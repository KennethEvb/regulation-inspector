import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI, Type } from "@google/genai";

// Lazy-loaded client so the function doesn't crash at cold-start if the key is missing —
// it fails on the actual request instead, with a clear error message.
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY is not set. Add it in Vercel: Project Settings → Environment Variables."
      );
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { text } = req.body ?? {};
    if (!text || typeof text !== "string" || text.trim() === "") {
      return res.status(400).json({ error: "Text is required and must be a valid string." });
    }

    const ai = getGeminiClient();

    const prompt = `You are an expert regulatory compliance auditor. Analyze the following regulatory text snippet and extract structured, individual compliance requirements (clauses).
For each requirement, identify:
1. The reference (e.g., Article number, Section, Paragraph).
2. The exact requirement text.
3. The domain (e.g., "BCDR" (Business Continuity & Disaster Recovery), "ICT Risk", "Testing", "Governance", "Data Protection", "Third-Party Risk", "Incident Response"). Use standard, short UPPERCASE names like BCDR, ICT RISK, TESTING, GOVERNANCE, DATA PROTECTION, THIRD-PARTY RISK, INCIDENT RESPONSE.
4. The estimated severity of non-compliance (HIGH, MED, or LOW).
5. A suggested remediation step to cover this requirement.
6. A short key phrase from the text that represents the core obligation (highlighted text).
7. One or more associated regulations or regulatory documents (such as DORA, BAIT, COBIT, GDPR, HIPAA) as tags based on the content.
8. A high-level logical "similarityGroup" to help group similar requirements.

Text to analyze:
"""
${text}
"""`;

    // NOTE: verify this model string against Google's current documentation before
    // relying on it in production — model names/versions change and this repo's
    // original value ("gemini-3.5-flash") could not be confirmed as current at
    // the time this was reviewed.
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["clauses"],
          properties: {
            clauses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["ref", "text", "domain", "severity", "remediation", "highlightedText", "regulations", "similarityGroup"],
                properties: {
                  ref: { type: Type.STRING, description: "The section, article, or paragraph reference." },
                  text: { type: Type.STRING, description: "The full, exact text of the requirement." },
                  domain: { type: Type.STRING, description: "General category: BCDR, ICT RISK, TESTING, GOVERNANCE, DATA PROTECTION, etc." },
                  severity: { type: Type.STRING, description: "HIGH, MED, or LOW." },
                  remediation: { type: Type.STRING, description: "Actionable compliance step." },
                  highlightedText: { type: Type.STRING, description: "Specific key phrase/obligation to highlight in the clause text." },
                  regulations: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Regulatory document tags, e.g. ['DORA', 'BAIT', 'COBIT']",
                  },
                  similarityGroup: { type: Type.STRING, description: "A high-level topic name used for grouping similar regulations." },
                },
              },
            },
          },
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response received from Gemini.");
    }

    const parsed = JSON.parse(resultText.trim());
    return res.status(200).json(parsed);
  } catch (error: any) {
    console.error("Gemini Parsing Error:", error);
    return res.status(500).json({ error: error.message || "Failed to parse regulation text" });
  }
}

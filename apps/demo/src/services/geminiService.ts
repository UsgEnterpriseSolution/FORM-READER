import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { ExtractedData } from "../types";

const fileToGenerativePart = async (file: File) => {
  const base64EncodedData = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
};

export async function extractInfoFromDoc(
  file: File
): Promise<ExtractedData | null> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const imagePart = await fileToGenerativePart(file);

  const prompt = `
    You are an expert AI at extracting specific information from documents. Analyze the provided document image and extract the following fields: Full Name, Age, Nationality, and Job.
    Return the information in a strict JSON format. For each field, provide the extracted value and a confidence level ('high' or 'low'). If a field is not found, the value should be an empty string and confidence should be 'low'.

    The JSON object must follow this exact structure:
    {
      "fullName": { "value": "string", "confidence": "high" | "low" },
      "age": { "value": "string", "confidence": "high" | "low" },
      "nationality": { "value": "string", "confidence": "high" | "low" },
      "job": { "value": "string", "confidence": "high" | "low" }
    }
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
      },
    });

    let jsonStr = response.text?.trim() || "";
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }

    const parsedData = JSON.parse(jsonStr);

    // Basic validation to ensure the structure is correct
    if (
      parsedData.fullName &&
      typeof parsedData.fullName.value === "string" &&
      parsedData.age &&
      typeof parsedData.age.value === "string" &&
      parsedData.nationality &&
      typeof parsedData.nationality.value === "string" &&
      parsedData.job &&
      typeof parsedData.job.value === "string"
    ) {
      return parsedData as ExtractedData;
    } else {
      console.error(
        "Parsed data does not match expected structure:",
        parsedData
      );
      return null;
    }
  } catch (error) {
    console.error("Error extracting information from document:", error);
    return null;
  }
}

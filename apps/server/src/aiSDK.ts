import fs from "node:fs";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { ollama } from "ollama-ai-provider";
import { CoreMessage, streamObject } from "ai";
import formSchema from "./zod";

const messages: CoreMessage[] = [
  {
    role: "system",
    content:
      `You are a highly accurate information extractor. ` +
      `Your task is to analyze handwritten text on a scanned document.` +
      `The text may be messy, fragmented, or have inconsistent formatting. ` +
      `Your job is to extract the following fields about a person, if they exist in the text: ` +
      `- fullName (string): The full name of the person. ` +
      `- age (number): The person's age in years. ` +
      `- nationality (string): The nationality or country of origin. ` +
      `- job (string): The person's current or most recent job title or occupation.` +
      `Only return a structured JSON object with the keys: ` +
      `"fullName", "age", "nationality", and "job".` +
      `If a field is not mentioned in the text, return null for its value.` +
      `Do not include any explanation or extra information — only return the JSON.`,
  },
  {
    role: "user",
    content: [
      {
        type: "image",
        image: fs
          .readFileSync(__dirname + "/assets/placeholder.jpg")
          .toString("base64"),
      },
    ],
  },
];

export async function askLMStudio() {
  const lmstudio = createOpenAICompatible({
    name: "lmstudio",
    baseURL: "http://127.0.0.1:1234/v1",
  });

  const { textStream } = await streamObject({
    model: lmstudio("google/gemma-3-12b"),
    messages,
    schema: formSchema,
  });

  for await (const text of textStream) {
    process.stdout.write(text);
  }
}

export async function askOllama() {
  const { textStream } = await streamObject({
    model: ollama("gemma3"),
    messages,
    schema: formSchema,
  });

  for await (const text of textStream) {
    process.stdout.write(text);
  }
}

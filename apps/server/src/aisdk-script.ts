import fs from "node:fs";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { ollama } from "ollama-ai-provider";
import {
  CoreMessage,
  generateObject,
  generateText,
  jsonSchema,
  streamObject,
} from "ai";
import schema from "./schema";

export async function main() {
  const messages: CoreMessage[] = [
    {
      role: "system",
      content:
        `You are a document field data extractor.` +
        `Your task is to extract hand written text from a document scan.` +
        `The text may be messy, fragmented, or have inconsistent formatting.` +
        `Fields should be treated as follows:` +
        `- Fields should be assigned the values written.` +
        `- Strike through or cancelled text should be ignored.` +
        `- Empty fields should be assigned an empty string value.` +
        `- Empty date fields should be assigned a null value.` +
        `- Phone number filled should be given the country code (+233) ` +
        `if number is provided and code is not specified. eg 0252530002 -> +233252530002` +
        `[IMPORTANT] All fields must respect the AJV JSON schema provided.`,
    },
    {
      role: "user",
      content: [
        {
          type: "image",
          image: fs
            .readFileSync(__dirname + "/assets/exampleB.jpg")
            .toString("base64"),
        },
      ],
    },
  ];

  // const lmstudio = createOpenAICompatible({
  //   name: "lmstudio",
  //   baseURL: "http://127.0.0.1:1234/v1",
  // });

  const { object } = await generateObject({
    model: ollama("gemma3"),
    messages,
    schema: jsonSchema(schema as any),
  });

  // for await (const text of textStream) {
  //   process.stdout.write(text);
  // }

  console.log(object);
}

main();

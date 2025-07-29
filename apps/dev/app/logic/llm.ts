import { google } from "@ai-sdk/google";
import { ollama } from "ollama-ai-provider";
import { generateObject, type CoreMessage } from "ai";
// import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { Chat, LMStudioClient } from "@lmstudio/sdk";

import { fieldDataSchema } from "~/zod";
import type { Engine } from "~/types";

// const lmstudio = createOpenAICompatible({
//   name: "lmstudio",
//   baseURL: "http://127.0.0.1:1234/v1",
// });

class LLM {
  private static system =
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
    `[IMPORTANT] All fields must respect the schema provided.`;

  private static message(images: string[]): CoreMessage {
    return {
      role: "user",
      content: images.map((image) => ({
        type: "image",
        image: image,
      })),
    };
  }

  private static async askGoogle(message: CoreMessage) {
    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      system: this.system,
      schema: fieldDataSchema,
      messages: [message],
    });

    return object;
  }

  private static async askOllama(message: CoreMessage) {
    const { object } = await generateObject({
      model: ollama("gemma3"),
      system: this.system,
      schema: fieldDataSchema,
      messages: [message],
    });

    return object;
  }

  private static async askLMStudio(images: string[]) {
    const client = new LMStudioClient();
    const model = await client.llm.model("google/gemma-3-12b");

    const chat = Chat.from([
      {
        role: "system",
        content: this.system,
      },
      {
        role: "user",
        content: "Extract fields",
        images: await Promise.all(
          images.map((image, index) =>
            client.files.prepareImageBase64(`img_${index}`, image),
          ),
        ),
      },
    ]);

    const result = await model.respond(chat, { structured: fieldDataSchema });

    return result.parsed;
  }

  // private static async askLMStudio(message: CoreMessage) {
  //   const { object } = await generateObject({
  //     model: lmstudio("google/gemma-3-12b"),
  //     system: this.system,
  //     schema: fieldDataSchema,
  //     messages: [message],
  //   });

  //   return object;
  // }

  public static async extract(flag: Engine, images: string[]) {
    switch (flag) {
      case "LMSTUDIO":
        return await this.askLMStudio(images);
      case "OLLAMA":
        return await this.askOllama(this.message(images));
      case "GOOGLE":
        return await this.askGoogle(this.message(images));
      default:
        throw new Error("Invalid flag");
    }
  }
}

export default LLM;

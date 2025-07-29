import { Chat, LMStudioClient } from "@lmstudio/sdk";
import { fieldDataSchema } from "~/zod";

export default async function genFieldObj(images: string[]) {
  const client = new LMStudioClient();
  const model = await client.llm.model("google/gemma-3-12b");

  const chat = Chat.from([
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
        `[IMPORTANT] All fields must respect the schema provided.`,
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

  return await model.respond(chat, { structured: fieldDataSchema });
}

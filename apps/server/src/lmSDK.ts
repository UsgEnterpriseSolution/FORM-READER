import { Chat, LMStudioClient } from "@lmstudio/sdk";
import formSchema from "./zod";

export default async function askLMStudio() {
  const client = new LMStudioClient();
  const model = await client.llm.model("google/gemma-3-12b");

  const path = __dirname + "/assets/placeholder.jpg";
  const image = await client.files.prepareImage(path);

  const chat = Chat.from([
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
      content: "Extract fields",
      images: [image],
    },
  ]);

  const prediction = model.respond(chat, { structured: formSchema });

  for await (const { content } of prediction) {
    process.stdout.write(content);
  }

  console.info();
}

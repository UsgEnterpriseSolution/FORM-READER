import { z } from "zod";

const formSchema = z.object({
  fullName: z.string().nullable(),
  age: z.number().nullable(),
  nationality: z.string().nullable(),
  job: z.string().nullable(),
});

export default formSchema;

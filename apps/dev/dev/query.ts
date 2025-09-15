import { db } from "~/db/database";
import { tbConfig, type InsertConfig } from "~/db/schema/tbConfig";

const configA: InsertConfig = {
  configRef: "bfece89d-3e98-42b2-b818-c89f811f5863",
  title: "Example Form A",
  description: "This is just a dummy form to test config functionality.",
  schema: {
    type: "object",
    properties: {
      surname: { type: "string" },
      firstName: { type: "string" },
      gender: { type: "string", enum: ["MALE", "FEMALE"] },
      email: { type: "string" },
      nationality: { type: "string" },
      number: { type: "string" },
    },
  },
  fields: [
    {
      type: "text",
      label: "Surname",
      name: "surname",
      placeholder: "eg: Amarfio",
      defaultValue: "",
      validation: {
        isRequired: true,
        regExp: "",
      },
    },
    {
      type: "text",
      label: "First name",
      name: "firstName",
      placeholder: "eg: Chris",
      defaultValue: "",
      validation: {
        isRequired: true,
        regExp: "",
      },
    },
    {
      type: "select",
      label: "Gender",
      name: "gender",
      placeholder: "Select your gender",
      defaultValue: "",
      options: [
        {
          label: "Male",
          value: "MALE",
        },
        {
          label: "Female",
          value: "FEMALE",
        },
      ],
      validation: {
        isRequired: true,
        regExp: "",
      },
    },
    {
      type: "email",
      label: "Email",
      name: "email",
      placeholder: "eg: chrisamarfio@union.com",
      defaultValue: "",
      validation: {
        isRequired: true,
        regExp: "",
      },
    },
    {
      type: "number",
      label: "Phone number",
      name: "number",
      placeholder: "eg: +233001122332",
      defaultValue: "",
      validation: {
        isRequired: true,
        regExp: "",
      },
    },
  ],
};

async function addConfig(data: InsertConfig) {
  try {
    await db.insert(tbConfig).values({ ...data });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else console.error(error);
  }
}

addConfig(configA);

async function getConfigs() {
  try {
    const results = await db.select().from(tbConfig);
    console.log(results);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else console.error(error);
  }
}

// getConfigs();

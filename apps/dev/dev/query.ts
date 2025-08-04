import { db } from "~/db/database";
import { tbConfig, type InsertConfig } from "~/db/schema/tbConfig";

const configA: InsertConfig = {
  configId: "0d5f4b4f-e0f0-423c-aab2-da941af4e874",
  title: "Example Details Form",
  description: "This is just a form to test configurations.",
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
      type: "select",
      label: "Country",
      name: "country",
      placeholder: "Select your country",
      defaultValue: "",
      options: [
        {
          label: "location",
          value: "location",
        },
      ],
      validation: {
        isRequired: true,
        regExp: "",
      },
    },
  ],
};

async function addConfig(data: InsertConfig) {
  try {
    await db.insert(tbConfig).values(data);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else console.error(error);
  }
}

addConfig(configA);

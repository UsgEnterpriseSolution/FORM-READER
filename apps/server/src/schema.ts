import { JSONSchema7 } from "json-schema";

const schema = {
  type: "object",
  properties: {
    surname: {
      type: "string",
    },
    firstName: {
      type: "string",
    },
    gender: {
      type: "string",
      enum: ["MALE", "FEMALE"],
    },
    email: {
      type: "string",
    },
    nationality: {
      type: "string",
    },
    number: {
      type: "string",
    },
  },
  required: [
    "surname",
    "firstName",
    "gender",
    "email",
    "nationality",
    "number",
  ],
  additionalProperties: false,
};

export default schema;

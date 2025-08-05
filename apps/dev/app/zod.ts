import { z } from "zod";

const nameSchema = z.object({
  surName: z.string(),
  firstName: z.string(),
  middleName: z.string(),
  otherName: z.string().optional(),
});

export const fieldDataSchema = z.object({
  employeeData: z.object({
    employeeNo: z.string(),
    dateOfEngagement: z.coerce.date().nullable(),
    subsidiary: z.string(),
    department: z.string(),
    subunit: z.string(),
  }),
  personalData: z.object({
    name: z.object({
      surName: z.string(),
      firstName: z.string(),
      middleName: z.string(),
      otherName: z.string().optional(),
      maidenSurName: z.string().optional(),
    }),
    dateOfBirth: z.coerce.date().nullable(),
    nationality: z.string(),
    sex: z.enum(["MALE", "FEMALE"]),
    ghCard: z.string(),
    ssnit: z.string(),
    bankers: z.string(),
    nameOfSpouse: z.object({
      isMarried: z.boolean(),
      surName: z.string(),
      firstName: z.string(),
      middleName: z.string(),
      otherName: z.string(),
    }),
    contact: z.object({
      postal: z.string(),
      email: z.string(),
      mobilePhone: z.string(),
      homePhone: z.string().optional(),
      homeTown: z.string(),
      residentialAddress: z.string(),
    }),
    education: z.object({
      qualification: z.string(),
      institution: z.string(),
    }),
    nextOfKin: z.object({
      name: nameSchema,
      relationship: z.string(),
      address: z.string(),
      phoneNo: z.string(),
    }),
    emmergencyContact: z.object({
      name: nameSchema,
      relationship: z.string(),
      address: z.string(),
      phoneNo: z.string(),
    }),
  }),
});

export const imgFieldDataSchema = z.object({
  images: z.array(z.string()),
  fieldData: fieldDataSchema,
});

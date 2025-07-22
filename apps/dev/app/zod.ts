import { z } from "zod";

const nameSchema = z.object({
  surName: z.string().nullable(),
  firstName: z.string().nullable(),
  middleName: z.string().nullable(),
  otherName: z.string().nullable().optional(),
});

export const fieldDataSchema = z.object({
  employeeData: z.object({
    employeeNo: z.string().nullable(),
    dateOfEngagement: z.coerce.date().nullable(),
    subsidiary: z.string().nullable(),
    department: z.string().nullable(),
    subunit: z.string().nullable(),
  }),
  personalData: z.object({
    name: z.object({
      surName: z.string().nullable(),
      firstName: z.string().nullable(),
      middleName: z.string().nullable(),
      otherName: z.string().nullable().optional(),
      maidenSurName: z.string().nullable().optional(),
    }),
    dateOfBirth: z.coerce.date().nullable(),
    nationality: z.string().nullable(),
    sex: z.enum(["MALE", "FEMALE"]),
    ghCard: z.string().nullable(),
    ssnit: z.string().nullable(),
    bankers: z.string().nullable(),
    nameOfSpouse: z.object({
      isMarried: z.boolean(),
      surName: z.string().nullable().optional(),
      firstName: z.string().nullable().optional(),
      middleName: z.string().nullable().optional(),
      otherName: z.string().nullable().optional(),
    }),
    contact: z.object({
      postal: z.string().nullable(),
      email: z.string().email().nullable(),
      mobilePhone: z.string().nullable(),
      homePhone: z.string().nullable().optional(),
      homeTown: z.string().nullable(),
      residentialAddress: z.string().nullable(),
    }),
    education: z.object({
      qualification: z.string().nullable(),
      institution: z.string().nullable(),
    }),
    nextOfKin: z.object({
      name: nameSchema,
      relationship: z.string().nullable(),
      address: z.string().nullable(),
      phoneNo: z.string().nullable(),
    }),
    emmergencyContact: z.object({
      name: nameSchema,
      relationship: z.string().nullable(),
      address: z.string().nullable(),
      phoneNo: z.string().nullable(),
    }),
  }),
});

export const uploadActionDataSchema = z.object({
  images: z.array(z.string()),
  fieldData: fieldDataSchema,
});

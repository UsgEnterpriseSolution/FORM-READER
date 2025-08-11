import { describe, it, expect } from "vitest";
import Ajv from "ajv";
import { generateAJVSchema } from "../generateAjvSchema";
import type { FormConfig } from "~/types";

describe("generateAJVSchema", () => {
  it("builds a JSON Schema and validates data correctly", () => {
    const config: FormConfig = {
      id: "1",
      name: "Employee",
      description: "Employee form",
      created: new Date(),
      modified: new Date(),
      fields: [
        { name: "employeeId", type: "text", label: "Employee ID", required: true, validation: { minLength: 3 } },
        { name: "email", type: "email", label: "Email", required: true },
        { name: "age", type: "number", label: "Age", required: false, validation: { min: 18, max: 99 } },
        { name: "dept", type: "select", label: "Department", required: true, options: [ { label: "HR", value: "HR" }, { label: "ENG", value: "ENG" } ] },
        { name: "active", type: "checkbox", label: "Active", required: false },
      ],
    };

    const schema = generateAJVSchema(config) as any;

    const ajv = new Ajv({ allErrors: true, strict: false });
    const validate = ajv.compile(schema);

    const good = {
      employeeId: "ABC123",
      email: "a@b.com",
      age: 30,
      dept: "ENG",
      active: true,
    };

    expect(validate(good)).toBe(true);

    const bad = {
      employeeId: "A", // too short
      email: "not-an-email",
      dept: "SALES", // not in enum
    } as any;

    expect(validate(bad)).toBe(false);
    expect(validate.errors && validate.errors.length).toBeGreaterThan(0);
  });
});


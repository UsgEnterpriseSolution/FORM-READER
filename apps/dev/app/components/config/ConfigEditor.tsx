import React, { useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

// Field schemas
const optionSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
});

const baseValidationSchema = z.object({
  pattern: z.string().optional(),
  minLength: z.number().int().nonnegative().optional(),
  maxLength: z.number().int().nonnegative().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
});

const fieldSchema = z.object({
  type: z.enum(["text", "email", "number", "textarea", "select", "checkbox"]),
  name: z
    .string()
    .min(1, "Name is required")
    .regex(
      /^[a-zA-Z_][a-zA-Z0-9_]*$/,
      "Use letters, numbers, underscores; cannot start with a number",
    ),
  label: z.string().min(1, "Label is required"),
  required: z.boolean(),
  options: z.array(optionSchema).optional(),
  validation: baseValidationSchema.optional(),
});

const configSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Configuration name is required"),
  description: z.string().optional(),
  fields: z.array(fieldSchema).min(1, "Add at least one field"),
});

export type ConfigEditorValues = z.infer<typeof configSchema>;

export type ConfigEditorProps = {
  defaultValues?: Partial<ConfigEditorValues>;
  onSubmit: (values: ConfigEditorValues) => void | Promise<void>;
  submitLabel?: string;
};

function FieldTypeSpecific({
  index,
  control,
  watchType,
}: {
  index: number;
  control: any;
  watchType: string;
}) {
  // Render type-specific controls
  if (watchType === "select") {
    return (
      <div className="rounded-md border p-3">
        <div className="mb-2 text-sm font-medium">Options</div>
        <FieldOptionsEditor control={control} fieldIndex={index} />
      </div>
    );
  }
  return null;
}

function FieldOptionsEditor({
  control,
  fieldIndex,
}: {
  control: any;
  fieldIndex: number;
}) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: `fields.${fieldIndex}.options` as const,
  });
  // Keep simple add/remove for options; reordering not essential here
  return (
    <div className="space-y-2">
      {fields.length === 0 && (
        <div className="text-muted-foreground text-sm">No options yet.</div>
      )}
      {fields.map((opt, i) => (
        <div key={opt.id} className="grid grid-cols-2 gap-2">
          <FormField
            control={control}
            name={`fields.${fieldIndex}.options.${i}.label` as const}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`fields.${fieldIndex}.options.${i}.value` as const}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Value</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="col-span-2 flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => i > 0 && move(i, i - 1)}
              >
                ↑
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => i < fields.length - 1 && move(i, i + 1)}
              >
                ↓
              </Button>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => remove(i)}
            >
              Remove option
            </Button>
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ label: "", value: "" })}
      >
        Add option
      </Button>
    </div>
  );
}

function FieldValidationEditor({
  control,
  fieldIndex,
}: {
  control: any;
  fieldIndex: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-3">
      <FormField
        control={control}
        name={`fields.${fieldIndex}.validation.pattern` as const}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pattern (RegExp)</FormLabel>
            <FormControl>
              <Input placeholder="^\\d{3}-\\d{2}-\\d{4}$" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`fields.${fieldIndex}.validation.minLength` as const}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Min Length</FormLabel>
            <FormControl>
              <Input
                type="number"
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(
                    e.target.value === "" ? undefined : Number(e.target.value),
                  )
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`fields.${fieldIndex}.validation.maxLength` as const}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Max Length</FormLabel>
            <FormControl>
              <Input
                type="number"
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(
                    e.target.value === "" ? undefined : Number(e.target.value),
                  )
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`fields.${fieldIndex}.validation.min` as const}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Min (number)</FormLabel>
            <FormControl>
              <Input
                type="number"
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(
                    e.target.value === "" ? undefined : Number(e.target.value),
                  )
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`fields.${fieldIndex}.validation.max` as const}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Max (number)</FormLabel>
            <FormControl>
              <Input
                type="number"
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(
                    e.target.value === "" ? undefined : Number(e.target.value),
                  )
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

import { useMemo, useState } from "react";
import { generateAJVSchema } from "~/lib/generateAjvSchema";
import Ajv from "ajv";

export default function ConfigEditor({
  defaultValues,
  onSubmit,
  submitLabel = "Save configuration",
}: ConfigEditorProps) {
  const form = useForm<ConfigEditorValues>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      name: "",
      description: "",
      fields: [],
      ...(defaultValues ?? {}),
    },
    mode: "onChange",
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "fields",
  });

  // DnD state for field reordering using native HTML5 drag & drop
  const dragIndex = useRef<number | null>(null);

  // Schema preview and validation tester state
  const currentConfig = useMemo(
    () => ({
      name: form.watch("name"),
      description: form.watch("description"),
      fields: form.watch("fields"),
    }),
    [form.watch],
  );
  const schema = useMemo(
    () => generateAJVSchema(currentConfig as any),
    [currentConfig],
  );
  const [sampleData, setSampleData] = useState<string>("{}");
  const [validationResult, setValidationResult] = useState<string>("");

  const runValidation = () => {
    try {
      const data = JSON.parse(sampleData || "{}");
      const ajv = new Ajv({ allErrors: true });
      const validate = ajv.compile(schema as any);
      const valid = validate(data);
      if (valid) setValidationResult("Valid");
      else setValidationResult(JSON.stringify(validate.errors, null, 2));
    } catch (e: any) {
      setValidationResult(`Invalid JSON input: ${e.message}`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Configuration Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Employee Intake" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    placeholder="Optional description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-lg font-medium">Fields</div>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  type: "text",
                  name: "",
                  label: "",
                  required: false,
                  validation: {},
                  options: [],
                } as any)
              }
            >
              Add field
            </Button>
          </div>

          {fields.length === 0 && (
            <div className="text-muted-foreground text-sm">
              No fields yet. Click "Add field" to create one.
            </div>
          )}

          <div className="space-y-4">
            {fields.map((f, idx) => {
              const type = form.watch(`fields.${idx}.type`);
              return (
                <div
                  key={f.id}
                  className="rounded-lg border p-4"
                  draggable
                  onDragStart={() => {
                    dragIndex.current = idx;
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const from = dragIndex.current;
                    const to = idx;
                    if (from !== null && from !== to) {
                      move(from, to);
                    }
                    dragIndex.current = null;
                  }}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-muted-foreground text-xs">
                      Drag to reorder
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => idx > 0 && move(idx, idx - 1)}
                      >
                        ↑
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          idx < fields.length - 1 && move(idx, idx + 1)
                        }
                      >
                        ↓
                      </Button>
                    </div>
                  </div>

                  <div className="mb-3 grid grid-cols-1 gap-3">
                    <FormField
                      control={form.control}
                      name={`fields.${idx}.type` as const}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Field Type</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="number">Number</SelectItem>
                                <SelectItem value="textarea">
                                  Textarea
                                </SelectItem>
                                <SelectItem value="select">
                                  Select (dropdown)
                                </SelectItem>
                                <SelectItem value="checkbox">
                                  Checkbox
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`fields.${idx}.name` as const}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Field Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. employeeId" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`fields.${idx}.label` as const}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Label</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Employee ID" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`fields.${idx}.required` as const}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Required</FormLabel>
                          <FormControl>
                            <div className="flex h-9 items-center">
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-2 space-y-3">
                    <FieldTypeSpecific
                      index={idx}
                      control={form.control}
                      watchType={type}
                    />

                    <div className="bg-muted/30 rounded-md p-3">
                      <div className="mb-2 text-sm font-medium">
                        Validation Rules
                      </div>
                      <FieldValidationEditor
                        control={form.control}
                        fieldIndex={idx}
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => remove(idx)}
                    >
                      Remove field
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Schema Preview and Tester */}
        {/* <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border p-4">
            <div className="mb-2 text-sm font-medium">
              Generated AJV Schema (JSON)
            </div>
            <pre className="bg-muted/40 max-h-72 overflow-auto rounded p-3 text-xs">
              {JSON.stringify(schema, null, 2)}
            </pre>
          </div>
          <div className="rounded-lg border p-4">
            <div className="mb-2 text-sm font-medium">Validation Tester</div>
            <Textarea
              rows={10}
              value={sampleData}
              onChange={(e) => setSampleData(e.target.value)}
            />
            <div className="mt-2 flex items-center gap-2">
              <Button type="button" variant="outline" onClick={runValidation}>
                Validate
              </Button>
            </div>
            {validationResult && (
              <pre className="bg-muted/40 mt-2 max-h-48 overflow-auto rounded p-3 text-xs">
                {validationResult}
              </pre>
            )}
          </div>
        </div> */}

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}

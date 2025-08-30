import React, { useCallback, useEffect, useRef } from "react";
import { useAutoScrollOnAppend } from "~/hooks/useAutoScrollOnAppend";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Form, useActionData, useNavigation } from "react-router";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { GenericFieldConfig } from "./GenericFieldConfig";
import type { AppResponse, ConfigFieldType } from "~/types";
import { useActions, useConfigDetails, useConfigFields } from "~/zustand/store";
import { Loader2 } from "lucide-react";

type ConfigEditorProps = {
  children: React.ReactNode;
  mode: "CREATE" | "EDIT";
  title: string;
  description: string;
  configId?: string;
};

export default function ConfigEditor(props: ConfigEditorProps) {
  const actionData = useActionData<AppResponse<any>>();
  const { state } = useNavigation();

  const containerRef = useRef<HTMLFormElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const details = useConfigDetails();
  const fields = useConfigFields();
  const { setConfigDetails, addConfigField, resetConfig } = useActions();

  const handleAddField = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const formData = new FormData(e.target as HTMLFormElement);
      const newFieldType = formData.get(
        "new-field-type",
      ) as ConfigFieldType | null;

      if (newFieldType) {
        addConfigField(newFieldType);
      }
    },
    [addConfigField],
  );

  // Auto-scroll to bottom when new fields are appended
  useAutoScrollOnAppend(containerRef, fields.length);

  useEffect(() => {
    if (actionData && actionData.status === "success") {
      resetConfig();
      closeBtnRef.current?.click();
    }
  }, [actionData?.timestamp]);

  return (
    <Sheet>
      <SheetTrigger asChild>{props.children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{props.title}</SheetTitle>
          <SheetDescription>{props.description}</SheetDescription>
        </SheetHeader>

        <Form
          id="configEditorForm"
          method={props.mode === "CREATE" ? "POST" : "PUT"}
          ref={containerRef}
          className="h-full space-y-4 overflow-y-scroll px-4"
        >
          <div className="space-y-3">
            <Label className="block space-y-2">
              <p>Title</p>
              <Input
                type="text"
                id="title"
                name="title"
                placeholder="eg: Bank - Debit Card Form"
                defaultValue={details.title ?? ""}
                onChange={(e) => setConfigDetails("title", e.target.value)}
                required
              />
            </Label>

            <Label className="block space-y-2">
              <p>Description</p>
              <Textarea
                id="description"
                name="description"
                placeholder="eg: This form collects..."
                defaultValue={details.description ?? ""}
                onChange={(e) =>
                  setConfigDetails("description", e.target.value)
                }
                required
              />
            </Label>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Fields</p>
              <div className="bg-primary text-secondary grid size-6 place-content-center rounded-full text-xs">
                {fields.length}
              </div>
            </div>

            {fields.length > 0 ? (
              fields.map((field) => (
                <GenericFieldConfig
                  key={field.fieldId}
                  fieldId={field.fieldId}
                />
              ))
            ) : (
              <p className="text-muted-foreground text-sm">
                No fields yet. Click "Add field" to create one.
              </p>
            )}
          </div>
        </Form>

        <SheetFooter className="gap-4">
          <form className="flex gap-2" onSubmit={handleAddField}>
            <Select name="new-field-type" defaultValue="TEXT" required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TEXT">Text</SelectItem>
                <SelectItem value="NUMBER">Number</SelectItem>
                <SelectItem value="DATE">Date</SelectItem>
                <SelectItem value="EMAIL">Email</SelectItem>
                <SelectItem value="PHONE">Phone</SelectItem>
                <SelectItem value="TEXTAREA">Textarea</SelectItem>
                <SelectItem value="SELECT">Select</SelectItem>
                <SelectItem value="CHECKBOX">Checkbox</SelectItem>
                <SelectItem value="RADIO">Radio</SelectItem>
                <SelectItem value="TABLE">Table</SelectItem>
                <SelectItem value="SWITCH">Switch</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" variant="outline">
              Add field
            </Button>
          </form>

          <div className="flex w-full gap-2">
            <Button
              disabled={state === "submitting"}
              type="submit"
              form="configEditorForm"
              className="w-full"
            >
              {state === "submitting" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <p>submitting...</p>
                </>
              ) : (
                <p>
                  {props.mode === "CREATE" ? "Submit form" : "Save changes"}
                </p>
              )}
            </Button>

            <SheetClose asChild>
              <Button ref={closeBtnRef} variant="outline" className="w-full">
                Close
              </Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

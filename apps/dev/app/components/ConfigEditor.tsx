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
import type { AppResponse, ConfigFieldType, EditorDetails } from "~/types";
import {
  useActions,
  useConfigDetails,
  useConfigFields,
  useConfigLoading,
  useConfigMode,
} from "~/zustand";
import { Loader2 } from "lucide-react";

type ConfigEditorProps = {
  children: React.ReactNode;
  configRef?: string;
};

export default function ConfigEditor({
  children,
  configRef,
}: ConfigEditorProps) {
  const actionData = useActionData<AppResponse<any>>();
  const { state } = useNavigation();

  const mode = useConfigMode();
  const details = useConfigDetails();
  const fields = useConfigFields();
  const isConfigLoading = useConfigLoading();
  const { setConfigDetails, addConfigField, resetConfig } = useActions();

  const containerRef = useRef<HTMLFormElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const editorDetails = (): EditorDetails => {
    switch (mode) {
      case "CREATE":
        return {
          method: "POST",
          title: "Add form",
          description:
            "Create a new form by providing a title, description, and adding fields below.",
          submitLabel: "Submit form",
        };
      case "EDIT":
        return {
          method: "PUT",
          title: "Edit form",
          description:
            "Update the form by modifying the title, description, and fields below.",
          submitLabel: "Save changes",
        };

      case "VIEW":
        return {
          method: "GET",
          title: "View form",
          description: "View the form's title, description, and fields below.",
          submitLabel: "Save changes",
        };
    }
  };

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

  const handleClose = () => {
    if (mode !== "CREATE") resetConfig();
  };

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
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        {isConfigLoading && (
          <div className="bg-primary-foreground/80 absolute inset-0 flex items-center justify-center">
            <Loader2 className="animate-spin" />
          </div>
        )}

        <SheetHeader>
          <SheetTitle>{editorDetails().title}</SheetTitle>
          <SheetDescription>{editorDetails().description}</SheetDescription>
        </SheetHeader>

        <Form
          id="configEditorForm"
          method={editorDetails().method}
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

          <Input
            type="hidden"
            id="configRef"
            name="configRef"
            defaultValue={configRef ?? ""}
          />

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
                <p>{editorDetails().submitLabel}</p>
              )}
            </Button>

            <SheetClose asChild>
              <Button
                ref={closeBtnRef}
                variant="outline"
                className="w-full"
                onClick={handleClose}
              >
                Close
              </Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

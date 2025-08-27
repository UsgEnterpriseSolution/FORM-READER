import React, { useState, useCallback } from "react";
import { nanoid } from "nanoid";
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
import { Form } from "react-router";
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
import type { ConfigFieldObj, ConfigFieldType } from "~/types";

type ConfigEditorProps = {
  children: React.ReactNode;
  mode: "CREATE" | "EDIT";
  title: string;
  description: string;
  configId?: string;
};

export default function ConfigEditor(props: ConfigEditorProps) {
  const [configFields, setConfigFields] = useState<ConfigFieldObj[]>([]);

  const handleAddField = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const formData = new FormData(e.target as HTMLFormElement);
      const newFieldType = formData.get(
        "new-field-type",
      ) as ConfigFieldType | null;

      if (newFieldType) {
        setConfigFields((state) => [
          ...state,
          { id: nanoid(), type: newFieldType },
        ]);
      }
    },
    [setConfigFields],
  );

  const handleDeleteField = useCallback((id: string) => {
    setConfigFields((fields) => fields.filter((field) => field.id !== id));
  }, []);

  const updateField = useCallback((id: string, newType: ConfigFieldType) => {
    setConfigFields((fields) =>
      fields.map((field) =>
        field.id === id ? { ...field, type: newType } : field,
      ),
    );
  }, []);

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
                defaultValue={""}
                required
              />
            </Label>

            <Label className="block space-y-2">
              <p>Description</p>
              <Textarea
                id="description"
                name="description"
                placeholder="eg: This form collects..."
                defaultValue={""}
                required
              />
            </Label>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Fields</p>
              <div className="bg-primary text-secondary grid size-6 place-content-center rounded-full text-xs">
                {configFields.length}
              </div>
            </div>

            {configFields.length > 0 ? (
              configFields.map((field) => (
                <GenericFieldConfig
                  key={field.id}
                  {...field}
                  handleDelete={handleDeleteField}
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
            <SheetClose asChild>
              <Button type="submit" form="configEditorForm" className="w-full">
                {props.mode === "CREATE" ? "Submit form" : "Save changes"}
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="outline" className="w-full">
                Close
              </Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

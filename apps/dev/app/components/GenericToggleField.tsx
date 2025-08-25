import React, { useState } from "react";

import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";

import type { ToggleField } from "~/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Props = {
  id: string;
  type: ToggleField["type"];
  data?: string;
  handleDelete: (id: string) => void;
};

export default function GenericToggleField(props: Props) {
  const [data, setData] = useState<ToggleField>(() =>
    props.data
      ? (JSON.parse(props.data) as ToggleField)
      : {
          type: props.type,
          label: "New Field",
          name: "",
          placeholder: "",
          defaultValue: false,
        },
  );

  const [required, setRequired] = useState<boolean>(() =>
    props.data ? ((JSON.parse(props.data) as any).isRequired ?? false) : false,
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | any,
    field: keyof ToggleField,
  ) => {
    const { value } = e.target as HTMLInputElement;
    setData((prev) => ({ ...prev, [field]: value }) as ToggleField);
  };

  return (
    <div className="space-y-4 rounded-lg border p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm">{data.label}</p>
          <div className="bg-muted w-fit rounded-sm px-2 py-1 text-xs">
            {props.type.toLocaleUpperCase()}
          </div>
        </div>

        <Button
          type="button"
          variant={"outline"}
          size={"icon"}
          onClick={() => props.handleDelete(props.id)}
        >
          <Trash2 className="stroke-red-500" />
        </Button>
      </div>

      <input
        type="hidden"
        name="field"
        value={JSON.stringify({ ...data, isRequired: required } as any)}
      />

      <Label className="block space-y-2">
        <p>
          Label <span className="text-red-500">*</span>
        </p>
        <Input
          type="text"
          placeholder="eg: Account creation date"
          value={data.label}
          onChange={(e) => handleChange(e, "label")}
          required
        />
      </Label>

      <Label className="block space-y-2">
        <p>
          Name <span className="text-red-500">*</span>
        </p>
        <Input
          type="text"
          placeholder="eg: accountCreationDate"
          value={data.name}
          onChange={(e) => handleChange(e, "name")}
          required
        />
      </Label>

      <Label className="block space-y-2">
        <p>
          Default <span className="text-red-500">*</span>
        </p>

        <Select
          name="new-field-type"
          value={data.defaultValue ? "true" : "false"}
          onValueChange={(v) =>
            setData((prev) => ({ ...prev, defaultValue: v === "true" }))
          }
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select field" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">toggle on</SelectItem>
            <SelectItem value="false">toggle off</SelectItem>
          </SelectContent>
        </Select>
      </Label>
    </div>
  );
}

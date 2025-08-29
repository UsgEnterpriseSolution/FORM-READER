import { useState } from "react";

import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";

import type { TextField } from "~/types";
import { useActions } from "~/zustand/store";

type Props = {
  fieldId: string;
  data: TextField;
};

export default function GenericTextField({ fieldId, data }: Props) {
  const { removeConfigField, updateConfigField } = useActions();

  const handleChange = (key: keyof TextField, value: any) => {
    updateConfigField(fieldId, { ...data, [key]: value });
  };

  return (
    <div className="space-y-4 rounded-lg border p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm">{data.label}</p>
          <div className="bg-muted w-fit rounded-sm px-2 py-1 text-xs">
            {data.type.toLocaleUpperCase()}
          </div>
        </div>

        <Button
          type="button"
          variant={"outline"}
          size={"icon"}
          onClick={() => removeConfigField(fieldId)}
        >
          <Trash2 className="stroke-red-500" />
        </Button>
      </div>

      <input type="hidden" name="field" value={JSON.stringify(data)} />

      <Label className="block space-y-2">
        <p>
          Label <span className="text-red-500">*</span>
        </p>
        <Input
          type="text"
          placeholder="eg: Account creation date"
          value={data.label}
          onChange={(e) => handleChange("label", e.target.value)}
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
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
      </Label>

      <Label className="block space-y-2">
        <p>
          Placeholder <span className="text-muted-foreground">(Optional)</span>
        </p>
        <Input
          type="text"
          placeholder="eg: dd/mm/yyyy"
          value={data.placeholder}
          onChange={(e) => handleChange("placeholder", e.target.value)}
        />
      </Label>

      <Label className="block space-y-2">
        <p>
          Default value{" "}
          <span className="text-muted-foreground">(Optional)</span>
        </p>
        <Input
          type="text"
          placeholder="eg: 22/08/2025"
          value={data.defaultValue}
          onChange={(e) => handleChange("defaultValue", e.target.value)}
        />
      </Label>

      <Label className="block space-y-2">
        <p>
          RegExp <span className="text-muted-foreground">(Optional)</span>
        </p>
        <Input
          type="text"
          placeholder="eg: /^[^\s@]+@[^\s@]+\.[^\s@]+$/"
          value={data.regExp}
          onChange={(e) => handleChange("regExp", e.target.value)}
        />
      </Label>

      <Label className="flex items-center gap-2 py-2">
        <Switch
          name="required"
          checked={data.isRequired}
          onCheckedChange={() => handleChange("isRequired", !data.isRequired)}
        />
        <p>Mark field as required.</p>
      </Label>
    </div>
  );
}

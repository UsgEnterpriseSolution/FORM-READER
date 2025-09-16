import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import type { TextField } from "~/types";
import { useActions } from "~/zustand";

type Props = {
  fieldId: string;
  data: TextField;
};

export default function GenericTextField({ fieldId, data }: Props) {
  const { removeConfigField, updateConfigField, updateConfigFieldType } =
    useActions();

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
        <p className="text-muted-foreground">
          Field <span className="text-red-500">*</span>
        </p>
        <Select
          name="type"
          value={data.type}
          onValueChange={(v) => updateConfigFieldType(fieldId, v)}
          required
        >
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
      </Label>

      <Label className="block space-y-2">
        <p className="text-muted-foreground">
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
        <p className="text-muted-foreground">
          Key <span className="text-red-500">*</span>
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
        <p className="text-muted-foreground">Placeholder</p>
        <Input
          type="text"
          placeholder="eg: dd/mm/yyyy"
          value={data.placeholder}
          onChange={(e) => handleChange("placeholder", e.target.value)}
        />
      </Label>

      <Label className="block space-y-2">
        <p className="text-muted-foreground">Default value</p>
        <Input
          type="text"
          placeholder="eg: 22/08/2025"
          value={data.defaultValue}
          onChange={(e) => handleChange("defaultValue", e.target.value)}
        />
      </Label>

      <Label className="block space-y-2">
        <p className="text-muted-foreground">RegExp</p>
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

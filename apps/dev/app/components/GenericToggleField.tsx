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
import { useActions } from "~/zustand/store";

type Props = {
  fieldId: string;
  data: ToggleField;
};

export default function GenericToggleField({ fieldId, data }: Props) {
  const { removeConfigField, updateConfigField } = useActions();

  const handleChange = (key: keyof ToggleField, value: any) => {
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
          Default <span className="text-red-500">*</span>
        </p>

        <Select
          name="new-field-type"
          value={data.defaultValue ? "true" : "false"}
          onValueChange={(v) => handleChange("defaultValue", v === "true")}
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

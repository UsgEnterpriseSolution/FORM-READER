import { useState } from "react";
import { Trash2, Plus } from "lucide-react";

import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";

import type { OptionField } from "~/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Props = {
  id: string;
  type: OptionField["type"];
  data?: string;
  handleDelete: (id: string) => void;
};

export default function GenericOptionField(props: Props) {
  const [data, setData] = useState<OptionField>(() =>
    props.data
      ? (JSON.parse(props.data) as OptionField)
      : {
          type: props.type,
          label: "New Field",
          name: "",
          placeholder: "",
          defaultValue: "",
          options: [],
          isRequired: false,
        },
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | any,
    field: keyof OptionField,
  ) => {
    if (field === "isRequired") {
      setData((prev) => ({
        ...prev,
        isRequired: !prev.isRequired,
      }));
      return;
    }

    const { value } = e.target as HTMLInputElement;
    setData((prev) => ({ ...prev, [field]: value }) as OptionField);
  };

  const addOption = () => {
    setData(
      (prev) =>
        ({
          ...prev,
          options: [...(prev.options ?? []), { label: "", value: "" }],
        }) as OptionField,
    );
  };

  const updateOption = (
    idx: number,
    key: keyof OptionField["options"][number],
    val: string,
  ) =>
    setData((prev) => {
      const opts = [...(prev.options ?? [])];
      opts[idx] = { ...opts[idx], [key]: val } as any;
      return { ...prev, options: opts } as OptionField;
    });

  const removeOption = (index: number) => {
    setData(
      (prev) =>
        ({
          ...prev,
          options: prev.options.filter((_, i) => i !== index),
        }) as OptionField,
    );
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

      <input type="hidden" name="field" value={JSON.stringify(data)} />

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
          Placeholder <span className="text-muted-foreground">(Optional)</span>
        </p>
        <Input
          type="text"
          placeholder="eg: dd/mm/yyyy"
          value={data.placeholder}
          onChange={(e) => handleChange(e, "placeholder")}
        />
      </Label>

      <FieldOptions
        options={data.options}
        onAdd={addOption}
        onUpdate={updateOption}
        onRemove={removeOption}
      />

      <Label className="block space-y-2">
        <p>
          Default <span className="text-red-500">*</span>
        </p>

        {(data.options ?? []).length === 0 ? (
          <>
            <p className="text-muted-foreground text-sm">
              Add options to choose a default.
            </p>
            <Select disabled>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="No options" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No options</SelectItem>
              </SelectContent>
            </Select>
          </>
        ) : (
          <Select
            name="defaultValue"
            value={data.defaultValue}
            onValueChange={(value) =>
              handleChange({ target: { value } } as any, "defaultValue")
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select default option" />
            </SelectTrigger>
            <SelectContent>
              {(data.options ?? []).map((opt, idx) => (
                <SelectItem key={idx} value={opt.value || `null-${idx}`}>
                  {opt.label || opt.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </Label>

      <Label className="flex items-center gap-2 py-2">
        <Switch
          name="required"
          checked={data.isRequired}
          onCheckedChange={() => handleChange({} as any, "isRequired")}
        />
        <p>Mark field as required.</p>
      </Label>
    </div>
  );
}

type FieldOptionsProps = {
  options: OptionField["options"];
  onAdd: () => void;
  onUpdate: (index: number, key: "label" | "value", value: string) => void;
  onRemove: (index: number) => void;
};

function FieldOptions({
  options = [],
  onAdd,
  onUpdate,
  onRemove,
}: FieldOptionsProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h6 className="text-sm font-medium">
          Options <span className="text-red-500">*</span>
        </h6>
        <Button type="button" variant={"outline"} size={"icon"} onClick={onAdd}>
          <Plus />
        </Button>
      </div>

      {options.length === 0 && (
        <p className="text-muted-foreground text-sm">No options yet.</p>
      )}

      {options.map((opt, idx) => (
        <div key={idx} className="flex items-end gap-2">
          <Button
            type="button"
            className="aspect-square"
            variant="outline"
            size="icon"
            onClick={() => onRemove(idx)}
          >
            <Trash2 className="stroke-red-500" />
          </Button>

          <Label className="block space-y-2">
            <p>
              Label <span className="text-red-500">*</span>
            </p>
            <Input
              type="text"
              placeholder="eg: Daily"
              value={opt.label}
              onChange={(e) => onUpdate(idx, "label", e.target.value)}
              required
            />
          </Label>

          <Label className="block space-y-2">
            <p>
              Value <span className="text-red-500">*</span>
            </p>
            <Input
              type="text"
              placeholder="eg: DAILY"
              value={opt.value}
              onChange={(e) => onUpdate(idx, "value", e.target.value)}
              required
            />
          </Label>
        </div>
      ))}
    </div>
  );
}

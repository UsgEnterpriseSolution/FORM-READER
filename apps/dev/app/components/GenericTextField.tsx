import { useState } from "react";

import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";

import type { TextField } from "~/types";

type Props = {
  id: string;
  type: TextField["type"];
  data?: string;
  handleDelete: (id: string) => void;
};

export default function GenericTextField(props: Props) {
  const [data, setData] = useState<TextField>(() =>
    props.data
      ? (JSON.parse(props.data) as TextField)
      : {
          type: props.type,
          label: "New Field",
          name: "",
          placeholder: "",
          defaultValue: "",
          regExp: "",
          isRequired: false,
        },
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof TextField,
  ) => {
    if (field === "isRequired") {
      setData((prev) => ({
        ...prev,
        isRequired: !prev.isRequired,
      }));
      return;
    }

    const { value } = e.target as HTMLInputElement;
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
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

      <Label className="block space-y-2">
        <p>
          Default value{" "}
          <span className="text-muted-foreground">(Optional)</span>
        </p>
        <Input
          type="text"
          placeholder="eg: 22/08/2025"
          value={data.defaultValue}
          onChange={(e) => handleChange(e, "defaultValue")}
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
          onChange={(e) => handleChange(e, "regExp")}
        />
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

import { Trash2, Plus } from "lucide-react";

import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

import type { ColumnField } from "~/types";
import { useState } from "react";

type Props = {
  id: string;
  type: ColumnField["type"];
  data?: string;
  handleDelete: (id: string) => void;
};

export default function GenericColumnField(props: Props) {
  const [data, setData] = useState<ColumnField>(() =>
    props.data
      ? (JSON.parse(props.data) as ColumnField)
      : {
          type: props.type,
          label: "New Field",
          name: "",
          columns: [],
        },
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | any,
    field: keyof ColumnField,
  ) => {
    const { value } = e.target as HTMLInputElement;
    setData((prev) => ({ ...prev, [field]: value }) as ColumnField);
  };

  const addColumn = () =>
    setData(
      (prev) =>
        ({
          ...prev,
          columns: [...(prev.columns ?? []), { label: "", key: "" }],
        }) as ColumnField,
    );

  const updateColumn = (
    idx: number,
    key: keyof ColumnField["columns"][number],
    val: string,
  ) =>
    setData((prev) => {
      const cols = [...(prev.columns ?? [])];
      cols[idx] = { ...cols[idx], [key]: val } as any;
      return { ...prev, columns: cols } as ColumnField;
    });

  const removeColumn = (idx: number) =>
    setData(
      (prev) =>
        ({
          ...prev,
          columns: prev.columns.filter((_, i) => i !== idx),
        }) as ColumnField,
    );

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

      <FieldColumns
        columns={data.columns}
        onAdd={addColumn}
        onUpdate={updateColumn}
        onRemove={removeColumn}
      />
    </div>
  );
}

function FieldColumns({
  columns = [],
  onAdd,
  onUpdate,
  onRemove,
}: {
  columns?: ColumnField["columns"];
  onAdd: () => void;
  onUpdate: (
    idx: number,
    key: keyof ColumnField["columns"][number],
    val: string,
  ) => void;
  onRemove: (idx: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h6 className="text-sm font-medium">Columns</h6>
        <Button type="button" variant={"outline"} size={"icon"} onClick={onAdd}>
          <Plus />
        </Button>
      </div>

      {columns.length === 0 && (
        <p className="text-muted-foreground text-sm">No columns yet.</p>
      )}

      {columns.map((col, idx) => (
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

          <Label className="block w-full space-y-2">
            <p>
              Label <span className="text-red-500">*</span>
            </p>
            <Input
              type="text"
              placeholder={`eg: Column ${idx + 1}`}
              value={col.label}
              onChange={(e) => onUpdate(idx, "label", e.target.value)}
              required
            />
          </Label>

          <Label className="block w-full space-y-2">
            <p>
              Key <span className="text-red-500">*</span>
            </p>
            <Input
              type="text"
              placeholder={`eg: key_${idx + 1}`}
              value={col.key}
              onChange={(e) => onUpdate(idx, "key", e.target.value)}
              required
            />
          </Label>
        </div>
      ))}
    </div>
  );
}

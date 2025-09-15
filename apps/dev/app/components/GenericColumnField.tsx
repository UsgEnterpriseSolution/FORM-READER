import { Trash2, Plus } from "lucide-react";

import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

import type { ColumnField } from "~/types";
import { useActions } from "~/zustand";

type Props = {
  fieldId: string;
  data: ColumnField;
};

export default function GenericColumnField({ fieldId, data }: Props) {
  const { removeConfigField, updateConfigField } = useActions();

  const handleChange = (key: keyof ColumnField, value: any) => {
    updateConfigField(fieldId, { ...data, [key]: value });
  };

  const addColumn = () =>
    updateConfigField(fieldId, {
      ...data,
      columns: [...(data.columns ?? []), { label: "", key: "" }],
    });

  const updateColumn = (
    idx: number,
    key: keyof ColumnField["columns"][number],
    val: string,
  ) => {
    const cols = [...(data.columns ?? [])];
    cols[idx] = { ...cols[idx], [key]: val } as any;
    updateConfigField(fieldId, { ...data, columns: cols });
  };

  const removeColumn = (idx: number) =>
    updateConfigField(fieldId, {
      ...data,
      columns: (data.columns ?? []).filter((_, i) => i !== idx),
    });

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

      <FieldColumns
        columns={data.columns ?? []}
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

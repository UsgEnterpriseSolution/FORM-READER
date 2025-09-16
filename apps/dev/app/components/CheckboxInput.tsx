import React, { useId, useState } from "react";

import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { nanoid } from "nanoid";

type Option = {
  label: string;
  value: string;
};

type CheckboxInputProps = {
  label: string;
  name: string;
  placeholder: string;
  options: Option[];
  defaultOption?: string;
};

type BoxObj = {
  id: string;
  label: string;
  value: string;
  isChecked: boolean;
};

export default function CheckboxInput(props: CheckboxInputProps) {
  const reactId = useId();

  const [boxes, setBoxes] = useState<BoxObj[]>(() => {
    return props.options.map((option) => ({
      id: nanoid(),
      label: option.label,
      value: option.value,
      isChecked: option.value === props.defaultOption,
    }));
  });

  const selectedValues = boxes
    .filter((box) => box.isChecked)
    .map((box) => box.value);

  const handleChange = (id: string) => {
    setBoxes((prev) =>
      prev.map((obj) =>
        obj.id === id ? { ...obj, isChecked: !obj.isChecked } : obj,
      ),
    );
  };

  return (
    <fieldset className="space-y-2">
      <Input
        name={props.name}
        type="hidden"
        value={JSON.stringify(selectedValues)}
      />
      <legend className="text-foreground text-sm leading-none font-medium">
        {props.label}
      </legend>
      <p className="text-muted-foreground text-sm">{props.placeholder}</p>

      <div className="flex flex-wrap gap-2">
        {boxes.map((box) => (
          <div
            key={`${reactId}-${box.id}`}
            className="border-input data-[checked=true]:border-primary/50 relative flex flex-col items-start gap-4 rounded-md border p-3 shadow-xs outline-none"
            data-checked={box.isChecked}
          >
            <div className="flex items-center gap-2">
              <Checkbox
                id={`${reactId}-${box.id}`}
                checked={box.isChecked}
                onClick={() => handleChange(box.id)}
              />
              <Label htmlFor={`${reactId}-${box.id}`}>{box.label}</Label>
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  );
}

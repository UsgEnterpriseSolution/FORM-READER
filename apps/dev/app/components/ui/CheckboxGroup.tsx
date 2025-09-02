import React, { useState } from "react";
import { Checkbox } from "./checkbox";
import { Input } from "./input";
import { Label } from "./label";
import { nanoid } from "nanoid";

type Option = {
  label: string;
  value: string;
};

type CheckboxGroupProps = {
  label: string;
  options: Option[];
  defaultOption: string;
  onChange: (values: string[]) => void;
};

type BoxObj = {
  id: string;
  label: string;
  value: string;
  isChecked: boolean;
};

export default function CheckboxGroup(props: CheckboxGroupProps) {
  const [boxes, setBoxes] = useState<BoxObj[]>(() => {
    const boxObj: BoxObj[] = [];

    for (const option of props.options) {
      boxObj.push({
        id: nanoid(),
        label: option.label,
        value: option.value,
        isChecked: option.value === props.defaultOption,
      });
    }

    return boxObj;
  });

  const selectedValues = boxes
    .filter((box) => box.isChecked)
    .map((box) => box.value);

  const handleChange = (id: string) => {
    setBoxes((prev) => {
      const box = prev.map((obj) =>
        obj.id === id ? { ...obj, isChecked: !obj.isChecked } : obj,
      );
      return box;
    });
  };

  return (
    <div className="space-y-2">
      <Input type="hidden" value={JSON.stringify(selectedValues)} />
      <p className="text-sm font-medium">{props.label}</p>
      <div className="flex flex-col gap-3">
        {boxes.map((box) => (
          <Label key={box.id} className="flex items-center gap-2">
            <Checkbox
              checked={box.isChecked}
              onClick={() => handleChange(box.id)}
            />
            <p className="text-sm font-normal">{box.label}</p>
          </Label>
        ))}
      </div>
    </div>
  );
}

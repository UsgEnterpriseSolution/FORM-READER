import { useId } from "react";

import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

type CheckboxInputProps = {
  label: string;
  name: string;
  placeholder: string;
  options: {
    label: string;
    value: string;
  }[];
  defaultOption?: string;
  required?: boolean;
};

export default function RadioInput(props: CheckboxInputProps) {
  const id = useId();

  return (
    <fieldset className="space-y-2">
      <legend className="text-foreground text-sm leading-none font-medium">
        {props.label}
      </legend>

      <p className="text-muted-foreground text-sm">{props.placeholder}</p>
      <RadioGroup
        className="gap-0 -space-y-px rounded-md shadow-xs"
        defaultValue={props.defaultOption}
        name={props.name}
        required={props.required ?? false}
      >
        {props.options.map((item) => (
          <div
            key={`${id}-${item.value}`}
            className="border-input has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-accent relative flex flex-col gap-4 border p-4 outline-none first:rounded-t-md last:rounded-b-md has-data-[state=checked]:z-10"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  id={`${id}-${item.value}`}
                  value={item.value}
                  className="after:absolute after:inset-0"
                  aria-describedby={`${`${id}-${item.value}`}-price`}
                  defaultChecked={item.value === props.defaultOption}
                />
                <Label
                  className="inline-flex items-start"
                  htmlFor={`${id}-${item.value}`}
                >
                  {item.label}
                </Label>
              </div>
            </div>
          </div>
        ))}
      </RadioGroup>
    </fieldset>
  );
}

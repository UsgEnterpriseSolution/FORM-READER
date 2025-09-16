import { useState } from "react";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";

type SwitchInputProps = {
  label: string;
  name: string;
  defaultValue: boolean;
};

export default function SwitchInput(props: SwitchInputProps) {
  const [state, setState] = useState<boolean>(props.defaultValue ?? false);

  return (
    <>
      <Input type="hidden" name={props.name} value={state ? "true" : "false"} />
      <Label className="flex items-center gap-2 py-2">
        <Switch
          checked={state}
          onChange={() => {}}
          onCheckedChange={(e) => setState(e)}
        />
        <p>{props.label}</p>
      </Label>
    </>
  );
}

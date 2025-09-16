import type { FieldObj } from "~/types";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { PhoneInput } from "./PhoneInput";
import DateInput from "./ui/DateInput";
import CheckboxInput from "./CheckboxInput";
import RadioInput from "./RadioInput";
import SwitchInput from "./SwitchInput";

type GenericFieldProp = {
  field: FieldObj;
  data: any;
};

export default function GenericField({ field, data }: GenericFieldProp) {
  switch (field.type) {
    case "TEXT":
    case "EMAIL":
    case "NUMBER":
      return (
        <div className="space-y-2">
          <Label className="block">{field.label}</Label>
          <Input
            type={field.type.toLocaleLowerCase()}
            name={field.name}
            placeholder={field.placeholder}
            required={field.isRequired}
            defaultValue={data[field.name]}
          />
        </div>
      );

    case "PHONE":
      return (
        <div className="space-y-2">
          <Label className="block">{field.label}</Label>
          <PhoneInput
            name={field.name}
            placeholder={field.placeholder}
            required={field.isRequired}
            value={data[field.name] || field.defaultValue}
          />
        </div>
      );

    case "DATE":
      return (
        <div className="space-y-2">
          <Label className="block">{field.label}</Label>
          <DateInput
            name={field.name}
            required={field.isRequired}
            value={data[field.name] || field.defaultValue}
          />
        </div>
      );

    case "TEXTAREA":
      return (
        <div className="space-y-2">
          <Label className="block">{field.label}</Label>
          <Textarea
            name={field.name}
            placeholder={field.placeholder}
            required={field.isRequired}
            defaultValue={data[field.name] || field.defaultValue}
          />
        </div>
      );

    case "SELECT":
      return (
        <div className="space-y-2">
          <Select
            name={field.name}
            defaultValue={data[field.name] || field.defaultValue}
          >
            <Label className="block">{field.label}</Label>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((item, index) => (
                <SelectItem key={index} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );

    case "CHECKBOX":
      return (
        <CheckboxInput
          label={field.label}
          name={field.name}
          placeholder={field.placeholder}
          options={field.options}
          defaultOption={data[field.name] || field.defaultValue}
        />
      );

    case "RADIO":
      return (
        <RadioInput
          label={field.label}
          name={field.name}
          placeholder={field.placeholder}
          options={field.options}
          defaultOption={data[field.name] || field.defaultValue}
          required={field.isRequired}
        />
      );

    case "TABLE":
      return <p>Table field</p>;

    case "SWITCH":
      return (
        <SwitchInput
          label={field.label}
          name={field.name}
          defaultValue={data[field.name] ?? field.defaultValue}
        />
      );

    default:
      return <p>Unknown field type</p>;
  }
}

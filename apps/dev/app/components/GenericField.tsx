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
import CheckboxGroup from "./ui/CheckboxGroup";

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
            value={data[field.name]}
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
            value={data[field.name]}
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
            defaultValue={JSON.stringify(data[field.name])}
          />
        </div>
      );

    case "SELECT":
      return (
        <div className="space-y-2">
          <Select name={field.name} defaultValue={data[field.name]}>
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
        <CheckboxGroup
          label={field.label}
          options={field.options}
          defaultOption={data[field.name]}
          onChange={(values) => console.log(values)}
        />
      );

    case "RADIO":
      return <p>Radio field</p>;

    case "TABLE":
      return <p>Table field</p>;

    case "SWITCH":
      return <p>Switch field</p>;

    default:
      return <p>Unknown field type</p>;
  }
}

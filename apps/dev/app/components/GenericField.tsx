import type { Field } from "~/types";
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

type GenericFieldProp = {
  field: Field;
  data: any;
};

export default function GenericField({ field, data }: GenericFieldProp) {
  switch (field.type) {
    case "text":
    case "email":
    case "number":
      return (
        <div>
          <Label>{field.label}</Label>
          <Input
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            required={field.validation.isRequired}
            defaultValue={data[field.name]}
          />
        </div>
      );
    case "phone":
      return (
        <div>
          <Label>{field.label}</Label>
          <PhoneInput
            name={field.name}
            placeholder={field.placeholder}
            required={field.validation.isRequired}
            value={data[field.name]}
          />
        </div>
      );

    case "textarea":
      return (
        <div>
          <Label>{field.label}</Label>
          <Textarea
            name={field.name}
            placeholder={field.placeholder}
            required={field.validation.isRequired}
            defaultValue={JSON.stringify(data[field.name])}
          />
        </div>
      );

    case "select":
      return (
        <div>
          <Select defaultValue={data[field.name]}>
            <Label>{field.label}</Label>
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

    case "checkbox":
      return <p>Checkbox field</p>;

    default:
      // @ts-expect-error
      <p>{field.type}</p>;
      // @ts-expect-error
      console.log(field.type);
    // throw new Error("Invalid field type.");
  }
}

import { Form } from "react-router";
import type { SelectConfig } from "~/db/schema/tbConfig";
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

type ReviewFormProps = {
  config: SelectConfig | undefined;
  data: any;
};

export default function ReviewForm({ config, data }: ReviewFormProps) {
  return (
    <section className="space-y-2 overflow-y-scroll pb-4">
      <h3 className="text-lg">{config?.title}</h3>
      <p className="text-muted-foreground">{config?.description}</p>
      <Form id="review-form" method="POST" className="h-fit space-y-3">
        {config &&
          config.fields.map((field, index) => (
            <GenericField key={index} field={field} data={data} />
          ))}
      </Form>
    </section>
  );
}

type GenericFieldProp = {
  field: Field;
  data: any;
};

export function GenericField({ field, data }: GenericFieldProp) {
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
            defaultValue={data[field.name]}
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
      throw new Error("Invalid field type.");
  }
}

import { Form } from "react-router";

import type { SelectConfig } from "~/db/schema/tbConfig";
import { cn } from "~/lib/utils";
import GenericField from "./GenericField";

type ReviewFormProps = {
  config: SelectConfig | undefined;
  className?: string;
  data: any;
};

export default function ReviewForm({
  config,
  data,
  className,
}: ReviewFormProps) {
  return (
    <section className={cn(className)}>
      <h3 className="text-lg">{config?.title}</h3>
      <p className="text-muted-foreground">{config?.description}</p>
      <Form
        id="review-form"
        method="POST"
        className="grid h-fit grid-cols-2 gap-3 space-y-3"
      >
        {config &&
          config.fields.map((field, index) => (
            <GenericField key={index} field={field} data={data} />
          ))}
      </Form>
    </section>
  );
}

import { Form } from "react-router";

import type { SelectConfig } from "~/db/schema/tbConfig";
import { cn } from "~/lib/utils";
import GenericField from "./GenericField";
import { Input } from "./ui/input";
import { useNavigation } from "react-router";

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
  const navigation = useNavigation();
  const isPageSubmitting = navigation.state === "submitting";

  return (
    <section className={cn(className)}>
      <h3 className="text-lg">{config?.title}</h3>

      <p className="text-muted-foreground">{config?.description}</p>

      <Form id="review-form" method="POST" className="h-fit">
        <fieldset
          className="grid grid-cols-2 gap-3"
          disabled={isPageSubmitting}
        >
          <Input type="hidden" name="configRef" value={config?.configRef} />

          {config &&
            config.fields.map((field, index) => (
              <GenericField key={index} field={field} data={data} />
            ))}
        </fieldset>
      </Form>
    </section>
  );
}

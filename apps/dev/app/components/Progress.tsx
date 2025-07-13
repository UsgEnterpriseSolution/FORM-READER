import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "~/components/ui/stepper";

const steps = [
  {
    step: 1,
    title: "Upload",
  },
  {
    step: 2,
    title: "Review",
  },
  {
    step: 3,
    title: "Confirm",
  },
];

export default function Progress() {
  return (
    <div className="space-y-8 text-center">
      <Stepper defaultValue={1}>
        {steps.map(({ step, title }) => (
          <StepperItem
            key={step}
            step={step}
            className="not-last:flex-1 max-md:items-start"
          >
            <StepperTrigger className="flex-col gap-1 rounded sm:flex-row sm:gap-2">
              <StepperIndicator />
              <div className="text-center sm:text-left">
                <StepperTitle>{title}</StepperTitle>
              </div>
            </StepperTrigger>
            {step < steps.length && <StepperSeparator className="mx-3" />}
          </StepperItem>
        ))}
      </Stepper>
    </div>
  );
}

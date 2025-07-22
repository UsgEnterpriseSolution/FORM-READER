import type React from "react";
import { cn } from "~/lib/utils";

type StepperProps = {
  children: React.ReactNode;
  index: number;
  isActive?: boolean;
};

export default function Stepper(props: StepperProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "grid size-6 place-content-center rounded-full text-xs font-medium",
          !props.isActive && "bg-muted text-muted-foreground",
          props.isActive && "bg-primary text-secondary",
        )}
      >
        {props.index}
      </div>
      <p className="text-sm font-medium">{props.children}</p>
    </div>
  );
}

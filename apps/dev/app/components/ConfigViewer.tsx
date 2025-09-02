import React from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
  SheetClose,
} from "~/components/ui/sheet";
import {
  useActions,
  useConfigDetails,
  useConfigFields,
  useConfigLoading,
  useConfigMode,
} from "~/zustand/store";
import { Button } from "./ui/button";
import GenericField from "./GenericField";
import { Loader2 } from "lucide-react";

type ConfigViewerProps = {
  children: React.ReactNode;
};

export default function ConfigViewer({ children }: ConfigViewerProps) {
  const mode = useConfigMode();
  const details = useConfigDetails();
  const fields = useConfigFields();
  const isConfigLoading = useConfigLoading();

  const { resetConfig } = useActions();

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        {isConfigLoading && (
          <div className="bg-primary-foreground/80 absolute inset-0 flex items-center justify-center">
            <Loader2 className="animate-spin" />
          </div>
        )}

        <SheetHeader>
          <SheetTitle>{details.title}</SheetTitle>
          <SheetDescription>{details.description}</SheetDescription>
        </SheetHeader>

        <section className="h-full space-y-4 overflow-y-scroll px-4">
          {fields.map((field) => (
            <GenericField key={field.fieldId} field={field.data} data={{}} />
          ))}
        </section>

        <SheetFooter>
          <SheetClose asChild>
            <Button onClick={resetConfig}>Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

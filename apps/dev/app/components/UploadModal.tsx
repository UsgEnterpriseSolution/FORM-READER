import { Sparkles } from "lucide-react";
import type React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useActions, useSettings } from "~/zustand/store";
import { Button } from "./ui/button";
import { useRef } from "react";
import { toast } from "sonner";

type ExtractModalProps = {
  children: React.ReactNode;
};

export default function UploadModal({ children }: ExtractModalProps) {
  const { setEngine, setConfigId } = useActions();
  const settings = useSettings();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleExtract = () => {
    if (!settings.configId) {
      toast.warning("Please select form type.");
    } else if (!settings.engine) {
      toast.warning("Please select an engine type.");
    } else buttonRef.current?.click();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Extract details</AlertDialogTitle>
          <AlertDialogDescription>
            Configure options and extract
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Select
          defaultValue={settings.configId === null ? "" : settings.configId}
          onValueChange={setConfigId}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Form Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Forms</SelectLabel>
              <SelectItem value="DUMMY">Dummy Form</SelectItem>
              <SelectItem value="PERSONAL_DETAILS">
                Personal Details Form
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          defaultValue={settings.engine === null ? "" : settings.engine}
          onValueChange={setEngine}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Engine Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Engines</SelectLabel>
              <SelectItem value="GOOGLE">Google</SelectItem>
              <SelectItem value="OLLAMA">Ollama</SelectItem>
              <SelectItem value="LMSTUDIO">LM Studio</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <AlertDialogFooter>
          <Button
            ref={buttonRef}
            className="sr-only"
            type="submit"
            form="image-form"
          ></Button>

          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction onClick={handleExtract}>
            <Sparkles
              className="-me-1 opacity-60"
              size={16}
              aria-hidden="true"
            />
            <span>Extract</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

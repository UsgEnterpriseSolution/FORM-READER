import { CircleChevronRight, Loader2Icon, Sparkles } from "lucide-react";

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
import { useActions, useSettings } from "~/zustand";
import { Button } from "./ui/button";

import { useLoaderData, useNavigation } from "react-router";
import type { loader } from "~/routes/upload";

type ExtractModalProps = {};

export default function UploadModal({}: ExtractModalProps) {
  const loaderData = useLoaderData<typeof loader>();

  const navigation = useNavigation();
  const isPageSubmitting = navigation.state === "submitting";

  const { setEngine, setconfigRef } = useActions();
  const settings = useSettings();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size={"sm"} disabled={isPageSubmitting}>
          {isPageSubmitting ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <Sparkles
              className="-me-1 opacity-60"
              size={16}
              aria-hidden="true"
            />
          )}
          <span>Extract</span>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Extraction configuration</AlertDialogTitle>
          <AlertDialogDescription>
            Choose your extraction options below.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Select
          defaultValue={settings.configRef === null ? "" : settings.configRef}
          onValueChange={setconfigRef}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Form Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Forms</SelectLabel>
              {loaderData.status === "success" &&
                loaderData.data.configs.map((config, index) => (
                  <SelectItem key={index} value={config.value}>
                    {config.label}
                  </SelectItem>
                ))}
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
              <SelectLabel>Online</SelectLabel>
              {loaderData.status === "success" &&
                loaderData.data.engines
                  .filter((item) => item.isLocal === false)
                  .map((engine, index) => (
                    <SelectItem key={index} value={engine.value}>
                      {engine.label}
                    </SelectItem>
                  ))}
            </SelectGroup>

            <SelectGroup>
              <SelectLabel>Local</SelectLabel>
              {loaderData.status === "success" &&
                loaderData.data.engines
                  .filter((item) => item.isLocal)
                  .map((engine, index) => (
                    <SelectItem key={index} value={engine.value}>
                      {engine.label}
                    </SelectItem>
                  ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            type="submit"
            form="image-form"
            disabled={!settings.configRef || !settings.engine}
          >
            <span>Proceed</span>
            <CircleChevronRight />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

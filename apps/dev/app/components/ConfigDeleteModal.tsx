import { CircleAlertIcon } from "lucide-react";

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
import { Button } from "./ui/button";
import { Form } from "react-router";

type ConfigDeleteModalProps = {
  children?: React.ReactNode;
  configId: string;
};

export default function ConfigDeleteModal({
  children,
  configId,
}: ConfigDeleteModalProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <CircleAlertIcon
              className="stroke-destructive opacity-80"
              size={16}
            />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the configuration and all of
              its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <Form id={`delete-config-${configId}`} method="DELETE">
          <input type="hidden" name="configId" value={configId} />
        </Form>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              type="submit"
              form={`delete-config-${configId}`}
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

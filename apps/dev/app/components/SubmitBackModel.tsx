import { CircleAlertIcon } from "lucide-react";
import type { Blocker } from "react-router";

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

type SubmitBackModelProps = {
  blocker: Blocker;
};

export default function SubmitBackModel({ blocker }: SubmitBackModelProps) {
  return (
    <AlertDialog open>
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
            <AlertDialogTitle>Access Denied!</AlertDialogTitle>
            <AlertDialogDescription>
              You are not permitted to return to this page.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={blocker.reset}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={blocker.reset}>Okay</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

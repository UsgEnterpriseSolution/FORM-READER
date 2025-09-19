import { CircleAlertIcon, Loader2Icon } from "lucide-react";
import { useNavigation } from "react-router";
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
import { Button } from "~/components/ui/button";

export default function ReviewSubmitModal() {
  const navigation = useNavigation();
  const isPageSubmitting = navigation.state === "submitting";

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="ml-auto"
          variant="default"
          disabled={isPageSubmitting}
        >
          {isPageSubmitting && <Loader2Icon className="animate-spin" />}
          Submit
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <CircleAlertIcon className="opacity-80" size={16} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Please ensure all information is correct before confirming, as
              changes cannot be made after submission.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction type="submit" form="review-form">
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

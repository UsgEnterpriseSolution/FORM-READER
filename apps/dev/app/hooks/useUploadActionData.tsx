import { useEffect } from "react";
import { href, useNavigate } from "react-router";
import { toast } from "sonner";

import type { ActionRes, UploadActionRes } from "~/types";
import { uploadActionDataSchema } from "~/zod";
import { useActions } from "~/zustand/store";

export default function useUploadActionData(
  actionData: ActionRes<UploadActionRes> | undefined,
) {
  const { addImage, addFieldData } = useActions();
  const navigate = useNavigate();

  useEffect(() => {
    if (actionData && actionData.status === "success") {
      const zodObj = uploadActionDataSchema.safeParse(actionData.data);

      if (!zodObj.success) {
        toast.error("Response data validation failed.");
      } else {
        const data = zodObj.data;

        addImage(data.images);
        addFieldData(data.fieldData);
        toast.success("Image(s) processed successfully.");

        navigate(href("/review"));
      }
    }

    if (actionData && actionData.status === "fail") {
      toast.warning(actionData.message);
    }

    if (actionData && actionData.status === "error") {
      toast.error(actionData.message);
    }
  }, [actionData]);
}

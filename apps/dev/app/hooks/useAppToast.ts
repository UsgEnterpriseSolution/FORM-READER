import { useEffect } from "react";
import { toast } from "sonner";
import type { AppResponse } from "~/types";

function useAppToast<T>(data?: AppResponse<T>) {
  useEffect(() => {
    if (data && data.status === "fail") {
      toast.warning(data.message);
    }

    if (data && data.status === "error") {
      toast.error(data.message);
    }

    if (data && data.status === "success") {
      toast.success(data.message);
    }
  }, [data?.timestamp]);
}

export default useAppToast;

import { useEffect } from "react";
import { useLoaderData } from "react-router";
import type { loader } from "~/routes/upload";
import { useActions } from "~/zustand";

export default function useConfigRef() {
  const loaderData = useLoaderData<typeof loader>();
  const { setSettings } = useActions();

  useEffect(() => {
    if (loaderData && loaderData.status === "success") {
      if (loaderData.data.configs.length === 1) {
        const config = loaderData.data.configs[0];
        setSettings({ key: "configRef", value: config.value ?? null });
        setSettings({ key: "hideConfigRef", value: true });
      }
    }
  }, [loaderData.timestamp]);
}

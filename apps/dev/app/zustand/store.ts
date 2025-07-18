import { create } from "zustand";
import type { FileWithPreview } from "~/hooks/use-file-upload";

type State = {
  images: FileWithPreview[];
  formData: FormData | null;
  appData: {
    isProcessing: boolean;
    successMsg: string;
    errorMsg: string;
  };
};

type Actions = {
  processImg: () => Promise<void>;
};

type AppStore = {
  state: State;
  actions: Actions;
};

const useAppStore = create<AppStore>((set, get) => ({
  state: {
    images: [],
    formData: null,
    appData: {
      isProcessing: false,
      successMsg: "",
      errorMsg: "",
    },
  },
  actions: {
    processImg: async () => {
      const { appData, images } = get().state;

      if (appData.isProcessing) return;
      else {
        set((state) => ({
          state: {
            ...state.state,
            appData: {
              ...state.state.appData,
              isProcessing: true,
              successMsg: "",
              errorMsg: "",
            },
          },
        }));
      }

      try {
        const imgDataUrlList = images.map((image) => image.preview);
        const orgin = window.location.origin;

        const response = await fetch(orgin + "/api/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(imgDataUrlList),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to process image.");
        }

        const data: FormData = await response.json();

        console.log(data);

        set((state) => ({
          state: {
            ...state.state,
            appData: {
              ...state.state.appData,
              isProcessing: false,
              successMsg: "Image processed successfully.",
              errorMsg: "",
            },
          },
        }));
      } catch (error: any) {
        set((state) => ({
          state: {
            ...state.state,
            appData: {
              ...state.state.appData,
              isProcessing: false,
              successMsg: "",
              errorMsg: error.message || "An error occurred.",
            },
          },
        }));
      }
    },
  },
}));

export const useImages = () => useAppStore((store) => store.state.images);
export const useFormData = () => useAppStore((store) => store.state.formData);
export const useAppData = () => useAppStore((store) => store.state.appData);
export const useActions = () => useAppStore((store) => store.actions);

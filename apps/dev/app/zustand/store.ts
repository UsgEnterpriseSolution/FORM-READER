import { create } from "zustand";
import type { FieldData } from "~/types";

type State = {
  images: string[];
  fieldData: FieldData | undefined;
};

type Actions = {
  addImage: (dataURL: string[]) => void;
  addFieldData: (fieldData: FieldData) => void;
};

type AppStore = {
  state: State;
  actions: Actions;
};

export const useAppStore = create<AppStore>((set, get) => ({
  state: {
    images: [],
    fieldData: undefined,
  },
  actions: {
    addImage: (images) => {
      set((store) => ({
        state: { ...store.state, images: [...store.state.images, ...images] },
      }));
    },
    addFieldData: (data) => {
      set((store) => ({
        state: { ...store.state, fieldData: data },
      }));
    },
  },
}));

export const useImages = () => useAppStore((store) => store.state.images);
export const useFieldData = () => useAppStore((store) => store.state.fieldData);
export const useActions = () => useAppStore((store) => store.actions);

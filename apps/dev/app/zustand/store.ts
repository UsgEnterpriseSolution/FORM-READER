import { create } from "zustand";
import type { Engine, FieldData } from "~/types";

type State = {
  settings: {
    engine: Engine | null;
    configId: string | null;
  };
  images: string[];
  fieldData: FieldData | undefined;
};

type Actions = {
  setImage: (dataURL: string[]) => void;
  setFieldData: (fieldData: FieldData) => void;
  setEngine: (engine: Engine) => void;
  setConfigId: (configId: string) => void;
  reset: () => void;
};

type AppStore = {
  state: State;
  actions: Actions;
};

export const useAppStore = create<AppStore>((set, get) => ({
  state: {
    settings: {
      engine: null,
      configId: null,
    },
    images: [],
    fieldData: undefined,
  },
  actions: {
    setImage: (images) => {
      set((store) => ({
        state: { ...store.state, images },
      }));
    },
    setFieldData: (data) => {
      set((store) => ({
        state: { ...store.state, fieldData: data },
      }));
    },
    setEngine: (engine) => {
      set((store) => ({
        state: {
          ...store.state,
          settings: { ...store.state.settings, engine },
        },
      }));
    },
    setConfigId: (configId) => {
      set((store) => ({
        state: {
          ...store.state,
          settings: { ...store.state.settings, configId },
        },
      }));
    },
    reset: () => {
      set({
        state: {
          images: [],
          fieldData: undefined,
          settings: { engine: null, configId: null },
        },
      });
    },
  },
}));

export const useSettings = () => useAppStore((store) => store.state.settings);
// export const useImages = () => useAppStore((store) => store.state.images);
// export const useFieldData = () => useAppStore((store) => store.state.fieldData);
export const useActions = () => useAppStore((store) => store.actions);

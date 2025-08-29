import { nanoid } from "nanoid";
import { create } from "zustand";
import type { ConfigFieldType, Engine, FieldObj } from "~/types";
import {
  columnFieldTypeSchema,
  optionFieldTypeSchema,
  textFieldTypeSchema,
  toggleFieldTypeSchema,
} from "~/zod";

type State = {
  settings: {
    engine: Engine | null;
    configId: string | null;
  };
  config: {
    details: {
      title: string | null;
      description: string | null;
    };
    fields: {
      fieldId: string;
      data: FieldObj;
    }[];
  };
};

type Actions = {
  setEngine: (engine: Engine) => void;
  setConfigId: (configId: string) => void;
  setConfigDetails: (key: "title" | "description", value: string) => void;
  addConfigField: (type: ConfigFieldType) => void;
  removeConfigField: (fieldId: string) => void;
  updateConfigField: (fieldId: string, data: FieldObj) => void;
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
    config: {
      details: {
        title: null,
        description: null,
      },
      fields: [],
    },
  },
  actions: {
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
    setConfigDetails: (key, value) => {
      set((store) => ({
        state: {
          ...store.state,
          config: {
            ...store.state.config,
            details: {
              ...store.state.config.details,
              [key]: value,
            },
          },
        },
      }));
    },
    addConfigField: (type) => {
      const textZodObj = textFieldTypeSchema.safeParse(type);
      const optionZodObj = optionFieldTypeSchema.safeParse(type);
      const columnZodObj = columnFieldTypeSchema.safeParse(type);
      const toggleZodObj = toggleFieldTypeSchema.safeParse(type);

      let fieldId = nanoid();
      let data: FieldObj;

      if (textZodObj.success) {
        data = {
          type: textZodObj.data,
          label: "New Field",
          name: "",
          placeholder: "",
          defaultValue: "",
          regExp: "",
          isRequired: false,
        };
      }

      if (optionZodObj.success) {
        data = {
          type: optionZodObj.data,
          label: "New Field",
          name: "",
          placeholder: "",
          defaultValue: "",
          options: [],
          isRequired: false,
        };
      }

      if (columnZodObj.success) {
        data = {
          type: columnZodObj.data,
          label: "New Field",
          name: "",
          columns: [],
        };
      }

      if (toggleZodObj.success) {
        data = {
          type: toggleZodObj.data,
          label: "New Field",
          name: "",
          placeholder: "",
          defaultValue: false,
        };
      }

      set((store) => ({
        state: {
          ...store.state,
          config: {
            ...store.state.config,
            fields: [...store.state.config.fields, { fieldId, data }],
          },
        },
      }));
    },
    removeConfigField: (fieldId) => {
      set((store) => ({
        state: {
          ...store.state,
          config: {
            ...store.state.config,
            fields: store.state.config.fields.filter(
              (field) => field.fieldId !== fieldId,
            ),
          },
        },
      }));
    },
    updateConfigField: (fieldId, data) => {
      set((store) => ({
        state: {
          ...store.state,
          config: {
            ...store.state.config,
            fields: store.state.config.fields.map((field) =>
              field.fieldId === fieldId ? { ...field, data } : field,
            ),
          },
        },
      }));
    },
  },
}));

export const useActions = () => useAppStore((store) => store.actions);

export const useSettings = () => useAppStore((store) => store.state.settings);

export const useConfigDetails = () =>
  useAppStore((store) => store.state.config.details);

export const useConfigFields = () =>
  useAppStore((store) => store.state.config.fields);

export const useConfigField = (id: string) =>
  useAppStore((store) =>
    store.state.config.fields.find((field) => field.fieldId === id),
  );

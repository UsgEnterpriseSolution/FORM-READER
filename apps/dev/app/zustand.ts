import { nanoid } from "nanoid";
import { create } from "zustand";
import type {
  AppResponse,
  ConfigFieldType,
  ConfigObj,
  DataLog,
  Discriminated,
  Engine,
  FieldObj,
} from "~/types";
import {
  columnFieldTypeSchema,
  optionFieldTypeSchema,
  textFieldTypeSchema,
  toggleFieldTypeSchema,
} from "~/zod";

type StoreState = {
  settings: {
    imgCount: number;
    engine: Engine | null;
    configRef: string | null;
    hideConfigRef: boolean;
  };
  config: {
    loading: boolean;
    mode: "CREATE" | "EDIT" | "VIEW";
    details: {
      title: string | null;
      description: string | null;
      endpoint: string | null;
      formCode: string | null;
    };
    fields: {
      fieldId: string;
      data: FieldObj;
    }[];
  };
};

type SettingsObj = Discriminated<StoreState["settings"]>;

type StoreActions = {
  setSettings: (obj: SettingsObj) => void;
  setConfigDetails: (
    key: "title" | "description" | "endpoint" | "formCode",
    value: string,
  ) => void;
  getDefaultFieldData: (type: ConfigFieldType) => FieldObj;
  addConfigField: (type: ConfigFieldType) => void;
  removeConfigField: (fieldId: string) => void;
  updateConfigField: (fieldId: string, data: FieldObj) => void;
  updateConfigFieldType: (fieldId: string, type: string) => void;
  resetConfig: () => void;
  setConfigMode: (mode: "CREATE" | "EDIT" | "VIEW") => void;
  fetchConfiglet: (configRef: string) => Promise<void>;
  setConfigLoading: (state: boolean) => void;
  fetchDataLog: (dataRef: string) => Promise<AppResponse<DataLog>>;
};

type AppStore = {
  state: StoreState;
  actions: StoreActions;
};

export const useAppStore = create<AppStore>((set, get) => ({
  state: {
    settings: {
      imgCount: 0,
      engine: null,
      configRef: null,
      hideConfigRef: false,
    },
    config: {
      loading: false,
      mode: "CREATE",
      details: {
        title: null,
        description: null,
        endpoint: null,
        formCode: null,
      },
      fields: [],
    },
  },
  actions: {
    setSettings: ({ key, value }) => {
      set((store) => ({
        state: {
          ...store.state,
          settings: { ...store.state.settings, [key]: value },
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
      const store = get();
      const fieldId = nanoid();
      const data = store.actions.getDefaultFieldData(type);

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
    updateConfigFieldType: (fieldId, type) => {
      const store = get();
      const data = store.actions.getDefaultFieldData(type as ConfigFieldType);

      store.actions.updateConfigField(fieldId, data);
    },
    resetConfig: () => {
      set((store) => ({
        state: {
          ...store.state,
          config: {
            ...store.state.config,
            details: {
              title: null,
              description: null,
              endpoint: null,
              formCode: null,
            },
            fields: [],
          },
        },
      }));
    },
    setConfigMode: (mode) => {
      set((store) => ({
        state: {
          ...store.state,
          config: {
            ...store.state.config,
            mode,
          },
        },
      }));
    },
    fetchConfiglet: async (configRef) => {
      const store = get();
      store.actions.setConfigLoading(true);
      try {
        const res = await fetch(
          `/api/configlet/${encodeURIComponent(configRef)}`,
        );
        if (!res.ok) {
          throw new Error("Failed to load config.");
        }

        const payload = await res.json();
        if (payload?.status !== "success") {
          throw new Error(payload.message);
        }

        const config: ConfigObj = payload.data;

        const mappedFields = Array.isArray(config.fields)
          ? config.fields.map((f) => ({ fieldId: nanoid(), data: f }))
          : [];

        set((store) => ({
          state: {
            ...store.state,
            settings: { ...store.state.settings, configRef },
            config: {
              ...store.state.config,
              mode: "EDIT",
              details: {
                title: config.title ?? null,
                description: config.description ?? null,
                endpoint: config.endpoint ?? null,
                formCode: config.formCode ?? null,
              },
              fields: mappedFields,
            },
          },
        }));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(
          "fetchConfiglet error:",
          error instanceof Error ? error.message : error,
        );
      } finally {
        store.actions.setConfigLoading(false);
      }
    },
    setConfigLoading: (state) => {
      set((store) => ({
        state: {
          ...store.state,
          config: {
            ...store.state.config,
            loading: state,
          },
        },
      }));
    },
    fetchDataLog: async (dataRef) => {
      try {
        const res = await fetch(`/api/datalog/${dataRef}`);

        if (!res.ok) {
          throw new Error("Unable to retrieve data log.");
        }

        return await res.json();
      } catch (error) {
        throw error;
      }
    },
    getDefaultFieldData: (type) => {
      const textZodObj = textFieldTypeSchema.safeParse(type);
      const optionZodObj = optionFieldTypeSchema.safeParse(type);
      const columnZodObj = columnFieldTypeSchema.safeParse(type);
      const toggleZodObj = toggleFieldTypeSchema.safeParse(type);

      if (textZodObj.success) {
        return {
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
        return {
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
        return {
          type: columnZodObj.data,
          label: "New Field",
          name: "",
          columns: [],
        };
      }

      if (toggleZodObj.success) {
        return {
          type: toggleZodObj.data,
          label: "New Field",
          name: "",
          placeholder: "",
          defaultValue: false,
        };
      }

      throw new Error("Invalid field type.");
    },
  },
}));

export const useActions = () => useAppStore((store) => store.actions);

export const useSettings = () => useAppStore((store) => store.state.settings);

export const useConfigMode = () =>
  useAppStore((store) => store.state.config.mode);

export const useConfigDetails = () =>
  useAppStore((store) => store.state.config.details);

export const useConfigFields = () =>
  useAppStore((store) => store.state.config.fields);

export const useConfigField = (id: string) =>
  useAppStore((store) =>
    store.state.config.fields.find((field) => field.fieldId === id),
  );

export const useConfigLoading = () =>
  useAppStore((store) => store.state.config.loading);

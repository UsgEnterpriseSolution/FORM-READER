import { nanoid } from "nanoid";
import { create } from "zustand";
import type { ConfigObj, FieldObj, StoreActions, StoreState } from "~/types";
import {
  columnFieldTypeSchema,
  optionFieldTypeSchema,
  textFieldTypeSchema,
  toggleFieldTypeSchema,
} from "~/zod";

type AppStore = {
  state: StoreState;
  actions: StoreActions;
};

export const useAppStore = create<AppStore>((set, get) => ({
  state: {
    settings: {
      engine: null,
      configRef: null,
    },
    config: {
      loading: false,
      mode: "CREATE",
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
    setconfigRef: (configRef) => {
      set((store) => ({
        state: {
          ...store.state,
          settings: { ...store.state.settings, configRef },
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
    resetConfig: () => {
      set((store) => ({
        state: {
          ...store.state,
          config: {
            ...store.state.config,
            details: {
              title: null,
              description: null,
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

        const payload = await res.json();

        if (!res.ok) {
          // backend may still return a JSON body with a message
          const msg =
            payload?.message || res.statusText || "Unable to load config.";
          throw new Error(msg);
        }

        if (payload?.status !== "success") {
          const msg = payload?.message || "Failed to load config.";
          throw new Error(msg);
        }

        const config: ConfigObj = payload.data;

        // map incoming fields (FieldObj[]) to store shape { fieldId, data }
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
              },
              fields: mappedFields,
            },
          },
        }));
      } catch (error) {
        // keep behavior simple: log error. callers/components can show toast if needed.
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

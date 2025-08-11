import { create } from "zustand";
import type { SelectConfig } from "~/db/schema/tbConfig";

export type ConfigsState = {
  items: SelectConfig[];
  loading: boolean;
  error?: string;
};

export type ConfigsActions = {
  fetchAll: () => Promise<void>;
  fetchOne: (id: string) => Promise<SelectConfig | null>;
  create: (
    input: Pick<SelectConfig, "configId" | "title" | "description" | "fields" | "schema">
  ) => Promise<SelectConfig | null>;
  update: (
    id: string,
    patch: Partial<Pick<SelectConfig, "title" | "description" | "fields" | "schema">>
  ) => Promise<SelectConfig | null>;
  remove: (id: string) => Promise<boolean>;
};

export const useConfigsStore = create<{ state: ConfigsState; actions: ConfigsActions }>((set, get) => ({
  state: { items: [], loading: false },
  actions: {
    fetchAll: async () => {
      set((s) => ({ state: { ...s.state, loading: true, error: undefined } }));
      try {
        const res = await fetch("/api/configs");
        const json = await res.json();
        if (json.status === "success") {
          set((s) => ({ state: { ...s.state, items: json.data, loading: false } }));
        } else {
          set((s) => ({ state: { ...s.state, loading: false, error: json.message || "Failed" } }));
        }
      } catch (e) {
        set((s) => ({ state: { ...s.state, loading: false, error: e instanceof Error ? e.message : String(e) } }));
      }
    },
    fetchOne: async (id) => {
      const res = await fetch(`/api/configs/${id}`);
      const json = await res.json();
      return json.status === "success" ? (json.data as SelectConfig) : null;
    },
    create: async (input) => {
      const res = await fetch("/api/configs", { method: "POST", body: JSON.stringify(input), headers: { "Content-Type": "application/json" } });
      const json = await res.json();
      if (json.status === "success") {
        set((s) => ({ state: { ...s.state, items: [...s.state.items, json.data] } }));
        return json.data as SelectConfig;
      }
      return null;
    },
    update: async (id, patch) => {
      // Optimistic update: apply patch locally, then revert on failure
      const prev = get().state.items;
      const optimistic = prev.map((it) => (it.configId === id ? { ...it, ...patch } : it));
      set((s) => ({ state: { ...s.state, items: optimistic } }));

      try {
        const res = await fetch(`/api/configs/${id}`, { method: "PUT", body: JSON.stringify(patch), headers: { "Content-Type": "application/json" } });
        const json = await res.json();
        if (json.status === "success") {
          set((s) => ({
            state: {
              ...s.state,
              items: s.state.items.map((it) => (it.configId === id ? (json.data as SelectConfig) : it)),
            },
          }));
          return json.data as SelectConfig;
        } else {
          // revert
          set((s) => ({ state: { ...s.state, items: prev } }));
          return null;
        }
      } catch (e) {
        // revert on error
        set((s) => ({ state: { ...s.state, items: prev } }));
        return null;
      }
    },
    remove: async (id) => {
      const res = await fetch(`/api/configs/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.status === "success") {
        set((s) => ({ state: { ...s.state, items: s.state.items.filter((it) => it.configId !== id) } }));
        return true;
      }
      return false;
    },
  },
}));


import type { Route } from "./+types/config";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import ConfigEditor, {
  type ConfigEditorValues,
} from "~/components/config/ConfigEditor";
import { useConfigsStore } from "~/zustand/configs";
import { generateAJVSchema } from "~/lib/generateAjvSchema";
import type { SelectConfig } from "~/db/schema/tbConfig";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

export async function action({}: Route.ActionArgs) {}

export async function loader({}: Route.LoaderArgs) {}

type EditorState =
  | { mode: "hidden" }
  | { mode: "create" }
  | { mode: "edit"; item: SelectConfig };

type SortKey = "title" | "description" | "configId";
type SortDir = "asc" | "desc";

export default function Config() {
  const { state, actions } = useConfigsStore();
  const [editor, setEditor] = useState<EditorState>({ mode: "hidden" });
  const [toDelete, setToDelete] = useState<null | SelectConfig>(null);
  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    actions.fetchAll();
  }, []);

  // Surface load errors via toast and inline message
  useEffect(() => {
    if (state.error) toast.error(state.error);
  }, [state.error]);

  const filteredSorted = useMemo(() => {
    const arr = [...state.items];
    arr.sort((a, b) => {
      const av = String(a[sortKey] ?? "").toLowerCase();
      const bv = String(b[sortKey] ?? "").toLowerCase();
      if (av === bv) return 0;
      const res = av < bv ? -1 : 1;
      return sortDir === "asc" ? res : -res;
    });
    return arr;
  }, [state.items, sortKey, sortDir]);

  const total = filteredSorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSorted.slice(start, start + pageSize);
  }, [filteredSorted, currentPage, pageSize]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function exportConfig(cfg: SelectConfig) {
    try {
      const data = JSON.stringify(cfg, null, 2);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `config-${cfg.configId}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Configuration exported");
    } catch (e) {
      toast.error("Failed to export configuration");
    }
  }

  async function importConfig(file: File) {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      // Accept either full SelectConfig or minimal create payload
      const incoming: Partial<SelectConfig> = parsed;
      const values = {
        configId:
          typeof globalThis !== "undefined" &&
          (globalThis as any).crypto &&
          typeof (globalThis as any).crypto.randomUUID === "function"
            ? (globalThis as any).crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        title: incoming.title || "Imported Config",
        description: incoming.description || "",
        fields: (incoming.fields as any) || [],
        schema: (incoming.schema as any) || {},
      };
      const created = await actions.create(values as any);
      if (created) toast.success("Configuration imported");
      else toast.error("Failed to import configuration");
    } catch (e: any) {
      toast.error(`Invalid import file: ${e?.message || e}`);
    }
  }

  const handleCreate = async (values: ConfigEditorValues) => {
    // Enforce unique field names
    const names = values.fields.map((f) => f.name);
    const uniq = new Set(names);
    if (uniq.size !== names.length) {
      toast.warning("Field names must be unique");
      return;
    }

    const configId =
      typeof globalThis !== "undefined" &&
      (globalThis as any).crypto &&
      typeof (globalThis as any).crypto.randomUUID === "function"
        ? (globalThis as any).crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const schema = generateAJVSchema({
      name: values.name,
      description: values.description,
      fields: values.fields,
    });

    const created = await actions.create({
      configId,
      title: values.name,
      description: values.description || "",
      fields: values.fields as any,
      schema: schema as any,
    });

    if (created) {
      toast.success("Configuration created");
      setEditor({ mode: "hidden" });
    } else {
      toast.error("Failed to create configuration");
    }
  };

  const handleUpdate = async (
    item: SelectConfig,
    values: ConfigEditorValues,
  ) => {
    const names = values.fields.map((f) => f.name);
    const uniq = new Set(names);
    if (uniq.size !== names.length) {
      toast.warning("Field names must be unique");
      return;
    }

    const schema = generateAJVSchema({
      name: values.name,
      description: values.description,
      fields: values.fields,
    });
    const updated = await actions.update(item.configId, {
      title: values.name,
      description: values.description || "",
      fields: values.fields as any,
      schema: schema as any,
    });

    if (updated) {
      toast.success("Configuration updated");
      setEditor({ mode: "hidden" });
    } else {
      toast.error("Failed to update configuration");
    }
  };

  const startEdit = (it: SelectConfig) => {
    setEditor({ mode: "edit", item: it });
  };

  return (
    <section className="p-4 md:p-6">
      <header className="mb-4 flex flex-col items-start justify-between gap-3 sm:mb-6 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Configurations
        </h1>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <label className="text-muted-foreground flex items-center gap-2 text-sm">
            Page size
            <select
              className="rounded-md border px-2 py-1"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <input
            type="file"
            accept="application/json"
            className="hidden"
            id="config-import-input"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importConfig(f);
              // reset so same file can be chosen again
              e.currentTarget.value = "";
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              document.getElementById("config-import-input")?.click()
            }
          >
            Import JSON
          </Button>
          <Button type="button" onClick={() => setEditor({ mode: "create" })}>
            Add New Configuration
          </Button>
        </div>
      </header>

      {state.error && (
        <div className="border-destructive/50 bg-destructive/10 text-destructive rounded-md border p-3 text-sm">
          {state.error}
        </div>
      )}

      <div className="grid gap-4 md:gap-6">
        <div className="bg-background rounded-lg border p-3 md:p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button
                    className="flex items-center gap-1"
                    onClick={() => toggleSort("title")}
                  >
                    Name{" "}
                    {sortKey === "title" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    className="flex items-center gap-1"
                    onClick={() => toggleSort("description")}
                  >
                    Description{" "}
                    {sortKey === "description"
                      ? sortDir === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    className="flex items-center gap-1"
                    onClick={() => toggleSort("configId")}
                  >
                    Config Id{" "}
                    {sortKey === "configId"
                      ? sortDir === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </button>
                </TableHead>
                <TableHead className="w-[220px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.loading ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-muted-foreground text-center"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : pageItems.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-muted-foreground text-center"
                  >
                    No configurations.
                  </TableCell>
                </TableRow>
              ) : (
                pageItems.map((cfg) => (
                  <TableRow key={cfg.configId}>
                    <TableCell className="font-medium">{cfg.title}</TableCell>
                    <TableCell className="max-w-[420px] truncate">
                      {cfg.description}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {cfg.configId}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => startEdit(cfg)}
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => exportConfig(cfg)}
                        >
                          Export
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                            >
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete configuration
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{cfg.title}"?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={async () => {
                                  const ok = await actions.remove(cfg.configId);
                                  if (ok)
                                    toast.success("Configuration deleted");
                                  else
                                    toast.error(
                                      "Failed to delete configuration",
                                    );
                                }}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {/* Pagination controls */}
          <div className="mt-3 flex flex-col items-center justify-between gap-2 sm:flex-row">
            <div className="text-muted-foreground text-sm">
              Showing{" "}
              {(currentPage - 1) * pageSize + Math.min(1, pageItems.length)}-
              {(currentPage - 1) * pageSize + pageItems.length} of {total}
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPage(1)}
                disabled={currentPage === 1}
              >
                « First
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ‹ Prev
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next ›
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                Last »
              </Button>
            </div>
          </div>
        </div>
        {/* Editor Modal */}

        <Dialog
          open={editor.mode !== "hidden"}
          onOpenChange={(open) => !open && setEditor({ mode: "hidden" })}
        >
          <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editor.mode === "edit"
                  ? "Edit configuration"
                  : "Create configuration"}
              </DialogTitle>
            </DialogHeader>
            <div className="py-2">
              <ConfigEditor
                defaultValues={
                  editor.mode === "edit"
                    ? {
                        name: editor.item.title,
                        description: editor.item.description,
                        fields: editor.item.fields as any,
                      }
                    : undefined
                }
                submitLabel={
                  editor.mode === "edit"
                    ? "Update configuration"
                    : "Create configuration"
                }
                onSubmit={(values: ConfigEditorValues) =>
                  editor.mode === "edit"
                    ? handleUpdate(editor.item, values)
                    : handleCreate(values)
                }
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}

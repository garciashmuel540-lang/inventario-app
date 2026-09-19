import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FileDown, Pencil, Plus, Printer, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { EmptyState } from "@/components/empty-state";
import { Field } from "@/components/field";
import { Money } from "@/components/money";
import { PageHeader } from "@/components/page-header";
import { PaginationBar } from "@/components/pagination-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { PAGE_SIZE } from "@/lib/constants";
import { downloadText, entriesToCsv, printEntries } from "@/lib/export";
import { formatDate, nextNumber, round2, todayIso } from "@/lib/format";
import { entryTotal } from "@/lib/metrics";
import { useAppStore } from "@/lib/store";
import type { Entry, EntryDraft } from "@/lib/types";

export const Route = createFileRoute("/entradas")({ component: EntriesPage });

function EntriesPage() {
  const products = useAppStore((s) => s.products);
  const entries = useAppStore((s) => s.entries);
  const settings = useAppStore((s) => s.settings);
  const addEntry = useAppStore((s) => s.addEntry);
  const updateEntry = useAppStore((s) => s.updateEntry);
  const deleteEntry = useAppStore((s) => s.deleteEntry);

  const activeProducts = products.filter((p) => p.status === "activo");
  const suppliers = useMemo(
    () => [...new Set(entries.map((e) => e.supplier).filter(Boolean))].sort((a, b) => a.localeCompare(b, "es")),
    [entries],
  );

  const [query, setQuery] = useState("");
  const [productId, setProductId] = useState("all");
  const [supplier, setSupplier] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Entry | null>(null);
  const [draft, setDraft] = useState<EntryDraft>(blankDraft(entries, activeProducts[0]?.id ?? ""));
  const [pendingDelete, setPendingDelete] = useState<Entry | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((entry) => {
      if (productId !== "all" && entry.productId !== productId) return false;
      if (supplier !== "all" && entry.supplier !== supplier) return false;
      if (from && entry.date < from) return false;
      if (to && entry.date > to) return false;
      if (!q) return true;
      const product = products.find((p) => p.id === entry.productId);
      return (
        entry.invoiceNumber.toLowerCase().includes(q) ||
        entry.supplier.toLowerCase().includes(q) ||
        (product?.name.toLowerCase().includes(q) ?? false)
      );
    });
  }, [entries, products, query, productId, supplier, from, to]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const total = round2(draft.quantity * draft.unitCost);

  function openCreate() {
    setEditing(null);
    setDraft(blankDraft(entries, activeProducts[0]?.id ?? ""));
    setOpen(true);
  }

  function onProductChange(id: string) {
    const product = products.find((p) => p.id === id);
    setDraft((prev) => ({
      ...prev,
      productId: id,
      unitCost: product?.purchasePrice ?? prev.unitCost,
    }));
  }

  function openEdit(entry: Entry) {
    setEditing(entry);
    setDraft({
      date: entry.date,
      invoiceNumber: entry.invoiceNumber,
      supplier: entry.supplier,
      productId: entry.productId,
      quantity: entry.quantity,
      unitCost: entry.unitCost,
      notes: entry.notes,
    });
    setOpen(true);
  }

  function save() {
    const result = editing ? updateEntry(editing.id, draft) : addEntry(draft);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(editing ? "Entrada actualizada. El stock se recalculó." : "Entrada guardada. El stock aumentó.");
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Entradas"
        description="Compras a proveedores. Al guardar, el stock del producto sube en automático."
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => downloadText("entradas.csv", entriesToCsv(filtered, products, settings.currency), "text/csv;charset=utf-8")}
            >
              <FileDown /> CSV
            </Button>
            <Button variant="outline" onClick={() => printEntries(filtered, products, settings)}>
              <Printer /> PDF
            </Button>
            <Button onClick={openCreate} disabled={activeProducts.length === 0}>
              <Plus /> Nueva entrada
            </Button>
          </>
        }
      />

      <Card>
        <CardContent className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="relative xl:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Buscar factura, proveedor o producto"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select value={productId} onValueChange={(v) => { setProductId(v); setPage(1); }}>
            <SelectTrigger>
              <SelectValue placeholder="Producto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los productos</SelectItem>
              {products.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.code} · {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={supplier} onValueChange={(v) => { setSupplier(v); setPage(1); }}>
            <SelectTrigger>
              <SelectValue placeholder="Proveedor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los proveedores</SelectItem>
              {suppliers.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="grid grid-cols-2 gap-2">
            <Input type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPage(1); }} aria-label="Desde" />
            <Input type="date" value={to} onChange={(e) => { setTo(e.target.value); setPage(1); }} aria-label="Hasta" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {activeProducts.length === 0 ? (
            <EmptyState
              title="Primero cree un producto"
              description="Las entradas se vinculan a productos activos."
              action={
                <Button asChild>
                  <Link to="/productos">Ir a productos</Link>
                </Button>
              }
            />
          ) : current.length === 0 ? (
            <EmptyState title="Sin entradas" description="Registre una compra para aumentar el inventario." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Factura</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Cant.</TableHead>
                  <TableHead className="text-right">Costo u.</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {current.map((entry) => {
                  const product = products.find((p) => p.id === entry.productId);
                  return (
                    <TableRow key={entry.id}>
                      <TableCell>{formatDate(entry.date)}</TableCell>
                      <TableCell className="tabular-nums">{entry.invoiceNumber}</TableCell>
                      <TableCell>{entry.supplier}</TableCell>
                      <TableCell>
                        <p className="font-medium">{product?.name ?? "—"}</p>
                        <p className="text-xs text-muted-foreground">{product?.code}</p>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{entry.quantity}</TableCell>
                      <TableCell className="text-right">
                        <Money value={entry.unitCost} />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <Money value={entryTotal(entry)} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon-sm" onClick={() => openEdit(entry)} aria-label="Editar">
                            <Pencil />
                          </Button>
                          <Button variant="ghost" size="icon-sm" onClick={() => setPendingDelete(entry)} aria-label="Eliminar">
                            <Trash2 />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <PaginationBar page={page} pageCount={pageCount} total={filtered.length} onPage={setPage} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar entrada" : "Nueva entrada"}</DialogTitle>
            <DialogDescription>El total se calcula solo. El stock se actualiza al guardar.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Fecha" htmlFor="date">
              <Input id="date" type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} />
            </Field>
            <Field label="N° factura" htmlFor="invoice">
              <Input
                id="invoice"
                value={draft.invoiceNumber}
                onChange={(e) => setDraft({ ...draft, invoiceNumber: e.target.value })}
              />
            </Field>
            <Field label="Proveedor" htmlFor="supplier" className="sm:col-span-2">
              <Input
                id="supplier"
                list="suppliers"
                value={draft.supplier}
                onChange={(e) => setDraft({ ...draft, supplier: e.target.value })}
                placeholder="Tropigas Nicaragua"
              />
              <datalist id="suppliers">
                {suppliers.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            </Field>
            <Field label="Producto" className="sm:col-span-2">
              <Select value={draft.productId} onValueChange={onProductChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un producto" />
                </SelectTrigger>
                <SelectContent>
                  {activeProducts.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.code} · {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Cantidad" htmlFor="qty">
              <Input
                id="qty"
                type="number"
                min={1}
                step={1}
                value={draft.quantity}
                onChange={(e) => setDraft({ ...draft, quantity: Number(e.target.value) })}
              />
            </Field>
            <Field label="Precio unitario de compra" htmlFor="cost">
              <Input
                id="cost"
                type="number"
                min={0}
                step="0.01"
                value={draft.unitCost}
                onChange={(e) => setDraft({ ...draft, unitCost: Number(e.target.value) })}
              />
            </Field>
            <Field label="Observaciones" className="sm:col-span-2" htmlFor="notes">
              <Textarea id="notes" rows={2} value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} />
            </Field>
          </div>
          <div className="rounded-xl bg-muted px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Total de la compra</p>
            <Money value={total} className="text-xl font-semibold" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={save}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(next) => !next && setPendingDelete(null)}
        title="Eliminar entrada"
        description="Se revertirá el aumento de stock si las ventas lo permiten."
        confirmLabel="Eliminar"
        destructive
        onConfirm={() => {
          if (!pendingDelete) return;
          const result = deleteEntry(pendingDelete.id);
          if (!result.ok) toast.error(result.error);
          else toast.success("Entrada eliminada");
          setPendingDelete(null);
        }}
      />
    </div>
  );
}

function blankDraft(entries: Entry[], productId: string): EntryDraft {
  const product = useAppStore.getState().products.find((p) => p.id === productId);
  return {
    date: todayIso(),
    invoiceNumber: nextNumber("F", entries.map((e) => e.invoiceNumber)),
    supplier: "",
    productId,
    quantity: 1,
    unitCost: product?.purchasePrice ?? 0,
    notes: "",
  };
}

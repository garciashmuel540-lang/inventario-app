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
import { PAGE_SIZE, PAYMENT_LABELS, PAYMENT_OPTIONS } from "@/lib/constants";
import { downloadText, printSales, salesToCsv } from "@/lib/export";
import { formatDate, nextNumber, round2, todayIso } from "@/lib/format";
import { saleTotals, stockOf } from "@/lib/metrics";
import { useAppStore } from "@/lib/store";
import type { PaymentMethod, Sale, SaleDraft } from "@/lib/types";

export const Route = createFileRoute("/salidas")({ component: SalesPage });

function SalesPage() {
  const products = useAppStore((s) => s.products);
  const entries = useAppStore((s) => s.entries);
  const sales = useAppStore((s) => s.sales);
  const settings = useAppStore((s) => s.settings);
  const addSale = useAppStore((s) => s.addSale);
  const updateSale = useAppStore((s) => s.updateSale);
  const deleteSale = useAppStore((s) => s.deleteSale);

  const activeProducts = products.filter((p) => p.status === "activo");

  const [query, setQuery] = useState("");
  const [productId, setProductId] = useState("all");
  const [payment, setPayment] = useState<PaymentMethod | "all">("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Sale | null>(null);
  const [draft, setDraft] = useState<SaleDraft>(blankDraft(sales, activeProducts[0]?.id ?? ""));
  const [pendingDelete, setPendingDelete] = useState<Sale | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sales.filter((sale) => {
      if (productId !== "all" && sale.productId !== productId) return false;
      if (payment !== "all" && sale.paymentMethod !== payment) return false;
      if (from && sale.date < from) return false;
      if (to && sale.date > to) return false;
      if (!q) return true;
      const product = products.find((p) => p.id === sale.productId);
      return sale.ticketNumber.toLowerCase().includes(q) || (product?.name.toLowerCase().includes(q) ?? false);
    });
  }, [sales, products, query, productId, payment, from, to]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const selected = products.find((p) => p.id === draft.productId);
  const available =
    stockOf(draft.productId, entries, sales) + (editing && editing.productId === draft.productId ? editing.quantity : 0);
  const unitCost = editing?.productId === draft.productId ? editing.unitCost : (selected?.purchasePrice ?? 0);
  const revenue = round2(draft.quantity * draft.unitPrice);
  const cost = round2(draft.quantity * unitCost);
  const profit = round2(revenue - cost);

  function openCreate() {
    setEditing(null);
    setDraft(blankDraft(sales, activeProducts[0]?.id ?? ""));
    setOpen(true);
  }

  function onProductChange(id: string) {
    const product = products.find((p) => p.id === id);
    setDraft((prev) => ({
      ...prev,
      productId: id,
      unitPrice: product?.salePrice ?? prev.unitPrice,
    }));
  }

  function openEdit(sale: Sale) {
    setEditing(sale);
    setDraft({
      date: sale.date,
      ticketNumber: sale.ticketNumber,
      productId: sale.productId,
      quantity: sale.quantity,
      unitPrice: sale.unitPrice,
      paymentMethod: sale.paymentMethod,
      notes: sale.notes,
    });
    setOpen(true);
  }

  function save() {
    const result = editing ? updateSale(editing.id, draft) : addSale(draft);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(editing ? "Venta actualizada" : "Venta registrada. El stock se descontó.");
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Salidas"
        description="Ventas al público. Valida stock, calcula ganancia y descuenta existencias."
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => downloadText("salidas.csv", salesToCsv(filtered, products), "text/csv;charset=utf-8")}
            >
              <FileDown /> CSV
            </Button>
            <Button variant="outline" onClick={() => printSales(filtered, products, settings)}>
              <Printer /> PDF
            </Button>
            <Button onClick={openCreate} disabled={activeProducts.length === 0}>
              <Plus /> Nueva venta
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
              placeholder="Buscar ticket o producto"
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
          <Select value={payment} onValueChange={(v) => { setPayment(v as PaymentMethod | "all"); setPage(1); }}>
            <SelectTrigger>
              <SelectValue placeholder="Pago" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los pagos</SelectItem>
              {PAYMENT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
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
              description="Las ventas se descuentan del inventario de productos activos."
              action={
                <Button asChild>
                  <Link to="/productos">Ir a productos</Link>
                </Button>
              }
            />
          ) : current.length === 0 ? (
            <EmptyState title="Sin ventas" description="Registre una salida para ver ganancias e inventario." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Ticket</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Cant.</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Ganancia</TableHead>
                  <TableHead>Pago</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {current.map((sale) => {
                  const product = products.find((p) => p.id === sale.productId);
                  const totals = saleTotals(sale);
                  return (
                    <TableRow key={sale.id}>
                      <TableCell>{formatDate(sale.date)}</TableCell>
                      <TableCell className="tabular-nums">{sale.ticketNumber}</TableCell>
                      <TableCell>
                        <p className="font-medium">{product?.name ?? "—"}</p>
                        <p className="text-xs text-muted-foreground">{product?.code}</p>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{sale.quantity}</TableCell>
                      <TableCell className="text-right font-medium">
                        <Money value={totals.revenue} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Money value={totals.profit} signed />
                      </TableCell>
                      <TableCell>{PAYMENT_LABELS[sale.paymentMethod]}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon-sm" onClick={() => openEdit(sale)} aria-label="Editar">
                            <Pencil />
                          </Button>
                          <Button variant="ghost" size="icon-sm" onClick={() => setPendingDelete(sale)} aria-label="Eliminar">
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
            <DialogTitle>{editing ? "Editar venta" : "Nueva venta"}</DialogTitle>
            <DialogDescription>
              Stock disponible: <span className="font-semibold tabular-nums text-foreground">{available}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Fecha" htmlFor="date">
              <Input id="date" type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} />
            </Field>
            <Field label="N° ticket" htmlFor="ticket">
              <Input
                id="ticket"
                value={draft.ticketNumber}
                onChange={(e) => setDraft({ ...draft, ticketNumber: e.target.value })}
              />
            </Field>
            <Field label="Producto" className="sm:col-span-2">
              <Select value={draft.productId} onValueChange={onProductChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un producto" />
                </SelectTrigger>
                <SelectContent>
                  {activeProducts.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.code} · {p.name} (stock {stockOf(p.id, entries, sales)})
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
            <Field label="Precio unitario de venta" htmlFor="price">
              <Input
                id="price"
                type="number"
                min={0}
                step="0.01"
                value={draft.unitPrice}
                onChange={(e) => setDraft({ ...draft, unitPrice: Number(e.target.value) })}
              />
            </Field>
            <Field label="Método de pago">
              <Select
                value={draft.paymentMethod}
                onValueChange={(v) => setDraft({ ...draft, paymentMethod: v as PaymentMethod })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Observaciones" htmlFor="notes">
              <Textarea id="notes" rows={2} value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3 rounded-xl bg-muted p-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Total venta</p>
              <Money value={revenue} className="font-semibold" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Costo</p>
              <Money value={cost} className="font-semibold" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Ganancia neta</p>
              <Money value={profit} signed className="font-semibold" />
            </div>
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
        title="Eliminar venta"
        description="El stock de ese producto se repondrá."
        confirmLabel="Eliminar"
        destructive
        onConfirm={() => {
          if (!pendingDelete) return;
          deleteSale(pendingDelete.id);
          toast.success("Venta eliminada");
          setPendingDelete(null);
        }}
      />
    </div>
  );
}

function blankDraft(sales: Sale[], productId: string): SaleDraft {
  const product = useAppStore.getState().products.find((p) => p.id === productId);
  return {
    date: todayIso(),
    ticketNumber: nextNumber("T", sales.map((s) => s.ticketNumber)),
    productId,
    quantity: 1,
    unitPrice: product?.salePrice ?? 0,
    paymentMethod: "efectivo",
    notes: "",
  };
}

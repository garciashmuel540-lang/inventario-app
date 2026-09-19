import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { EmptyState } from "@/components/empty-state";
import { Field } from "@/components/field";
import { Money } from "@/components/money";
import { PageHeader } from "@/components/page-header";
import { PaginationBar } from "@/components/pagination-bar";
import { Badge } from "@/components/ui/badge";
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
import {
  CATEGORY_LABELS,
  CATEGORY_OPTIONS,
  PAGE_SIZE,
  STATUS_LABELS,
  UNIT_LABELS,
  UNIT_OPTIONS,
} from "@/lib/constants";
import { formatPercent, profitMargin, unitProfit } from "@/lib/format";
import { useAppStore } from "@/lib/store";
import type { Category, Product, ProductDraft, ProductStatus } from "@/lib/types";

export const Route = createFileRoute("/productos")({ component: ProductsPage });

const emptyDraft = (): ProductDraft => ({
  code: "",
  name: "",
  category: "gas",
  unit: "cilindro",
  purchasePrice: 0,
  salePrice: 0,
  minStock: 0,
  status: "activo",
  notes: "",
});

function ProductsPage() {
  const products = useAppStore((s) => s.products);
  const addProduct = useAppStore((s) => s.addProduct);
  const updateProduct = useAppStore((s) => s.updateProduct);
  const deleteProduct = useAppStore((s) => s.deleteProduct);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [status, setStatus] = useState<ProductStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft());
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((product) => {
      if (category !== "all" && product.category !== category) return false;
      if (status !== "all" && product.status !== status) return false;
      if (!q) return true;
      return (
        product.name.toLowerCase().includes(q) ||
        product.code.toLowerCase().includes(q) ||
        product.notes.toLowerCase().includes(q)
      );
    });
  }, [products, query, category, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const utilidad = unitProfit(draft.purchasePrice, draft.salePrice);
  const margen = profitMargin(draft.purchasePrice, draft.salePrice);

  function openCreate() {
    setEditing(null);
    setDraft(emptyDraft());
    setOpen(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setDraft({
      code: product.code,
      name: product.name,
      category: product.category,
      unit: product.unit,
      purchasePrice: product.purchasePrice,
      salePrice: product.salePrice,
      minStock: product.minStock,
      status: product.status,
      notes: product.notes,
    });
    setOpen(true);
  }

  function save() {
    const result = editing ? updateProduct(editing.id, draft) : addProduct(draft);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(editing ? "Producto actualizado" : "Producto creado. Ya aparece en entradas, salidas e inventario.");
    setOpen(false);
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    const result = deleteProduct(pendingDelete.id);
    if (!result.ok) toast.error(result.error);
    else toast.success("Producto eliminado");
    setPendingDelete(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Productos"
        description="Alta de cilindros, garrafones y accesorios. Un producto nuevo entra solo a todos los formularios."
        actions={
          <Button onClick={openCreate}>
            <Plus /> Nuevo producto
          </Button>
        }
      />

      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Buscar por código, nombre o notas"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select
            value={category}
            onValueChange={(v) => {
              setCategory(v as Category | "all");
              setPage(1);
            }}
          >
            <SelectTrigger className="sm:w-40">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {CATEGORY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v as ProductStatus | "all");
              setPage(1);
            }}
          >
            <SelectTrigger className="sm:w-40">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="inactivo">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {current.length === 0 ? (
            <EmptyState
              title="Sin productos"
              description="Cree el primero para poder registrar compras y ventas."
              action={
                <Button onClick={openCreate}>
                  <Plus /> Crear producto
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-right">Compra</TableHead>
                  <TableHead className="text-right">Venta</TableHead>
                  <TableHead className="text-right">Utilidad</TableHead>
                  <TableHead className="text-right">Margen</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {current.map((product) => {
                  const profit = unitProfit(product.purchasePrice, product.salePrice);
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium tabular-nums">{product.code}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{UNIT_LABELS[product.unit]}</p>
                        </div>
                      </TableCell>
                      <TableCell>{CATEGORY_LABELS[product.category]}</TableCell>
                      <TableCell className="text-right">
                        <Money value={product.purchasePrice} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Money value={product.salePrice} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Money value={profit} signed />
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatPercent(profitMargin(product.purchasePrice, product.salePrice))}
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.status === "activo" ? "success" : "muted"}>
                          {STATUS_LABELS[product.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon-sm" onClick={() => openEdit(product)} aria-label="Editar">
                            <Pencil />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setPendingDelete(product)}
                            aria-label="Eliminar"
                          >
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
            <DialogTitle>{editing ? "Editar producto" : "Nuevo producto"}</DialogTitle>
            <DialogDescription>La utilidad y el margen se calculan al instante.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Código" htmlFor="code">
              <Input
                id="code"
                value={draft.code}
                onChange={(e) => setDraft({ ...draft, code: e.target.value })}
                placeholder="GAS-45"
              />
            </Field>
            <Field label="Nombre" htmlFor="name">
              <Input
                id="name"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="Cilindro de gas 45 kg"
              />
            </Field>
            <Field label="Categoría">
              <Select value={draft.category} onValueChange={(v) => setDraft({ ...draft, category: v as Category })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Unidad">
              <Select
                value={draft.unit}
                onValueChange={(v) => setDraft({ ...draft, unit: v as ProductDraft["unit"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNIT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Precio de compra" htmlFor="purchase">
              <Input
                id="purchase"
                type="number"
                min={0}
                step="0.01"
                value={draft.purchasePrice}
                onChange={(e) => setDraft({ ...draft, purchasePrice: Number(e.target.value) })}
              />
            </Field>
            <Field label="Precio de venta" htmlFor="sale">
              <Input
                id="sale"
                type="number"
                min={0}
                step="0.01"
                value={draft.salePrice}
                onChange={(e) => setDraft({ ...draft, salePrice: Number(e.target.value) })}
              />
            </Field>
            <Field label="Stock mínimo" htmlFor="min">
              <Input
                id="min"
                type="number"
                min={0}
                step="1"
                value={draft.minStock}
                onChange={(e) => setDraft({ ...draft, minStock: Number(e.target.value) })}
              />
            </Field>
            <Field label="Estado">
              <Select
                value={draft.status}
                onValueChange={(v) => setDraft({ ...draft, status: v as ProductStatus })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Notas" className="sm:col-span-2" htmlFor="notes">
              <Textarea
                id="notes"
                value={draft.notes}
                onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                rows={3}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3 rounded-xl bg-muted p-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Utilidad unitaria</p>
              <Money value={utilidad} signed className="text-lg font-semibold" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Margen</p>
              <p className="text-lg font-semibold tabular-nums">{formatPercent(margen)}</p>
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
        title="Eliminar producto"
        description={
          pendingDelete
            ? `¿Eliminar ${pendingDelete.name}? Si tiene movimientos, desactívelo en lugar de borrarlo.`
            : ""
        }
        confirmLabel="Eliminar"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  );
}

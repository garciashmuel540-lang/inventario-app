import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileDown, Printer, Search } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { PaginationBar } from "@/components/pagination-bar";
import { StockBadge } from "@/components/stock-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CATEGORY_LABELS, CATEGORY_OPTIONS, PAGE_SIZE } from "@/lib/constants";
import { downloadText, inventoryToCsv, printInventory } from "@/lib/export";
import { inventoryRows } from "@/lib/metrics";
import { useAppStore } from "@/lib/store";
import type { Category, StockLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/inventario")({ component: InventoryPage });

function InventoryPage() {
  const products = useAppStore((s) => s.products);
  const entries = useAppStore((s) => s.entries);
  const sales = useAppStore((s) => s.sales);
  const settings = useAppStore((s) => s.settings);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [level, setLevel] = useState<StockLevel | "all">("all");
  const [page, setPage] = useState(1);

  const rows = useMemo(() => inventoryRows(products, entries, sales), [products, entries, sales]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (category !== "all" && row.product.category !== category) return false;
      if (level !== "all" && row.level !== level) return false;
      if (!q) return true;
      return row.product.name.toLowerCase().includes(q) || row.product.code.toLowerCase().includes(q);
    });
  }, [rows, query, category, level]);

  const sorted = [...filtered].sort((a, b) => {
    const rank = { agotado: 0, bajo: 1, ok: 2 };
    return rank[a.level] - rank[b.level] || a.product.name.localeCompare(b.product.name, "es");
  });
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const current = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const alerts = rows.filter((r) => r.product.status === "activo" && r.level !== "ok").length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Inventario"
        description="Stock en tiempo real: entradas menos salidas. Se recalcula con cada movimiento."
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => downloadText("inventario.csv", inventoryToCsv(sorted), "text/csv;charset=utf-8")}
            >
              <FileDown /> CSV
            </Button>
            <Button variant="outline" onClick={() => printInventory(sorted, settings)}>
              <Printer /> PDF
            </Button>
          </>
        }
      />

      {alerts > 0 ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm">
          Hay {alerts} producto{alerts === 1 ? "" : "s"} en estado BAJO o AGOTADO. Recomendamos registrar una entrada.
        </div>
      ) : null}

      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Buscar producto"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select value={category} onValueChange={(v) => { setCategory(v as Category | "all"); setPage(1); }}>
            <SelectTrigger className="sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Categorías</SelectItem>
              {CATEGORY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={level} onValueChange={(v) => { setLevel(v as StockLevel | "all"); setPage(1); }}>
            <SelectTrigger className="sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="ok">OK</SelectItem>
              <SelectItem value="bajo">BAJO</SelectItem>
              <SelectItem value="agotado">AGOTADO</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {current.length === 0 ? (
            <EmptyState title="Sin resultados" description="Ajuste los filtros o dé de alta un producto." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-right">Entradas</TableHead>
                  <TableHead className="text-right">Salidas</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Mínimo</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {current.map((row) => (
                  <TableRow
                    key={row.product.id}
                    className={cn(row.level === "agotado" && "bg-destructive/5", row.level === "bajo" && "bg-warning/5")}
                  >
                    <TableCell className="font-medium tabular-nums">{row.product.code}</TableCell>
                    <TableCell>
                      <p className="font-medium">{row.product.name}</p>
                      {row.product.status === "inactivo" ? (
                        <Badge variant="muted" className="mt-1">
                          Inactivo
                        </Badge>
                      ) : null}
                    </TableCell>
                    <TableCell>{CATEGORY_LABELS[row.product.category]}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.entriesQty}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.salesQty}</TableCell>
                    <TableCell className="text-right text-base font-semibold tabular-nums">{row.stock}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.product.minStock}</TableCell>
                    <TableCell>
                      <StockBadge level={row.level} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <PaginationBar page={page} pageCount={pageCount} total={sorted.length} onPage={setPage} />
    </div>
  );
}

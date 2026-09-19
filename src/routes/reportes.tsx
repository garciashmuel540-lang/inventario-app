import { useMemo, useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileDown, Printer } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ClientOnly } from "@/components/client-only";
import { Money } from "@/components/money";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CATEGORY_OPTIONS } from "@/lib/constants";
import { downloadText, printReport, toCsv } from "@/lib/export";
import { formatMoney, formatMonthLabel, formatPercent, monthKey } from "@/lib/format";
import { computeReport } from "@/lib/metrics";
import { useAppStore } from "@/lib/store";
import type { Category } from "@/lib/types";

export const Route = createFileRoute("/reportes")({ component: ReportsPage });

function ReportsPage() {
  const products = useAppStore((s) => s.products);
  const sales = useAppStore((s) => s.sales);
  const settings = useAppStore((s) => s.settings);
  const currency = settings.currency;

  const [from, setFrom] = useState(`${monthKey()}-01`);
  const [to, setTo] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [productId, setProductId] = useState("all");

  const report = useMemo(
    () => computeReport(products, sales, { from: from || undefined, to: to || undefined, category, productId }),
    [products, sales, from, to, category, productId],
  );

  const monthChart = report.byMonth.map((row) => ({
    ...row,
    label: formatMonthLabel(row.month),
  }));

  function exportCsv() {
    const csv = toCsv(
      ["Producto", "Unidades", "Ingresos", "Costos", "Ganancia", "Margen %"],
      report.byProduct.map((row) => [
        row.product.name,
        row.units,
        row.revenue.toFixed(2),
        row.cost.toFixed(2),
        row.profit.toFixed(2),
        row.margin.toFixed(1),
      ]),
    );
    downloadText("reporte-ganancias.csv", csv, "text/csv;charset=utf-8");
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Ganancias y reportes"
        description="Filtre por fechas, categoría o producto. Los totales se recalculan al instante."
        actions={
          <>
            <Button variant="outline" onClick={exportCsv}>
              <FileDown /> CSV
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                printReport(
                  settings,
                  report,
                  report.byProduct.map((row) => ({
                    name: row.product.name,
                    units: row.units,
                    revenue: row.revenue,
                    profit: row.profit,
                    margin: row.margin,
                  })),
                )
              }
            >
              <Printer /> PDF
            </Button>
          </>
        }
      />

      <Card>
        <CardContent className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-4">
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} aria-label="Desde" />
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} aria-label="Hasta" />
          <Select value={category} onValueChange={(v) => setCategory(v as Category | "all")}>
            <SelectTrigger>
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {CATEGORY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={productId} onValueChange={setProductId}>
            <SelectTrigger>
              <SelectValue placeholder="Producto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los productos</SelectItem>
              {products.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Kpi label="Total ventas" value={<Money value={report.totalSales} className="text-xl font-semibold" />} />
        <Kpi label="Total costos" value={<Money value={report.totalCost} className="text-xl font-semibold" />} />
        <Kpi label="Ganancia bruta" value={<Money value={report.grossProfit} signed className="text-xl font-semibold" />} />
        <Kpi label="Margen promedio" value={<span className="text-xl font-semibold tabular-nums">{formatPercent(report.avgMargin)}</span>} />
        <Kpi
          label="Transacciones"
          value={<span className="text-xl font-semibold tabular-nums">{report.transactions}</span>}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ganancia por mes</CardTitle>
            <CardDescription>Agrupación automática según el rango filtrado.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ClientOnly>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                    <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" width={56} />
                    <Tooltip
                      formatter={(value) => formatMoney(Number(value ?? 0), currency)}
                      contentStyle={tooltipStyle}
                    />
                    <Line type="monotone" dataKey="ventas" name="Ventas" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="ganancia" name="Ganancia" stroke="var(--chart-2)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </ClientOnly>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top 5 más rentables</CardTitle>
            <CardDescription>Productos con mayor ganancia neta en el período.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ClientOnly>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={report.top5.map((row) => ({ name: row.product.code, ganancia: row.profit }))}
                    layout="vertical"
                    margin={{ left: 16, right: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis type="number" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" width={72} />
                    <Tooltip formatter={(value) => formatMoney(Number(value ?? 0), currency)} contentStyle={tooltipStyle} />
                    <Bar dataKey="ganancia" name="Ganancia" fill="var(--chart-2)" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ClientOnly>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Ganancia por producto</CardTitle>
          <CardDescription>Unidades, ingresos, costos y margen.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead className="text-right">Unidades</TableHead>
                <TableHead className="text-right">Ingresos</TableHead>
                <TableHead className="text-right">Costos</TableHead>
                <TableHead className="text-right">Ganancia</TableHead>
                <TableHead className="text-right">Margen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.byProduct.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    No hay ventas en el rango seleccionado.
                  </TableCell>
                </TableRow>
              ) : (
                report.byProduct.map((row) => (
                  <TableRow key={row.product.id}>
                    <TableCell>
                      <p className="font-medium">{row.product.name}</p>
                      <p className="text-xs text-muted-foreground">{row.product.code}</p>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{row.units}</TableCell>
                    <TableCell className="text-right">
                      <Money value={row.revenue} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Money value={row.cost} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Money value={row.profit} signed />
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{formatPercent(row.margin)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <div className="mt-2">{value}</div>
      </CardContent>
    </Card>
  );
}

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  color: "var(--popover-foreground)",
  fontSize: 12,
};

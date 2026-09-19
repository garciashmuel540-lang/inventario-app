import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Package,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ClientOnly } from "@/components/client-only";
import { PageHeader } from "@/components/page-header";
import { Money } from "@/components/money";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORY_LABELS, PAYMENT_LABELS } from "@/lib/constants";
import { formatDate, formatMoney, formatPercent } from "@/lib/format";
import { computeDashboard, inventoryRows, saleTotals } from "@/lib/metrics";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/")({ component: DashboardPage });

const PIE_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"];

function DashboardPage() {
  const products = useAppStore((s) => s.products);
  const entries = useAppStore((s) => s.entries);
  const sales = useAppStore((s) => s.sales);
  const currency = useAppStore((s) => s.settings.currency);
  const businessName = useAppStore((s) => s.settings.businessName);

  const metrics = useMemo(() => computeDashboard(products, entries, sales), [products, entries, sales]);
  const lowRows = useMemo(
    () =>
      inventoryRows(products, entries, sales).filter(
        (row) => row.product.status === "activo" && row.level !== "ok",
      ),
    [products, entries, sales],
  );

  const kpis = [
    {
      label: "Ventas del mes",
      value: <Money value={metrics.monthSales} className="text-2xl font-semibold" />,
      hint: `${metrics.todaySalesCount} ventas hoy`,
      icon: Wallet,
    },
    {
      label: "Ganancia del mes",
      value: <Money value={metrics.monthProfit} signed className="text-2xl font-semibold" />,
      hint: `Margen ${formatPercent(metrics.monthSales ? (metrics.monthProfit / metrics.monthSales) * 100 : 0)}`,
      icon: TrendingUp,
    },
    {
      label: "Stock bajo",
      value: <span className="text-2xl font-semibold tabular-nums">{metrics.lowStockCount}</span>,
      hint: "Productos activos en alerta",
      icon: AlertTriangle,
    },
    {
      label: "Productos activos",
      value: <span className="text-2xl font-semibold tabular-nums">{metrics.activeProducts}</span>,
      hint: `${metrics.totalStockUnits} unidades en bodega`,
      icon: Package,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={businessName}
        description="Resumen de ventas, ganancias y existencias. Todo se actualiza al registrar un movimiento."
        actions={
          <>
            <Button asChild variant="outline">
              <Link to="/entradas">
                <ArrowDownToLine /> Nueva entrada
              </Link>
            </Button>
            <Button asChild>
              <Link to="/salidas">
                <ArrowUpFromLine /> Registrar venta
              </Link>
            </Button>
          </>
        }
      />

      {lowRows.length > 0 ? (
        <div className="flex flex-col gap-2 rounded-2xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="font-semibold">{lowRows.length} producto{lowRows.length === 1 ? "" : "s"}</span>{" "}
            por debajo del mínimo o agotado.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link to="/inventario">Ver inventario</Link>
          </Button>
        </div>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label}>
              <CardContent className="flex items-start justify-between gap-3 p-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{kpi.label}</p>
                  <div className="mt-2">{kpi.value}</div>
                  <p className="mt-1 text-xs text-muted-foreground">{kpi.hint}</p>
                </div>
                <div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Icon className="size-4" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Ventas y ganancias · 14 días</CardTitle>
            <CardDescription>Ingresos y utilidad neta por día.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ClientOnly>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metrics.dailySeries} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                    <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" width={48} />
                    <Tooltip
                      formatter={(value) => formatMoney(Number(value ?? 0), currency)}
                      contentStyle={tooltipStyle}
                    />
                    <Area type="monotone" dataKey="ventas" name="Ventas" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.18} />
                    <Area type="monotone" dataKey="ganancia" name="Ganancia" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.22} />
                  </AreaChart>
                </ResponsiveContainer>
              </ClientOnly>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ganancia por categoría</CardTitle>
            <CardDescription>Participación en la utilidad histórica.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {metrics.categoryShare.length === 0 ? (
                <p className="flex h-full items-center justify-center text-sm text-muted-foreground">Sin ventas aún</p>
              ) : (
                <ClientOnly>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={metrics.categoryShare} dataKey="value" nameKey="name" innerRadius={52} outerRadius={78} paddingAngle={3} label={false} isAnimationActive={false}>
                        {metrics.categoryShare.map((item, i) => (
                          <Cell key={item.key} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatMoney(Number(value ?? 0), currency)} contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </ClientOnly>
              )}
            </div>
            <ul className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
              {metrics.categoryShare.map((item, i) => (
                <li key={item.key} className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  {item.name}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>Entradas vs salidas</CardTitle>
            <CardDescription>Unidades compradas frente a unidades vendidas por producto.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ClientOnly>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics.entriesVsSales} margin={{ left: 0, right: 8, top: 8, bottom: 24 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} stroke="var(--muted-foreground)" />
                    <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" width={32} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="entradas" name="Entradas" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="salidas" name="Salidas" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ClientOnly>
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader className="flex-row items-start justify-between">
            <div>
              <CardTitle>Últimas ventas</CardTitle>
              <CardDescription>Movimientos más recientes.</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/salidas">Ver todas</Link>
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {metrics.recentSales.length === 0 ? (
              <p className="text-sm text-muted-foreground">Todavía no hay salidas.</p>
            ) : (
              metrics.recentSales.map((sale) => {
                const product = products.find((p) => p.id === sale.productId);
                const totals = saleTotals(sale);
                return (
                  <div key={sale.id} className="flex items-start justify-between gap-3 rounded-lg border border-border/70 px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{product?.name ?? "Producto"}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(sale.date)} · {sale.quantity} u. · {PAYMENT_LABELS[sale.paymentMethod]}
                      </p>
                    </div>
                    <div className="text-right">
                      <Money value={totals.revenue} className="text-sm font-semibold" />
                      <p className="text-xs text-success tabular-nums">+{formatMoney(totals.profit, currency)}</p>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </section>

      {lowRows.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Alertas de inventario</CardTitle>
            <CardDescription>Revise reposición para no perder ventas.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {lowRows.map((row) => (
              <Badge key={row.product.id} variant={row.level === "agotado" ? "destructive" : "warning"}>
                {row.product.name} · {row.stock} / mín. {row.product.minStock} · {CATEGORY_LABELS[row.product.category]}
              </Badge>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  color: "var(--popover-foreground)",
  fontSize: 12,
};

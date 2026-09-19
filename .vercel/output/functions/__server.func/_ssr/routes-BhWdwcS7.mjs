import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { D as ArrowDownToLine, E as ArrowUpFromLine, a as TriangleAlert, m as Package, o as TrendingUp, r as Wallet } from "../_libs/lucide-react.mjs";
import { a as computeDashboard, c as inventoryRows, d as formatDate, f as formatMoney, i as useAppStore, l as saleTotals, m as formatPercent, n as Button, w as PAYMENT_LABELS, x as CATEGORY_LABELS } from "./router-CbzeC8Tb.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, o as PageHeader, r as CardDescription, t as Card } from "./card-D1q2-H8-.mjs";
import { t as Money } from "./money-YZXDvsck.mjs";
import { t as Badge } from "./badge-BiGmXcXe.mjs";
import { a as YAxis, d as Pie, f as Cell, l as CartesianGrid, m as Tooltip, n as PieChart, o as XAxis, p as ResponsiveContainer, r as BarChart, s as Area, t as AreaChart, u as Bar } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BhWdwcS7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PIE_COLORS = [
	"var(--chart-1)",
	"var(--chart-2)",
	"var(--chart-3)"
];
function DashboardPage() {
	const products = useAppStore((s) => s.products);
	const entries = useAppStore((s) => s.entries);
	const sales = useAppStore((s) => s.sales);
	const currency = useAppStore((s) => s.settings.currency);
	const businessName = useAppStore((s) => s.settings.businessName);
	const metrics = (0, import_react.useMemo)(() => computeDashboard(products, entries, sales), [
		products,
		entries,
		sales
	]);
	const lowRows = (0, import_react.useMemo)(() => inventoryRows(products, entries, sales).filter((row) => row.product.status === "activo" && row.level !== "ok"), [
		products,
		entries,
		sales
	]);
	const kpis = [
		{
			label: "Ventas del mes",
			value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
				value: metrics.monthSales,
				className: "text-2xl font-semibold"
			}),
			hint: `${metrics.todaySalesCount} ventas hoy`,
			icon: Wallet
		},
		{
			label: "Ganancia del mes",
			value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
				value: metrics.monthProfit,
				signed: true,
				className: "text-2xl font-semibold"
			}),
			hint: `Margen ${formatPercent(metrics.monthSales ? metrics.monthProfit / metrics.monthSales * 100 : 0)}`,
			icon: TrendingUp
		},
		{
			label: "Stock bajo",
			value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-2xl font-semibold tabular-nums",
				children: metrics.lowStockCount
			}),
			hint: "Productos activos en alerta",
			icon: TriangleAlert
		},
		{
			label: "Productos activos",
			value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-2xl font-semibold tabular-nums",
				children: metrics.activeProducts
			}),
			hint: `${metrics.totalStockUnits} unidades en bodega`,
			icon: Package
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: businessName,
				description: "Resumen de ventas, ganancias y existencias. Todo se actualiza al registrar un movimiento.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/entradas",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownToLine, {}), " Nueva entrada"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/salidas",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpFromLine, {}), " Registrar venta"]
					})
				})] })
			}),
			lowRows.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 rounded-2xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-foreground sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-semibold",
						children: [
							lowRows.length,
							" producto",
							lowRows.length === 1 ? "" : "s"
						]
					}),
					" ",
					"por debajo del mínimo o agotado."
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					size: "sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/inventario",
						children: "Ver inventario"
					})
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
				children: kpis.map((kpi) => {
					const Icon = kpi.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "flex items-start justify-between gap-3 p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
								children: kpi.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2",
								children: kpi.value
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: kpi.hint
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
						})]
					}) }, kpi.label);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 xl:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "xl:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Ventas y ganancias · 14 días" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Ingresos y utilidad neta por día." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-64",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
								data: metrics.dailySeries,
								margin: {
									left: 0,
									right: 8,
									top: 8,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										stroke: "var(--border)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "date",
										tick: { fontSize: 12 },
										stroke: "var(--muted-foreground)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										tick: { fontSize: 12 },
										stroke: "var(--muted-foreground)",
										width: 48
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										formatter: (value) => formatMoney(Number(value ?? 0), currency),
										contentStyle: tooltipStyle
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "ventas",
										name: "Ventas",
										stroke: "var(--chart-1)",
										fill: "var(--chart-1)",
										fillOpacity: .18
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "ganancia",
										name: "Ganancia",
										stroke: "var(--chart-2)",
										fill: "var(--chart-2)",
										fillOpacity: .22
									})
								]
							})
						})
					}) })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Ganancia por categoría" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Participación en la utilidad histórica." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-64",
					children: metrics.categoryShare.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "flex h-full items-center justify-center text-sm text-muted-foreground",
						children: "Sin ventas aún"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
							data: metrics.categoryShare,
							dataKey: "value",
							nameKey: "name",
							innerRadius: 52,
							outerRadius: 78,
							paddingAngle: 3,
							children: metrics.categoryShare.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: PIE_COLORS[i % PIE_COLORS.length] }, item.key))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
							formatter: (value) => formatMoney(Number(value ?? 0), currency),
							contentStyle: tooltipStyle
						})] })
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground",
					children: metrics.categoryShare.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "size-2 rounded-full",
							style: { background: PIE_COLORS[i % PIE_COLORS.length] }
						}), item.name]
					}, item.key))
				})] })] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 xl:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "xl:col-span-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Entradas vs salidas" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Unidades compradas frente a unidades vendidas por producto." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-72",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: metrics.entriesVsSales,
								margin: {
									left: 0,
									right: 8,
									top: 8,
									bottom: 24
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										stroke: "var(--border)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "name",
										tick: { fontSize: 11 },
										interval: 0,
										angle: -18,
										textAnchor: "end",
										height: 48,
										stroke: "var(--muted-foreground)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										tick: { fontSize: 12 },
										stroke: "var(--muted-foreground)",
										width: 32
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tooltipStyle }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "entradas",
										name: "Entradas",
										fill: "var(--chart-1)",
										radius: [
											4,
											4,
											0,
											0
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "salidas",
										name: "Salidas",
										fill: "var(--chart-2)",
										radius: [
											4,
											4,
											0,
											0
										]
									})
								]
							})
						})
					}) })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "xl:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex-row items-start justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Últimas ventas" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Movimientos más recientes." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "ghost",
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/salidas",
								children: "Ver todas"
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "flex flex-col gap-3",
						children: metrics.recentSales.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Todavía no hay salidas."
						}) : metrics.recentSales.map((sale) => {
							const product = products.find((p) => p.id === sale.productId);
							const totals = saleTotals(sale);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3 rounded-lg border border-border/70 px-3 py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm font-medium",
										children: product?.name ?? "Producto"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											formatDate(sale.date),
											" · ",
											sale.quantity,
											" u. · ",
											PAYMENT_LABELS[sale.paymentMethod]
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
										value: totals.revenue,
										className: "text-sm font-semibold"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-success tabular-nums",
										children: ["+", formatMoney(totals.profit, currency)]
									})]
								})]
							}, sale.id);
						})
					})]
				})]
			}),
			lowRows.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Alertas de inventario" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Revise reposición para no perder ventas." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "flex flex-wrap gap-2",
				children: lowRows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					variant: row.level === "agotado" ? "destructive" : "warning",
					children: [
						row.product.name,
						" · ",
						row.stock,
						" / mín. ",
						row.product.minStock,
						" · ",
						CATEGORY_LABELS[row.product.category]
					]
				}, row.product.id))
			})] }) : null
		]
	});
}
var tooltipStyle = {
	background: "var(--popover)",
	border: "1px solid var(--border)",
	borderRadius: 12,
	color: "var(--popover-foreground)",
	fontSize: 12
};
//#endregion
export { DashboardPage as component };

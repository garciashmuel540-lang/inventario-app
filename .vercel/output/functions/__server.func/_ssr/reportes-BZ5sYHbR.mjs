import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { d as Printer, y as FileDown } from "../_libs/lucide-react.mjs";
import { S as CATEGORY_OPTIONS, f as formatMoney, h as monthKey, i as useAppStore, m as formatPercent, n as Button, o as computeReport, p as formatMonthLabel } from "./router-CbzeC8Tb.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, o as PageHeader, r as CardDescription, t as Card } from "./card-D1q2-H8-.mjs";
import { a as SelectTrigger, i as SelectItem, n as Select, o as SelectValue, r as SelectContent, t as Input } from "./select-B3-Irm70.mjs";
import { l as toCsv, o as printReport, t as downloadText } from "./export-ubSyx4JC.mjs";
import { t as Money } from "./money-YZXDvsck.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DJS5TwM8.mjs";
import { a as YAxis, c as Line, i as LineChart, l as CartesianGrid, m as Tooltip, o as XAxis, p as ResponsiveContainer, r as BarChart, u as Bar } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reportes-BZ5sYHbR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReportsPage() {
	const products = useAppStore((s) => s.products);
	const sales = useAppStore((s) => s.sales);
	const settings = useAppStore((s) => s.settings);
	const currency = settings.currency;
	const [from, setFrom] = (0, import_react.useState)(`${monthKey()}-01`);
	const [to, setTo] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("all");
	const [productId, setProductId] = (0, import_react.useState)("all");
	const report = (0, import_react.useMemo)(() => computeReport(products, sales, {
		from: from || void 0,
		to: to || void 0,
		category,
		productId
	}), [
		products,
		sales,
		from,
		to,
		category,
		productId
	]);
	const monthChart = report.byMonth.map((row) => ({
		...row,
		label: formatMonthLabel(row.month)
	}));
	function exportCsv() {
		const csv = toCsv([
			"Producto",
			"Unidades",
			"Ingresos",
			"Costos",
			"Ganancia",
			"Margen %"
		], report.byProduct.map((row) => [
			row.product.name,
			row.units,
			row.revenue.toFixed(2),
			row.cost.toFixed(2),
			row.profit.toFixed(2),
			row.margin.toFixed(1)
		]));
		downloadText("reporte-ganancias.csv", csv, "text/csv;charset=utf-8");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Ganancias y reportes",
				description: "Filtre por fechas, categoría o producto. Los totales se recalculan al instante.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: exportCsv,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, {}), " CSV"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => printReport(settings, report, report.byProduct.map((row) => ({
						name: row.product.name,
						units: row.units,
						revenue: row.revenue,
						profit: row.profit,
						margin: row.margin
					}))),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, {}), " PDF"]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: from,
						onChange: (e) => setFrom(e.target.value),
						"aria-label": "Desde"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: to,
						onChange: (e) => setTo(e.target.value),
						"aria-label": "Hasta"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: category,
						onValueChange: (v) => setCategory(v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Categoría" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "Todas las categorías"
						}), CATEGORY_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: opt.value,
							children: opt.label
						}, opt.value))] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: productId,
						onValueChange: setProductId,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Producto" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "Todos los productos"
						}), products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: p.id,
							children: p.name
						}, p.id))] })]
					})
				]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Total ventas",
						value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
							value: report.totalSales,
							className: "text-xl font-semibold"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Total costos",
						value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
							value: report.totalCost,
							className: "text-xl font-semibold"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Ganancia bruta",
						value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
							value: report.grossProfit,
							signed: true,
							className: "text-xl font-semibold"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Margen promedio",
						value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xl font-semibold tabular-nums",
							children: formatPercent(report.avgMargin)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Transacciones",
						value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xl font-semibold tabular-nums",
							children: report.transactions
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 xl:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Ganancia por mes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Agrupación automática según el rango filtrado." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-64",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
							data: monthChart,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									stroke: "var(--border)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "label",
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
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "ventas",
									name: "Ventas",
									stroke: "var(--chart-1)",
									strokeWidth: 2,
									dot: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "ganancia",
									name: "Ganancia",
									stroke: "var(--chart-2)",
									strokeWidth: 2,
									dot: false
								})
							]
						})
					})
				}) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Top 5 más rentables" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Productos con mayor ganancia neta en el período." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-64",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: report.top5.map((row) => ({
								name: row.product.code,
								ganancia: row.profit
							})),
							layout: "vertical",
							margin: {
								left: 16,
								right: 8
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									stroke: "var(--border)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									type: "number",
									tick: { fontSize: 12 },
									stroke: "var(--muted-foreground)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									type: "category",
									dataKey: "name",
									tick: { fontSize: 12 },
									stroke: "var(--muted-foreground)",
									width: 72
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									formatter: (value) => formatMoney(Number(value ?? 0), currency),
									contentStyle: tooltipStyle
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "ganancia",
									name: "Ganancia",
									fill: "var(--chart-2)",
									radius: [
										0,
										6,
										6,
										0
									]
								})
							]
						})
					})
				}) })] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Ganancia por producto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Unidades, ingresos, costos y margen." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "p-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Producto" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Unidades"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Ingresos"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Costos"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Ganancia"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Margen"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: report.byProduct.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 6,
					className: "py-10 text-center text-muted-foreground",
					children: "No hay ventas en el rango seleccionado."
				}) }) : report.byProduct.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: row.product.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: row.product.code
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right tabular-nums",
						children: row.units
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: row.revenue })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: row.cost })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
							value: row.profit,
							signed: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right tabular-nums",
						children: formatPercent(row.margin)
					})
				] }, row.product.id)) })] })
			})] })
		]
	});
}
function Kpi({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2",
			children: value
		})]
	}) });
}
var tooltipStyle = {
	background: "var(--popover)",
	border: "1px solid var(--border)",
	borderRadius: 12,
	color: "var(--popover-foreground)",
	fontSize: 12
};
//#endregion
export { ReportsPage as component };

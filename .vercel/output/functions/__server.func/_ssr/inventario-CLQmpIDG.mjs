import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { d as Printer, u as Search, y as FileDown } from "../_libs/lucide-react.mjs";
import { S as CATEGORY_OPTIONS, c as inventoryRows, i as useAppStore, k as cn, n as Button, x as CATEGORY_LABELS } from "./router-CbzeC8Tb.mjs";
import { n as CardContent, o as PageHeader, t as Card } from "./card-D1q2-H8-.mjs";
import { a as SelectTrigger, i as SelectItem, n as Select, o as SelectValue, r as SelectContent, t as Input } from "./select-B3-Irm70.mjs";
import { a as printInventory, r as inventoryToCsv, t as downloadText } from "./export-ubSyx4JC.mjs";
import { n as PaginationBar, t as EmptyState } from "./pagination-bar-NMY926xB.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DJS5TwM8.mjs";
import { t as Badge } from "./badge-BiGmXcXe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/inventario-CLQmpIDG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var META = {
	ok: {
		label: "OK",
		variant: "success"
	},
	bajo: {
		label: "BAJO",
		variant: "warning"
	},
	agotado: {
		label: "AGOTADO",
		variant: "destructive"
	}
};
function StockBadge({ level }) {
	const meta = META[level];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: meta.variant,
		children: meta.label
	});
}
function InventoryPage() {
	const products = useAppStore((s) => s.products);
	const entries = useAppStore((s) => s.entries);
	const sales = useAppStore((s) => s.sales);
	const settings = useAppStore((s) => s.settings);
	const [query, setQuery] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("all");
	const [level, setLevel] = (0, import_react.useState)("all");
	const [page, setPage] = (0, import_react.useState)(1);
	const rows = (0, import_react.useMemo)(() => inventoryRows(products, entries, sales), [
		products,
		entries,
		sales
	]);
	const sorted = [...(0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return rows.filter((row) => {
			if (category !== "all" && row.product.category !== category) return false;
			if (level !== "all" && row.level !== level) return false;
			if (!q) return true;
			return row.product.name.toLowerCase().includes(q) || row.product.code.toLowerCase().includes(q);
		});
	}, [
		rows,
		query,
		category,
		level
	])].sort((a, b) => {
		const rank = {
			agotado: 0,
			bajo: 1,
			ok: 2
		};
		return rank[a.level] - rank[b.level] || a.product.name.localeCompare(b.product.name, "es");
	});
	const pageCount = Math.max(1, Math.ceil(sorted.length / 8));
	const current = sorted.slice((page - 1) * 8, page * 8);
	const alerts = rows.filter((r) => r.product.status === "activo" && r.level !== "ok").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Inventario",
				description: "Stock en tiempo real: entradas menos salidas. Se recalcula con cada movimiento.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => downloadText("inventario.csv", inventoryToCsv(sorted), "text/csv;charset=utf-8"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, {}), " CSV"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => printInventory(sorted, settings),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, {}), " PDF"]
				})] })
			}),
			alerts > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm",
				children: [
					"Hay ",
					alerts,
					" producto",
					alerts === 1 ? "" : "s",
					" en estado BAJO o AGOTADO. Recomendamos registrar una entrada."
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex flex-col gap-3 p-4 sm:flex-row",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "pl-9",
							placeholder: "Buscar producto",
							value: query,
							onChange: (e) => {
								setQuery(e.target.value);
								setPage(1);
							}
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: category,
						onValueChange: (v) => {
							setCategory(v);
							setPage(1);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "sm:w-40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "Categorías"
						}), CATEGORY_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: opt.value,
							children: opt.label
						}, opt.value))] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: level,
						onValueChange: (v) => {
							setLevel(v);
							setPage(1);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "sm:w-40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "Todos los estados"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "ok",
								children: "OK"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "bajo",
								children: "BAJO"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "agotado",
								children: "AGOTADO"
							})
						] })]
					})
				]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "p-0",
				children: current.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "Sin resultados",
					description: "Ajuste los filtros o dé de alta un producto."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Código" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Producto" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Categoría" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Entradas"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Salidas"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Stock"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Mínimo"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Estado" })
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: current.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
					className: cn(row.level === "agotado" && "bg-destructive/5", row.level === "bajo" && "bg-warning/5"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-medium tabular-nums",
							children: row.product.code
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: row.product.name
						}), row.product.status === "inactivo" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "muted",
							className: "mt-1",
							children: "Inactivo"
						}) : null] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: CATEGORY_LABELS[row.product.category] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right tabular-nums",
							children: row.entriesQty
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right tabular-nums",
							children: row.salesQty
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right text-base font-semibold tabular-nums",
							children: row.stock
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right tabular-nums",
							children: row.product.minStock
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StockBadge, { level: row.level }) })
					]
				}, row.product.id)) })] })
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaginationBar, {
				page,
				pageCount,
				total: sorted.length,
				onPage: setPage
			})
		]
	});
}
//#endregion
export { InventoryPage as component };

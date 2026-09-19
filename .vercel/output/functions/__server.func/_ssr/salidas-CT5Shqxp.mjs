import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { d as Printer, f as Plus, p as Pencil, s as Trash2, u as Search, y as FileDown } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { T as PAYMENT_OPTIONS, d as formatDate, g as nextNumber, i as useAppStore, l as saleTotals, n as Button, u as stockOf, v as round2, w as PAYMENT_LABELS, y as todayIso } from "./router-CbzeC8Tb.mjs";
import { n as Field, t as ConfirmDialog } from "./field-CAxr1C02.mjs";
import { n as CardContent, o as PageHeader, t as Card } from "./card-D1q2-H8-.mjs";
import { a as SelectTrigger, i as SelectItem, n as Select, o as SelectValue, r as SelectContent, t as Input } from "./select-B3-Irm70.mjs";
import { c as salesToCsv, s as printSales, t as downloadText } from "./export-ubSyx4JC.mjs";
import { n as PaginationBar, t as EmptyState } from "./pagination-bar-NMY926xB.mjs";
import { t as Money } from "./money-YZXDvsck.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as Textarea, t as Dialog } from "./textarea-DghkxXzI.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DJS5TwM8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/salidas-CT5Shqxp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SalesPage() {
	const products = useAppStore((s) => s.products);
	const entries = useAppStore((s) => s.entries);
	const sales = useAppStore((s) => s.sales);
	const settings = useAppStore((s) => s.settings);
	const addSale = useAppStore((s) => s.addSale);
	const updateSale = useAppStore((s) => s.updateSale);
	const deleteSale = useAppStore((s) => s.deleteSale);
	const activeProducts = products.filter((p) => p.status === "activo");
	const [query, setQuery] = (0, import_react.useState)("");
	const [productId, setProductId] = (0, import_react.useState)("all");
	const [payment, setPayment] = (0, import_react.useState)("all");
	const [from, setFrom] = (0, import_react.useState)("");
	const [to, setTo] = (0, import_react.useState)("");
	const [page, setPage] = (0, import_react.useState)(1);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [draft, setDraft] = (0, import_react.useState)(blankDraft(sales, activeProducts[0]?.id ?? ""));
	const [pendingDelete, setPendingDelete] = (0, import_react.useState)(null);
	const filtered = (0, import_react.useMemo)(() => {
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
	}, [
		sales,
		products,
		query,
		productId,
		payment,
		from,
		to
	]);
	const pageCount = Math.max(1, Math.ceil(filtered.length / 8));
	const current = filtered.slice((page - 1) * 8, page * 8);
	const selected = products.find((p) => p.id === draft.productId);
	const available = stockOf(draft.productId, entries, sales) + (editing && editing.productId === draft.productId ? editing.quantity : 0);
	const unitCost = editing?.productId === draft.productId ? editing.unitCost : selected?.purchasePrice ?? 0;
	const revenue = round2(draft.quantity * draft.unitPrice);
	const cost = round2(draft.quantity * unitCost);
	const profit = round2(revenue - cost);
	function openCreate() {
		setEditing(null);
		setDraft(blankDraft(sales, activeProducts[0]?.id ?? ""));
		setOpen(true);
	}
	function onProductChange(id) {
		const product = products.find((p) => p.id === id);
		setDraft((prev) => ({
			...prev,
			productId: id,
			unitPrice: product?.salePrice ?? prev.unitPrice
		}));
	}
	function openEdit(sale) {
		setEditing(sale);
		setDraft({
			date: sale.date,
			ticketNumber: sale.ticketNumber,
			productId: sale.productId,
			quantity: sale.quantity,
			unitPrice: sale.unitPrice,
			paymentMethod: sale.paymentMethod,
			notes: sale.notes
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Salidas",
				description: "Ventas al público. Valida stock, calcula ganancia y descuenta existencias.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => downloadText("salidas.csv", salesToCsv(filtered, products), "text/csv;charset=utf-8"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, {}), " CSV"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => printSales(filtered, products, settings),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, {}), " PDF"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: openCreate,
						disabled: activeProducts.length === 0,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), " Nueva venta"]
					})
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative xl:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "pl-9",
							placeholder: "Buscar ticket o producto",
							value: query,
							onChange: (e) => {
								setQuery(e.target.value);
								setPage(1);
							}
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: productId,
						onValueChange: (v) => {
							setProductId(v);
							setPage(1);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Producto" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "Todos los productos"
						}), products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
							value: p.id,
							children: [
								p.code,
								" · ",
								p.name
							]
						}, p.id))] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: payment,
						onValueChange: (v) => {
							setPayment(v);
							setPage(1);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Pago" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "Todos los pagos"
						}), PAYMENT_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: opt.value,
							children: opt.label
						}, opt.value))] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: from,
							onChange: (e) => {
								setFrom(e.target.value);
								setPage(1);
							},
							"aria-label": "Desde"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: to,
							onChange: (e) => {
								setTo(e.target.value);
								setPage(1);
							},
							"aria-label": "Hasta"
						})]
					})
				]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "p-0",
				children: activeProducts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "Primero cree un producto",
					description: "Las ventas se descuentan del inventario de productos activos.",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/productos",
							children: "Ir a productos"
						})
					})
				}) : current.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "Sin ventas",
					description: "Registre una salida para ver ganancias e inventario."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Fecha" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Ticket" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Producto" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Cant."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Total"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Ganancia"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Pago" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Acciones"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: current.map((sale) => {
					const product = products.find((p) => p.id === sale.productId);
					const totals = saleTotals(sale);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatDate(sale.date) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "tabular-nums",
							children: sale.ticketNumber
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: product?.name ?? "—"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: product?.code
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right tabular-nums",
							children: sale.quantity
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right font-medium",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: totals.revenue })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
								value: totals.profit,
								signed: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: PAYMENT_LABELS[sale.paymentMethod] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon-sm",
									onClick: () => openEdit(sale),
									"aria-label": "Editar",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon-sm",
									onClick: () => setPendingDelete(sale),
									"aria-label": "Eliminar",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
								})]
							})
						})
					] }, sale.id);
				}) })] })
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaginationBar, {
				page,
				pageCount,
				total: filtered.length,
				onPage: setPage
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Editar venta" : "Nueva venta" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: ["Stock disponible: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold tabular-nums text-foreground",
						children: available
					})] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Fecha",
								htmlFor: "date",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "date",
									type: "date",
									value: draft.date,
									onChange: (e) => setDraft({
										...draft,
										date: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "N° ticket",
								htmlFor: "ticket",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "ticket",
									value: draft.ticketNumber,
									onChange: (e) => setDraft({
										...draft,
										ticketNumber: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Producto",
								className: "sm:col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: draft.productId,
									onValueChange: onProductChange,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Seleccione un producto" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: activeProducts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: p.id,
										children: [
											p.code,
											" · ",
											p.name,
											" (stock ",
											stockOf(p.id, entries, sales),
											")"
										]
									}, p.id)) })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Cantidad",
								htmlFor: "qty",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "qty",
									type: "number",
									min: 1,
									step: 1,
									value: draft.quantity,
									onChange: (e) => setDraft({
										...draft,
										quantity: Number(e.target.value)
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Precio unitario de venta",
								htmlFor: "price",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "price",
									type: "number",
									min: 0,
									step: "0.01",
									value: draft.unitPrice,
									onChange: (e) => setDraft({
										...draft,
										unitPrice: Number(e.target.value)
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Método de pago",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: draft.paymentMethod,
									onValueChange: (v) => setDraft({
										...draft,
										paymentMethod: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: PAYMENT_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: opt.value,
										children: opt.label
									}, opt.value)) })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Observaciones",
								htmlFor: "notes",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "notes",
									rows: 2,
									value: draft.notes,
									onChange: (e) => setDraft({
										...draft,
										notes: e.target.value
									})
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 gap-3 rounded-xl bg-muted p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-wide text-muted-foreground",
								children: "Total venta"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
								value: revenue,
								className: "font-semibold"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-wide text-muted-foreground",
								children: "Costo"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
								value: cost,
								className: "font-semibold"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-wide text-muted-foreground",
								children: "Ganancia neta"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
								value: profit,
								signed: true,
								className: "font-semibold"
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setOpen(false),
						children: "Cancelar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: save,
						children: "Guardar"
					})] })
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: Boolean(pendingDelete),
				onOpenChange: (next) => !next && setPendingDelete(null),
				title: "Eliminar venta",
				description: "El stock de ese producto se repondrá.",
				confirmLabel: "Eliminar",
				destructive: true,
				onConfirm: () => {
					if (!pendingDelete) return;
					deleteSale(pendingDelete.id);
					toast.success("Venta eliminada");
					setPendingDelete(null);
				}
			})
		]
	});
}
function blankDraft(sales, productId) {
	const product = useAppStore.getState().products.find((p) => p.id === productId);
	return {
		date: todayIso(),
		ticketNumber: nextNumber("T", sales.map((s) => s.ticketNumber)),
		productId,
		quantity: 1,
		unitPrice: product?.salePrice ?? 0,
		paymentMethod: "efectivo",
		notes: ""
	};
}
//#endregion
export { SalesPage as component };

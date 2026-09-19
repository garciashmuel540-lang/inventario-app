import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { d as Printer, f as Plus, p as Pencil, s as Trash2, u as Search, y as FileDown } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { d as formatDate, g as nextNumber, i as useAppStore, n as Button, s as entryTotal, v as round2, y as todayIso } from "./router-CbzeC8Tb.mjs";
import { n as Field, t as ConfirmDialog } from "./field-CAxr1C02.mjs";
import { n as CardContent, o as PageHeader, t as Card } from "./card-D1q2-H8-.mjs";
import { a as SelectTrigger, i as SelectItem, n as Select, o as SelectValue, r as SelectContent, t as Input } from "./select-B3-Irm70.mjs";
import { i as printEntries, n as entriesToCsv, t as downloadText } from "./export-ubSyx4JC.mjs";
import { n as PaginationBar, t as EmptyState } from "./pagination-bar-NMY926xB.mjs";
import { t as Money } from "./money-YZXDvsck.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as Textarea, t as Dialog } from "./textarea-DghkxXzI.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DJS5TwM8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/entradas-DwtJDawx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EntriesPage() {
	const products = useAppStore((s) => s.products);
	const entries = useAppStore((s) => s.entries);
	const settings = useAppStore((s) => s.settings);
	const addEntry = useAppStore((s) => s.addEntry);
	const updateEntry = useAppStore((s) => s.updateEntry);
	const deleteEntry = useAppStore((s) => s.deleteEntry);
	const activeProducts = products.filter((p) => p.status === "activo");
	const suppliers = (0, import_react.useMemo)(() => [...new Set(entries.map((e) => e.supplier).filter(Boolean))].sort((a, b) => a.localeCompare(b, "es")), [entries]);
	const [query, setQuery] = (0, import_react.useState)("");
	const [productId, setProductId] = (0, import_react.useState)("all");
	const [supplier, setSupplier] = (0, import_react.useState)("all");
	const [from, setFrom] = (0, import_react.useState)("");
	const [to, setTo] = (0, import_react.useState)("");
	const [page, setPage] = (0, import_react.useState)(1);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [draft, setDraft] = (0, import_react.useState)(blankDraft(entries, activeProducts[0]?.id ?? ""));
	const [pendingDelete, setPendingDelete] = (0, import_react.useState)(null);
	const filtered = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return entries.filter((entry) => {
			if (productId !== "all" && entry.productId !== productId) return false;
			if (supplier !== "all" && entry.supplier !== supplier) return false;
			if (from && entry.date < from) return false;
			if (to && entry.date > to) return false;
			if (!q) return true;
			const product = products.find((p) => p.id === entry.productId);
			return entry.invoiceNumber.toLowerCase().includes(q) || entry.supplier.toLowerCase().includes(q) || (product?.name.toLowerCase().includes(q) ?? false);
		});
	}, [
		entries,
		products,
		query,
		productId,
		supplier,
		from,
		to
	]);
	const pageCount = Math.max(1, Math.ceil(filtered.length / 8));
	const current = filtered.slice((page - 1) * 8, page * 8);
	const total = round2(draft.quantity * draft.unitCost);
	function openCreate() {
		setEditing(null);
		setDraft(blankDraft(entries, activeProducts[0]?.id ?? ""));
		setOpen(true);
	}
	function onProductChange(id) {
		const product = products.find((p) => p.id === id);
		setDraft((prev) => ({
			...prev,
			productId: id,
			unitCost: product?.purchasePrice ?? prev.unitCost
		}));
	}
	function openEdit(entry) {
		setEditing(entry);
		setDraft({
			date: entry.date,
			invoiceNumber: entry.invoiceNumber,
			supplier: entry.supplier,
			productId: entry.productId,
			quantity: entry.quantity,
			unitCost: entry.unitCost,
			notes: entry.notes
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Entradas",
				description: "Compras a proveedores. Al guardar, el stock del producto sube en automático.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => downloadText("entradas.csv", entriesToCsv(filtered, products, settings.currency), "text/csv;charset=utf-8"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, {}), " CSV"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => printEntries(filtered, products, settings),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, {}), " PDF"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: openCreate,
						disabled: activeProducts.length === 0,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), " Nueva entrada"]
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
							placeholder: "Buscar factura, proveedor o producto",
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
						value: supplier,
						onValueChange: (v) => {
							setSupplier(v);
							setPage(1);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Proveedor" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "Todos los proveedores"
						}), suppliers.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: name,
							children: name
						}, name))] })]
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
					description: "Las entradas se vinculan a productos activos.",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/productos",
							children: "Ir a productos"
						})
					})
				}) : current.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "Sin entradas",
					description: "Registre una compra para aumentar el inventario."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Fecha" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Factura" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Proveedor" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Producto" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Cant."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Costo u."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Total"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Acciones"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: current.map((entry) => {
					const product = products.find((p) => p.id === entry.productId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatDate(entry.date) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "tabular-nums",
							children: entry.invoiceNumber
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: entry.supplier }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: product?.name ?? "—"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: product?.code
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right tabular-nums",
							children: entry.quantity
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: entry.unitCost })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right font-medium",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: entryTotal(entry) })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon-sm",
									onClick: () => openEdit(entry),
									"aria-label": "Editar",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon-sm",
									onClick: () => setPendingDelete(entry),
									"aria-label": "Eliminar",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
								})]
							})
						})
					] }, entry.id);
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Editar entrada" : "Nueva entrada" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "El total se calcula solo. El stock se actualiza al guardar." })] }),
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
								label: "N° factura",
								htmlFor: "invoice",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "invoice",
									value: draft.invoiceNumber,
									onChange: (e) => setDraft({
										...draft,
										invoiceNumber: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
								label: "Proveedor",
								htmlFor: "supplier",
								className: "sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "supplier",
									list: "suppliers",
									value: draft.supplier,
									onChange: (e) => setDraft({
										...draft,
										supplier: e.target.value
									}),
									placeholder: "Tropigas Nicaragua"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
									id: "suppliers",
									children: suppliers.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: name }, name))
								})]
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
											p.name
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
								label: "Precio unitario de compra",
								htmlFor: "cost",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "cost",
									type: "number",
									min: 0,
									step: "0.01",
									value: draft.unitCost,
									onChange: (e) => setDraft({
										...draft,
										unitCost: Number(e.target.value)
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Observaciones",
								className: "sm:col-span-2",
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
						className: "rounded-xl bg-muted px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-wide text-muted-foreground",
							children: "Total de la compra"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
							value: total,
							className: "text-xl font-semibold"
						})]
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
				title: "Eliminar entrada",
				description: "Se revertirá el aumento de stock si las ventas lo permiten.",
				confirmLabel: "Eliminar",
				destructive: true,
				onConfirm: () => {
					if (!pendingDelete) return;
					const result = deleteEntry(pendingDelete.id);
					if (!result.ok) toast.error(result.error);
					else toast.success("Entrada eliminada");
					setPendingDelete(null);
				}
			})
		]
	});
}
function blankDraft(entries, productId) {
	const product = useAppStore.getState().products.find((p) => p.id === productId);
	return {
		date: todayIso(),
		invoiceNumber: nextNumber("F", entries.map((e) => e.invoiceNumber)),
		supplier: "",
		productId,
		quantity: 1,
		unitCost: product?.purchasePrice ?? 0,
		notes: ""
	};
}
//#endregion
export { EntriesPage as component };

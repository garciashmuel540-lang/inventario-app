import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { f as Plus, p as Pencil, s as Trash2, u as Search } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as UNIT_LABELS, E as STATUS_LABELS, O as UNIT_OPTIONS, S as CATEGORY_OPTIONS, _ as profitMargin, b as unitProfit, i as useAppStore, m as formatPercent, n as Button, x as CATEGORY_LABELS } from "./router-CbzeC8Tb.mjs";
import { n as Field, t as ConfirmDialog } from "./field-CAxr1C02.mjs";
import { n as CardContent, o as PageHeader, t as Card } from "./card-D1q2-H8-.mjs";
import { a as SelectTrigger, i as SelectItem, n as Select, o as SelectValue, r as SelectContent, t as Input } from "./select-B3-Irm70.mjs";
import { n as PaginationBar, t as EmptyState } from "./pagination-bar-NMY926xB.mjs";
import { t as Money } from "./money-YZXDvsck.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as Textarea, t as Dialog } from "./textarea-DghkxXzI.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DJS5TwM8.mjs";
import { t as Badge } from "./badge-BiGmXcXe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/productos-C7Nws6du.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var emptyDraft = () => ({
	code: "",
	name: "",
	category: "gas",
	unit: "cilindro",
	purchasePrice: 0,
	salePrice: 0,
	minStock: 0,
	status: "activo",
	notes: ""
});
function ProductsPage() {
	const products = useAppStore((s) => s.products);
	const addProduct = useAppStore((s) => s.addProduct);
	const updateProduct = useAppStore((s) => s.updateProduct);
	const deleteProduct = useAppStore((s) => s.deleteProduct);
	const [query, setQuery] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("all");
	const [status, setStatus] = (0, import_react.useState)("all");
	const [page, setPage] = (0, import_react.useState)(1);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [draft, setDraft] = (0, import_react.useState)(emptyDraft());
	const [pendingDelete, setPendingDelete] = (0, import_react.useState)(null);
	const filtered = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return products.filter((product) => {
			if (category !== "all" && product.category !== category) return false;
			if (status !== "all" && product.status !== status) return false;
			if (!q) return true;
			return product.name.toLowerCase().includes(q) || product.code.toLowerCase().includes(q) || product.notes.toLowerCase().includes(q);
		});
	}, [
		products,
		query,
		category,
		status
	]);
	const pageCount = Math.max(1, Math.ceil(filtered.length / 8));
	const current = filtered.slice((page - 1) * 8, page * 8);
	const utilidad = unitProfit(draft.purchasePrice, draft.salePrice);
	const margen = profitMargin(draft.purchasePrice, draft.salePrice);
	function openCreate() {
		setEditing(null);
		setDraft(emptyDraft());
		setOpen(true);
	}
	function openEdit(product) {
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
			notes: product.notes
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Productos",
				description: "Alta de cilindros, garrafones y accesorios. Un producto nuevo entra solo a todos los formularios.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: openCreate,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), " Nuevo producto"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex flex-col gap-3 p-4 sm:flex-row",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "pl-9",
							placeholder: "Buscar por código, nombre o notas",
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
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Categoría" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "Todas"
						}), CATEGORY_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: opt.value,
							children: opt.label
						}, opt.value))] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: status,
						onValueChange: (v) => {
							setStatus(v);
							setPage(1);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "sm:w-40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Estado" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "Todos"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "activo",
								children: "Activo"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "inactivo",
								children: "Inactivo"
							})
						] })]
					})
				]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "p-0",
				children: current.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "Sin productos",
					description: "Cree el primero para poder registrar compras y ventas.",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: openCreate,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), " Crear producto"]
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Código" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Producto" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Categoría" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Compra"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Venta"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Utilidad"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Margen"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Estado" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Acciones"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: current.map((product) => {
					const profit = unitProfit(product.purchasePrice, product.salePrice);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-medium tabular-nums",
							children: product.code
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: product.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: UNIT_LABELS[product.unit]
						})] }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: CATEGORY_LABELS[product.category] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: product.purchasePrice })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: product.salePrice })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
								value: profit,
								signed: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right tabular-nums",
							children: formatPercent(profitMargin(product.purchasePrice, product.salePrice))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: product.status === "activo" ? "success" : "muted",
							children: STATUS_LABELS[product.status]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon-sm",
									onClick: () => openEdit(product),
									"aria-label": "Editar",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon-sm",
									onClick: () => setPendingDelete(product),
									"aria-label": "Eliminar",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
								})]
							})
						})
					] }, product.id);
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Editar producto" : "Nuevo producto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "La utilidad y el margen se calculan al instante." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Código",
								htmlFor: "code",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "code",
									value: draft.code,
									onChange: (e) => setDraft({
										...draft,
										code: e.target.value
									}),
									placeholder: "GAS-45"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Nombre",
								htmlFor: "name",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "name",
									value: draft.name,
									onChange: (e) => setDraft({
										...draft,
										name: e.target.value
									}),
									placeholder: "Cilindro de gas 45 kg"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Categoría",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: draft.category,
									onValueChange: (v) => setDraft({
										...draft,
										category: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: CATEGORY_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: opt.value,
										children: opt.label
									}, opt.value)) })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Unidad",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: draft.unit,
									onValueChange: (v) => setDraft({
										...draft,
										unit: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: UNIT_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: opt.value,
										children: opt.label
									}, opt.value)) })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Precio de compra",
								htmlFor: "purchase",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "purchase",
									type: "number",
									min: 0,
									step: "0.01",
									value: draft.purchasePrice,
									onChange: (e) => setDraft({
										...draft,
										purchasePrice: Number(e.target.value)
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Precio de venta",
								htmlFor: "sale",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "sale",
									type: "number",
									min: 0,
									step: "0.01",
									value: draft.salePrice,
									onChange: (e) => setDraft({
										...draft,
										salePrice: Number(e.target.value)
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Stock mínimo",
								htmlFor: "min",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "min",
									type: "number",
									min: 0,
									step: "1",
									value: draft.minStock,
									onChange: (e) => setDraft({
										...draft,
										minStock: Number(e.target.value)
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Estado",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: draft.status,
									onValueChange: (v) => setDraft({
										...draft,
										status: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "activo",
										children: "Activo"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "inactivo",
										children: "Inactivo"
									})] })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Notas",
								className: "sm:col-span-2",
								htmlFor: "notes",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "notes",
									value: draft.notes,
									onChange: (e) => setDraft({
										...draft,
										notes: e.target.value
									}),
									rows: 3
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3 rounded-xl bg-muted p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-wide text-muted-foreground",
							children: "Utilidad unitaria"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
							value: utilidad,
							signed: true,
							className: "text-lg font-semibold"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-wide text-muted-foreground",
							children: "Margen"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg font-semibold tabular-nums",
							children: formatPercent(margen)
						})] })]
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
				title: "Eliminar producto",
				description: pendingDelete ? `¿Eliminar ${pendingDelete.name}? Si tiene movimientos, desactívelo en lugar de borrarlo.` : "",
				confirmLabel: "Eliminar",
				destructive: true,
				onConfirm: confirmDelete
			})
		]
	});
}
//#endregion
export { ProductsPage as component };

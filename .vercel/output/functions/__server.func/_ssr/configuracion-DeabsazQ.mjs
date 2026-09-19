import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { b as Download, c as Sun, h as Moon, i as Upload } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as CURRENCY_OPTIONS, i as useAppStore, k as cn, n as Button } from "./router-CbzeC8Tb.mjs";
import { n as Field, t as ConfirmDialog } from "./field-CAxr1C02.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, o as PageHeader, r as CardDescription, t as Card } from "./card-D1q2-H8-.mjs";
import { a as SelectTrigger, i as SelectItem, n as Select, o as SelectValue, r as SelectContent, t as Input } from "./select-B3-Irm70.mjs";
import { t as downloadText } from "./export-ubSyx4JC.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/configuracion-DeabsazQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40", "disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-5 w-5 rounded-full bg-card shadow-sm ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
function SettingsPage() {
	const settings = useAppStore((s) => s.settings);
	const products = useAppStore((s) => s.products);
	const entries = useAppStore((s) => s.entries);
	const sales = useAppStore((s) => s.sales);
	const updateSettings = useAppStore((s) => s.updateSettings);
	const exportBackup = useAppStore((s) => s.exportBackup);
	const importBackup = useAppStore((s) => s.importBackup);
	const resetData = useAppStore((s) => s.resetData);
	const fileRef = (0, import_react.useRef)(null);
	const [resetOpen, setResetOpen] = (0, import_react.useState)(false);
	function onImport(file) {
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			const result = importBackup(String(reader.result ?? ""));
			if (!result.ok) toast.error(result.error);
			else toast.success("Respaldo restaurado");
		};
		reader.readAsText(file);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex w-full max-w-3xl flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Configuración",
				description: "Nombre del negocio, moneda, tema y respaldos. Los datos viven en este dispositivo."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Negocio" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Se muestra en el menú y en los PDF." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "grid gap-4 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Nombre comercial",
						htmlFor: "biz",
						className: "sm:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "biz",
							value: settings.businessName,
							onChange: (e) => updateSettings({ businessName: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Moneda",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: settings.currency,
							onValueChange: (v) => {
								updateSettings({ currency: v });
								toast.success("Moneda actualizada");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: CURRENCY_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: opt.value,
								children: opt.label
							}, opt.value)) })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Modo oscuro",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex h-11 items-center justify-between rounded-md border border-input px-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-2 text-sm text-muted-foreground",
								children: [settings.theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-4" }), settings.theme === "dark" ? "Oscuro" : "Claro"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: settings.theme === "dark",
								onCheckedChange: (checked) => updateSettings({ theme: checked ? "dark" : "light" }),
								"aria-label": "Cambiar tema"
							})]
						})
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Respaldo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, { children: [
				products.length,
				" productos · ",
				entries.length,
				" entradas · ",
				sales.length,
				" salidas"
			] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex flex-col gap-3 sm:flex-row",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => downloadText(`aguagas-respaldo-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`, exportBackup(), "application/json"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), " Exportar JSON"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => fileRef.current?.click(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {}), " Importar JSON"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileRef,
						type: "file",
						accept: "application/json,.json",
						className: "hidden",
						onChange: (e) => {
							onImport(e.target.files?.[0]);
							e.target.value = "";
						}
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Restablecer" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Vuelve a cargar el catálogo de demostración (cilindros y garrafones de ejemplo). Esta acción no se puede deshacer." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "destructive",
				onClick: () => setResetOpen(true),
				children: "Restablecer datos de demostración"
			}) })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: resetOpen,
				onOpenChange: setResetOpen,
				title: "¿Restablecer todo?",
				description: "Se reemplazarán productos, entradas y salidas por el set de demostración.",
				confirmLabel: "Restablecer",
				destructive: true,
				onConfirm: () => {
					resetData();
					toast.success("Datos restablecidos");
					setResetOpen(false);
				}
			})
		]
	});
}
//#endregion
export { SettingsPage as component };

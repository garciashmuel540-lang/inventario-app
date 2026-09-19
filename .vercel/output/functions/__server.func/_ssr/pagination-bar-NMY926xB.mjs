import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { S as ChevronLeft, v as Inbox, x as ChevronRight } from "../_libs/lucide-react.mjs";
import { n as Button } from "./router-CbzeC8Tb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pagination-bar-NMY926xB.js
var import_jsx_runtime = require_jsx_runtime();
function EmptyState({ title, description, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center gap-3 px-6 py-14 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "size-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display font-semibold",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-sm text-sm text-muted-foreground",
				children: description
			})] }),
			action
		]
	});
}
function PaginationBar({ page, pageCount, total, onPage }) {
	if (total === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-3 pt-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-xs text-muted-foreground",
			children: [
				total,
				" registro",
				total === 1 ? "" : "s",
				" · página ",
				page,
				" de ",
				pageCount
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "outline",
				size: "icon-sm",
				disabled: page <= 1,
				onClick: () => onPage(page - 1),
				"aria-label": "Página anterior",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "outline",
				size: "icon-sm",
				disabled: page >= pageCount,
				onClick: () => onPage(page + 1),
				"aria-label": "Página siguiente",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {})
			})]
		})]
	});
}
//#endregion
export { PaginationBar as n, EmptyState as t };

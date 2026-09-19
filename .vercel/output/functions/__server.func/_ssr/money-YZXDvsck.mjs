import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { f as formatMoney, i as useAppStore, k as cn } from "./router-CbzeC8Tb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/money-YZXDvsck.js
var import_jsx_runtime = require_jsx_runtime();
function Money({ value, signed, className }) {
	const currency = useAppStore((s) => s.settings.currency);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("tabular-nums", signed && value > 0 ? "text-success" : signed && value < 0 ? "text-destructive" : void 0, className),
		children: formatMoney(value, currency)
	});
}
//#endregion
export { Money as t };

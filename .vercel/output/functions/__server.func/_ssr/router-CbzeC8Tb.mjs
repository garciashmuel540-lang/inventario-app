import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as createRootRoute, d as useRouterState, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, v as Link, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime, O as Slot, d as DialogContent, h as DialogTitle, l as Dialog, m as DialogPortal, p as DialogOverlay, u as DialogClose } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { D as ArrowDownToLine, E as ArrowUpFromLine, T as ChartNoAxesCombined, _ as LayoutDashboard, a as TriangleAlert, g as Menu, l as Settings, m as Package, n as Warehouse, t as X } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { n as Portal, r as Provider, t as Content2 } from "../_libs/radix-ui__react-tooltip.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { n as parseISO, r as format, t as es } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CbzeC8Tb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var TooltipProvider = Provider;
var TooltipContent = import_react.forwardRef(({ className, sideOffset = 6, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 overflow-hidden rounded-md bg-foreground px-2.5 py-1.5 text-xs text-background shadow-sm", className),
	...props
}) }));
TooltipContent.displayName = Content2.displayName;
var APP_NAME = "AguaGas";
var APP_TAGLINE = "Control de inventario de gas y agua";
var STORE_KEY = "aguagas-inventory-v1";
var CATEGORY_LABELS = {
	gas: "Gas",
	agua: "Agua",
	otros: "Otros"
};
var UNIT_LABELS = {
	cilindro: "Cilindro",
	garrafon: "Garrafón",
	unidad: "Unidad"
};
var STATUS_LABELS = {
	activo: "Activo",
	inactivo: "Inactivo"
};
var PAYMENT_LABELS = {
	efectivo: "Efectivo",
	transferencia: "Transferencia",
	tarjeta: "Tarjeta",
	credito: "Crédito"
};
var CURRENCY_OPTIONS = [{
	value: "NIO",
	label: "Córdobas (C$)"
}, {
	value: "USD",
	label: "Dólares (US$)"
}];
var CATEGORY_OPTIONS = Object.keys(CATEGORY_LABELS).map((value) => ({
	value,
	label: CATEGORY_LABELS[value]
}));
var UNIT_OPTIONS = Object.keys(UNIT_LABELS).map((value) => ({
	value,
	label: UNIT_LABELS[value]
}));
var PAYMENT_OPTIONS = Object.keys(PAYMENT_LABELS).map((value) => ({
	value,
	label: PAYMENT_LABELS[value]
}));
function todayIso(date = /* @__PURE__ */ new Date()) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function monthKey(date = /* @__PURE__ */ new Date()) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}
function isoMonth(isoDate) {
	return isoDate.slice(0, 7);
}
function formatDate(isoDate) {
	try {
		return format(parseISO(isoDate), "d MMM yyyy", { locale: es });
	} catch {
		return isoDate;
	}
}
function formatMonthLabel(yyyyMm) {
	try {
		return format(parseISO(`${yyyyMm}-01`), "MMM yyyy", { locale: es });
	} catch {
		return yyyyMm;
	}
}
function formatMoney(amount, currency) {
	const value = Number.isFinite(amount) ? amount : 0;
	try {
		return new Intl.NumberFormat("es-NI", {
			style: "currency",
			currency,
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(value);
	} catch {
		return `${currency === "USD" ? "US$" : "C$"} ${value.toFixed(2)}`;
	}
}
function formatPercent(value) {
	return `${(Number.isFinite(value) ? value : 0).toFixed(1)}%`;
}
function unitProfit(purchase, sale) {
	return round2(sale - purchase);
}
function profitMargin(purchase, sale) {
	if (sale <= 0) return 0;
	return round2((sale - purchase) / sale * 100);
}
function round2(n) {
	return Math.round((n + Number.EPSILON) * 100) / 100;
}
function nextNumber(prefix, existing) {
	let max = 0;
	const re = new RegExp(`^${prefix}-(\\d+)$`, "i");
	for (const value of existing) {
		const match = value.trim().match(re);
		if (match) max = Math.max(max, Number.parseInt(match[1] ?? "0", 10));
	}
	return `${prefix}-${String(max + 1).padStart(4, "0")}`;
}
function stockOf(productId, entries, sales) {
	let qty = 0;
	for (const entry of entries) if (entry.productId === productId) qty += entry.quantity;
	for (const sale of sales) if (sale.productId === productId) qty -= sale.quantity;
	return qty;
}
function stockLevel(stock, minStock) {
	if (stock <= 0) return "agotado";
	if (stock <= minStock) return "bajo";
	return "ok";
}
function inventoryRows(products, entries, sales) {
	return products.map((product) => {
		let entriesQty = 0;
		let salesQty = 0;
		for (const entry of entries) if (entry.productId === product.id) entriesQty += entry.quantity;
		for (const sale of sales) if (sale.productId === product.id) salesQty += sale.quantity;
		const stock = entriesQty - salesQty;
		return {
			product,
			entriesQty,
			salesQty,
			stock,
			level: stockLevel(stock, product.minStock)
		};
	});
}
function saleTotals(sale) {
	const revenue = round2(sale.quantity * sale.unitPrice);
	const cost = round2(sale.quantity * sale.unitCost);
	return {
		revenue,
		cost,
		profit: round2(revenue - cost)
	};
}
function entryTotal(entry) {
	return round2(entry.quantity * entry.unitCost);
}
function inRange(isoDate, from, to) {
	if (from && isoDate < from) return false;
	if (to && isoDate > to) return false;
	return true;
}
var CATEGORY_NAME = {
	gas: "Gas",
	agua: "Agua",
	otros: "Otros"
};
function computeDashboard(products, entries, sales, now = /* @__PURE__ */ new Date()) {
	const month = monthKey(now);
	const today = todayIso(now);
	const productMap = new Map(products.map((p) => [p.id, p]));
	const rows = inventoryRows(products, entries, sales);
	let monthSales = 0;
	let monthProfit = 0;
	let monthCost = 0;
	let todaySalesCount = 0;
	let todayRevenue = 0;
	const catProfit = {
		gas: 0,
		agua: 0,
		otros: 0
	};
	const daily = /* @__PURE__ */ new Map();
	for (let i = 13; i >= 0; i -= 1) {
		const d = new Date(now);
		d.setDate(d.getDate() - i);
		daily.set(todayIso(d), {
			ventas: 0,
			ganancia: 0
		});
	}
	for (const sale of sales) {
		const { revenue, cost, profit } = saleTotals(sale);
		if (isoMonth(sale.date) === month) {
			monthSales += revenue;
			monthProfit += profit;
			monthCost += cost;
		}
		if (sale.date === today) {
			todaySalesCount += 1;
			todayRevenue += revenue;
		}
		const product = productMap.get(sale.productId);
		if (product) catProfit[product.category] += profit;
		const bucket = daily.get(sale.date);
		if (bucket) {
			bucket.ventas += revenue;
			bucket.ganancia += profit;
		}
	}
	const entriesVsSales = rows.filter((row) => row.product.status === "activo").map((row) => ({
		name: row.product.name.replace("Cilindro de ", "").replace("Garrafón de ", ""),
		entradas: row.entriesQty,
		salidas: row.salesQty
	}));
	const categoryShare = Object.keys(catProfit).map((key) => ({
		name: CATEGORY_NAME[key],
		value: round2(catProfit[key]),
		key
	})).filter((item) => item.value > 0);
	return {
		monthSales: round2(monthSales),
		monthProfit: round2(monthProfit),
		monthCost: round2(monthCost),
		lowStockCount: rows.filter((r) => r.product.status === "activo" && r.level !== "ok").length,
		activeProducts: products.filter((p) => p.status === "activo").length,
		todaySalesCount,
		todayRevenue: round2(todayRevenue),
		totalStockUnits: rows.reduce((sum, row) => sum + Math.max(row.stock, 0), 0),
		entriesVsSales,
		dailySeries: [...daily.entries()].map(([date, values]) => ({
			date: date.slice(8),
			ventas: round2(values.ventas),
			ganancia: round2(values.ganancia)
		})),
		categoryShare,
		recentSales: [...sales].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6)
	};
}
function computeReport(products, sales, filters) {
	const productMap = new Map(products.map((p) => [p.id, p]));
	const filtered = sales.filter((sale) => {
		if (!inRange(sale.date, filters.from, filters.to)) return false;
		if (filters.productId && filters.productId !== "all" && sale.productId !== filters.productId) return false;
		if (filters.category && filters.category !== "all") {
			const product = productMap.get(sale.productId);
			if (!product || product.category !== filters.category) return false;
		}
		return true;
	});
	const byId = /* @__PURE__ */ new Map();
	const byMonth = /* @__PURE__ */ new Map();
	let totalSales = 0;
	let totalCost = 0;
	for (const sale of filtered) {
		const product = productMap.get(sale.productId);
		if (!product) continue;
		const { revenue, cost, profit } = saleTotals(sale);
		totalSales += revenue;
		totalCost += cost;
		const current = byId.get(product.id) ?? {
			product,
			units: 0,
			revenue: 0,
			cost: 0,
			profit: 0,
			margin: 0
		};
		current.units += sale.quantity;
		current.revenue += revenue;
		current.cost += cost;
		current.profit += profit;
		byId.set(product.id, current);
		const month = isoMonth(sale.date);
		const bucket = byMonth.get(month) ?? {
			ventas: 0,
			ganancia: 0
		};
		bucket.ventas += revenue;
		bucket.ganancia += profit;
		byMonth.set(month, bucket);
	}
	const byProduct = [...byId.values()].map((row) => ({
		...row,
		revenue: round2(row.revenue),
		cost: round2(row.cost),
		profit: round2(row.profit),
		margin: row.revenue > 0 ? round2(row.profit / row.revenue * 100) : 0
	})).sort((a, b) => b.profit - a.profit);
	const months = [...byMonth.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([month, values]) => ({
		month,
		ventas: round2(values.ventas),
		ganancia: round2(values.ganancia)
	}));
	const grossProfit = round2(totalSales - totalCost);
	return {
		totalSales: round2(totalSales),
		totalCost: round2(totalCost),
		grossProfit,
		avgMargin: totalSales > 0 ? round2(grossProfit / totalSales * 100) : 0,
		transactions: filtered.length,
		byProduct,
		byMonth: months,
		top5: byProduct.slice(0, 5)
	};
}
function isoDaysAgo(days, now) {
	const d = new Date(now);
	d.setDate(d.getDate() - days);
	return todayIso(d);
}
function stamp(daysAgo, hour, now) {
	const d = new Date(now);
	d.setDate(d.getDate() - daysAgo);
	d.setHours(hour, 12, 0, 0);
	return d.toISOString();
}
var defaultSettings = () => ({
	businessName: "Distribuidora AguaGas",
	currency: "NIO",
	theme: "light"
});
function buildDemoData(now = /* @__PURE__ */ new Date()) {
	return {
		products: [
			{
				id: "prod-gas-25",
				code: "GAS-25",
				name: "Cilindro de gas 25 lb",
				category: "gas",
				unit: "cilindro",
				purchasePrice: 420,
				salePrice: 520,
				minStock: 8,
				status: "activo",
				notes: "Uso doméstico. Recambio más solicitado.",
				createdAt: stamp(50, 8, now),
				updatedAt: stamp(2, 9, now)
			},
			{
				id: "prod-gas-45",
				code: "GAS-45",
				name: "Cilindro de gas 45 kg",
				category: "gas",
				unit: "cilindro",
				purchasePrice: 890,
				salePrice: 1050,
				minStock: 5,
				status: "activo",
				notes: "Comercios y comedores.",
				createdAt: stamp(50, 8, now),
				updatedAt: stamp(4, 10, now)
			},
			{
				id: "prod-gas-10",
				code: "GAS-10",
				name: "Cilindro de gas 10 lb",
				category: "gas",
				unit: "cilindro",
				purchasePrice: 210,
				salePrice: 270,
				minStock: 6,
				status: "activo",
				notes: "Portátil, alta rotación.",
				createdAt: stamp(48, 9, now),
				updatedAt: stamp(6, 11, now)
			},
			{
				id: "prod-agua-20",
				code: "AGUA-20",
				name: "Garrafón de agua 20 L",
				category: "agua",
				unit: "garrafon",
				purchasePrice: 55,
				salePrice: 85,
				minStock: 12,
				status: "activo",
				notes: "Envase lleno de primer uso.",
				createdAt: stamp(45, 8, now),
				updatedAt: stamp(1, 8, now)
			},
			{
				id: "prod-agua-recarga",
				code: "AGUA-R20",
				name: "Recarga de garrafón 20 L",
				category: "agua",
				unit: "garrafon",
				purchasePrice: 18,
				salePrice: 35,
				minStock: 20,
				status: "activo",
				notes: "El cliente deja su envase.",
				createdAt: stamp(45, 8, now),
				updatedAt: stamp(1, 8, now)
			},
			{
				id: "prod-agua-botella",
				code: "AGUA-1L",
				name: "Botella de agua 1 L",
				category: "agua",
				unit: "unidad",
				purchasePrice: 8,
				salePrice: 15,
				minStock: 24,
				status: "activo",
				notes: "Paquete de mostrador.",
				createdAt: stamp(40, 10, now),
				updatedAt: stamp(8, 12, now)
			},
			{
				id: "prod-reg",
				code: "ACC-REG",
				name: "Regulador de gas",
				category: "otros",
				unit: "unidad",
				purchasePrice: 120,
				salePrice: 185,
				minStock: 4,
				status: "activo",
				notes: "Compatible con cilindros 25 lb y 10 lb.",
				createdAt: stamp(38, 11, now),
				updatedAt: stamp(12, 9, now)
			},
			{
				id: "prod-mang",
				code: "ACC-MAN",
				name: "Manguera para gas 1.5 m",
				category: "otros",
				unit: "unidad",
				purchasePrice: 45,
				salePrice: 75,
				minStock: 6,
				status: "activo",
				notes: "",
				createdAt: stamp(38, 11, now),
				updatedAt: stamp(12, 9, now)
			}
		],
		entries: [
			e("en-01", 42, "F-0001", "Tropigas Nicaragua", "prod-gas-25", 40, 400, now),
			e("en-02", 42, "F-0001", "Tropigas Nicaragua", "prod-gas-45", 18, 860, now),
			e("en-03", 42, "F-0001", "Tropigas Nicaragua", "prod-gas-10", 24, 200, now),
			e("en-04", 35, "F-0002", "Agua Pura del Norte", "prod-agua-20", 50, 52, now),
			e("en-05", 35, "F-0002", "Agua Pura del Norte", "prod-agua-recarga", 80, 16, now),
			e("en-06", 35, "F-0002", "Agua Pura del Norte", "prod-agua-botella", 60, 7.5, now),
			e("en-07", 28, "F-0003", "Ferretería El Soplete", "prod-reg", 12, 118, now),
			e("en-08", 28, "F-0003", "Ferretería El Soplete", "prod-mang", 20, 42, now),
			e("en-09", 18, "F-0004", "Gasnica", "prod-gas-25", 25, 415, now),
			e("en-10", 18, "F-0004", "Gasnica", "prod-gas-45", 10, 880, now),
			e("en-11", 10, "F-0005", "Agua Pura del Norte", "prod-agua-20", 30, 55, now),
			e("en-12", 10, "F-0005", "Agua Pura del Norte", "prod-agua-recarga", 40, 18, now),
			e("en-13", 4, "F-0006", "Tropigas Nicaragua", "prod-gas-10", 16, 210, now),
			e("en-14", 2, "F-0007", "Distribuidora El Lago", "prod-agua-botella", 48, 8, now)
		],
		sales: [
			s("sa-01", 30, "T-0001", "prod-gas-25", 4, 520, 400, "efectivo", now, 9),
			s("sa-02", 29, "T-0002", "prod-agua-recarga", 10, 35, 16, "efectivo", now, 10),
			s("sa-03", 28, "T-0003", "prod-gas-45", 2, 1050, 860, "transferencia", now, 11),
			s("sa-04", 27, "T-0004", "prod-agua-20", 6, 85, 52, "efectivo", now, 12),
			s("sa-05", 26, "T-0005", "prod-gas-10", 5, 270, 200, "efectivo", now, 9),
			s("sa-06", 25, "T-0006", "prod-reg", 1, 185, 118, "tarjeta", now, 15),
			s("sa-07", 24, "T-0007", "prod-gas-25", 6, 520, 400, "credito", now, 10),
			s("sa-08", 23, "T-0008", "prod-agua-recarga", 14, 35, 16, "efectivo", now, 8),
			s("sa-09", 22, "T-0009", "prod-mang", 3, 75, 42, "efectivo", now, 13),
			s("sa-10", 21, "T-0010", "prod-gas-45", 1, 1050, 860, "transferencia", now, 16),
			s("sa-11", 20, "T-0011", "prod-agua-botella", 12, 15, 7.5, "efectivo", now, 9),
			s("sa-12", 18, "T-0012", "prod-gas-25", 5, 520, 415, "efectivo", now, 11),
			s("sa-13", 16, "T-0013", "prod-agua-20", 8, 85, 52, "tarjeta", now, 12),
			s("sa-14", 15, "T-0014", "prod-gas-10", 4, 270, 200, "efectivo", now, 10),
			s("sa-15", 14, "T-0015", "prod-agua-recarga", 16, 35, 18, "efectivo", now, 8),
			s("sa-16", 13, "T-0016", "prod-gas-45", 2, 1050, 880, "credito", now, 14),
			s("sa-17", 12, "T-0017", "prod-gas-25", 3, 520, 415, "transferencia", now, 9),
			s("sa-18", 11, "T-0018", "prod-reg", 2, 185, 118, "efectivo", now, 17),
			s("sa-19", 10, "T-0019", "prod-agua-20", 5, 85, 55, "efectivo", now, 11),
			s("sa-20", 9, "T-0020", "prod-agua-recarga", 12, 35, 18, "efectivo", now, 8),
			s("sa-21", 8, "T-0021", "prod-gas-10", 3, 270, 210, "tarjeta", now, 13),
			s("sa-22", 7, "T-0022", "prod-gas-25", 7, 520, 415, "efectivo", now, 10),
			s("sa-23", 6, "T-0023", "prod-agua-botella", 18, 15, 8, "efectivo", now, 9),
			s("sa-24", 5, "T-0024", "prod-gas-45", 1, 1050, 880, "transferencia", now, 15),
			s("sa-25", 4, "T-0025", "prod-agua-20", 7, 85, 55, "credito", now, 12),
			s("sa-26", 3, "T-0026", "prod-gas-25", 4, 520, 415, "efectivo", now, 10),
			s("sa-27", 3, "T-0027", "prod-agua-recarga", 9, 35, 18, "efectivo", now, 16),
			s("sa-28", 2, "T-0028", "prod-gas-10", 2, 270, 210, "efectivo", now, 9),
			s("sa-29", 1, "T-0029", "prod-mang", 2, 75, 42, "tarjeta", now, 11),
			s("sa-30", 1, "T-0030", "prod-agua-20", 4, 85, 55, "efectivo", now, 14),
			s("sa-31", 0, "T-0031", "prod-gas-25", 3, 520, 415, "efectivo", now, 8),
			s("sa-32", 0, "T-0032", "prod-agua-recarga", 8, 35, 18, "efectivo", now, 9),
			s("sa-33", 0, "T-0033", "prod-gas-45", 1, 1050, 880, "transferencia", now, 10)
		],
		settings: defaultSettings()
	};
}
function e(id, daysAgo, invoice, supplier, productId, quantity, unitCost, now) {
	return {
		id,
		date: isoDaysAgo(daysAgo, now),
		invoiceNumber: invoice,
		supplier,
		productId,
		quantity,
		unitCost,
		notes: "",
		createdAt: stamp(daysAgo, 8, now)
	};
}
function s(id, daysAgo, ticket, productId, quantity, unitPrice, unitCost, paymentMethod, now, hour) {
	return {
		id,
		date: isoDaysAgo(daysAgo, now),
		ticketNumber: ticket,
		productId,
		quantity,
		unitPrice,
		unitCost,
		paymentMethod,
		notes: "",
		createdAt: stamp(daysAgo, hour, now)
	};
}
var demo = buildDemoData();
function uid() {
	return crypto.randomUUID();
}
function nowIso() {
	return (/* @__PURE__ */ new Date()).toISOString();
}
function normalizeCode(code) {
	return code.trim().toUpperCase();
}
function validDraftNumbers(qty, price) {
	if (!Number.isFinite(qty) || qty <= 0) return "La cantidad debe ser mayor a cero.";
	if (!Number.isFinite(price) || price < 0) return "El precio no puede ser negativo.";
	return null;
}
function isBackup(value) {
	if (!value || typeof value !== "object") return false;
	const data = value;
	return data.version === 1 && Array.isArray(data.products) && Array.isArray(data.entries) && Array.isArray(data.sales) && Boolean(data.settings);
}
var useAppStore = create()(persist((set, get) => ({
	products: demo.products,
	entries: demo.entries,
	sales: demo.sales,
	settings: demo.settings,
	addProduct: (draft) => {
		const code = normalizeCode(draft.code);
		const name = draft.name.trim();
		if (!code || !name) return {
			ok: false,
			error: "Código y nombre son obligatorios."
		};
		if (draft.purchasePrice < 0 || draft.salePrice < 0 || draft.minStock < 0) return {
			ok: false,
			error: "Los importes y el stock mínimo no pueden ser negativos."
		};
		if (get().products.some((p) => p.code === code)) return {
			ok: false,
			error: "Ya existe un producto con ese código."
		};
		set({ products: [{
			...draft,
			id: uid(),
			code,
			name,
			notes: draft.notes.trim(),
			createdAt: nowIso(),
			updatedAt: nowIso()
		}, ...get().products] });
		return { ok: true };
	},
	updateProduct: (id, draft) => {
		const code = normalizeCode(draft.code);
		const name = draft.name.trim();
		if (!code || !name) return {
			ok: false,
			error: "Código y nombre son obligatorios."
		};
		if (get().products.some((p) => p.id !== id && p.code === code)) return {
			ok: false,
			error: "Ya existe un producto con ese código."
		};
		set({ products: get().products.map((product) => product.id === id ? {
			...product,
			...draft,
			code,
			name,
			notes: draft.notes.trim(),
			updatedAt: nowIso()
		} : product) });
		return { ok: true };
	},
	deleteProduct: (id) => {
		const { entries, sales, products } = get();
		if (entries.some((e) => e.productId === id) || sales.some((s) => s.productId === id)) return {
			ok: false,
			error: "No se puede eliminar: tiene entradas o salidas. Desactívelo en su lugar."
		};
		set({ products: products.filter((p) => p.id !== id) });
		return { ok: true };
	},
	addEntry: (draft) => {
		const product = get().products.find((p) => p.id === draft.productId);
		if (!product) return {
			ok: false,
			error: "Seleccione un producto."
		};
		if (product.status !== "activo") return {
			ok: false,
			error: "El producto está inactivo."
		};
		if (!draft.supplier.trim()) return {
			ok: false,
			error: "El proveedor es obligatorio."
		};
		const invalid = validDraftNumbers(draft.quantity, draft.unitCost);
		if (invalid) return {
			ok: false,
			error: invalid
		};
		set({
			entries: [{
				id: uid(),
				date: draft.date,
				invoiceNumber: draft.invoiceNumber.trim(),
				supplier: draft.supplier.trim(),
				productId: draft.productId,
				quantity: draft.quantity,
				unitCost: draft.unitCost,
				notes: draft.notes.trim(),
				createdAt: nowIso()
			}, ...get().entries],
			products: get().products.map((item) => item.id === product.id ? {
				...item,
				purchasePrice: draft.unitCost,
				updatedAt: nowIso()
			} : item)
		});
		return { ok: true };
	},
	updateEntry: (id, draft) => {
		if (!get().entries.find((e) => e.id === id)) return {
			ok: false,
			error: "Entrada no encontrada."
		};
		const product = get().products.find((p) => p.id === draft.productId);
		if (!product) return {
			ok: false,
			error: "Seleccione un producto."
		};
		if (!draft.supplier.trim()) return {
			ok: false,
			error: "El proveedor es obligatorio."
		};
		const invalid = validDraftNumbers(draft.quantity, draft.unitCost);
		if (invalid) return {
			ok: false,
			error: invalid
		};
		const nextEntries = get().entries.map((entry) => entry.id === id ? {
			...entry,
			date: draft.date,
			invoiceNumber: draft.invoiceNumber.trim(),
			supplier: draft.supplier.trim(),
			productId: draft.productId,
			quantity: draft.quantity,
			unitCost: draft.unitCost,
			notes: draft.notes.trim()
		} : entry);
		if (stockOf(draft.productId, nextEntries, get().sales) < 0) return {
			ok: false,
			error: "Esa cantidad dejaría el stock en negativo."
		};
		set({
			entries: nextEntries,
			products: get().products.map((item) => item.id === product.id ? {
				...item,
				purchasePrice: draft.unitCost,
				updatedAt: nowIso()
			} : item)
		});
		return { ok: true };
	},
	deleteEntry: (id) => {
		const current = get().entries.find((e) => e.id === id);
		if (!current) return {
			ok: false,
			error: "Entrada no encontrada."
		};
		const nextEntries = get().entries.filter((e) => e.id !== id);
		if (stockOf(current.productId, nextEntries, get().sales) < 0) return {
			ok: false,
			error: "No se puede borrar: el stock quedaría negativo por las ventas ya registradas."
		};
		set({ entries: nextEntries });
		return { ok: true };
	},
	addSale: (draft) => {
		const product = get().products.find((p) => p.id === draft.productId);
		if (!product) return {
			ok: false,
			error: "Seleccione un producto."
		};
		if (product.status !== "activo") return {
			ok: false,
			error: "El producto está inactivo."
		};
		const invalid = validDraftNumbers(draft.quantity, draft.unitPrice);
		if (invalid) return {
			ok: false,
			error: invalid
		};
		const stock = stockOf(product.id, get().entries, get().sales);
		if (draft.quantity > stock) return {
			ok: false,
			error: `Stock insuficiente. Disponible: ${stock}.`
		};
		set({ sales: [{
			id: uid(),
			date: draft.date,
			ticketNumber: draft.ticketNumber.trim(),
			productId: draft.productId,
			quantity: draft.quantity,
			unitPrice: draft.unitPrice,
			unitCost: product.purchasePrice,
			paymentMethod: draft.paymentMethod,
			notes: draft.notes.trim(),
			createdAt: nowIso()
		}, ...get().sales] });
		return { ok: true };
	},
	updateSale: (id, draft) => {
		const current = get().sales.find((s) => s.id === id);
		if (!current) return {
			ok: false,
			error: "Venta no encontrada."
		};
		if (!get().products.find((p) => p.id === draft.productId)) return {
			ok: false,
			error: "Seleccione un producto."
		};
		const invalid = validDraftNumbers(draft.quantity, draft.unitPrice);
		if (invalid) return {
			ok: false,
			error: invalid
		};
		const nextSales = get().sales.map((sale) => sale.id === id ? {
			...sale,
			date: draft.date,
			ticketNumber: draft.ticketNumber.trim(),
			productId: draft.productId,
			quantity: draft.quantity,
			unitPrice: draft.unitPrice,
			paymentMethod: draft.paymentMethod,
			notes: draft.notes.trim()
		} : sale);
		if (stockOf(draft.productId, get().entries, nextSales) < 0) return {
			ok: false,
			error: `Stock insuficiente. Disponible: ${stockOf(draft.productId, get().entries, get().sales) + current.quantity}.`
		};
		set({ sales: nextSales });
		return { ok: true };
	},
	deleteSale: (id) => {
		set({ sales: get().sales.filter((s) => s.id !== id) });
		return { ok: true };
	},
	updateSettings: (patch) => {
		set({ settings: {
			...get().settings,
			...patch
		} });
	},
	importBackup: (raw) => {
		try {
			const parsed = JSON.parse(raw);
			if (!isBackup(parsed)) return {
				ok: false,
				error: "El archivo no tiene el formato de respaldo de AguaGas."
			};
			set({
				products: parsed.products,
				entries: parsed.entries,
				sales: parsed.sales,
				settings: {
					...defaultSettings(),
					...parsed.settings
				}
			});
			return { ok: true };
		} catch {
			return {
				ok: false,
				error: "No se pudo leer el JSON. Verifique el archivo."
			};
		}
	},
	resetData: () => {
		const fresh = buildDemoData();
		set({
			products: fresh.products,
			entries: fresh.entries,
			sales: fresh.sales,
			settings: fresh.settings
		});
	},
	exportBackup: () => {
		const { products, entries, sales, settings } = get();
		const backup = {
			version: 1,
			exportedAt: nowIso(),
			products,
			entries,
			sales,
			settings
		};
		return JSON.stringify(backup, null, 2);
	}
}), {
	name: STORE_KEY,
	storage: createJSONStorage(() => {
		if (typeof window === "undefined") return {
			getItem: () => null,
			setItem: () => {},
			removeItem: () => {}
		};
		return localStorage;
	}),
	skipHydration: true,
	partialize: (state) => ({
		products: state.products,
		entries: state.entries,
		sales: state.sales,
		settings: state.settings
	})
}));
function Toaster$1() {
	const theme = useAppStore((s) => s.settings.theme);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		theme,
		position: "top-right",
		richColors: true,
		closeButton: true,
		toastOptions: { classNames: { toast: "font-sans" } }
	});
}
function LogoMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: cn("size-8", className),
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "32",
				height: "32",
				rx: "8",
				fill: "currentColor",
				className: "text-sidebar-foreground/15"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M11 7.5h6c.8 0 1.5.7 1.5 1.5v1h1.2c.4 0 .8.3.8.8v1.4h-11V10.8c0-.5.4-.8.8-.8H12V9c0-.8.7-1.5 1.5-1.5H11z",
				fill: "currentColor",
				className: "text-sidebar-foreground",
				opacity: "0.95"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M10.2 13.2h11.6c.4 0 .7.4.6.8l-1.3 8.2c-.2 1.2-1.2 2-2.4 2h-5.4c-1.2 0-2.2-.8-2.4-2l-1.3-8.2c-.1-.4.2-.8.6-.8z",
				fill: "currentColor",
				className: "text-sidebar-foreground"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M16 17.2c1.3 1.6 2.2 2.8 2.2 3.8a2.2 2.2 0 1 1-4.4 0c0-1 1-2.2 2.2-3.8z",
				fill: "currentColor",
				className: "text-sidebar-foreground/40"
			})
		]
	});
}
function Logo({ compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3 text-sidebar-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, {}), !compact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-base font-semibold leading-none tracking-tight",
				children: "AguaGas"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 truncate text-[11px] uppercase tracking-[0.14em] text-sidebar-muted",
				children: "Inventario"
			})]
		})]
	});
}
function AppProviders({ children }) {
	const [ready, setReady] = (0, import_react.useState)(false);
	const theme = useAppStore((s) => s.settings.theme);
	(0, import_react.useEffect)(() => {
		const finish = () => setReady(true);
		const unsub = useAppStore.persist.onFinishHydration(finish);
		useAppStore.persist.rehydrate();
		if (useAppStore.persist.hasHydrated()) finish();
		return unsub;
	}, []);
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		document.documentElement.classList.toggle("dark", theme === "dark");
	}, [ready, theme]);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col items-center justify-center gap-4 bg-sidebar text-sidebar-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, { className: "size-12" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-xl font-semibold tracking-tight",
				children: "AguaGas"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-sidebar-muted",
				children: "Cargando inventario…"
			})]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TooltipProvider, {
		delayDuration: 250,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})]
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
			destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
			outline: "border border-input bg-card text-foreground hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			sidebar: "text-sidebar-foreground hover:bg-sidebar-accent justify-start",
			success: "bg-success text-success-foreground hover:bg-success/90"
		},
		size: {
			default: "h-11 px-4 py-2",
			sm: "h-9 rounded-md px-3 text-sm",
			lg: "h-12 rounded-md px-6",
			icon: "h-11 w-11",
			"icon-sm": "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Sheet = Dialog;
var SheetPortal = DialogPortal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
	className: cn("fixed inset-0 z-50 bg-foreground/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay.displayName;
var SheetContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn("fixed inset-y-0 left-0 z-50 flex h-full w-72 flex-col bg-sidebar text-sidebar-foreground shadow-lg", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left", className),
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
			className: "sr-only",
			children: "Menú de navegación"
		}),
		children,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute right-3 top-3 rounded-md p-1 text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Cerrar menú"
			})]
		})
	]
})] }));
SheetContent.displayName = DialogContent.displayName;
var NAV = [
	{
		to: "/",
		label: "Panel",
		icon: LayoutDashboard
	},
	{
		to: "/productos",
		label: "Productos",
		icon: Package
	},
	{
		to: "/entradas",
		label: "Entradas",
		icon: ArrowDownToLine
	},
	{
		to: "/salidas",
		label: "Salidas",
		icon: ArrowUpFromLine
	},
	{
		to: "/inventario",
		label: "Inventario",
		icon: Warehouse
	},
	{
		to: "/reportes",
		label: "Reportes",
		icon: ChartNoAxesCombined
	},
	{
		to: "/configuracion",
		label: "Configuración",
		icon: Settings
	}
];
function NavList({ onNavigate }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const low = inventoryRows(useAppStore((s) => s.products), useAppStore((s) => s.entries), useAppStore((s) => s.sales)).filter((row) => row.product.status === "activo" && row.level !== "ok").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "flex flex-1 flex-col gap-1 px-3",
		children: NAV.map((item) => {
			const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
			const Icon = item.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.to,
				onClick: onNavigate,
				className: cn("flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors", active ? "bg-sidebar-accent text-sidebar-foreground" : "text-sidebar-muted hover:bg-sidebar-accent/70 hover:text-sidebar-foreground"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 shrink-0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex-1",
						children: item.label
					}),
					item.to === "/inventario" && low > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-destructive px-2 py-0.5 text-[10px] font-semibold text-destructive-foreground",
						children: low
					}) : null
				]
			}, item.to);
		})
	});
}
function SidebarBody({ onNavigate }) {
	const businessName = useAppStore((s) => s.settings.businessName);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col py-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-5 pb-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavList, { onNavigate }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-auto px-5 pt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-xs text-sidebar-muted",
					children: businessName
				})
			})
		]
	});
}
function AppShell({ children }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const businessName = useAppStore((s) => s.settings.businessName);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
			className: "fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarBody, {})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-dvh flex-col lg:pl-64",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-sidebar-border bg-sidebar px-4 lg:hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							size: "icon-sm",
							className: "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
							onClick: () => setOpen(true),
							"aria-label": "Abrir menú",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "ml-auto max-w-[40%] truncate text-xs text-sidebar-muted",
							children: businessName
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
					open,
					onOpenChange: setOpen,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarBody, { onNavigate: () => setOpen(false) }) })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 px-4 py-6 pb-10 sm:px-6 lg:px-8 lg:py-8",
					children
				})
			]
		})]
	});
}
var styles_default = "/assets/styles-C9NiSS0D.css";
var Route$7 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: APP_TAGLINE
			},
			{
				name: "theme-color",
				content: "#1F3864"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700&family=Source+Sans+3:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
			}
		]
	}),
	component: RootDocument
});
function RootDocument() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "es",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "antialiased",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppProviders, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	});
}
var $$splitComponentImporter$6 = () => import("./routes-BhWdwcS7.mjs");
var Route$6 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./configuracion-DeabsazQ.mjs");
var Route$5 = createFileRoute("/configuracion")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./entradas-DwtJDawx.mjs");
var Route$4 = createFileRoute("/entradas")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./inventario-CLQmpIDG.mjs");
var Route$3 = createFileRoute("/inventario")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./productos-C7Nws6du.mjs");
var Route$2 = createFileRoute("/productos")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./reportes-BZ5sYHbR.mjs");
var Route$1 = createFileRoute("/reportes")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./salidas-CT5Shqxp.mjs");
var Route = createFileRoute("/salidas")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$6.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$7
	}),
	ConfiguracionRoute: Route$5.update({
		id: "/configuracion",
		path: "/configuracion",
		getParentRoute: () => Route$7
	}),
	EntradasRoute: Route$4.update({
		id: "/entradas",
		path: "/entradas",
		getParentRoute: () => Route$7
	}),
	InventarioRoute: Route$3.update({
		id: "/inventario",
		path: "/inventario",
		getParentRoute: () => Route$7
	}),
	ProductosRoute: Route$2.update({
		id: "/productos",
		path: "/productos",
		getParentRoute: () => Route$7
	}),
	ReportesRoute: Route$1.update({
		id: "/reportes",
		path: "/reportes",
		getParentRoute: () => Route$7
	}),
	SalidasRoute: Route.update({
		id: "/salidas",
		path: "/salidas",
		getParentRoute: () => Route$7
	})
};
var routeTree = Route$7._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { CURRENCY_OPTIONS as C, UNIT_LABELS as D, STATUS_LABELS as E, UNIT_OPTIONS as O, CATEGORY_OPTIONS as S, PAYMENT_OPTIONS as T, profitMargin as _, computeDashboard as a, unitProfit as b, inventoryRows as c, formatDate as d, formatMoney as f, nextNumber as g, monthKey as h, useAppStore as i, cn as k, saleTotals as l, formatPercent as m, Button as n, computeReport as o, formatMonthLabel as p, buttonVariants as r, entryTotal as s, router_exports as t, stockOf as u, round2 as v, PAYMENT_LABELS as w, CATEGORY_LABELS as x, todayIso as y };

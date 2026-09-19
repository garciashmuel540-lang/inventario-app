import { D as UNIT_LABELS, d as formatDate, f as formatMoney, l as saleTotals, m as formatPercent, s as entryTotal, w as PAYMENT_LABELS, x as CATEGORY_LABELS } from "./router-CbzeC8Tb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/export-ubSyx4JC.js
function csvEscape(value) {
	const text = String(value ?? "");
	if (/[",\n;]/.test(text)) return `"${text.replace(/"/g, "\"\"")}"`;
	return text;
}
function downloadText(filename, content, mime = "text/plain;charset=utf-8") {
	const blob = new Blob([content], { type: mime });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}
function toCsv(headers, rows) {
	return `\uFEFF${[headers.map(csvEscape).join(","), ...rows.map((row) => row.map(csvEscape).join(","))].join("\n")}`;
}
function productMap(products) {
	return new Map(products.map((p) => [p.id, p]));
}
function entriesToCsv(entries, products, currency) {
	const map = productMap(products);
	return toCsv([
		"Fecha",
		"Factura",
		"Proveedor",
		"Código",
		"Producto",
		"Cantidad",
		"Costo unitario",
		"Total",
		"Notas"
	], entries.map((entry) => {
		const product = map.get(entry.productId);
		return [
			entry.date,
			entry.invoiceNumber,
			entry.supplier,
			product?.code ?? "",
			product?.name ?? "Producto eliminado",
			entry.quantity,
			entry.unitCost.toFixed(2),
			entryTotal(entry).toFixed(2),
			entry.notes
		];
	}));
}
function salesToCsv(sales, products) {
	const map = productMap(products);
	return toCsv([
		"Fecha",
		"Ticket",
		"Código",
		"Producto",
		"Cantidad",
		"Precio unitario",
		"Total venta",
		"Costo",
		"Ganancia",
		"Pago",
		"Notas"
	], sales.map((sale) => {
		const product = map.get(sale.productId);
		const totals = saleTotals(sale);
		return [
			sale.date,
			sale.ticketNumber,
			product?.code ?? "",
			product?.name ?? "Producto eliminado",
			sale.quantity,
			sale.unitPrice.toFixed(2),
			totals.revenue.toFixed(2),
			totals.cost.toFixed(2),
			totals.profit.toFixed(2),
			PAYMENT_LABELS[sale.paymentMethod],
			sale.notes
		];
	}));
}
function inventoryToCsv(rows) {
	return toCsv([
		"Código",
		"Producto",
		"Categoría",
		"Unidad",
		"Entradas",
		"Salidas",
		"Stock",
		"Mínimo",
		"Estado"
	], rows.map((row) => [
		row.product.code,
		row.product.name,
		CATEGORY_LABELS[row.product.category],
		UNIT_LABELS[row.product.unit],
		row.entriesQty,
		row.salesQty,
		row.stock,
		row.product.minStock,
		row.level.toUpperCase()
	]));
}
function printHtml(title, body, businessName) {
	const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>
    body { font-family: "Segoe UI", sans-serif; color: #172033; padding: 32px; }
    h1 { font-size: 20px; margin: 0 0 4px; }
    p { margin: 0 0 16px; color: #5c6778; font-size: 12px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th, td { border: 1px solid #d5dce6; padding: 8px 10px; text-align: left; }
    th { background: #1f3864; color: #fff; }
    tfoot td { font-weight: 600; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <h1>${businessName}</h1>
  <p>${title} · ${(/* @__PURE__ */ new Date()).toLocaleString("es-NI")}</p>
  ${body}
</body>
</html>`;
	const iframe = document.createElement("iframe");
	iframe.setAttribute("aria-hidden", "true");
	iframe.style.position = "fixed";
	iframe.style.right = "0";
	iframe.style.bottom = "0";
	iframe.style.width = "0";
	iframe.style.height = "0";
	iframe.style.border = "0";
	document.body.appendChild(iframe);
	const doc = iframe.contentDocument;
	if (!doc) return;
	doc.open();
	doc.write(html);
	doc.close();
	iframe.contentWindow?.focus();
	iframe.contentWindow?.print();
	window.setTimeout(() => iframe.remove(), 1500);
}
function tableHtml(headers, rows) {
	return `<table>
    <thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
    <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody>
  </table>`;
}
function printEntries(entries, products, settings) {
	const map = productMap(products);
	printHtml("Entradas / compras", tableHtml([
		"Fecha",
		"Factura",
		"Proveedor",
		"Producto",
		"Cant.",
		"Costo u.",
		"Total"
	], entries.map((entry) => {
		const product = map.get(entry.productId);
		return [
			formatDate(entry.date),
			entry.invoiceNumber,
			entry.supplier,
			product?.name ?? "—",
			String(entry.quantity),
			formatMoney(entry.unitCost, settings.currency),
			formatMoney(entryTotal(entry), settings.currency)
		];
	})), settings.businessName);
}
function printSales(sales, products, settings) {
	const map = productMap(products);
	printHtml("Salidas / ventas", tableHtml([
		"Fecha",
		"Ticket",
		"Producto",
		"Cant.",
		"Total",
		"Ganancia",
		"Pago"
	], sales.map((sale) => {
		const product = map.get(sale.productId);
		const totals = saleTotals(sale);
		return [
			formatDate(sale.date),
			sale.ticketNumber,
			product?.name ?? "—",
			String(sale.quantity),
			formatMoney(totals.revenue, settings.currency),
			formatMoney(totals.profit, settings.currency),
			PAYMENT_LABELS[sale.paymentMethod]
		];
	})), settings.businessName);
}
function printInventory(rows, settings) {
	printHtml("Inventario", tableHtml([
		"Código",
		"Producto",
		"Categoría",
		"Entradas",
		"Salidas",
		"Stock",
		"Estado"
	], rows.map((row) => [
		row.product.code,
		row.product.name,
		CATEGORY_LABELS[row.product.category],
		String(row.entriesQty),
		String(row.salesQty),
		String(row.stock),
		row.level.toUpperCase()
	])), settings.businessName);
}
function printReport(settings, summary, byProduct) {
	printHtml("Reporte de ganancias", `${tableHtml(["Indicador", "Valor"], [
		["Total ventas", formatMoney(summary.totalSales, settings.currency)],
		["Total costos", formatMoney(summary.totalCost, settings.currency)],
		["Ganancia bruta", formatMoney(summary.grossProfit, settings.currency)],
		["Margen promedio", formatPercent(summary.avgMargin)],
		["Transacciones", String(summary.transactions)]
	])}<br/>${tableHtml([
		"Producto",
		"Unidades",
		"Ingresos",
		"Ganancia",
		"Margen"
	], byProduct.map((row) => [
		row.name,
		String(row.units),
		formatMoney(row.revenue, settings.currency),
		formatMoney(row.profit, settings.currency),
		formatPercent(row.margin)
	]))}`, settings.businessName);
}
//#endregion
export { printInventory as a, salesToCsv as c, printEntries as i, toCsv as l, entriesToCsv as n, printReport as o, inventoryToCsv as r, printSales as s, downloadText as t };

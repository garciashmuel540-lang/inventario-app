import { CATEGORY_LABELS, PAYMENT_LABELS, UNIT_LABELS } from "./constants";
import { formatDate, formatMoney, formatPercent } from "./format";
import { entryTotal, saleTotals } from "./metrics";
import type { CurrencyCode, Entry, InventoryRow, Product, Sale, Settings } from "./types";

function csvEscape(value: string | number): string {
  const text = String(value ?? "");
  if (/[",\n;]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export function downloadText(filename: string, content: string, mime = "text/plain;charset=utf-8"): void {
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

export function toCsv(headers: string[], rows: (string | number)[][]): string {
  const lines = [headers.map(csvEscape).join(","), ...rows.map((row) => row.map(csvEscape).join(","))];
  return `\uFEFF${lines.join("\n")}`;
}

export function productMap(products: Product[]): Map<string, Product> {
  return new Map(products.map((p) => [p.id, p]));
}

export function entriesToCsv(entries: Entry[], products: Product[], currency: CurrencyCode): string {
  const map = productMap(products);
  return toCsv(
    ["Fecha", "Factura", "Proveedor", "Código", "Producto", "Cantidad", "Costo unitario", "Total", "Notas"],
    entries.map((entry) => {
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
        entry.notes,
      ];
    }),
  );
}

export function salesToCsv(sales: Sale[], products: Product[]): string {
  const map = productMap(products);
  return toCsv(
    [
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
      "Notas",
    ],
    sales.map((sale) => {
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
        sale.notes,
      ];
    }),
  );
}

export function inventoryToCsv(rows: InventoryRow[]): string {
  return toCsv(
    ["Código", "Producto", "Categoría", "Unidad", "Entradas", "Salidas", "Stock", "Mínimo", "Estado"],
    rows.map((row) => [
      row.product.code,
      row.product.name,
      CATEGORY_LABELS[row.product.category],
      UNIT_LABELS[row.product.unit],
      row.entriesQty,
      row.salesQty,
      row.stock,
      row.product.minStock,
      row.level.toUpperCase(),
    ]),
  );
}

function printHtml(title: string, body: string, businessName: string): void {
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
  <p>${title} · ${new Date().toLocaleString("es-NI")}</p>
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

function tableHtml(headers: string[], rows: string[][]): string {
  return `<table>
    <thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
    <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody>
  </table>`;
}

export function printEntries(entries: Entry[], products: Product[], settings: Settings): void {
  const map = productMap(products);
  printHtml(
    "Entradas / compras",
    tableHtml(
      ["Fecha", "Factura", "Proveedor", "Producto", "Cant.", "Costo u.", "Total"],
      entries.map((entry) => {
        const product = map.get(entry.productId);
        return [
          formatDate(entry.date),
          entry.invoiceNumber,
          entry.supplier,
          product?.name ?? "—",
          String(entry.quantity),
          formatMoney(entry.unitCost, settings.currency),
          formatMoney(entryTotal(entry), settings.currency),
        ];
      }),
    ),
    settings.businessName,
  );
}

export function printSales(sales: Sale[], products: Product[], settings: Settings): void {
  const map = productMap(products);
  printHtml(
    "Salidas / ventas",
    tableHtml(
      ["Fecha", "Ticket", "Producto", "Cant.", "Total", "Ganancia", "Pago"],
      sales.map((sale) => {
        const product = map.get(sale.productId);
        const totals = saleTotals(sale);
        return [
          formatDate(sale.date),
          sale.ticketNumber,
          product?.name ?? "—",
          String(sale.quantity),
          formatMoney(totals.revenue, settings.currency),
          formatMoney(totals.profit, settings.currency),
          PAYMENT_LABELS[sale.paymentMethod],
        ];
      }),
    ),
    settings.businessName,
  );
}

export function printInventory(rows: InventoryRow[], settings: Settings): void {
  printHtml(
    "Inventario",
    tableHtml(
      ["Código", "Producto", "Categoría", "Entradas", "Salidas", "Stock", "Estado"],
      rows.map((row) => [
        row.product.code,
        row.product.name,
        CATEGORY_LABELS[row.product.category],
        String(row.entriesQty),
        String(row.salesQty),
        String(row.stock),
        row.level.toUpperCase(),
      ]),
    ),
    settings.businessName,
  );
}

export function printReport(
  settings: Settings,
  summary: { totalSales: number; totalCost: number; grossProfit: number; avgMargin: number; transactions: number },
  byProduct: { name: string; units: number; revenue: number; profit: number; margin: number }[],
): void {
  const summaryTable = tableHtml(
    ["Indicador", "Valor"],
    [
      ["Total ventas", formatMoney(summary.totalSales, settings.currency)],
      ["Total costos", formatMoney(summary.totalCost, settings.currency)],
      ["Ganancia bruta", formatMoney(summary.grossProfit, settings.currency)],
      ["Margen promedio", formatPercent(summary.avgMargin)],
      ["Transacciones", String(summary.transactions)],
    ],
  );
  const productsTable = tableHtml(
    ["Producto", "Unidades", "Ingresos", "Ganancia", "Margen"],
    byProduct.map((row) => [
      row.name,
      String(row.units),
      formatMoney(row.revenue, settings.currency),
      formatMoney(row.profit, settings.currency),
      formatPercent(row.margin),
    ]),
  );
  printHtml("Reporte de ganancias", `${summaryTable}<br/>${productsTable}`, settings.businessName);
}

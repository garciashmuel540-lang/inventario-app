import { isoMonth, monthKey, round2, todayIso } from "./format";
import type {
  Category,
  Entry,
  InventoryRow,
  Product,
  Sale,
  StockLevel,
} from "./types";

export function stockOf(productId: string, entries: Entry[], sales: Sale[]): number {
  let qty = 0;
  for (const entry of entries) if (entry.productId === productId) qty += entry.quantity;
  for (const sale of sales) if (sale.productId === productId) qty -= sale.quantity;
  return qty;
}

export function stockLevel(stock: number, minStock: number): StockLevel {
  if (stock <= 0) return "agotado";
  if (stock <= minStock) return "bajo";
  return "ok";
}

export function inventoryRows(products: Product[], entries: Entry[], sales: Sale[]): InventoryRow[] {
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
      level: stockLevel(stock, product.minStock),
    };
  });
}

export function saleTotals(sale: Sale) {
  const revenue = round2(sale.quantity * sale.unitPrice);
  const cost = round2(sale.quantity * sale.unitCost);
  const profit = round2(revenue - cost);
  return { revenue, cost, profit };
}

export function entryTotal(entry: Entry) {
  return round2(entry.quantity * entry.unitCost);
}

export function inRange(isoDate: string, from?: string, to?: string) {
  if (from && isoDate < from) return false;
  if (to && isoDate > to) return false;
  return true;
}

export interface DashboardMetrics {
  monthSales: number;
  monthProfit: number;
  monthCost: number;
  lowStockCount: number;
  activeProducts: number;
  todaySalesCount: number;
  todayRevenue: number;
  totalStockUnits: number;
  entriesVsSales: { name: string; entradas: number; salidas: number }[];
  dailySeries: { date: string; ventas: number; ganancia: number }[];
  categoryShare: { name: string; value: number; key: Category }[];
  recentSales: Sale[];
}

const CATEGORY_NAME: Record<Category, string> = {
  gas: "Gas",
  agua: "Agua",
  otros: "Otros",
};

export function computeDashboard(
  products: Product[],
  entries: Entry[],
  sales: Sale[],
  now = new Date(),
): DashboardMetrics {
  const month = monthKey(now);
  const today = todayIso(now);
  const productMap = new Map(products.map((p) => [p.id, p]));
  const rows = inventoryRows(products, entries, sales);

  let monthSales = 0;
  let monthProfit = 0;
  let monthCost = 0;
  let todaySalesCount = 0;
  let todayRevenue = 0;
  const catProfit: Record<Category, number> = { gas: 0, agua: 0, otros: 0 };
  const daily = new Map<string, { ventas: number; ganancia: number }>();

  for (let i = 13; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    daily.set(todayIso(d), { ventas: 0, ganancia: 0 });
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

  const entriesVsSales = rows
    .filter((row) => row.product.status === "activo")
    .map((row) => ({
      name: row.product.code,
      entradas: row.entriesQty,
      salidas: row.salesQty,
    }));

  const categoryShare = (Object.keys(catProfit) as Category[])
    .map((key) => ({ name: CATEGORY_NAME[key], value: round2(catProfit[key]), key }))
    .filter((item) => item.value > 0);

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
      ganancia: round2(values.ganancia),
    })),
    categoryShare,
    recentSales: [...sales].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6),
  };
}

export interface ProductProfitRow {
  product: Product;
  units: number;
  revenue: number;
  cost: number;
  profit: number;
  margin: number;
}

export interface ReportMetrics {
  totalSales: number;
  totalCost: number;
  grossProfit: number;
  avgMargin: number;
  transactions: number;
  byProduct: ProductProfitRow[];
  byMonth: { month: string; ventas: number; ganancia: number }[];
  top5: ProductProfitRow[];
}

export function computeReport(
  products: Product[],
  sales: Sale[],
  filters: { from?: string; to?: string; category?: Category | "all"; productId?: string | "all" },
): ReportMetrics {
  const productMap = new Map(products.map((p) => [p.id, p]));
  const filtered = sales.filter((sale) => {
    if (!inRange(sale.date, filters.from, filters.to)) return false;
    if (filters.productId && filters.productId !== "all" && sale.productId !== filters.productId) {
      return false;
    }
    if (filters.category && filters.category !== "all") {
      const product = productMap.get(sale.productId);
      if (!product || product.category !== filters.category) return false;
    }
    return true;
  });

  const byId = new Map<string, ProductProfitRow>();
  const byMonth = new Map<string, { ventas: number; ganancia: number }>();
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
      margin: 0,
    };
    current.units += sale.quantity;
    current.revenue += revenue;
    current.cost += cost;
    current.profit += profit;
    byId.set(product.id, current);

    const month = isoMonth(sale.date);
    const bucket = byMonth.get(month) ?? { ventas: 0, ganancia: 0 };
    bucket.ventas += revenue;
    bucket.ganancia += profit;
    byMonth.set(month, bucket);
  }

  const byProduct = [...byId.values()]
    .map((row) => ({
      ...row,
      revenue: round2(row.revenue),
      cost: round2(row.cost),
      profit: round2(row.profit),
      margin: row.revenue > 0 ? round2((row.profit / row.revenue) * 100) : 0,
    }))
    .sort((a, b) => b.profit - a.profit);

  const months = [...byMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, values]) => ({
      month,
      ventas: round2(values.ventas),
      ganancia: round2(values.ganancia),
    }));

  const grossProfit = round2(totalSales - totalCost);
  return {
    totalSales: round2(totalSales),
    totalCost: round2(totalCost),
    grossProfit,
    avgMargin: totalSales > 0 ? round2((grossProfit / totalSales) * 100) : 0,
    transactions: filtered.length,
    byProduct,
    byMonth: months,
    top5: byProduct.slice(0, 5),
  };
}

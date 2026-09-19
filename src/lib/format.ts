import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import type { CurrencyCode } from "./types";

export function todayIso(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function monthKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function isoMonth(isoDate: string): string {
  return isoDate.slice(0, 7);
}

export function formatDate(isoDate: string): string {
  try {
    return format(parseISO(isoDate), "d MMM yyyy", { locale: es });
  } catch {
    return isoDate;
  }
}

export function formatMonthLabel(yyyyMm: string): string {
  try {
    return format(parseISO(`${yyyyMm}-01`), "MMM yyyy", { locale: es });
  } catch {
    return yyyyMm;
  }
}

export function formatMoney(amount: number, currency: CurrencyCode): string {
  const value = Number.isFinite(amount) ? amount : 0;
  try {
    return new Intl.NumberFormat("es-NI", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    const symbol = currency === "USD" ? "US$" : "C$";
    return `${symbol} ${value.toFixed(2)}`;
  }
}

export function formatNumber(value: number, digits = 0): string {
  return new Intl.NumberFormat("es-NI", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatPercent(value: number): string {
  const n = Number.isFinite(value) ? value : 0;
  return `${n.toFixed(1)}%`;
}

export function unitProfit(purchase: number, sale: number): number {
  return round2(sale - purchase);
}

export function profitMargin(purchase: number, sale: number): number {
  if (sale <= 0) return 0;
  return round2(((sale - purchase) / sale) * 100);
}

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function nextNumber(prefix: string, existing: string[]): string {
  let max = 0;
  const re = new RegExp(`^${prefix}-(\\d+)$`, "i");
  for (const value of existing) {
    const match = value.trim().match(re);
    if (match) max = Math.max(max, Number.parseInt(match[1] ?? "0", 10));
  }
  return `${prefix}-${String(max + 1).padStart(4, "0")}`;
}

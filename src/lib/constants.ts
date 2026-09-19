import type { Category, CurrencyCode, PaymentMethod, ProductStatus, Unit } from "./types";

export const APP_NAME = "AguaGas";
export const APP_TAGLINE = "Control de inventario de gas y agua";
export const STORE_KEY = "aguagas-inventory-v1";

export const CATEGORY_LABELS: Record<Category, string> = {
  gas: "Gas",
  agua: "Agua",
  otros: "Otros",
};

export const UNIT_LABELS: Record<Unit, string> = {
  cilindro: "Cilindro",
  garrafon: "Garrafón",
  unidad: "Unidad",
};

export const STATUS_LABELS: Record<ProductStatus, string> = {
  activo: "Activo",
  inactivo: "Inactivo",
};

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  efectivo: "Efectivo",
  transferencia: "Transferencia",
  tarjeta: "Tarjeta",
  credito: "Crédito",
};

export const CURRENCY_OPTIONS: { value: CurrencyCode; label: string }[] = [
  { value: "NIO", label: "Córdobas (C$)" },
  { value: "USD", label: "Dólares (US$)" },
];

export const CATEGORY_OPTIONS = (Object.keys(CATEGORY_LABELS) as Category[]).map((value) => ({
  value,
  label: CATEGORY_LABELS[value],
}));

export const UNIT_OPTIONS = (Object.keys(UNIT_LABELS) as Unit[]).map((value) => ({
  value,
  label: UNIT_LABELS[value],
}));

export const PAYMENT_OPTIONS = (Object.keys(PAYMENT_LABELS) as PaymentMethod[]).map((value) => ({
  value,
  label: PAYMENT_LABELS[value],
}));

export const PAGE_SIZE = 8;

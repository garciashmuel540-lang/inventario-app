import { todayIso } from "./format";
import type { Entry, Product, Sale, Settings } from "./types";

function isoDaysAgo(days: number, now: Date): string {
  const d = new Date(now);
  d.setDate(d.getDate() - days);
  return todayIso(d);
}

function stamp(daysAgo: number, hour: number, now: Date): string {
  const d = new Date(now);
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, 12, 0, 0);
  return d.toISOString();
}

export const defaultSettings = (): Settings => ({
  businessName: "Distribuidora AguaGas",
  currency: "NIO",
  theme: "light",
});

export function buildDemoData(now = new Date()): {
  products: Product[];
  entries: Entry[];
  sales: Sale[];
  settings: Settings;
} {
  const products: Product[] = [
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
      updatedAt: stamp(2, 9, now),
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
      updatedAt: stamp(4, 10, now),
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
      updatedAt: stamp(6, 11, now),
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
      updatedAt: stamp(1, 8, now),
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
      updatedAt: stamp(1, 8, now),
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
      updatedAt: stamp(8, 12, now),
    },
    {
      id: "prod-reg",
      code: "ACC-REG",
      name: "Regulador de gas",
      category: "otros",
      unit: "unidad",
      purchasePrice: 120,
      salePrice: 185,
      minStock: 12,
      status: "activo",
      notes: "Compatible con cilindros 25 lb y 10 lb.",
      createdAt: stamp(38, 11, now),
      updatedAt: stamp(12, 9, now),
    },
    {
      id: "prod-mang",
      code: "ACC-MAN",
      name: "Manguera para gas 1.5 m",
      category: "otros",
      unit: "unidad",
      purchasePrice: 45,
      salePrice: 75,
      minStock: 18,
      status: "activo",
      notes: "",
      createdAt: stamp(38, 11, now),
      updatedAt: stamp(12, 9, now),
    },
  ];

  const entries: Entry[] = [
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
    e("en-14", 2, "F-0007", "Distribuidora El Lago", "prod-agua-botella", 48, 8, now),
  ];

  const sales: Sale[] = [
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
    s("sa-33", 0, "T-0033", "prod-gas-45", 1, 1050, 880, "transferencia", now, 10),
  ];

  return { products, entries, sales, settings: defaultSettings() };
}

function e(
  id: string,
  daysAgo: number,
  invoice: string,
  supplier: string,
  productId: string,
  quantity: number,
  unitCost: number,
  now: Date,
): Entry {
  return {
    id,
    date: isoDaysAgo(daysAgo, now),
    invoiceNumber: invoice,
    supplier,
    productId,
    quantity,
    unitCost,
    notes: "",
    createdAt: stamp(daysAgo, 8, now),
  };
}

function s(
  id: string,
  daysAgo: number,
  ticket: string,
  productId: string,
  quantity: number,
  unitPrice: number,
  unitCost: number,
  paymentMethod: Sale["paymentMethod"],
  now: Date,
  hour: number,
): Sale {
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
    createdAt: stamp(daysAgo, hour, now),
  };
}

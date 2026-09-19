export type Category = "gas" | "agua" | "otros";
export type Unit = "cilindro" | "garrafon" | "unidad";
export type ProductStatus = "activo" | "inactivo";
export type PaymentMethod = "efectivo" | "transferencia" | "tarjeta" | "credito";
export type CurrencyCode = "NIO" | "USD";
export type ThemeMode = "light" | "dark";
export type StockLevel = "ok" | "bajo" | "agotado";

export interface Product {
  id: string;
  code: string;
  name: string;
  category: Category;
  unit: Unit;
  purchasePrice: number;
  salePrice: number;
  minStock: number;
  status: ProductStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Entry {
  id: string;
  date: string;
  invoiceNumber: string;
  supplier: string;
  productId: string;
  quantity: number;
  unitCost: number;
  notes: string;
  createdAt: string;
}

export interface Sale {
  id: string;
  date: string;
  ticketNumber: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  unitCost: number;
  paymentMethod: PaymentMethod;
  notes: string;
  createdAt: string;
}

export interface Settings {
  businessName: string;
  currency: CurrencyCode;
  theme: ThemeMode;
}

export interface BackupFile {
  version: 1;
  exportedAt: string;
  products: Product[];
  entries: Entry[];
  sales: Sale[];
  settings: Settings;
}

export interface InventoryRow {
  product: Product;
  entriesQty: number;
  salesQty: number;
  stock: number;
  level: StockLevel;
}

export interface ProductDraft {
  code: string;
  name: string;
  category: Category;
  unit: Unit;
  purchasePrice: number;
  salePrice: number;
  minStock: number;
  status: ProductStatus;
  notes: string;
}

export interface EntryDraft {
  date: string;
  invoiceNumber: string;
  supplier: string;
  productId: string;
  quantity: number;
  unitCost: number;
  notes: string;
}

export interface SaleDraft {
  date: string;
  ticketNumber: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  paymentMethod: PaymentMethod;
  notes: string;
}

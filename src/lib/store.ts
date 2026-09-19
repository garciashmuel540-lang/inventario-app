import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { STORE_KEY } from "./constants";
import { stockOf } from "./metrics";
import { buildDemoData, defaultSettings } from "./seed";
import type {
  BackupFile,
  Entry,
  EntryDraft,
  Product,
  ProductDraft,
  Sale,
  SaleDraft,
  Settings,
} from "./types";

export type ActionResult = { ok: true } | { ok: false; error: string };

interface AppState {
  products: Product[];
  entries: Entry[];
  sales: Sale[];
  settings: Settings;
  addProduct: (draft: ProductDraft) => ActionResult;
  updateProduct: (id: string, draft: ProductDraft) => ActionResult;
  deleteProduct: (id: string) => ActionResult;
  addEntry: (draft: EntryDraft) => ActionResult;
  updateEntry: (id: string, draft: EntryDraft) => ActionResult;
  deleteEntry: (id: string) => ActionResult;
  addSale: (draft: SaleDraft) => ActionResult;
  updateSale: (id: string, draft: SaleDraft) => ActionResult;
  deleteSale: (id: string) => ActionResult;
  updateSettings: (patch: Partial<Settings>) => void;
  importBackup: (raw: string) => ActionResult;
  resetData: () => void;
  exportBackup: () => string;
}

const demo = buildDemoData();

function uid(): string {
  return crypto.randomUUID();
}

function nowIso(): string {
  return new Date().toISOString();
}

function normalizeCode(code: string): string {
  return code.trim().toUpperCase();
}

function validDraftNumbers(qty: number, price: number): string | null {
  if (!Number.isFinite(qty) || qty <= 0) return "La cantidad debe ser mayor a cero.";
  if (!Number.isFinite(price) || price < 0) return "El precio no puede ser negativo.";
  return null;
}

function isBackup(value: unknown): value is BackupFile {
  if (!value || typeof value !== "object") return false;
  const data = value as BackupFile;
  return (
    data.version === 1 &&
    Array.isArray(data.products) &&
    Array.isArray(data.entries) &&
    Array.isArray(data.sales) &&
    Boolean(data.settings)
  );
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      products: demo.products,
      entries: demo.entries,
      sales: demo.sales,
      settings: demo.settings,

      addProduct: (draft) => {
        const code = normalizeCode(draft.code);
        const name = draft.name.trim();
        if (!code || !name) return { ok: false, error: "Código y nombre son obligatorios." };
        if (draft.purchasePrice < 0 || draft.salePrice < 0 || draft.minStock < 0) {
          return { ok: false, error: "Los importes y el stock mínimo no pueden ser negativos." };
        }
        if (get().products.some((p) => p.code === code)) {
          return { ok: false, error: "Ya existe un producto con ese código." };
        }
        const product: Product = {
          ...draft,
          id: uid(),
          code,
          name,
          notes: draft.notes.trim(),
          createdAt: nowIso(),
          updatedAt: nowIso(),
        };
        set({ products: [product, ...get().products] });
        return { ok: true };
      },

      updateProduct: (id, draft) => {
        const code = normalizeCode(draft.code);
        const name = draft.name.trim();
        if (!code || !name) return { ok: false, error: "Código y nombre son obligatorios." };
        if (get().products.some((p) => p.id !== id && p.code === code)) {
          return { ok: false, error: "Ya existe un producto con ese código." };
        }
        set({
          products: get().products.map((product) =>
            product.id === id
              ? {
                  ...product,
                  ...draft,
                  code,
                  name,
                  notes: draft.notes.trim(),
                  updatedAt: nowIso(),
                }
              : product,
          ),
        });
        return { ok: true };
      },

      deleteProduct: (id) => {
        const { entries, sales, products } = get();
        if (entries.some((e) => e.productId === id) || sales.some((s) => s.productId === id)) {
          return {
            ok: false,
            error: "No se puede eliminar: tiene entradas o salidas. Desactívelo en su lugar.",
          };
        }
        set({ products: products.filter((p) => p.id !== id) });
        return { ok: true };
      },

      addEntry: (draft) => {
        const product = get().products.find((p) => p.id === draft.productId);
        if (!product) return { ok: false, error: "Seleccione un producto." };
        if (product.status !== "activo") return { ok: false, error: "El producto está inactivo." };
        if (!draft.supplier.trim()) return { ok: false, error: "El proveedor es obligatorio." };
        const invalid = validDraftNumbers(draft.quantity, draft.unitCost);
        if (invalid) return { ok: false, error: invalid };
        const entry: Entry = {
          id: uid(),
          date: draft.date,
          invoiceNumber: draft.invoiceNumber.trim(),
          supplier: draft.supplier.trim(),
          productId: draft.productId,
          quantity: draft.quantity,
          unitCost: draft.unitCost,
          notes: draft.notes.trim(),
          createdAt: nowIso(),
        };
        set({
          entries: [entry, ...get().entries],
          products: get().products.map((item) =>
            item.id === product.id
              ? { ...item, purchasePrice: draft.unitCost, updatedAt: nowIso() }
              : item,
          ),
        });
        return { ok: true };
      },

      updateEntry: (id, draft) => {
        const current = get().entries.find((e) => e.id === id);
        if (!current) return { ok: false, error: "Entrada no encontrada." };
        const product = get().products.find((p) => p.id === draft.productId);
        if (!product) return { ok: false, error: "Seleccione un producto." };
        if (!draft.supplier.trim()) return { ok: false, error: "El proveedor es obligatorio." };
        const invalid = validDraftNumbers(draft.quantity, draft.unitCost);
        if (invalid) return { ok: false, error: invalid };
        const nextEntries = get().entries.map((entry) =>
          entry.id === id
            ? {
                ...entry,
                date: draft.date,
                invoiceNumber: draft.invoiceNumber.trim(),
                supplier: draft.supplier.trim(),
                productId: draft.productId,
                quantity: draft.quantity,
                unitCost: draft.unitCost,
                notes: draft.notes.trim(),
              }
            : entry,
        );
        const stock = stockOf(draft.productId, nextEntries, get().sales);
        if (stock < 0) {
          return { ok: false, error: "Esa cantidad dejaría el stock en negativo." };
        }
        set({
          entries: nextEntries,
          products: get().products.map((item) =>
            item.id === product.id
              ? { ...item, purchasePrice: draft.unitCost, updatedAt: nowIso() }
              : item,
          ),
        });
        return { ok: true };
      },

      deleteEntry: (id) => {
        const current = get().entries.find((e) => e.id === id);
        if (!current) return { ok: false, error: "Entrada no encontrada." };
        const nextEntries = get().entries.filter((e) => e.id !== id);
        const stock = stockOf(current.productId, nextEntries, get().sales);
        if (stock < 0) {
          return {
            ok: false,
            error: "No se puede borrar: el stock quedaría negativo por las ventas ya registradas.",
          };
        }
        set({ entries: nextEntries });
        return { ok: true };
      },

      addSale: (draft) => {
        const product = get().products.find((p) => p.id === draft.productId);
        if (!product) return { ok: false, error: "Seleccione un producto." };
        if (product.status !== "activo") return { ok: false, error: "El producto está inactivo." };
        const invalid = validDraftNumbers(draft.quantity, draft.unitPrice);
        if (invalid) return { ok: false, error: invalid };
        const stock = stockOf(product.id, get().entries, get().sales);
        if (draft.quantity > stock) {
          return { ok: false, error: `Stock insuficiente. Disponible: ${stock}.` };
        }
        const sale: Sale = {
          id: uid(),
          date: draft.date,
          ticketNumber: draft.ticketNumber.trim(),
          productId: draft.productId,
          quantity: draft.quantity,
          unitPrice: draft.unitPrice,
          unitCost: product.purchasePrice,
          paymentMethod: draft.paymentMethod,
          notes: draft.notes.trim(),
          createdAt: nowIso(),
        };
        set({ sales: [sale, ...get().sales] });
        return { ok: true };
      },

      updateSale: (id, draft) => {
        const current = get().sales.find((s) => s.id === id);
        if (!current) return { ok: false, error: "Venta no encontrada." };
        const product = get().products.find((p) => p.id === draft.productId);
        if (!product) return { ok: false, error: "Seleccione un producto." };
        const invalid = validDraftNumbers(draft.quantity, draft.unitPrice);
        if (invalid) return { ok: false, error: invalid };
        const nextSales = get().sales.map((sale) =>
          sale.id === id
            ? {
                ...sale,
                date: draft.date,
                ticketNumber: draft.ticketNumber.trim(),
                productId: draft.productId,
                quantity: draft.quantity,
                unitPrice: draft.unitPrice,
                paymentMethod: draft.paymentMethod,
                notes: draft.notes.trim(),
              }
            : sale,
        );
        const stock = stockOf(draft.productId, get().entries, nextSales);
        if (stock < 0) {
          const available = stockOf(draft.productId, get().entries, get().sales) + current.quantity;
          return { ok: false, error: `Stock insuficiente. Disponible: ${available}.` };
        }
        set({ sales: nextSales });
        return { ok: true };
      },

      deleteSale: (id) => {
        set({ sales: get().sales.filter((s) => s.id !== id) });
        return { ok: true };
      },

      updateSettings: (patch) => {
        set({ settings: { ...get().settings, ...patch } });
      },

      importBackup: (raw) => {
        try {
          const parsed: unknown = JSON.parse(raw);
          if (!isBackup(parsed)) {
            return { ok: false, error: "El archivo no tiene el formato de respaldo de AguaGas." };
          }
          set({
            products: parsed.products,
            entries: parsed.entries,
            sales: parsed.sales,
            settings: { ...defaultSettings(), ...parsed.settings },
          });
          return { ok: true };
        } catch {
          return { ok: false, error: "No se pudo leer el JSON. Verifique el archivo." };
        }
      },

      resetData: () => {
        const fresh = buildDemoData();
        set({
          products: fresh.products,
          entries: fresh.entries,
          sales: fresh.sales,
          settings: fresh.settings,
        });
      },

      exportBackup: () => {
        const { products, entries, sales, settings } = get();
        const backup: BackupFile = {
          version: 1,
          exportedAt: nowIso(),
          products,
          entries,
          sales,
          settings,
        };
        return JSON.stringify(backup, null, 2);
      },
    }),
    {
      name: STORE_KEY,
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      skipHydration: true,
      partialize: (state) => ({
        products: state.products,
        entries: state.entries,
        sales: state.sales,
        settings: state.settings,
      }),
    },
  ),
);

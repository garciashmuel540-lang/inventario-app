import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ChartNoAxesCombined,
  LayoutDashboard,
  Menu,
  Package,
  Settings,
  Warehouse,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { inventoryRows } from "@/lib/metrics";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Panel", icon: LayoutDashboard },
  { to: "/productos", label: "Productos", icon: Package },
  { to: "/entradas", label: "Entradas", icon: ArrowDownToLine },
  { to: "/salidas", label: "Salidas", icon: ArrowUpFromLine },
  { to: "/inventario", label: "Inventario", icon: Warehouse },
  { to: "/reportes", label: "Reportes", icon: ChartNoAxesCombined },
  { to: "/configuracion", label: "Configuración", icon: Settings },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const products = useAppStore((s) => s.products);
  const entries = useAppStore((s) => s.entries);
  const sales = useAppStore((s) => s.sales);
  const low = inventoryRows(products, entries, sales).filter(
    (row) => row.product.status === "activo" && row.level !== "ok",
  ).length;

  return (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {NAV.map((item) => {
        const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-foreground"
                : "text-sidebar-muted hover:bg-sidebar-accent/70 hover:text-sidebar-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span className="flex-1">{item.label}</span>
            {item.to === "/inventario" && low > 0 ? (
              <span className="rounded-full bg-destructive px-2 py-0.5 text-[10px] font-semibold text-destructive-foreground">
                {low}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const businessName = useAppStore((s) => s.settings.businessName);
  return (
    <div className="flex h-full flex-col py-5">
      <div className="px-5 pb-6">
        <Logo />
      </div>
      <NavList onNavigate={onNavigate} />
      <div className="mt-auto px-5 pt-4">
        <p className="truncate text-xs text-sidebar-muted">{businessName}</p>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const businessName = useAppStore((s) => s.settings.businessName);

  return (
    <div className="min-h-dvh bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col">
        <SidebarBody />
      </aside>

      <div className="flex min-h-dvh flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-sidebar-border bg-sidebar px-4 lg:hidden">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu />
          </Button>
          <Logo />
          <p className="ml-auto max-w-[40%] truncate text-xs text-sidebar-muted">{businessName}</p>
        </header>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent>
            <SidebarBody onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>

        <main className="flex-1 px-4 py-6 pb-10 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}

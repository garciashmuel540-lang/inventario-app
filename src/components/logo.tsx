import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="currentColor" className="text-sidebar-foreground/15" />
      <path
        d="M11 7.5h6c.8 0 1.5.7 1.5 1.5v1h1.2c.4 0 .8.3.8.8v1.4h-11V10.8c0-.5.4-.8.8-.8H12V9c0-.8.7-1.5 1.5-1.5H11z"
        fill="currentColor"
        className="text-sidebar-foreground"
        opacity="0.95"
      />
      <path
        d="M10.2 13.2h11.6c.4 0 .7.4.6.8l-1.3 8.2c-.2 1.2-1.2 2-2.4 2h-5.4c-1.2 0-2.2-.8-2.4-2l-1.3-8.2c-.1-.4.2-.8.6-.8z"
        fill="currentColor"
        className="text-sidebar-foreground"
      />
      <path
        d="M16 17.2c1.3 1.6 2.2 2.8 2.2 3.8a2.2 2.2 0 1 1-4.4 0c0-1 1-2.2 2.2-3.8z"
        fill="currentColor"
        className="text-sidebar-foreground/40"
      />
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3 text-sidebar-foreground">
      <LogoMark />
      {!compact && (
        <div className="min-w-0">
          <p className="font-display text-base font-semibold leading-none tracking-tight">AguaGas</p>
          <p className="mt-1 truncate text-[11px] uppercase tracking-[0.14em] text-sidebar-muted">
            Inventario
          </p>
        </div>
      )}
    </div>
  );
}

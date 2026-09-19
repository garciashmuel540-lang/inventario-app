import { useEffect, useState, type ReactNode } from "react";

export function ClientOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return fallback ?? <div className="h-64 animate-pulse rounded-xl bg-muted" />;
  }
  return children;
}

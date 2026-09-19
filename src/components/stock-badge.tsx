import { Badge } from "@/components/ui/badge";
import type { StockLevel } from "@/lib/types";

const META: Record<StockLevel, { label: string; variant: "success" | "warning" | "destructive" }> = {
  ok: { label: "OK", variant: "success" },
  bajo: { label: "BAJO", variant: "warning" },
  agotado: { label: "AGOTADO", variant: "destructive" },
};

export function StockBadge({ level }: { level: StockLevel }) {
  const meta = META[level];
  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}

import { formatMoney } from "@/lib/format";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Money({
  value,
  signed,
  className,
}: {
  value: number;
  signed?: boolean;
  className?: string;
}) {
  const currency = useAppStore((s) => s.settings.currency);
  const tone =
    signed && value > 0 ? "text-success" : signed && value < 0 ? "text-destructive" : undefined;
  return <span className={cn("tabular-nums", tone, className)}>{formatMoney(value, currency)}</span>;
}

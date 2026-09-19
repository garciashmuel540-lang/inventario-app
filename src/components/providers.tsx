import { useEffect, type ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { useAppStore } from "@/lib/store";

export function AppProviders({ children }: { children: ReactNode }) {
  const theme = useAppStore((s) => s.settings.theme);

  useEffect(() => {
    void useAppStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <TooltipProvider delayDuration={250}>
      {children}
      <Toaster />
    </TooltipProvider>
  );
}

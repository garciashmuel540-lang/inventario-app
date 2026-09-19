import { Toaster as Sonner } from "sonner";
import { useAppStore } from "@/lib/store";

export function Toaster() {
  const theme = useAppStore((s) => s.settings.theme);
  return (
    <Sonner
      theme={theme}
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "font-sans",
        },
      }}
    />
  );
}

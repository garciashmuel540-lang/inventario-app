import { useEffect, useRef } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onScan: (code: string) => void;
};

export function ScannerDialog({ open, onClose, onScan }: Props) {
  const lastScanRef = useRef<{ code: string; time: number }>({ code: "", time: 0 });

  useEffect(() => {
    if (!open) lastScanRef.current = { code: "", time: 0 };
  }, [open]);

  if (!open) return null;

  function handleScan(detectedCodes: { rawValue: string }[]) {
    const code = detectedCodes[0]?.rawValue?.trim();
    if (!code) return;

    const now = Date.now();
    // Evita leer el mismo código varias veces seguidas (debounce 2 seg)
    if (code === lastScanRef.current.code && now - lastScanRef.current.time < 2000) return;

    lastScanRef.current = { code, time: now };
    onScan(code);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <div className="flex items-center justify-between bg-black px-4 py-3 text-white">
        <p className="font-semibold">Escanear código</p>
        <button onClick={onClose} className="rounded-full bg-white/10 p-2" aria-label="Cerrar">
          <X className="size-5" />
        </button>
      </div>
      <div className="relative flex-1">
        <Scanner
          onScan={handleScan}
          onError={(err) => console.error("Scanner error:", err)}
          constraints={{ facingMode: "environment" }}
          styles={{ container: { width: "100%", height: "100%" } }}
        />
      </div>
      <p className="bg-black px-4 py-3 text-center text-sm text-white/80">
        Apunta la cámara al código de barras del producto
      </p>
    </div>
  );
}

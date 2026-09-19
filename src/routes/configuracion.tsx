import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, Moon, Sun, Upload } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Field } from "@/components/field";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CURRENCY_OPTIONS } from "@/lib/constants";
import { downloadText } from "@/lib/export";
import { useAppStore } from "@/lib/store";
import type { CurrencyCode } from "@/lib/types";

export const Route = createFileRoute("/configuracion")({ component: SettingsPage });

function SettingsPage() {
  const settings = useAppStore((s) => s.settings);
  const products = useAppStore((s) => s.products);
  const entries = useAppStore((s) => s.entries);
  const sales = useAppStore((s) => s.sales);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const exportBackup = useAppStore((s) => s.exportBackup);
  const importBackup = useAppStore((s) => s.importBackup);
  const resetData = useAppStore((s) => s.resetData);
  const fileRef = useRef<HTMLInputElement>(null);
  const [resetOpen, setResetOpen] = useState(false);

  function onImport(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = importBackup(String(reader.result ?? ""));
      if (!result.ok) toast.error(result.error);
      else toast.success("Respaldo restaurado");
    };
    reader.readAsText(file);
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <PageHeader
        title="Configuración"
        description="Nombre del negocio, moneda, tema y respaldos. Los datos viven en este dispositivo."
      />

      <Card>
        <CardHeader>
          <CardTitle>Negocio</CardTitle>
          <CardDescription>Se muestra en el menú y en los PDF.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre comercial" htmlFor="biz" className="sm:col-span-2">
            <Input
              id="biz"
              value={settings.businessName}
              onChange={(e) => updateSettings({ businessName: e.target.value })}
            />
          </Field>
          <Field label="Moneda">
            <Select
              value={settings.currency}
              onValueChange={(v) => {
                updateSettings({ currency: v as CurrencyCode });
                toast.success("Moneda actualizada");
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Modo oscuro">
            <div className="flex h-11 items-center justify-between rounded-md border border-input px-3">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                {settings.theme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
                {settings.theme === "dark" ? "Oscuro" : "Claro"}
              </span>
              <Switch
                checked={settings.theme === "dark"}
                onCheckedChange={(checked) => updateSettings({ theme: checked ? "dark" : "light" })}
                aria-label="Cambiar tema"
              />
            </div>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Respaldo</CardTitle>
          <CardDescription>
            {products.length} productos · {entries.length} entradas · {sales.length} salidas
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => downloadText(`aguagas-respaldo-${new Date().toISOString().slice(0, 10)}.json`, exportBackup(), "application/json")}
          >
            <Download /> Exportar JSON
          </Button>
          <Button variant="outline" onClick={() => fileRef.current?.click()}>
            <Upload /> Importar JSON
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              onImport(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Restablecer</CardTitle>
          <CardDescription>
            Vuelve a cargar el catálogo de demostración (cilindros y garrafones de ejemplo). Esta acción no se puede deshacer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={() => setResetOpen(true)}>
            Restablecer datos de demostración
          </Button>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        title="¿Restablecer todo?"
        description="Se reemplazarán productos, entradas y salidas por el set de demostración."
        confirmLabel="Restablecer"
        destructive
        onConfirm={() => {
          resetData();
          toast.success("Datos restablecidos");
          setResetOpen(false);
        }}
      />
    </div>
  );
}

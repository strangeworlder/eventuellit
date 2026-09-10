import { Badge } from "@repo/ui/components/Badge";
import { Breadcrumb } from "@repo/ui/components/Breadcrumb";
import { Button } from "@repo/ui/components/Button";
import { ConfirmDialog } from "@repo/ui/components/ConfirmDialog";
import { Dialog } from "@repo/ui/components/Dialog";
import { EmptyState } from "@repo/ui/components/EmptyState";
import { HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Hero } from "@repo/ui/components/Hero";
import { Input } from "@repo/ui/components/Input";
import { Stack } from "@repo/ui/components/Layout";
import { LoadingState } from "@repo/ui/components/LoadingState";
import { MarkdownRenderer } from "@repo/ui/components/Markdown";
import { NoticePanel } from "@repo/ui/components/NoticePanel";
import { PageBody } from "@repo/ui/components/Page";
import { Select, type SelectOption } from "@repo/ui/components/Select";
import { Table, type TableColumn } from "@repo/ui/components/Table";
import { Text } from "@repo/ui/components/Text";
import { TextArea } from "@repo/ui/components/TextArea";
import { useCallback, useMemo, useState } from "react";
import {
  type MonkPower,
  useCreateMonkPower,
  useDeleteMonkPower,
  useMonkPowers,
  useUpdateMonkPower,
} from "./api/monk-powers";

interface PropertyRow {
  id: string;
  key: string;
  value: string;
}

const TIER_OPTIONS: SelectOption[] = [
  { value: "1", label: "1. piiri" },
  { value: "2", label: "2. piiri" },
  { value: "3", label: "3. piiri" },
  { value: "4", label: "4. piiri" },
  { value: "5", label: "5. piiri" },
  { value: "6", label: "6. piiri" },
  { value: "7", label: "7. piiri" },
  { value: "8", label: "8. piiri" },
];

const FILTER_TIER_OPTIONS: SelectOption[] = [
  { value: "all", label: "Kaikki piirit" },
  ...TIER_OPTIONS,
];

interface MonkPowersAdminProps {
  basePath?: string;
}

export function MonkPowersAdmin({ basePath = "" }: MonkPowersAdminProps) {
  const [tierFilter, setTierFilter] = useState<string>("all");
  const selectedTier = tierFilter === "all" ? undefined : Number(tierFilter);

  const { data: powers, isLoading, error } = useMonkPowers(selectedTier);
  const createMutation = useCreateMonkPower();
  const updateMutation = useUpdateMonkPower();
  const deleteMutation = useDeleteMonkPower();

  // Dialog state (Create / Edit)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPower, setEditingPower] = useState<MonkPower | null>(null);
  const [formName, setFormName] = useState("");
  const [formTier, setFormTier] = useState("1");
  const [formDescription, setFormDescription] = useState("");
  const [propertyRows, setPropertyRows] = useState<PropertyRow[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete state
  const [powerToDelete, setPowerToDelete] = useState<MonkPower | null>(null);

  const handleOpenCreate = () => {
    setEditingPower(null);
    setFormName("");
    setFormTier(tierFilter !== "all" ? tierFilter : "1");
    setFormDescription("");
    setPropertyRows([]);
    setFormError(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = useCallback((power: MonkPower) => {
    setEditingPower(power);
    setFormName(power.name);
    setFormTier(String(power.tier));
    setFormDescription(power.description || "");
    const initialProps = Object.entries(power.properties || {}).map(([key, value]) => ({
      id: `${key}-${Math.random().toString(36).slice(2, 9)}`,
      key,
      value: typeof value === "object" ? JSON.stringify(value) : String(value ?? ""),
    }));
    setPropertyRows(initialProps);
    setFormError(null);
    setIsDialogOpen(true);
  }, []);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPower(null);
    setFormError(null);
  };

  const handleAddPropertyRow = () => {
    setPropertyRows((prev) => [
      ...prev,
      { id: `prop-${Math.random().toString(36).slice(2, 9)}`, key: "", value: "" },
    ]);
  };

  const handleRemovePropertyRow = (id: string) => {
    setPropertyRows((prev) => prev.filter((row) => row.id !== id));
  };

  const handlePropertyChange = (id: string, field: "key" | "value", val: string) => {
    setPropertyRows((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: val } : row)));
  };

  const handleSave = async () => {
    const trimmedName = formName.trim();
    if (!trimmedName) {
      setFormError("Voimalla on oltava nimi.");
      return;
    }

    const tierNum = Number(formTier);
    if (Number.isNaN(tierNum) || tierNum < 1 || tierNum > 8) {
      setFormError("Piirin on oltava välillä 1–8.");
      return;
    }

    const propertiesObj: Record<string, unknown> = {};
    for (const row of propertyRows) {
      const trimmedKey = row.key.trim();
      if (trimmedKey) {
        let val: unknown = row.value.trim();
        if (typeof val === "string") {
          try {
            val = JSON.parse(val);
          } catch {
            // Keep as string
          }
        }
        propertiesObj[trimmedKey] = val;
      }
    }

    try {
      if (editingPower) {
        await updateMutation.mutateAsync({
          id: editingPower.id,
          name: trimmedName,
          tier: tierNum,
          description: formDescription.trim() || null,
          properties: propertiesObj,
        });
      } else {
        await createMutation.mutateAsync({
          name: trimmedName,
          tier: tierNum,
          description: formDescription.trim() || undefined,
          properties: propertiesObj,
        });
      }
      handleCloseDialog();
    } catch (err: any) {
      setFormError(err.message || "Tallennus epäonnistui.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!powerToDelete) return;
    try {
      await deleteMutation.mutateAsync(powerToDelete.id);
      setPowerToDelete(null);
    } catch {
      // Handled by deleteMutation error or query
    }
  };

  const columns: TableColumn<MonkPower>[] = useMemo(
    () => [
      {
        key: "tier",
        header: "Piiri",
        align: "center",
        render: (value) => <Badge variant="solid">{value as number}. piiri</Badge>,
      },
      {
        key: "name",
        header: "Nimi",
        render: (value) => <Text variant="bold">{value as string}</Text>,
      },
      {
        key: "description",
        header: "Kuvaus",
        render: (value) => {
          const desc = value as string;
          if (!desc) return <span className="text-text-muted text-sm">—</span>;
          return (
            <div className="line-clamp-2 max-w-md text-xs text-text-muted">
              <MarkdownRenderer className="space-y-0.5 [&_p]:mb-0 [&_p]:text-xs [&_ul]:my-0 [&_ol]:my-0 [&_li]:text-xs">
                {desc}
              </MarkdownRenderer>
            </div>
          );
        },
      },
      {
        key: "properties",
        header: "Ominaisuudet",
        render: (value) => {
          const props = (value as Record<string, unknown>) || {};
          const entries = Object.entries(props);
          if (entries.length === 0) {
            return <span className="text-text-subtle text-xs">—</span>;
          }
          return (
            <div className="flex flex-wrap gap-1 max-w-xs">
              {entries.map(([k, v]) => (
                <span
                  key={k}
                  className="text-xs px-1.5 py-0.5 rounded bg-[var(--theme-surface-tint)] border border-[var(--theme-border-soft)] font-mono text-[var(--theme-text)]"
                >
                  {k}: {typeof v === "object" ? JSON.stringify(v) : String(v)}
                </span>
              ))}
            </div>
          );
        },
      },
      {
        key: "id",
        header: "Toiminnot",
        align: "right",
        render: (_, row) => (
          <div className="flex gap-2 justify-end">
            <Button size="compact" variant="outline" onClick={() => handleOpenEdit(row)}>
              Muokkaa
            </Button>
            <Button size="compact" variant="danger" onClick={() => setPowerToDelete(row)}>
              Poista
            </Button>
          </div>
        ),
      },
    ],
    [handleOpenEdit],
  );

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <HeadingLevelProvider>
      <Hero title="Munkin voimat" description="Voimakatalogin hallinta (Pelinjohtaja)" />

      <PageBody className="space-y-6">
        <Breadcrumb
          items={[{ label: "Hahmot", to: `${basePath}/list` }, { label: "Munkin voimat" }]}
        />

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--theme-surface-tint)] p-4 rounded border border-[var(--theme-border-soft)]">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-sm font-semibold text-text-muted whitespace-nowrap">
              Suodata piirin mukaan:
            </span>
            <div className="w-48">
              <Select
                size="compact"
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                options={FILTER_TIER_OPTIONS}
              />
            </div>
          </div>

          <Button size="compact" variant="solid" onClick={handleOpenCreate}>
            + Luo uusi voima
          </Button>
        </div>

        {/* Content */}
        {isLoading && <LoadingState message="Ladataan munkin voimia..." layout="padded" />}

        {error && (
          <NoticePanel variant="error" title="Virhe haettaessa voimia">
            {error instanceof Error ? error.message : "Tuntematon virhe tapahtui."}
          </NoticePanel>
        )}

        {!isLoading && !error && powers && powers.length === 0 && (
          <EmptyState
            title="Ei munkin voimia"
            description={
              tierFilter === "all"
                ? "Katalogissa ei ole vielä yhtään munkin voimaa."
                : `Piirillä ${tierFilter} ei ole vielä yhtään voimaa.`
            }
            action={
              <Button size="compact" variant="solid" onClick={handleOpenCreate}>
                Luo ensimmäinen voima
              </Button>
            }
          />
        )}

        {!isLoading && !error && powers && powers.length > 0 && (
          <Table<MonkPower>
            variant="compact"
            columns={columns}
            data={powers}
            caption={`Munkin voimat (${powers.length} kpl)`}
          />
        )}
      </PageBody>

      {/* Create / Edit Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        size="lg"
        title={editingPower ? "Muokkaa munkin voimaa" : "Luo uusi munkin voima"}
        description={
          editingPower
            ? `Muokkaa voiman "${editingPower.name}" tietoja.`
            : "Määritä uusi munkin voima katalogiin."
        }
        footer={
          <div className="flex gap-3 justify-end w-full">
            <Button
              type="button"
              variant="ghost-subtle"
              size="compact"
              onClick={handleCloseDialog}
              disabled={isSaving}
            >
              Peruuta
            </Button>
            <Button
              type="button"
              variant="solid"
              size="compact"
              loading={isSaving}
              onClick={handleSave}
            >
              {editingPower ? "Tallenna muutokset" : "Luo voima"}
            </Button>
          </div>
        }
      >
        <Stack gap={4} className="py-2">
          {formError && (
            <NoticePanel variant="error" title="Tarkista tiedot">
              {formError}
            </NoticePanel>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Nimi *"
                size="compact"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Esim. Tuulen askel"
                required
              />
            </div>
            <div>
              <Select
                label="Piiri (1–8) *"
                size="compact"
                value={formTier}
                onChange={(e) => setFormTier(e.target.value)}
                options={TIER_OPTIONS}
              />
            </div>
          </div>

          <TextArea
            label="Kuvaus (Markdown)"
            variant="monospace"
            size="compact"
            rows={4}
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            placeholder="Kuvaus voiman vaikutuksista ja säännöistä (tukee Markdown-muotoilua)..."
          />

          {formDescription.trim() && (
            <div className="rounded border border-[var(--theme-border-soft)] bg-[var(--theme-bg)] p-3 space-y-1">
              <Text variant="muted" className="text-xs font-semibold uppercase tracking-wider">
                Esikatselu:
              </Text>
              <div className="text-xs text-[var(--theme-text)]">
                <MarkdownRenderer className="space-y-1 [&_p]:mb-1 [&_p]:text-xs [&_ul]:my-1 [&_ol]:my-1 [&_li]:text-xs">
                  {formDescription}
                </MarkdownRenderer>
              </div>
            </div>
          )}

          {/* Properties editor */}
          <div className="border-t border-[var(--theme-border-soft)] pt-3">
            <div className="flex justify-between items-center mb-2">
              <Text variant="bold" className="text-sm">
                Ominaisuudet (avain–arvo -parit)
              </Text>
              <Button type="button" size="compact" variant="outline" onClick={handleAddPropertyRow}>
                + Lisää ominaisuus
              </Button>
            </div>

            {propertyRows.length === 0 ? (
              <p className="text-xs text-text-subtle italic">
                Ei erillisiä ominaisuuksia määritelty. Voit lisätä vapaamuotoisia avain-arvo -pareja
                (esim. kantama, kesto, loitsimisviive).
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {propertyRows.map((row) => (
                  <div key={row.id} className="flex gap-2 items-center">
                    <div className="w-1/2">
                      <Input
                        size="compact"
                        placeholder="Avain (esim. kantama)"
                        value={row.key}
                        onChange={(e) => handlePropertyChange(row.id, "key", e.target.value)}
                      />
                    </div>
                    <div className="w-1/2">
                      <Input
                        size="compact"
                        placeholder="Arvo (esim. 10 m)"
                        value={row.value}
                        onChange={(e) => handlePropertyChange(row.id, "value", e.target.value)}
                      />
                    </div>
                    <Button
                      type="button"
                      size="compact"
                      variant="ghost-subtle"
                      onClick={() => handleRemovePropertyRow(row.id)}
                      aria-label="Poista ominaisuus"
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Stack>
      </Dialog>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={Boolean(powerToDelete)}
        onOpenChange={(open) => {
          if (!open) setPowerToDelete(null);
        }}
        title="Poista munkin voima?"
        description={`Voima "${powerToDelete?.name}" (${powerToDelete?.tier}. piiri) poistetaan pysyvästi. Tätä toimintoa ei voi peruuttaa.`}
        confirmLabel="Poista"
        cancelLabel="Peruuta"
        variant="danger"
        onConfirm={handleConfirmDelete}
      />
    </HeadingLevelProvider>
  );
}

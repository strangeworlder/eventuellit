import { Button } from "@repo/ui/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/Card";
import { ImageField, type MediaItem } from "@repo/ui/components/ImageField";
import { Input } from "@repo/ui/components/Input";
import { Select } from "@repo/ui/components/Select";
import { TextArea } from "@repo/ui/components/TextArea";
import { useState } from "react";
import type { Episode } from "../api/episodes";
import { useMediaList, useUploadMedia } from "../api/media";

export function EpisodeEditForm({
  episode,
  onCancel,
  onSave,
}: {
  episode?: Episode;
  onCancel: () => void;
  onSave: (data: Partial<Episode>) => void;
}) {
  const [formData, setFormData] = useState<Partial<Episode>>(
    episode || {
      title: "",
      slug: "",
      order: 99,
      status: "planned",
      description: "",
      content: "",
      location: "",
      locationLink: "",
      image: "",
      imageAlt: "",
      mechanicalAdditions: "",
      summary: "",
      theme: "base",
    },
  );

  const { data: mediaRecords, isLoading: mediaLoading } = useMediaList();
  const uploadMutation = useUploadMedia();

  const mediaItems: MediaItem[] = (mediaRecords ?? []).map((m) => {
    const slug = m.key.replace("images/", "");
    const baseUrl = (formData.image ?? "").split("/images/")[0] || "https://pub-af583d95f0c543179e569e08a407bc5e.r2.dev";
    return {
      id: m.id,
      key: m.key,
      filename: m.filename,
      width: m.width,
      height: m.height,
      context: m.context,
      thumbnailUrl: `${baseUrl}/images/${slug}-480.jpg`,
      publicUrl: `${baseUrl}/images/${slug}-${m.width}.jpg`,
    };
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "order" ? parseInt(value) || 0 : value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{episode ? "Muokkaa Jaksoa" : "Uusi Jakso"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Otsikko"
            name="title"
            value={formData.title ?? ""}
            onChange={handleChange}
          />
          <Input
            label="Slug (URL)"
            name="slug"
            value={formData.slug ?? ""}
            onChange={handleChange}
          />
          <Input
            label="Järjestys"
            type="number"
            name="order"
            value={formData.order?.toString() ?? "99"}
            onChange={handleChange}
          />

          <Select
            label="Tila"
            name="status"
            value={formData.status ?? "planned"}
            onChange={handleChange}
            options={[
              { value: "active", label: "Aktiivinen" },
              { value: "completed", label: "Arkistoitu" },
              { value: "planned", label: "Tulossa" },
            ]}
          />
        </div>

        <Input
          label="Lyhyt Kuvaus"
          name="description"
          value={formData.description ?? ""}
          onChange={handleChange}
        />

        <TextArea
          label="Sisältö (Markdown)"
          name="content"
          variant="monospace"
          className="h-64"
          value={formData.content ?? ""}
          onChange={handleChange}
        />

        <TextArea
          label="Mekaaniset Lisäykset (Markdown)"
          name="mechanicalAdditions"
          variant="monospace"
          className="h-32"
          value={formData.mechanicalAdditions ?? ""}
          onChange={handleChange}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Sijainti"
            name="location"
            value={formData.location ?? ""}
            onChange={handleChange}
          />
          <Input
            label="Sijainti (Linkki)"
            name="locationLink"
            value={formData.locationLink ?? ""}
            onChange={handleChange}
          />
          <Select
            label="Teema (Värit)"
            name="theme"
            value={formData.theme || "base"}
            onChange={handleChange}
            options={[
              { value: "base", label: "Oletus (Base)" },
              { value: "inverted", label: "Vaalea (Inverted)" },
              { value: "primary-light", label: "Primary Light" },
              { value: "primary-dark", label: "Primary Dark" },
              { value: "secondary-light", label: "Secondary Light" },
              { value: "secondary-dark", label: "Secondary Dark" },
              { value: "accent-light", label: "Accent Light" },
              { value: "accent-dark", label: "Accent Dark" },
              { value: "royal", label: "Royal" },
              { value: "royal-dark", label: "Royal Dark" },
            ]}
          />
        </div>
        <ImageField
          label="Jakson kuva"
          value={formData.image ?? ""}
          mediaItems={mediaItems}
          mediaLoading={mediaLoading}
          uploading={uploadMutation.isPending}
          onChange={({ url, mediaId }) => {
            setFormData((prev) => ({ ...prev, image: url, mediaId }));
          }}
          onUpload={async (file) => {
            const result = await uploadMutation.mutateAsync({
              file,
              context: "episodes",
            });
            return { url: result.publicUrl, mediaId: result.id };
          }}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Kuva (Alt)"
            name="imageAlt"
            value={formData.imageAlt ?? ""}
            onChange={handleChange}
          />
        </div>

        <div className="flex gap-2 justify-end mt-4">
          <Button variant="outline" onClick={onCancel}>
            Peruuta
          </Button>
          <Button
            onClick={() => {
              const { id, gmId, createdAt, updatedAt, ...editableData } = formData as Episode;
              onSave(editableData);
            }}
          >
            Tallenna
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

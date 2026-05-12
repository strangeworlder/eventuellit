import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ImageField, type ImageFieldValue, type MediaItem } from "./ImageField";

const meta: Meta<typeof ImageField> = {
	title: "Lomake/ImageField",
	component: ImageField,
	tags: ["autodocs"],
	parameters: {
		docs: {
			description: {
				component:
					"Kuvanvalinta- ja -latauskenttä. Tarjoaa mediakirjaston olemassaolevista kuvista ja raahaa-ja-pudota -latausalueen uusille kuville.",
			},
		},
	},
	decorators: [
		(Story) => (
			<div style={{ maxWidth: 480, padding: "2rem" }}>
				<Story />
			</div>
		),
	],
};

export default meta;
type Story = StoryObj<typeof ImageField>;

const MOCK_MEDIA: MediaItem[] = [
	{
		id: 1,
		key: "images/jakso-1",
		filename: "jakso-1.png",
		width: 1024,
		height: 1024,
		context: "episodes",
		thumbnailUrl: "https://picsum.photos/seed/jakso1/480/270",
		publicUrl: "https://picsum.photos/seed/jakso1/1024/1024",
	},
	{
		id: 2,
		key: "images/jakso-2",
		filename: "jakso-2.png",
		width: 2752,
		height: 1536,
		context: "episodes",
		thumbnailUrl: "https://picsum.photos/seed/jakso2/480/270",
		publicUrl: "https://picsum.photos/seed/jakso2/1200/670",
	},
	{
		id: 3,
		key: "images/hahmonluonti",
		filename: "Hahmonluonti.png",
		width: 2752,
		height: 1536,
		context: "ruleset",
		thumbnailUrl: "https://picsum.photos/seed/hahmo/480/270",
		publicUrl: "https://picsum.photos/seed/hahmo/1200/670",
	},
	{
		id: 4,
		key: "images/verso",
		filename: "03-verso.png",
		width: 1584,
		height: 672,
		context: "world",
		thumbnailUrl: "https://picsum.photos/seed/verso/480/270",
		publicUrl: "https://picsum.photos/seed/verso/1200/510",
	},
	{
		id: 5,
		key: "images/kilpi",
		filename: "09-kilpi.png",
		width: 2752,
		height: 1536,
		context: "world",
		thumbnailUrl: "https://picsum.photos/seed/kilpi/480/270",
		publicUrl: "https://picsum.photos/seed/kilpi/1200/670",
	},
	{
		id: 6,
		key: "images/kehitys",
		filename: "Kehitys.png",
		width: 3168,
		height: 1344,
		context: "ruleset",
		thumbnailUrl: "https://picsum.photos/seed/kehitys/480/270",
		publicUrl: "https://picsum.photos/seed/kehitys/1200/510",
	},
];

function InteractiveWrapper({
	initialValue,
	...props
}: Partial<React.ComponentProps<typeof ImageField>> & {
	initialValue?: string;
}) {
	const [value, setValue] = useState(initialValue ?? "");
	return (
		<ImageField
			label="Jakson kuva"
			value={value}
			onChange={(result: ImageFieldValue) => setValue(result.url)}
			{...props}
		/>
	);
}

/** Tyhjä kenttä ilman valittua kuvaa tai mediaa. */
export const Tyhjä: Story = {
	render: () => (
		<InteractiveWrapper
			mediaItems={[]}
			onUpload={async () => {
				await new Promise((r) => setTimeout(r, 2000));
				return { url: "https://picsum.photos/seed/uusi/1200/670", mediaId: 99 };
			}}
		/>
	),
};

/** Nykyinen kuva valittuna — näyttää esikatselun. */
export const NykyinenKuva: Story = {
	render: () => (
		<InteractiveWrapper
			initialValue="https://picsum.photos/seed/jakso1/1024/1024"
			mediaItems={MOCK_MEDIA}
			onUpload={async () => {
				await new Promise((r) => setTimeout(r, 2000));
				return { url: "https://picsum.photos/seed/uusi/1200/670", mediaId: 99 };
			}}
		/>
	),
};

/** Mediakirjasto — ruudukko olemassaolevista kuvista. */
export const Mediakirjasto: Story = {
	render: () => (
		<InteractiveWrapper
			mediaItems={MOCK_MEDIA}
			onUpload={async () => {
				await new Promise((r) => setTimeout(r, 2000));
				return { url: "https://picsum.photos/seed/uusi/1200/670", mediaId: 99 };
			}}
		/>
	),
};

/** Lataus käynnissä — optimoidaan ja ladataan -tila. */
export const LatausKäynnissä: Story = {
	render: () => (
		<ImageField
			label="Jakson kuva"
			value=""
			onChange={() => {}}
			mediaItems={[]}
			uploading
		/>
	),
};

/** Virheviesti näkyvillä. */
export const Virhe: Story = {
	render: () => (
		<ImageField
			label="Jakson kuva"
			value=""
			onChange={() => {}}
			mediaItems={MOCK_MEDIA}
			error="Kuva on liian suuri (yli 15 Mt)"
		/>
	),
};

/** Mediakirjastoa ladataan. */
export const KirjastoaLadataan: Story = {
	render: () => (
		<ImageField
			label="Jakson kuva"
			value=""
			onChange={() => {}}
			mediaItems={[]}
			mediaLoading
		/>
	),
};

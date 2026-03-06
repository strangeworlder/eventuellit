import type { Meta, StoryObj } from "@storybook/react";
import { MarkdownRenderer } from "./Markdown";

const meta = {
    title: "Suunnittelujarjestelma/Komponentit/MarkdownRenderer",
    component: MarkdownRenderer,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof MarkdownRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleMarkdown = `
# Markdown-renderöijän testi

Tämä kappale näyttää, miten \`MarkdownRenderer\` muuntaa tavallisen markdownin **suunnittelujärjestelmän** komponenteiksi. Huomaa, että lihavoitu teksti käyttää oikeaa typografiapainoa ja *kursivoitu* teksti tyylittyy oikein.

## Otsikot ja osiot

Tässä on \`inline_code_snippet\`, joka mapataan GameTerm-komponentiksi. Oletuksena käytetään korostusvarianttia.

### Listat ja linkit

Katsotaan ensin järjestämätöntä listaa:
- Ensimmäinen kohta
- Toinen kohta
  - Sisäkkäiset kohdat toimivat myös, jos listakomponentin rakenne tukee niitä.
- Kolmas kohta, jossa on [linkki example.com-sivulle](https://example.com)

Ja järjestetty lista:
1. Ensimmäinen vaihe
2. Toinen vaihe
3. Kolmas vaihe

> Myös lainauslohkot ovat tuettuja, ja ne saavat tyylitellyn vasemman reunuksen.
`;

export const Default: Story = {
    args: {
        children: sampleMarkdown,
    },
};

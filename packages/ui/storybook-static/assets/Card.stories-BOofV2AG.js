import{j as e}from"./jsx-runtime-u17CrQMm.js";import{B as p}from"./Button-eGzUney-.js";import{C as a,b as n,c as t,a as s,d as u,e as C}from"./Card-D3vB3BNs.js";import"./bundle-mjs-Ce1ZTWB2.js";import"./iframe-RLsCwdXb.js";import"./preload-helper-PPVm8Dsz.js";import"./Heading-DaMVR3YC.js";import"./Icon-dO9IW84r.js";import"./dice-5-CjDluqk6.js";import"./Theme-9Lj_OJ7_.js";const T={title:"Suunnittelujarjestelma/Komponentit/Card",component:a,parameters:{layout:"centered",docs:{description:{component:'The `Card` component is a flexible container for grouping related content and actions.\r\nIt is built with a subcomponent architecture (`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, and `CardFooter`)\r\nto provide maximum flexibility while maintaining consistent spacing and styling.\r\n\nThe Card\'s `variant` prop controls which **semantic pattern** is used:\r\n- **`primary`** (default): Solid `--theme-primary` background with inverted text. Matches the "Primary Component" pattern from the design system themes.\r\n- **`secondary`**: Transparent background with `--theme-secondary` border and text. Matches the "Secondary Component" pattern.\r\n- **`accent`**: Theme background with `--theme-accent` text and a thick bottom accent border. Matches the "Accent Notifier" pattern.\r\n- **`subtle`**: Light bordered surface card for non-semantic grouping.\r\n- **`rule`**: Left-accented callout block for game mechanics.\r\n\n> **Note:** `Card` is intended for bounded areas of related content (like character stats, rule blocks, or interactive widgets).\r\n> It should **not** be used as a primary page or tab layout wrapper. For main layouts, use semantic HTML tags (`<div>`, `<main>`) with a `<HeadingLevelProvider>`.'}}},tags:["autodocs"],argTypes:{variant:{control:"select",options:["primary","secondary","accent","subtle","rule"],description:"Semantic visual style variant of the card."},theme:{control:"select",options:[void 0,"base","inverted","primary-light","primary-dark","secondary-light","secondary-dark","accent-light","accent-dark"],description:"Theme context to apply to the card and all nested subcomponents."},iconName:{control:"select",options:[void 0,"sparkles","dice5","book","chevron-left","chevron-right"],description:"Optional icon to render in the CardHeader."},iconVariant:{control:"select",options:["primary","secondary","accent"],description:"The color variant for the icon container."}}},i={args:{className:"w-[350px]",variant:"primary"},render:r=>e.jsxs(a,{...r,children:[e.jsxs(n,{children:[e.jsx(t,{children:"Character Info"}),e.jsx(u,{children:"Stats and conditions"})]}),e.jsxs(s,{children:[e.jsxs("div",{className:"flex justify-between items-center py-2 border-b border-current/10",children:[e.jsx("span",{className:"font-bold",children:"Strength"}),e.jsx("span",{children:"16 (+3)"})]}),e.jsxs("div",{className:"flex justify-between items-center py-2 border-b border-current/10",children:[e.jsx("span",{className:"font-bold",children:"Dexterity"}),e.jsx("span",{children:"14 (+2)"})]}),e.jsxs("div",{className:"flex justify-between items-center py-2",children:[e.jsx("span",{className:"font-bold",children:"Constitution"}),e.jsx("span",{children:"15 (+2)"})]})]}),e.jsxs(C,{className:"flex justify-between",children:[e.jsx(p,{variant:"secondary",children:"Cancel"}),e.jsx(p,{variant:"primary",children:"Save Changes"})]})]})},d={render:()=>e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl",children:["primary","secondary","accent","subtle","rule"].map(r=>e.jsxs(a,{variant:r,children:[e.jsx(n,{children:e.jsxs(t,{className:"capitalize",children:[r," Variant"]})}),e.jsxs(s,{children:["This card uses the ",e.jsx("strong",{children:r})," variant styling."]})]},r))})},o={render:()=>e.jsxs("div",{className:"flex flex-col gap-6 w-[350px]",children:[e.jsxs(a,{variant:"subtle",children:[e.jsx(n,{children:e.jsx(t,{children:"Default Padding"})}),e.jsx(s,{variant:"default",children:e.jsx("div",{className:"bg-[var(--theme-primary)]/10 h-16 w-full rounded flex items-center justify-center",children:"Default"})})]}),e.jsxs(a,{variant:"subtle",children:[e.jsx(n,{children:e.jsx(t,{children:"Dense Padding"})}),e.jsx(s,{variant:"dense",children:e.jsx("div",{className:"bg-[var(--theme-primary)]/10 h-16 w-full rounded flex items-center justify-center",children:"Dense"})})]})]})},c={render:()=>e.jsxs(a,{variant:"rule",className:"max-w-xl",children:[e.jsx(n,{children:e.jsx(t,{children:"Critical Hits"})}),e.jsxs(s,{variant:"rule",children:["When you score a critical hit, you get to roll extra dice for the attack's damage against the target. Roll all of the attack's damage dice twice and add them together. Then add any relevant modifiers as normal.",e.jsx("br",{}),e.jsx("br",{}),"To score a critical hit, you must roll a natural 20 on your attack roll."]})]})},l={render:()=>e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl",children:[e.jsxs(a,{iconName:"dice5",iconVariant:"primary",children:[e.jsx(n,{children:e.jsx(t,{children:"Generator"})}),e.jsx(s,{children:"Primary themed icon (Dice)"})]}),e.jsxs(a,{iconName:"book",iconVariant:"secondary",children:[e.jsx(n,{children:e.jsx(t,{children:"Ruleset"})}),e.jsx(s,{children:"Secondary themed icon (Book)"})]}),e.jsxs(a,{iconName:"sparkles",iconVariant:"accent",children:[e.jsx(n,{children:e.jsx(t,{children:"New Features"})}),e.jsx(s,{children:"Accent themed icon (Sparkles)"})]})]})},m={parameters:{layout:"padded"},render:()=>e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full",children:["base","inverted","primary-light","primary-dark","secondary-light","secondary-dark","accent-light","accent-dark"].map((r,h)=>e.jsxs(a,{theme:r,iconName:h%2===0?"dice5":"book",iconVariant:h%3===0?"primary":h%3===1?"secondary":"accent",children:[e.jsxs(n,{children:[e.jsx(t,{children:r}),e.jsx(u,{children:"Theme Example"})]}),e.jsx(s,{children:e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsx("span",{children:"Progress"}),e.jsx("span",{className:"font-bold",children:"80%"})]}),e.jsx("div",{className:"h-2 w-full bg-current/20 rounded-full overflow-hidden",children:e.jsx("div",{className:"h-full bg-[var(--theme-bg)]",style:{width:"80%"}})})]})}),e.jsx(C,{className:"flex justify-end border-t border-current/10 pt-4 mt-2",children:e.jsx(p,{children:"Action"})})]},r))})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    className: "w-[350px]",
    variant: "primary"
  },
  render: args => <Card {...args}>\r
      <CardHeader>\r
        <CardTitle>Character Info</CardTitle>\r
        <CardDescription>Stats and conditions</CardDescription>\r
      </CardHeader>\r
      <CardContent>\r
        <div className="flex justify-between items-center py-2 border-b border-current/10">\r
          <span className="font-bold">Strength</span>\r
          <span>16 (+3)</span>\r
        </div>\r
        <div className="flex justify-between items-center py-2 border-b border-current/10">\r
          <span className="font-bold">Dexterity</span>\r
          <span>14 (+2)</span>\r
        </div>\r
        <div className="flex justify-between items-center py-2">\r
          <span className="font-bold">Constitution</span>\r
          <span>15 (+2)</span>\r
        </div>\r
      </CardContent>\r
      <CardFooter className="flex justify-between">\r
        <Button variant="secondary">Cancel</Button>\r
        <Button variant="primary">Save Changes</Button>\r
      </CardFooter>\r
    </Card>
}`,...i.parameters?.docs?.source},description:{story:'The default Card uses the **primary** variant: a solid `--theme-primary` background\r\nwith inverted text, matching the "Primary Component" pattern from the design system themes.',...i.parameters?.docs?.description}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">\r
      {(["primary", "secondary", "accent", "subtle", "rule"] as const).map(variant => <Card key={variant} variant={variant}>\r
          <CardHeader>\r
            <CardTitle className="capitalize">{variant} Variant</CardTitle>\r
          </CardHeader>\r
          <CardContent>\r
            This card uses the <strong>{variant}</strong> variant styling.\r
          </CardContent>\r
        </Card>)}\r
    </div>
}`,...d.parameters?.docs?.source},description:{story:`All five semantic visual variants. Each matches a distinct design system pattern:\r
- **Primary**: Solid fill, inverted text — for primary actions and content.\r
- **Secondary**: Outlined, transparent — for secondary/alternative interactions.\r
- **Accent**: Bottom accent border — for highlights, notifications, active states.\r
- **Subtle**: Soft bordered surface — for non-semantic grouping.\r
- **Rule**: Left-accented callout — for game mechanics and rules.`,...d.parameters?.docs?.description}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-6 w-[350px]">\r
      <Card variant="subtle">\r
        <CardHeader>\r
          <CardTitle>Default Padding</CardTitle>\r
        </CardHeader>\r
        <CardContent variant="default">\r
          <div className="bg-[var(--theme-primary)]/10 h-16 w-full rounded flex items-center justify-center">\r
            Default\r
          </div>\r
        </CardContent>\r
      </Card>\r
\r
      <Card variant="subtle">\r
        <CardHeader>\r
          <CardTitle>Dense Padding</CardTitle>\r
        </CardHeader>\r
        <CardContent variant="dense">\r
          <div className="bg-[var(--theme-primary)]/10 h-16 w-full rounded flex items-center justify-center">\r
            Dense\r
          </div>\r
        </CardContent>\r
      </Card>\r
    </div>
}`,...o.parameters?.docs?.source},description:{story:"Demonstrates the different density options available for `CardContent`.",...o.parameters?.docs?.description}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <Card variant="rule" className="max-w-xl">\r
      <CardHeader>\r
        <CardTitle>Critical Hits</CardTitle>\r
      </CardHeader>\r
      <CardContent variant="rule">\r
        When you score a critical hit, you get to roll extra dice for the attack's damage against\r
        the target. Roll all of the attack's damage dice twice and add them together. Then add any\r
        relevant modifiers as normal.\r
        <br />\r
        <br />\r
        To score a critical hit, you must roll a natural 20 on your attack roll.\r
      </CardContent>\r
    </Card>
}`,...c.parameters?.docs?.source},description:{story:"The 'rule' variant is specifically tailored for presenting game mechanics or important callouts.\r\nBy using the 'rule' variant on `Card` and `CardContent`, we get a highly stylized block.",...c.parameters?.docs?.description}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">\r
      <Card iconName="dice5" iconVariant="primary">\r
        <CardHeader>\r
          <CardTitle>Generator</CardTitle>\r
        </CardHeader>\r
        <CardContent>Primary themed icon (Dice)</CardContent>\r
      </Card>\r
\r
      <Card iconName="book" iconVariant="secondary">\r
        <CardHeader>\r
          <CardTitle>Ruleset</CardTitle>\r
        </CardHeader>\r
        <CardContent>Secondary themed icon (Book)</CardContent>\r
      </Card>\r
\r
      <Card iconName="sparkles" iconVariant="accent">\r
        <CardHeader>\r
          <CardTitle>New Features</CardTitle>\r
        </CardHeader>\r
        <CardContent>Accent themed icon (Sparkles)</CardContent>\r
      </Card>\r
    </div>
}`,...l.parameters?.docs?.source},description:{story:"Demonstrates the built-in icon support. Icons automatically scale on hover\r\nand adapt their colors based on the `iconVariant` and current theme.",...l.parameters?.docs?.description}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  parameters: {
    layout: "padded"
  },
  render: () => <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">\r
      {(["base", "inverted", "primary-light", "primary-dark", "secondary-light", "secondary-dark", "accent-light", "accent-dark"] as const).map((theme, idx) => <Card key={theme} theme={theme} iconName={idx % 2 === 0 ? "dice5" : "book"} iconVariant={idx % 3 === 0 ? "primary" : idx % 3 === 1 ? "secondary" : "accent"}>\r
          <CardHeader>\r
            <CardTitle>{theme}</CardTitle>\r
            <CardDescription>Theme Example</CardDescription>\r
          </CardHeader>\r
          <CardContent>\r
            <div className="space-y-2">\r
              <div className="flex justify-between text-sm">\r
                <span>Progress</span>\r
                <span className="font-bold">80%</span>\r
              </div>\r
              <div className="h-2 w-full bg-current/20 rounded-full overflow-hidden">\r
                <div className="h-full bg-[var(--theme-bg)]" style={{
              width: "80%"
            }} />\r
              </div>\r
            </div>\r
          </CardContent>\r
          <CardFooter className="flex justify-end border-t border-current/10 pt-4 mt-2">\r
            <Button>Action</Button>\r
          </CardFooter>\r
        </Card>)}\r
    </div>
}`,...m.parameters?.docs?.source},description:{story:"Cards can be themed via `data-theme` using the `theme` prop.\r\nThis changes the CSS variables used within the Card, automatically recoloring text, borders, backgrounds, and shadows.\r\nNotice how each Card adapts its primary variant to the theme's primary color.",...m.parameters?.docs?.description}}};const S=["Default","Variants","ContentDensity","RuleBlock","Icons","Themes"];export{o as ContentDensity,i as Default,l as Icons,c as RuleBlock,m as Themes,d as Variants,S as __namedExportsOrder,T as default};

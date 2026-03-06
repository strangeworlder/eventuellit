import{j as e}from"./jsx-runtime-u17CrQMm.js";import{B as a}from"./Badge-BRBRCTmV.js";import"./bundle-mjs-Ce1ZTWB2.js";import"./iframe-C2RddfHL.js";import"./preload-helper-PPVm8Dsz.js";import"./Icon-B5LAENwG.js";import"./dice-5-BzsbHJi_.js";const v={title:"Suunnittelujarjestelma/Komponentit/Badge",component:a,tags:["autodocs"],argTypes:{variant:{control:"select",options:["primary","secondary","accent","accent-solid","outline"]},theme:{control:"select",options:["base","inverted","primary-light","primary-dark","secondary-light","secondary-dark","accent-light","accent-dark"]}}},n={args:{variant:"primary",children:"Tervetuloa seikkailuun",icon:"sparkles"}},s={args:{variant:"secondary",children:"Sääntökirja",icon:"book"}},t={args:{variant:"accent",children:"Hahmopaja",icon:"dice5"}},i={args:{variant:"outline",children:"Päivitys saatavilla"}},c={args:{variant:"accent-solid",children:"Aktiivinen"}},o={render:r=>e.jsxs("div",{className:"flex flex-col gap-4 p-4",children:[e.jsxs("div",{className:"flex gap-2","data-theme":"base",children:[e.jsx(a,{...r,theme:"base",children:"Perusteema"}),e.jsx(a,{...r,theme:"inverted",children:"Käänteinen teema"})]}),e.jsxs("div",{className:"flex gap-2","data-theme":"primary-dark",children:[e.jsx(a,{...r,theme:"primary-dark",children:"Tumma pääteema"}),e.jsx(a,{...r,theme:"secondary-dark",children:"Tumma sivuteema"})]})]}),args:{variant:"primary",icon:"sparkles"}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "primary",
    children: "Tervetuloa seikkailuun",
    icon: "sparkles"
  }
}`,...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "secondary",
    children: "Sääntökirja",
    icon: "book"
  }
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "accent",
    children: "Hahmopaja",
    icon: "dice5"
  }
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "outline",
    children: "Päivitys saatavilla"
  }
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "accent-solid",
    children: "Aktiivinen"
  }
}`,...c.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: args => <div className="flex flex-col gap-4 p-4">\r
            <div className="flex gap-2" data-theme="base">\r
                <Badge {...args} theme="base">Perusteema</Badge>\r
                <Badge {...args} theme="inverted">Käänteinen teema</Badge>\r
            </div>\r
            <div className="flex gap-2" data-theme="primary-dark">\r
                <Badge {...args} theme="primary-dark">Tumma pääteema</Badge>\r
                <Badge {...args} theme="secondary-dark">Tumma sivuteema</Badge>\r
            </div>\r
        </div>,
  args: {
    variant: "primary",
    icon: "sparkles"
  }
}`,...o.parameters?.docs?.source}}};const y=["Primary","Secondary","Accent","Outline","AccentSolid","WithDifferentThemes"];export{t as Accent,c as AccentSolid,i as Outline,n as Primary,s as Secondary,o as WithDifferentThemes,y as __namedExportsOrder,v as default};

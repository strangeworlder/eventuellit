import{j as a}from"./jsx-runtime-u17CrQMm.js";import{L as n}from"./Link-Ee04Ky9W.js";import{T as s}from"./Text-DmkKOsz0.js";import{B as i}from"./chunk-LFPYN7LY-CCjzDIv4.js";import"./iframe-C2RddfHL.js";import"./preload-helper-PPVm8Dsz.js";import"./Heading-C7jQQPe8.js";import"./bundle-mjs-Ce1ZTWB2.js";const u={title:"Suunnittelujarjestelma/Komponentit/Link",component:n,parameters:{layout:"padded"},tags:["autodocs"],decorators:[o=>a.jsx(i,{children:a.jsx(o,{})})]},e={args:{href:"#",children:"Click here for more information"}},r={args:{href:"https://example.com",external:!0,children:"External Link"}},t={render:()=>a.jsxs(s,{children:["This is a paragraph with an ",a.jsx(n,{href:"#",children:"inline link"})," inside of it to demonstrate text flow."]})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    href: "#",
    children: "Click here for more information"
  }
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    href: "https://example.com",
    external: true,
    children: "External Link"
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <Text>\r
            This is a paragraph with an <Link href="#">inline link</Link> inside of it to demonstrate text flow.\r
        </Text>
}`,...t.parameters?.docs?.source}}};const g=["Default","External","InlineText"];export{e as Default,r as External,t as InlineText,g as __namedExportsOrder,u as default};

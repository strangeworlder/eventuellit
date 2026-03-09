import{j as e}from"./jsx-runtime-u17CrQMm.js";import{R as m}from"./iframe-RLsCwdXb.js";import{c as p}from"./Button-eGzUney-.js";import"./preload-helper-PPVm8Dsz.js";import"./bundle-mjs-Ce1ZTWB2.js";const s=m.forwardRef(({className:l,label:o,error:n,theme:i,...c},d)=>e.jsxs("div",{className:"flex flex-col w-full gap-2 mt-2","data-theme":i,children:[o&&e.jsx("label",{className:"text-sm font-black uppercase tracking-widest text-[var(--theme-secondary)]",children:o}),e.jsx("input",{ref:d,className:p("flex h-12 w-full rounded-sm border-2 border-[var(--theme-secondary)]/40 bg-[var(--theme-bg)] px-4 py-2 text-lg font-bold text-[var(--theme-text)] shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50",n&&"border-[var(--theme-accent)] focus-visible:ring-[var(--theme-accent)]",l),...c}),n&&e.jsx("span",{className:"text-sm font-bold uppercase tracking-widest text-[var(--theme-accent)]",children:n})]}));s.displayName="Input";s.__docgenInfo={description:"",methods:[],displayName:"Input",props:{label:{required:!1,tsType:{name:"string"},description:""},error:{required:!1,tsType:{name:"string"},description:""},theme:{required:!1,tsType:{name:"union",raw:`| "base"\r
| "inverted"\r
| "primary-light"\r
| "primary-dark"\r
| "secondary-light"\r
| "secondary-dark"\r
| "accent-light"\r
| "accent-dark"`,elements:[{name:"literal",value:'"base"'},{name:"literal",value:'"inverted"'},{name:"literal",value:'"primary-light"'},{name:"literal",value:'"primary-dark"'},{name:"literal",value:'"secondary-light"'},{name:"literal",value:'"secondary-dark"'},{name:"literal",value:'"accent-light"'},{name:"literal",value:'"accent-dark"'}]},description:""}}};const f={title:"Suunnittelujarjestelma/Komponentit/Input",component:s,parameters:{layout:"centered"},tags:["autodocs"]},r={args:{placeholder:"Kirjoita tähän..."}},a={args:{label:"Hahmon Nimi",placeholder:"Esim. Kaelen"}},t={args:{label:"Koodi",placeholder:"Syötä koodi",error:"Koodi on virheellinen."}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: "Kirjoita tähän..."
  }
}`,...r.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Hahmon Nimi",
    placeholder: "Esim. Kaelen"
  }
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Koodi",
    placeholder: "Syötä koodi",
    error: "Koodi on virheellinen."
  }
}`,...t.parameters?.docs?.source}}};const y=["Default","WithLabel","WithError"];export{r as Default,t as WithError,a as WithLabel,y as __namedExportsOrder,f as default};

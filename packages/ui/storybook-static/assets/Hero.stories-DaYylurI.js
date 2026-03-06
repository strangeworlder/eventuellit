import{j as r}from"./jsx-runtime-u17CrQMm.js";import{R as p}from"./iframe-C2RddfHL.js";import{a as m,c as l}from"./Heading-C7jQQPe8.js";import"./preload-helper-PPVm8Dsz.js";import"./bundle-mjs-Ce1ZTWB2.js";const o=p.forwardRef(({title:s,description:a,children:i,className:n,...c},d)=>r.jsxs("div",{ref:d,className:l("border-b-2 border-[var(--theme-secondary)] pb-4 mb-6 mt-6 bg-[var(--theme-bg)] text-[var(--theme-text)] px-4",n),...c,children:[r.jsx(m,{children:s}),a&&r.jsx("p",{className:"text-lg font-bold uppercase tracking-wider text-[var(--theme-text)]/80 mt-2",children:a}),i]}));o.displayName="Hero";o.__docgenInfo={description:"",methods:[],displayName:"Hero",props:{title:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},description:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}},composes:["Omit"]};const R={title:"Suunnittelujarjestelma/Komponentit/Hero",component:o,parameters:{layout:"padded"},argTypes:{title:{control:"text"},description:{control:"text"}}},e={args:{title:"Page Title",description:"Optional description for the page goes here.",children:r.jsx("p",{className:"text-text/80",children:"Here is some additional content that would go inside or below the Hero header."})}},t={args:{title:"Settings"}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Page Title",
    description: "Optional description for the page goes here.",
    children: <p className="text-text/80">Here is some additional content that would go inside or below the Hero header.</p>
  }
}`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Settings"
  }
}`,...t.parameters?.docs?.source}}};const b=["Default","WithoutDescription"];export{e as Default,t as WithoutDescription,b as __namedExportsOrder,R as default};

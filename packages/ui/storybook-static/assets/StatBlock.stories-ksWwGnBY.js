import{j as e}from"./jsx-runtime-u17CrQMm.js";import{R as m}from"./index-mTzoL55G.js";import{c as p}from"./Button-SHBV2pqv.js";const a=m.forwardRef(({className:n,label:c,value:i,maxValue:r,icon:o,...l},d)=>e.jsxs("div",{ref:d,className:p("flex items-center justify-between p-3 rounded-md border border-slate-700 bg-slate-900",n),...l,children:[e.jsxs("div",{className:"flex items-center gap-3",children:[o&&e.jsx("div",{className:"text-orange-500",children:o}),e.jsx("span",{className:"font-medium text-slate-200 uppercase tracking-wider text-sm",children:c})]}),e.jsxs("div",{className:"flex items-baseline gap-1",children:[e.jsx("span",{className:"text-2xl font-bold text-white leading-none",children:i}),r!==void 0&&e.jsxs("span",{className:"text-sm font-medium text-slate-500 leading-none",children:["/ ",r]})]})]}));a.displayName="StatBlock";a.__docgenInfo={description:"",methods:[],displayName:"StatBlock",props:{label:{required:!0,tsType:{name:"string"},description:""},value:{required:!0,tsType:{name:"number"},description:""},maxValue:{required:!1,tsType:{name:"number"},description:""},icon:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};const f={title:"TTRPG/StatBlock",component:a,parameters:{layout:"centered"},tags:["autodocs"]},u=()=>e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"20",height:"20",viewBox:"0 0 24 24",fill:"currentColor",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"})}),s={args:{label:"Kesto",value:4,maxValue:5,icon:e.jsx(u,{})}},t={args:{label:"Sisu",value:12}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Kesto",
    value: 4,
    maxValue: 5,
    icon: <HeartIcon />
  }
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Sisu",
    value: 12
  }
}`,...t.parameters?.docs?.source}}};const b=["Health","AbilityScore"];export{t as AbilityScore,s as Health,b as __namedExportsOrder,f as default};

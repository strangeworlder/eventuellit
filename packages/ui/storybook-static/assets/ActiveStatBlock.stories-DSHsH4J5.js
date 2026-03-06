import{j as e}from"./jsx-runtime-u17CrQMm.js";import{R as B,r as q}from"./iframe-C2RddfHL.js";import{c as x,B as f}from"./Button-DX2V7SKz.js";import{I as i}from"./Icon-B5LAENwG.js";import{u as A,T as z,p as P}from"./Theme-CJEPQAsu.js";import{H as K,a as C}from"./Heading-C7jQQPe8.js";import"./preload-helper-PPVm8Dsz.js";import"./bundle-mjs-Ce1ZTWB2.js";import"./dice-5-BzsbHJi_.js";const v=B.forwardRef(({className:a,label:r,value:t,maxValue:g,icon:l,onIncrement:k,onDecrement:j,minAllowed:T=0,maxAllowed:S=1/0,variant:n="secondary",theme:y,...V},I)=>{const w=A(),h=y??w,b=n==="primary"?P[h]:y,N=b??h;return e.jsx(z.Provider,{value:N,children:e.jsxs("div",{ref:I,"data-theme":b,"data-variant":n,className:x("flex flex-col p-6 rounded-xl shadow-sm gap-3 transition-all duration-200 relative overflow-hidden",{"bg-[var(--theme-bg)] text-[var(--theme-text)]":n==="primary","bg-transparent text-[var(--theme-secondary)] border border-[var(--theme-secondary)]":n==="secondary","bg-[var(--theme-bg)] text-[var(--theme-accent)] border-b-4 border-b-[var(--theme-accent)] border-t-0 border-l-0 border-r-0":n==="accent"},a),...V,children:[e.jsxs(K,{children:[e.jsxs("div",{className:x("flex items-center gap-3 pb-3 border-b border-current/20",{"border-b-[var(--theme-secondary)]":n==="secondary","border-b-[var(--theme-accent)]":n==="accent"}),children:[l&&e.jsx(i,{name:l,size:24,className:"shrink-0"}),e.jsx(C,{children:r})]}),e.jsxs("div",{className:"flex items-center justify-between mt-1",children:[e.jsx(f,{variant:"secondary",size:"icon",onClick:j,disabled:t<=T,"aria-label":`Vähennä ${r}`,children:e.jsx(i,{name:"minus",size:16})}),e.jsxs("div",{className:"flex items-baseline gap-1 mx-4",children:[e.jsx("span",{className:"text-4xl text-[var(--theme-text)] font-heading font-black leading-none",children:t}),g!==void 0&&e.jsxs("span",{className:"text-lg font-bold leading-none",children:["/ ",g]})]}),e.jsx(f,{variant:"secondary",size:"icon",onClick:k,disabled:t>=(g??S),"aria-label":`Lisää ${r}`,children:e.jsx(i,{name:"plus",size:16})})]})]}),l&&e.jsx(i,{name:l,size:128,className:"-top-6 -left-6 absolute opacity-5"})]})})});v.displayName="ActiveStatBlock";v.__docgenInfo={description:"",methods:[],displayName:"ActiveStatBlock",props:{label:{required:!0,tsType:{name:"string"},description:""},value:{required:!0,tsType:{name:"number"},description:""},maxValue:{required:!1,tsType:{name:"number"},description:""},icon:{required:!1,tsType:{name:"union",raw:"keyof typeof icons",elements:[{name:"literal",value:"sparkles"},{name:"literal",value:"dice5"},{name:"literal",value:"book"},{name:"literal",value:'"chevron-left"'},{name:"literal",value:'"chevron-right"'},{name:"literal",value:"minus"},{name:"literal",value:"plus"},{name:"literal",value:"zap"},{name:"literal",value:"shield"}]},description:""},onIncrement:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},onDecrement:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},minAllowed:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"0",computed:!1}},maxAllowed:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"Infinity",computed:!0}},variant:{required:!1,tsType:{name:"union",raw:'"primary" | "secondary" | "accent"',elements:[{name:"literal",value:'"primary"'},{name:"literal",value:'"secondary"'},{name:"literal",value:'"accent"'}]},description:"",defaultValue:{value:'"secondary"',computed:!1}},theme:{required:!1,tsType:{name:"union",raw:`| "base"\r
| "inverted"\r
| "primary-light"\r
| "primary-dark"\r
| "secondary-light"\r
| "secondary-dark"\r
| "accent-light"\r
| "accent-dark"`,elements:[{name:"literal",value:'"base"'},{name:"literal",value:'"inverted"'},{name:"literal",value:'"primary-light"'},{name:"literal",value:'"primary-dark"'},{name:"literal",value:'"secondary-light"'},{name:"literal",value:'"secondary-dark"'},{name:"literal",value:'"accent-light"'},{name:"literal",value:'"accent-dark"'}]},description:""}}};const O={title:"Suunnittelujarjestelma/Komponentit/ActiveStatBlock",component:v,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{variant:{control:"select",options:["primary","secondary","accent"]},theme:{control:"select",options:["base","inverted","primary-light","primary-dark","secondary-light","secondary-dark","accent-light","accent-dark"]},value:{control:"number"},maxValue:{control:"number"},minAllowed:{control:"number"},maxAllowed:{control:"number"}}},s=a=>{const[r,t]=q.useState(a.value||0);return e.jsx(v,{...a,value:r,onIncrement:()=>t(r+1),onDecrement:()=>t(r-1)})},o={render:a=>e.jsx(s,{...a}),args:{label:"Terveys",value:10,maxValue:20,icon:"zap"}},c={render:a=>e.jsx(s,{...a}),args:{label:"Panssari",value:5,icon:"book"}},m={render:a=>e.jsx(s,{...a}),args:{label:"Kestävyys",value:100,maxValue:100}},d={render:a=>e.jsx(s,{...a}),args:{label:"Taikapisteet",value:15,maxValue:50,variant:"accent",icon:"sparkles"}},u={render:a=>e.jsx(s,{...a}),args:{label:"Kesto",value:8,maxValue:12,variant:"primary",icon:"shield"}},p={render:()=>{const a=["base","inverted","primary-light","primary-dark","secondary-light","secondary-dark","accent-light","accent-dark"];return e.jsx("div",{className:"grid grid-cols-2 lg:grid-cols-4 gap-4",children:a.map(r=>e.jsx(s,{theme:r,label:r,value:10,maxValue:20,icon:"sparkles"},r))})},args:{label:"Teema",value:10}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: args => <InteractiveStatBlock {...args} />,
  args: {
    label: "Terveys",
    value: 10,
    maxValue: 20,
    icon: "zap"
  }
}`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: args => <InteractiveStatBlock {...args} />,
  args: {
    label: "Panssari",
    value: 5,
    icon: "book"
  }
}`,...c.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <InteractiveStatBlock {...args} />,
  args: {
    label: "Kestävyys",
    value: 100,
    maxValue: 100
  }
}`,...m.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <InteractiveStatBlock {...args} />,
  args: {
    label: "Taikapisteet",
    value: 15,
    maxValue: 50,
    variant: "accent",
    icon: "sparkles"
  }
}`,...d.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => <InteractiveStatBlock {...args} />,
  args: {
    label: "Kesto",
    value: 8,
    maxValue: 12,
    variant: "primary",
    icon: "shield"
  }
}`,...u.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => {
    const themes = ["base", "inverted", "primary-light", "primary-dark", "secondary-light", "secondary-dark", "accent-light", "accent-dark"];
    return <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">\r
        {themes.map(theme => <InteractiveStatBlock key={theme} theme={theme as any} label={theme} value={10} maxValue={20} icon="sparkles" />)}\r
      </div>;
  },
  args: {
    label: "Teema",
    value: 10
  }
}`,...p.parameters?.docs?.source}}};const F=["Default","NoMaxValue","WithoutIcon","Accent","Primary","ThemeShowcase"];export{d as Accent,o as Default,c as NoMaxValue,u as Primary,p as ThemeShowcase,m as WithoutIcon,F as __namedExportsOrder,O as default};

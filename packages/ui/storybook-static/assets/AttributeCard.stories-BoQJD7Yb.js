import{j as e}from"./jsx-runtime-u17CrQMm.js";import{R,r as f}from"./iframe-RLsCwdXb.js";import{B as h,c as j}from"./Button-eGzUney-.js";import{C as N,a as S}from"./Card-D3vB3BNs.js";import{S as T}from"./StatBlock-DepS-IkV.js";import{I as x}from"./Icon-dO9IW84r.js";import{D as C}from"./DiceIcon-BoLGTUrC.js";import"./preload-helper-PPVm8Dsz.js";import"./bundle-mjs-Ce1ZTWB2.js";import"./Heading-DaMVR3YC.js";import"./Theme-9Lj_OJ7_.js";import"./dice-5-CjDluqk6.js";const l=[4,6,8,10,12,20];function g(t){const r=[];let n=t;for(let a=0;a<l.length;a++){const c=n%3;for(let o=0;o<c;o++)r.push(l[a]);if(n=Math.floor(n/3),n===0)break}for(;n>0;)r.push(l[l.length-1]),n--;return r.sort((a,c)=>c-a)}function A(t){return g(t).reduce((n,a)=>n+a/2,0)}const v=R.forwardRef(({className:t,variant:r="primary",label:n,score:a,subAttributes:c,...o},i)=>e.jsx(N,{ref:i,variant:r,className:j("transition-all duration-300",t),...o,children:e.jsxs(S,{variant:"dense",className:"gap-5",children:[e.jsx(T,{label:n,value:a}),e.jsx("div",{className:"flex flex-col gap-3 px-1",children:c.map(s=>e.jsxs("div",{className:"flex justify-between items-center group/row py-1 border-b border-current/5 last:border-0 pb-3 last:pb-0",children:[e.jsx("div",{className:"flex flex-col gap-1.5 flex-1",children:e.jsxs("div",{className:"flex flex-wrap items-center gap-3",children:[e.jsx("span",{className:"font-bold text-[var(--theme-text)] text-sm tablet:text-base shrink-0",children:s.label}),e.jsxs("div",{className:"flex flex-wrap gap-1.5 min-h-[1.5rem] items-center",children:[g(s.value).map((y,k)=>e.jsx(C,{faces:y,size:"sm",active:r==="primary"},`${s.name}-${y}-${k}`)),s.value===0&&e.jsx("span",{className:"text-[10px] uppercase font-bold tracking-tighter text-[var(--theme-text)] opacity-20 italic",children:"Ei lisänoppia"})]})]})}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(h,{variant:"secondary",size:"icon",onClick:s.onRemove,disabled:!s.canRemove,"aria-label":`Poista noppa kohteesta ${s.label}`,children:e.jsx(x,{name:"minus",size:14})}),e.jsx(h,{variant:"secondary",size:"icon",onClick:s.onAdd,disabled:!s.canAdd,"aria-label":`Lisää noppa kohteeseen ${s.label}`,children:e.jsx(x,{name:"plus",size:14})})]})]},s.name))})]})}));v.displayName="AttributeCard";v.__docgenInfo={description:`A composite card component used in character generation.\r
It displays a main stat (StatBlock) and a list of sub-attributes that \r
can have dice assigned or removed.`,methods:[],displayName:"AttributeCard",props:{variant:{required:!1,tsType:{name:"union",raw:'"primary" | "secondary" | "accent"',elements:[{name:"literal",value:'"primary"'},{name:"literal",value:'"secondary"'},{name:"literal",value:'"accent"'}]},description:"The visual style variant. \r\n- `primary` (default): High-contrast swapped theme (mapped via primaryThemeMap).\r\n- `secondary`: Transparent background with secondary-colored border and text.\r\n- `accent`: Theme background with accent-colored text and a thick bottom accent border.",defaultValue:{value:'"primary"',computed:!1}},label:{required:!0,tsType:{name:"string"},description:'The main name of the attribute (e.g., "Keho", "Mieli")'},score:{required:!0,tsType:{name:"number"},description:"The summary score for this attribute"},subAttributes:{required:!0,tsType:{name:"Array",elements:[{name:"AttributeCardSubAttribute"}],raw:"AttributeCardSubAttribute[]"},description:"List of sub-attributes that can be modified"}}};const H={title:"Suunnittelujarjestelma/Komponentit/AttributeCard",component:v,tags:["autodocs"],argTypes:{variant:{control:"select",options:["primary","secondary","accent"]}}},w=t=>{const[r,n]=f.useState(1),[a,c]=f.useState(0),o=15,i=r+a,s=[{name:"fysiikka",label:"Fysiikka",value:r,onAdd:()=>i<o&&n(r+1),onRemove:()=>r>0&&n(r-1),canAdd:i<o,canRemove:r>0},{name:"nopeus",label:"Nopeus",value:a,onAdd:()=>i<o&&c(a+1),onRemove:()=>a>0&&c(a-1),canAdd:i<o,canRemove:a>0}];return e.jsx(v,{...t,subAttributes:s,score:8+A(r)+A(a)})},m={args:{label:"Keho",score:10,subAttributes:[{name:"fysiikka",label:"Fysiikka",value:1,canRemove:!0,canAdd:!0},{name:"nopeus",label:"Nopeus",value:0,canRemove:!1,canAdd:!0}]}},u={args:{variant:"primary",label:"Keho",score:10,subAttributes:[{name:"fysiikka",label:"Fysiikka",value:1,canRemove:!0,canAdd:!0},{name:"nopeus",label:"Nopeus",value:0,canRemove:!1,canAdd:!0}]}},d={args:{variant:"secondary",label:"Mieli",score:8,subAttributes:[{name:"ymmarrys",label:"Ymmärrys",value:0,canRemove:!1,canAdd:!0},{name:"persoona",label:"Persoona",value:0,canRemove:!1,canAdd:!0}]}},p={args:{variant:"accent",label:"Terä",score:12,subAttributes:[{name:"nakemys",label:"Näkemys",value:2,canRemove:!0,canAdd:!1},{name:"napparyys",label:"Näppäryys",value:0,canRemove:!1,canAdd:!0}]}},b={render:t=>e.jsx(w,{...t}),args:{label:"Keho"}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Keho",
    score: 10,
    subAttributes: [{
      name: "fysiikka",
      label: "Fysiikka",
      value: 1,
      canRemove: true,
      canAdd: true
    }, {
      name: "nopeus",
      label: "Nopeus",
      value: 0,
      canRemove: false,
      canAdd: true
    }]
  }
}`,...m.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "primary",
    label: "Keho",
    score: 10,
    subAttributes: [{
      name: "fysiikka",
      label: "Fysiikka",
      value: 1,
      canRemove: true,
      canAdd: true
    }, {
      name: "nopeus",
      label: "Nopeus",
      value: 0,
      canRemove: false,
      canAdd: true
    }]
  }
}`,...u.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "secondary",
    label: "Mieli",
    score: 8,
    subAttributes: [{
      name: "ymmarrys",
      label: "Ymmärrys",
      value: 0,
      canRemove: false,
      canAdd: true
    }, {
      name: "persoona",
      label: "Persoona",
      value: 0,
      canRemove: false,
      canAdd: true
    }]
  }
}`,...d.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "accent",
    label: "Terä",
    score: 12,
    subAttributes: [{
      name: "nakemys",
      label: "Näkemys",
      value: 2,
      canRemove: true,
      canAdd: false
    }, {
      name: "napparyys",
      label: "Näppäryys",
      value: 0,
      canRemove: false,
      canAdd: true
    }]
  }
}`,...p.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: args => <InteractiveTemplate {...args} />,
  args: {
    label: "Keho"
  }
}`,...b.parameters?.docs?.source}}};const V=["Default","Primary","Secondary","Accent","Interactive"];export{p as Accent,m as Default,b as Interactive,u as Primary,d as Secondary,V as __namedExportsOrder,H as default};

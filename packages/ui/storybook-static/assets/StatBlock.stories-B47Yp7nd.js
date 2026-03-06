import{j as c}from"./jsx-runtime-u17CrQMm.js";import{S as l}from"./StatBlock-DIP_8X_q.js";import"./iframe-C2RddfHL.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-DX2V7SKz.js";import"./bundle-mjs-Ce1ZTWB2.js";import"./Heading-C7jQQPe8.js";import"./Icon-B5LAENwG.js";import"./dice-5-BzsbHJi_.js";import"./Theme-CJEPQAsu.js";const k={title:"Suunnittelujarjestelma/Komponentit/StatBlock",component:l,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{variant:{control:"select",options:["primary","secondary","accent"]},theme:{control:"select",options:["base","inverted","primary-light","primary-dark","secondary-light","secondary-dark","accent-light","accent-dark"]},value:{control:"number"},maxValue:{control:"number"}}},a={args:{label:"Terveys",value:10,maxValue:20,icon:"zap"}},e={args:{label:"Krediitit",value:15420,icon:"sparkles"}},r={args:{label:"Taso",value:5,icon:"dice5"}},s={args:{label:"Kokemus",value:750,maxValue:1e3,variant:"accent",icon:"sparkles"}},n={args:{label:"Sisu",value:3,maxValue:6,variant:"primary",icon:"shield"}},o={args:{label:"Teema",value:0},render:()=>{const i=["base","inverted","primary-light","primary-dark","secondary-light","secondary-dark","accent-light","accent-dark"];return c.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-w-[300px] sm:min-w-[600px] lg:min-w-[1000px]",children:i.map(t=>c.jsx(l,{theme:t,label:t,value:Math.floor(Math.random()*50)+10,maxValue:100,icon:"zap"},t))})}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Terveys",
    value: 10,
    maxValue: 20,
    icon: "zap"
  }
}`,...a.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Krediitit",
    value: 15420,
    icon: "sparkles"
  }
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Taso",
    value: 5,
    icon: "dice5"
  }
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Kokemus",
    value: 750,
    maxValue: 1000,
    variant: "accent",
    icon: "sparkles"
  }
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Sisu",
    value: 3,
    maxValue: 6,
    variant: "primary",
    icon: "shield"
  }
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Teema",
    value: 0
  },
  render: () => {
    const themes = ["base", "inverted", "primary-light", "primary-dark", "secondary-light", "secondary-dark", "accent-light", "accent-dark"];
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-w-[300px] sm:min-w-[600px] lg:min-w-[1000px]">\r
        {themes.map(theme => <StatBlock key={theme} theme={theme as any} label={theme} value={Math.floor(Math.random() * 50) + 10} maxValue={100} icon="zap" />)}\r
      </div>;
  }
}`,...o.parameters?.docs?.source}}};const S=["Default","LargeNumbers","WithoutMax","Accent","Primary","ThemeShowcase"];export{s as Accent,a as Default,e as LargeNumbers,n as Primary,o as ThemeShowcase,r as WithoutMax,S as __namedExportsOrder,k as default};

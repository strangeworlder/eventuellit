import{j as e}from"./jsx-runtime-u17CrQMm.js";import{I as t,i}from"./Icon-B5LAENwG.js";import"./iframe-C2RddfHL.js";import"./dice-5-BzsbHJi_.js";import"./preload-helper-PPVm8Dsz.js";const o=Object.keys(i),l={title:"Suunnittelujarjestelma/Komponentit/Icon",component:t,parameters:{layout:"centered"},args:{name:"sparkles",size:24},argTypes:{name:{control:"select",options:o}}},r={},s={render:()=>e.jsx("div",{className:"grid grid-cols-2 tablet:grid-cols-4 desktop:grid-cols-6 gap-4",children:o.map(a=>e.jsxs("div",{className:"flex flex-col items-center gap-2 rounded-lg border border-[var(--theme-primary)]/25 p-3 bg-[var(--theme-bg)] text-[var(--theme-text)]",children:[e.jsx(t,{name:a,size:22}),e.jsx("span",{className:"text-xs opacity-80",children:a})]},a))})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:"{}",...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-2 tablet:grid-cols-4 desktop:grid-cols-6 gap-4">\r
      {iconNames.map(name => <div key={name} className="flex flex-col items-center gap-2 rounded-lg border border-[var(--theme-primary)]/25 p-3 bg-[var(--theme-bg)] text-[var(--theme-text)]">\r
          <Icon name={name} size={22} />\r
          <span className="text-xs opacity-80">{name}</span>\r
        </div>)}\r
    </div>
}`,...s.parameters?.docs?.source}}};const g=["Esikatselu","KaikkiKuvakkeet"];export{r as Esikatselu,s as KaikkiKuvakkeet,g as __namedExportsOrder,l as default};

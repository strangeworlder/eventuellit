import{j as e}from"./jsx-runtime-u17CrQMm.js";import{c as p,B as l}from"./Button-eGzUney-.js";import{G as r}from"./GameTerm-B5TXl4CZ.js";import{R as x}from"./iframe-RLsCwdXb.js";import{H as h,a as f}from"./Heading-DaMVR3YC.js";import"./bundle-mjs-Ce1ZTWB2.js";import"./preload-helper-PPVm8Dsz.js";const n=x.forwardRef(({className:c,variant:s="info",title:o,actions:i,children:m,...d},u)=>e.jsxs("div",{ref:u,className:p("rounded-sm p-6 text-[var(--theme-text)]",{"border-2 border-[var(--theme-secondary)]/50 bg-[var(--theme-secondary)]/5 shadow-[0_0_15px_color-mix(in_srgb,var(--theme-secondary)_20%,transparent)]":s==="success","border-l-4 border-[var(--theme-accent)] bg-[var(--theme-accent)]/10":s==="info"},c),...d,children:[e.jsxs(h,{children:[o?e.jsx(f,{className:"mb-3",children:o}):null,e.jsx("div",{className:"text-[var(--theme-text)]/85",children:m})]}),i?e.jsx("div",{className:"mt-6 flex gap-4",children:i}):null]}));n.displayName="NoticePanel";n.__docgenInfo={description:"Semantic callout panel for success and informational notices.",methods:[],displayName:"NoticePanel",props:{variant:{required:!1,tsType:{name:"union",raw:'"success" | "info"',elements:[{name:"literal",value:'"success"'},{name:"literal",value:'"info"'}]},description:"",defaultValue:{value:'"info"',computed:!1}},title:{required:!1,tsType:{name:"string"},description:""},actions:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};const k={title:"Suunnittelujarjestelma/Komponentit/Ilmoituspaneeli",component:n,parameters:{layout:"padded"}},a={args:{variant:"success",title:"Hahmo luotu onnistuneesti!",children:"Hahmosi tallennettiin tietokantaan.",actions:e.jsxs(e.Fragment,{children:[e.jsx(l,{children:"Palaa listaan"}),e.jsx(l,{variant:"secondary",children:"Tee uusi hahmo"})]})}},t={render:()=>e.jsx(n,{variant:"info",title:"Nopat ja toiminta",children:e.jsxs("p",{className:"text-lg leading-relaxed",children:["Sinulla on ",e.jsx(r,{variant:"accent",className:"font-black text-xl",children:"5n20"})," ","oletuksena. Olet ottanut"," ",e.jsx(r,{variant:"primary",className:"font-bold",children:"2 vauriota"}),", joten noppapoolisi koko on"," ",e.jsx(r,{variant:"primary",className:"font-black text-2xl",children:"3"}),"."]})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "success",
    title: "Hahmo luotu onnistuneesti!",
    children: "Hahmosi tallennettiin tietokantaan.",
    actions: <>\r
        <Button>Palaa listaan</Button>\r
        <Button variant="secondary">Tee uusi hahmo</Button>\r
      </>
  }
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <NoticePanel variant="info" title="Nopat ja toiminta">\r
      <p className="text-lg leading-relaxed">\r
        Sinulla on <GameTerm variant="accent" className="font-black text-xl">5n20</GameTerm>{" "}\r
        oletuksena. Olet ottanut{" "}\r
        <GameTerm variant="primary" className="font-bold">2 vauriota</GameTerm>, joten\r
        noppapoolisi koko on{" "}\r
        <GameTerm variant="primary" className="font-black text-2xl">3</GameTerm>.\r
      </p>\r
    </NoticePanel>
}`,...t.parameters?.docs?.source}}};const _=["Onnistuminen","Tieto"];export{a as Onnistuminen,t as Tieto,_ as __namedExportsOrder,k as default};

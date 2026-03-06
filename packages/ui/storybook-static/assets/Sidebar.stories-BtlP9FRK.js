import{j as e}from"./jsx-runtime-u17CrQMm.js";import{a as g}from"./Heading-C7jQQPe8.js";import{r as i}from"./iframe-C2RddfHL.js";import{B as w,c as m}from"./Button-DX2V7SKz.js";import{c as S,C as D,a as O,D as z,B as I}from"./dice-5-BzsbHJi_.js";import"./bundle-mjs-Ce1ZTWB2.js";import"./preload-helper-PPVm8Dsz.js";const T=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}],["path",{d:"M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662",key:"154egf"}]],C=S("circle-user",T);const A=[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]],H=S("log-out",A);const B=[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],E=S("settings",B),_=i.createContext(void 0);function k(){const r=i.useContext(_);if(!r)throw new Error("useSidebar must be used within a SidebarProvider");return r}const x=i.forwardRef(({className:r,defaultExpanded:s=!0,expanded:o,onExpandedChange:t,theme:d,children:v,...c},R)=>{const[F,q]=i.useState(s),j=o!==void 0,n=j?o:F,p=i.useCallback(l=>{const N=typeof l=="function"?l(n):l;j||q(N),t?.(N)},[j,n,t]);return e.jsx(_.Provider,{value:{expanded:n,setExpanded:p},children:e.jsxs(e.Fragment,{children:[n&&e.jsx("div",{className:"desktop:hidden fixed inset-0 z-40 bg-black/50 transition-opacity",onClick:()=>p(!1),onKeyDown:l=>l.key==="Escape"&&p(!1)}),e.jsxs("aside",{ref:R,"data-theme":d,className:m("h-full flex flex-col bg-[var(--theme-bg)] desktop:bg-transparent border-r border-[var(--theme-secondary)] transition-all duration-300 relative text-[var(--theme-secondary)] z-50","max-desktop:fixed max-desktop:top-0 max-desktop:bottom-0 max-desktop:left-0 max-desktop:w-64 max-desktop:z-50",!n&&"max-desktop:-translate-x-full",n&&"max-desktop:translate-x-0 max-desktop:shadow-2xl",!n&&"desktop:w-16",n&&"desktop:w-64",r),...c,children:[v,e.jsx(w,{variant:"secondary",size:"icon",onClick:()=>p(l=>!l),className:m("absolute top-4 bg-[var(--theme-bg)] hover:bg-[var(--theme-bg)] rounded-full p-1 opacity-100 z-10 hover:-translate-y-0 h-6 w-6 min-w-0 flex items-center justify-center p-0",n?"-right-3":"max-desktop:right-0 desktop:-right-3"),"aria-label":n?"Collapse sidebar":"Expand sidebar",children:n?e.jsx(D,{size:16}):e.jsx(O,{size:16})})]})]})})});x.displayName="Sidebar";const h=i.forwardRef(({className:r,children:s,...o},t)=>{const{expanded:d}=k();return e.jsx("div",{ref:t,className:m("p-4 flex items-center mb-4 transition-opacity",d?"justify-start":"justify-center",r),...o,children:s})});h.displayName="SidebarHeader";const f=i.forwardRef(({className:r,children:s,...o},t)=>e.jsx("div",{ref:t,className:m("flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-1",r),...o,children:s}));f.displayName="SidebarContent";const a=i.forwardRef(({className:r,icon:s,active:o,children:t,...d},v)=>{const{expanded:c}=k();return e.jsxs(w,{ref:v,variant:"ghost-secondary",size:"nav",justify:c?"start":"center",className:m("w-full flex items-center p-2 rounded-md transition-colors text-left group relative",o?"bg-[var(--theme-secondary)]/10 text-[var(--theme-secondary)] font-bold":"text-[var(--theme-secondary)]/70 hover:bg-[var(--theme-secondary)]/10 hover:text-[var(--theme-secondary)]",c?"justify-start":"justify-center",r),...d,children:[s&&e.jsx("span",{className:m("flex-shrink-0",c&&"mr-3"),children:s}),c&&e.jsx("span",{className:"truncate",children:t}),!c&&e.jsx("div",{className:"absolute left-full ml-4 px-2 py-1 bg-[var(--theme-bg)] text-[var(--theme-secondary)] border border-[var(--theme-secondary)]/20 shadow-lg rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap",children:t})]})});a.displayName="SidebarItem";const y=i.forwardRef(({className:r,children:s,...o},t)=>{const{expanded:d}=k();return e.jsx("div",{ref:t,className:m("p-4 border-t border-[var(--theme-secondary)]/20 mt-auto",d?"block":"flex justify-center",r),...o,children:s})});y.displayName="SidebarFooter";x.__docgenInfo={description:"",methods:[],displayName:"Sidebar",props:{defaultExpanded:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},expanded:{required:!1,tsType:{name:"boolean"},description:""},onExpandedChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(expanded: boolean | ((prev: boolean) => boolean)) => void",signature:{arguments:[{type:{name:"union",raw:"boolean | ((prev: boolean) => boolean)",elements:[{name:"boolean"},{name:"unknown"}]},name:"expanded"}],return:{name:"void"}}},description:""},theme:{required:!1,tsType:{name:"union",raw:`| "base"\r
| "inverted"\r
| "primary-light"\r
| "primary-dark"\r
| "secondary-light"\r
| "secondary-dark"\r
| "accent-light"\r
| "accent-dark"`,elements:[{name:"literal",value:'"base"'},{name:"literal",value:'"inverted"'},{name:"literal",value:'"primary-light"'},{name:"literal",value:'"primary-dark"'},{name:"literal",value:'"secondary-light"'},{name:"literal",value:'"secondary-dark"'},{name:"literal",value:'"accent-light"'},{name:"literal",value:'"accent-dark"'}]},description:""}}};h.__docgenInfo={description:"",methods:[],displayName:"SidebarHeader"};f.__docgenInfo={description:"",methods:[],displayName:"SidebarContent"};a.__docgenInfo={description:"",methods:[],displayName:"SidebarItem",props:{icon:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},active:{required:!1,tsType:{name:"boolean"},description:""}}};y.__docgenInfo={description:"",methods:[],displayName:"SidebarFooter"};const G={title:"Suunnittelujarjestelma/Komponentit/Sidebar",component:x,parameters:{layout:"fullscreen",backgrounds:{default:"dark"}},tags:["autodocs"],decorators:[r=>e.jsxs("div",{className:"h-screen bg-background border border-border rounded-lg overflow-hidden flex",children:[e.jsx(r,{}),e.jsxs("div",{className:"flex-1 p-8 text-text",children:[e.jsx(g,{as:"h1",children:"Main Content Area"}),e.jsx("p",{className:"mt-4 text-text-muted",children:"This is to demonstrate how the sidebar looks next to content."})]})]})]},u={render:()=>e.jsxs(x,{children:[e.jsxs(h,{children:[e.jsx("div",{className:"w-8 h-8 rounded bg-primary text-white flex items-center justify-center font-bold flex-shrink-0",children:"E"}),e.jsx(g,{as:"h4",className:"ml-3 truncate",children:"Eventuellit"})]}),e.jsxs(f,{children:[e.jsx(a,{icon:e.jsx(z,{size:20}),active:!0,children:"Hahmogeneraattori"}),e.jsx(a,{icon:e.jsx(I,{size:20}),children:"Sääntökirja"}),e.jsx("div",{className:"my-4 border-t border-border mx-2"}),e.jsx(a,{icon:e.jsx(C,{size:20}),children:"Hahmot"}),e.jsx(a,{icon:e.jsx(E,{size:20}),children:"Asetukset"})]}),e.jsx(y,{children:e.jsx(a,{icon:e.jsx(H,{size:20}),className:"text-secondary/80 hover:text-secondary hover:bg-secondary/10",children:"Kirjaudu ulos"})})]})},b={render:()=>e.jsxs(x,{defaultExpanded:!1,children:[e.jsxs(h,{children:[e.jsx("div",{className:"w-8 h-8 rounded bg-primary text-white flex items-center justify-center font-bold flex-shrink-0",children:"E"}),e.jsx(g,{as:"h4",className:"ml-3 truncate",children:"Eventuellit"})]}),e.jsxs(f,{children:[e.jsx(a,{icon:e.jsx(z,{size:20}),active:!0,children:"Hahmogeneraattori"}),e.jsx(a,{icon:e.jsx(I,{size:20}),children:"Sääntökirja"}),e.jsx("div",{className:"my-4 border-t border-border mx-2"}),e.jsx(a,{icon:e.jsx(C,{size:20}),children:"Hahmot"}),e.jsx(a,{icon:e.jsx(E,{size:20}),children:"Asetukset"})]}),e.jsx(y,{children:e.jsx(a,{icon:e.jsx(H,{size:20}),className:"text-secondary/80 hover:text-secondary hover:bg-secondary/10",children:"Kirjaudu ulos"})})]})};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <Sidebar>\r
      <SidebarHeader>\r
        <div className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">\r
          E\r
        </div>\r
        <Heading as="h4" className="ml-3 truncate">\r
          Eventuellit\r
        </Heading>\r
      </SidebarHeader>\r
\r
      <SidebarContent>\r
        <SidebarItem icon={<Dice5 size={20} />} active>\r
          Hahmogeneraattori\r
        </SidebarItem>\r
        <SidebarItem icon={<BookOpen size={20} />}>Sääntökirja</SidebarItem>\r
        <div className="my-4 border-t border-border mx-2" />\r
        <SidebarItem icon={<UserCircle size={20} />}>Hahmot</SidebarItem>\r
        <SidebarItem icon={<Settings size={20} />}>Asetukset</SidebarItem>\r
      </SidebarContent>\r
\r
      <SidebarFooter>\r
        <SidebarItem icon={<LogOut size={20} />} className="text-secondary/80 hover:text-secondary hover:bg-secondary/10">\r
          Kirjaudu ulos\r
        </SidebarItem>\r
      </SidebarFooter>\r
    </Sidebar>
}`,...u.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <Sidebar defaultExpanded={false}>\r
      <SidebarHeader>\r
        <div className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">\r
          E\r
        </div>\r
        <Heading as="h4" className="ml-3 truncate">\r
          Eventuellit\r
        </Heading>\r
      </SidebarHeader>\r
\r
      <SidebarContent>\r
        <SidebarItem icon={<Dice5 size={20} />} active>\r
          Hahmogeneraattori\r
        </SidebarItem>\r
        <SidebarItem icon={<BookOpen size={20} />}>Sääntökirja</SidebarItem>\r
        <div className="my-4 border-t border-border mx-2" />\r
        <SidebarItem icon={<UserCircle size={20} />}>Hahmot</SidebarItem>\r
        <SidebarItem icon={<Settings size={20} />}>Asetukset</SidebarItem>\r
      </SidebarContent>\r
\r
      <SidebarFooter>\r
        <SidebarItem icon={<LogOut size={20} />} className="text-secondary/80 hover:text-secondary hover:bg-secondary/10">\r
          Kirjaudu ulos\r
        </SidebarItem>\r
      </SidebarFooter>\r
    </Sidebar>
}`,...b.parameters?.docs?.source}}};const J=["Default","Collapsed"];export{b as Collapsed,u as Default,J as __namedExportsOrder,G as default};

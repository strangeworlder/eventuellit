import{j as e}from"./jsx-runtime-u17CrQMm.js";import{C as j,b as k,c as w,a as N}from"./Card-yR70UR06.js";import{R as S,r as n}from"./iframe-C2RddfHL.js";import{c as _}from"./Button-DX2V7SKz.js";import{N as B}from"./chunk-LFPYN7LY-CCjzDIv4.js";import"./Heading-C7jQQPe8.js";import"./bundle-mjs-Ce1ZTWB2.js";import"./Icon-B5LAENwG.js";import"./dice-5-BzsbHJi_.js";import"./Theme-CJEPQAsu.js";import"./preload-helper-PPVm8Dsz.js";const I=n.createContext(void 0);function K(){const a=n.useContext(I);if(!a)throw new Error("Tabs components must be used within a Tabs provider");return a}const x=S.forwardRef(({value:a,defaultValue:t,onValueChange:l,className:u,...r},o)=>{const[p,d]=n.useState(t),v=a!==void 0,T=v?a:p,R=n.useCallback(g=>{v||d(g),l?.(g)},[v,l]);return e.jsx(I.Provider,{value:{value:T,onValueChange:R},children:e.jsx("div",{ref:o,className:_("flex flex-col",u),...r})})});x.displayName="Tabs";const A=S.forwardRef(({className:a,onKeyDown:t,style:l,...u},r)=>{const o=n.useRef(null),[p,d]=n.useState(0),[v,T]=n.useState(1),[R,g]=n.useState(0),D=n.useCallback(c=>{o.current=c,typeof r=="function"?r(c):r&&(r.current=c)},[r]),E=c=>{if(!o.current||c.target.getAttribute?.("role")!=="tab")return;const h=Array.from(o.current.querySelectorAll('[role="tab"]:not([disabled])'));if(!h.length)return;const f=h.findIndex(C=>C===document.activeElement);let m=f,b=!1;switch(c.key){case"ArrowRight":m=(f+1)%h.length,b=!0;break;case"ArrowLeft":m=(f-1+h.length)%h.length,b=!0;break;case"Home":m=0,b=!0;break;case"End":m=h.length-1,b=!0;break}b&&(c.preventDefault(),h[m]?.focus()),t?.(c)},O=n.useCallback(c=>{const y=c.target.closest('[role="tab"]');if(!y||!o.current)return;if(y.getAttribute("aria-selected")==="true"||y.getAttribute("aria-current")==="page"){d(0),T(1),g(0);return}const f=Array.from(o.current.querySelectorAll('[role="tab"]')),m=f.findIndex(H=>H.getAttribute("aria-selected")==="true"||H.getAttribute("aria-current")==="page"),b=f.indexOf(y);if(m===-1||b===-1)return;const C=Math.abs(b-m),q=b>m?1:-1;d(q*(2+C*2)),T(1+C*.025),g(q*C)},[]),U=n.useCallback(()=>{d(0),T(1),g(0)},[]);return e.jsx("div",{ref:D,role:"tablist","aria-orientation":"horizontal",className:_("relative flex flex-wrap items-end border-b-2 border-[var(--theme-primary)] mb-0 gap-1 px-4 sm:px-0","[anchor-scope:--active-tab]","after:content-[''] after:absolute after:rounded-full after:bg-[var(--theme-secondary)]/15 after:border-2 after:border-[var(--theme-secondary)]","after:[position-anchor:--active-tab] after:[left:anchor(left)] after:[right:anchor(right)] after:[bottom:calc(anchor(bottom)+5px)] after:[top:calc(anchor(top)+2px)]","after:transition-all after:duration-500 after:ease-[cubic-bezier(0.23,1,0.32,1)]","after:[transform:translateX(var(--tab-tug,0px))_scaleX(var(--tab-stretch,1))_skewX(var(--tab-skew,0deg))]","after:pointer-events-none",a),style:{"--tab-tug":`${p}px`,"--tab-stretch":v,"--tab-skew":`${R}deg`,...l},onKeyDown:E,onMouseOver:O,onMouseLeave:U,...u})});A.displayName="TabsList";const s=S.forwardRef(({className:a,value:t,theme:l,onClick:u,...r},o)=>{const p=K(),d=p.value===t;return e.jsx("button",{ref:o,role:"tab",type:"button","aria-selected":d,"aria-controls":`tabpanel-${t}`,id:`tab-${t}`,tabIndex:d?0:-1,"data-theme":l,onClick:v=>{p.onValueChange?.(t),u?.(v)},className:_("relative cursor-pointer inline-flex items-center justify-center whitespace-nowrap px-6 py-3 text-sm sm:text-base font-bold uppercase tracking-widest transition-all","focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-bg)]","disabled:pointer-events-none disabled:opacity-50","rounded-t-md","mb-[-2px]",d&&"[anchor-name:--active-tab]",d?"bg-transparent text-[var(--theme-primary)] z-10 border-2 border-transparent font-bold":"border-2 border-transparent bg-transparent text-[var(--theme-text)] hover:[text-shadow:0_0_15px_var(--theme-secondary)] hover:text-[var(--theme-text)] font-semibold",a),...r})});s.displayName="TabsTrigger";const M=S.forwardRef(({className:a,theme:t,...l},u)=>e.jsx(B,{ref:u,role:"tab","data-theme":t,className:({isActive:r})=>_("relative cursor-pointer inline-flex items-center justify-center whitespace-nowrap px-6 py-3 text-sm sm:text-base font-bold uppercase tracking-widest transition-all","focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-bg)]","rounded-t-md","mb-[-2px]",r&&"[anchor-name:--active-tab]",r?"bg-transparent text-[var(--theme-text)] z-10 border-2 border-transparent font-bold":"border-2 border-transparent bg-transparent text-[var(--theme-text)] hover:[text-shadow:0_0_15px_var(--theme-secondary)] hover:text-[var(--theme-text)] font-semibold",a),...l}));M.displayName="TabsLink";const i=S.forwardRef(({className:a,value:t,...l},u)=>K().value===t?e.jsx("div",{ref:u,role:"tabpanel",id:`tabpanel-${t}`,"aria-labelledby":`tab-${t}`,tabIndex:0,className:_("focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-bg)] animate-in fade-in duration-300",a),...l}):null);i.displayName="TabsContent";x.__docgenInfo={description:`A set of layered sections of content—known as tab panels—that display one panel of content at a time.\r
Designed with a physical binder aesthetic and full keyboard accessibility.`,methods:[],displayName:"Tabs",props:{value:{required:!1,tsType:{name:"string"},description:"The controlled value of the tab to activate. Should be used in conjunction with `onValueChange`."},defaultValue:{required:!1,tsType:{name:"string"},description:"The value of the tab that should be active when initially rendered. Use when you do not need to control the state of the tabs."},onValueChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}}},description:"Event handler called when the value changes."}}};A.__docgenInfo={description:"",methods:[],displayName:"TabsList"};s.__docgenInfo={description:"",methods:[],displayName:"TabsTrigger",props:{value:{required:!0,tsType:{name:"string"},description:""},theme:{required:!1,tsType:{name:"union",raw:`| "base"\r
| "inverted"\r
| "primary-light"\r
| "primary-dark"\r
| "secondary-light"\r
| "secondary-dark"\r
| "accent-light"\r
| "accent-dark"`,elements:[{name:"literal",value:'"base"'},{name:"literal",value:'"inverted"'},{name:"literal",value:'"primary-light"'},{name:"literal",value:'"primary-dark"'},{name:"literal",value:'"secondary-light"'},{name:"literal",value:'"secondary-dark"'},{name:"literal",value:'"accent-light"'},{name:"literal",value:'"accent-dark"'}]},description:""}}};M.__docgenInfo={description:"A tab trigger that renders as a `NavLink` for router-based navigation.\r\nActive state is determined by the current URL, not by Tabs context.",methods:[],displayName:"TabsLink",props:{theme:{required:!1,tsType:{name:"union",raw:`| "base"\r
| "inverted"\r
| "primary-light"\r
| "primary-dark"\r
| "secondary-light"\r
| "secondary-dark"\r
| "accent-light"\r
| "accent-dark"`,elements:[{name:"literal",value:'"base"'},{name:"literal",value:'"inverted"'},{name:"literal",value:'"primary-light"'},{name:"literal",value:'"primary-dark"'},{name:"literal",value:'"secondary-light"'},{name:"literal",value:'"secondary-dark"'},{name:"literal",value:'"accent-light"'},{name:"literal",value:'"accent-dark"'}]},description:""},className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};i.__docgenInfo={description:"",methods:[],displayName:"TabsContent",props:{value:{required:!0,tsType:{name:"string"},description:""}}};const ee={title:"Suunnittelujarjestelma/Komponentit/Tabs",component:x,parameters:{layout:"padded"},tags:["autodocs"]},L={render:()=>e.jsx("div",{className:"w-full max-w-2xl bg-[var(--theme-bg)] text-[var(--theme-text)] p-8",children:e.jsxs(x,{defaultValue:"visuals",children:[e.jsxs(A,{children:[e.jsx(s,{value:"stats",children:"Ominaisuudet"}),e.jsx(s,{value:"skills",children:"Taidot"}),e.jsx(s,{value:"visuals",children:"Ulkoasu"}),e.jsx(s,{value:"equipment",disabled:!0,children:"Varusteet"})]}),e.jsx(i,{value:"stats",children:e.jsxs(j,{children:[e.jsx(k,{children:e.jsx(w,{children:"Hahmon ominaisuudet"})}),e.jsx(N,{children:e.jsx("p",{children:"Määritä hahmon fyysiset ja henkiset ominaisuudet täällä."})})]})}),e.jsx(i,{value:"skills",children:e.jsxs(j,{children:[e.jsx(k,{children:e.jsx(w,{children:"Taidot ja kyvyt"})}),e.jsx(N,{children:e.jsx("p",{children:"Jaa taitopisteet ja valitse hahmon osaamiset."})})]})}),e.jsx(i,{value:"visuals",children:e.jsxs(j,{variant:"subtle",children:[e.jsx(k,{children:e.jsx(w,{children:"Ulkoasun tiedot"})}),e.jsxs(N,{children:[e.jsx("p",{className:"mb-4",children:"Tässä voit määrittää, miltä hahmosi näyttää. Välilehti yhdistyy visuaalisesti sisältöalueeseen klassisen mapin tyyliin."}),e.jsx("div",{className:"h-24 w-24 bg-[var(--theme-secondary)]/20 border-2 border-[var(--theme-secondary)] rounded-full flex items-center justify-center",children:e.jsx("span",{className:"text-sm font-bold uppercase tracking-widest text-[var(--theme-secondary)]",children:"Muotokuva"})})]})]})}),e.jsx(i,{value:"equipment",children:e.jsx("p",{children:"Tämän sisällön ei pidä olla käytettävissä, koska välilehti on poistettu käytöstä."})})]})})},V={render:()=>e.jsxs("div",{className:"w-full max-w-4xl grid gap-8 bg-background p-8",children:[e.jsxs(j,{"data-theme":"inverted",className:"p-8 rounded-lg shadow-lg",children:[e.jsx(k,{children:e.jsx(w,{children:"Käänteinen teema"})}),e.jsx(N,{children:e.jsxs(x,{defaultValue:"tab1",children:[e.jsxs(A,{children:[e.jsx(s,{value:"tab1",children:"Käänteinen välilehti 1"}),e.jsx(s,{value:"tab2",children:"Käänteinen välilehti 2"}),e.jsx(s,{value:"tab3",children:"Käänteinen välilehti 3"})]}),e.jsx(i,{value:"tab1",children:e.jsx("div",{className:"p-6 bg-[var(--theme-primary)]/10 rounded-b-lg border-2 border-t-0 border-[var(--theme-primary)]",children:"Sisältö käänteisen teeman välilehdelle 1."})}),e.jsx(i,{value:"tab2",children:e.jsx("div",{className:"p-6 bg-[var(--theme-primary)]/10 rounded-b-lg border-2 border-t-0 border-[var(--theme-primary)]",children:"Sisältö käänteisen teeman välilehdelle 2."})}),e.jsx(i,{value:"tab3",children:e.jsx("div",{className:"p-6 bg-[var(--theme-primary)]/10 rounded-b-lg border-2 border-t-0 border-[var(--theme-primary)]",children:"Sisältö käänteisen teeman välilehdelle 3."})})]})})]}),e.jsxs(j,{"data-theme":"primary-dark",className:"p-8 rounded-lg shadow-lg",children:[e.jsx(k,{children:e.jsx(w,{children:"Tumma pääteema"})}),e.jsx(N,{children:e.jsxs(x,{defaultValue:"tabA",children:[e.jsxs(A,{children:[e.jsx(s,{value:"tabA",children:"Tumma tila A"}),e.jsx(s,{value:"tabB",children:"Tumma tila B"})]}),e.jsx(i,{value:"tabA",children:e.jsx("p",{className:"mt-4 text-lg",children:"Tumma pääteema on aktiivinen. Värit mukautuvat saumattomasti."})}),e.jsx(i,{value:"tabB",children:e.jsx("p",{className:"mt-4 text-lg",children:"Toinen testivälilehden sisältöpaneeli."})})]})})]})]})};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-full max-w-2xl bg-[var(--theme-bg)] text-[var(--theme-text)] p-8">\r
      <Tabs defaultValue="visuals">\r
        <TabsList>\r
          <TabsTrigger value="stats">Ominaisuudet</TabsTrigger>\r
          <TabsTrigger value="skills">Taidot</TabsTrigger>\r
          <TabsTrigger value="visuals">Ulkoasu</TabsTrigger>\r
          <TabsTrigger value="equipment" disabled>\r
            Varusteet\r
          </TabsTrigger>\r
        </TabsList>\r
        <TabsContent value="stats">\r
          <Card>\r
            <CardHeader>\r
              <CardTitle>Hahmon ominaisuudet</CardTitle>\r
            </CardHeader>\r
            <CardContent>\r
              <p>Määritä hahmon fyysiset ja henkiset ominaisuudet täällä.</p>\r
            </CardContent>\r
          </Card>\r
        </TabsContent>\r
        <TabsContent value="skills">\r
          <Card>\r
            <CardHeader>\r
              <CardTitle>Taidot ja kyvyt</CardTitle>\r
            </CardHeader>\r
            <CardContent>\r
              <p>Jaa taitopisteet ja valitse hahmon osaamiset.</p>\r
            </CardContent>\r
          </Card>\r
        </TabsContent>\r
        <TabsContent value="visuals">\r
          <Card variant="subtle">\r
            <CardHeader>\r
              <CardTitle>Ulkoasun tiedot</CardTitle>\r
            </CardHeader>\r
            <CardContent>\r
              <p className="mb-4">\r
                Tässä voit määrittää, miltä hahmosi näyttää. Välilehti yhdistyy visuaalisesti\r
                sisältöalueeseen klassisen mapin tyyliin.\r
              </p>\r
              <div className="h-24 w-24 bg-[var(--theme-secondary)]/20 border-2 border-[var(--theme-secondary)] rounded-full flex items-center justify-center">\r
                <span className="text-sm font-bold uppercase tracking-widest text-[var(--theme-secondary)]">\r
                  Muotokuva\r
                </span>\r
              </div>\r
            </CardContent>\r
          </Card>\r
        </TabsContent>\r
        <TabsContent value="equipment">\r
          <p>Tämän sisällön ei pidä olla käytettävissä, koska välilehti on poistettu käytöstä.</p>\r
        </TabsContent>\r
      </Tabs>\r
    </div>
}`,...L.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-full max-w-4xl grid gap-8 bg-background p-8">\r
      <Card data-theme="inverted" className="p-8 rounded-lg shadow-lg">\r
        <CardHeader>\r
          <CardTitle>Käänteinen teema</CardTitle>\r
        </CardHeader>\r
        <CardContent>\r
          <Tabs defaultValue="tab1">\r
            <TabsList>\r
              <TabsTrigger value="tab1">Käänteinen välilehti 1</TabsTrigger>\r
              <TabsTrigger value="tab2">Käänteinen välilehti 2</TabsTrigger>\r
              <TabsTrigger value="tab3">Käänteinen välilehti 3</TabsTrigger>\r
            </TabsList>\r
            <TabsContent value="tab1">\r
              <div className="p-6 bg-[var(--theme-primary)]/10 rounded-b-lg border-2 border-t-0 border-[var(--theme-primary)]">\r
                Sisältö käänteisen teeman välilehdelle 1.\r
              </div>\r
            </TabsContent>\r
            <TabsContent value="tab2">\r
              <div className="p-6 bg-[var(--theme-primary)]/10 rounded-b-lg border-2 border-t-0 border-[var(--theme-primary)]">\r
                Sisältö käänteisen teeman välilehdelle 2.\r
              </div>\r
            </TabsContent>\r
            <TabsContent value="tab3">\r
              <div className="p-6 bg-[var(--theme-primary)]/10 rounded-b-lg border-2 border-t-0 border-[var(--theme-primary)]">\r
                Sisältö käänteisen teeman välilehdelle 3.\r
              </div>\r
            </TabsContent>\r
          </Tabs>\r
        </CardContent>\r
      </Card>\r
\r
      <Card data-theme="primary-dark" className="p-8 rounded-lg shadow-lg">\r
        <CardHeader>\r
          <CardTitle>Tumma pääteema</CardTitle>\r
        </CardHeader>\r
        <CardContent>\r
          <Tabs defaultValue="tabA">\r
            <TabsList>\r
              <TabsTrigger value="tabA">Tumma tila A</TabsTrigger>\r
              <TabsTrigger value="tabB">Tumma tila B</TabsTrigger>\r
            </TabsList>\r
            <TabsContent value="tabA">\r
              <p className="mt-4 text-lg">\r
                Tumma pääteema on aktiivinen. Värit mukautuvat saumattomasti.\r
              </p>\r
            </TabsContent>\r
            <TabsContent value="tabB">\r
              <p className="mt-4 text-lg">Toinen testivälilehden sisältöpaneeli.</p>\r
            </TabsContent>\r
          </Tabs>\r
        </CardContent>\r
      </Card>\r
    </div>
}`,...V.parameters?.docs?.source}}};const te=["Default","Themed"];export{L as Default,V as Themed,te as __namedExportsOrder,ee as default};

import{j as r}from"./jsx-runtime-u17CrQMm.js";import{r as p}from"./iframe-C2RddfHL.js";import{T as o}from"./ToggleButton-CVlV2yo7.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-DX2V7SKz.js";import"./bundle-mjs-Ce1ZTWB2.js";const f={title:"Suunnittelujarjestelma/Komponentit/ToggleButton",component:o,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{pressed:{control:"boolean"},theme:{control:"select",options:["base","inverted","primary-light","primary-dark","secondary-light","secondary-dark","accent-light","accent-dark"]}}},a={args:{pressed:!0,children:"+1n6"}},n={args:{pressed:!1,children:"+1n6"}},s={render:e=>{const[c,d]=p.useState(e.pressed);return r.jsx(o,{...e,pressed:c,onClick:()=>d(i=>!i),children:"+1n6"})},args:{pressed:!1}},t={render:()=>r.jsx("div",{className:"flex flex-col gap-4 p-4",children:["base","inverted","primary-light","primary-dark","secondary-light","secondary-dark","accent-light","accent-dark"].map(e=>r.jsxs("div",{className:"flex items-center gap-4 p-3 rounded-sm","data-theme":e,children:[r.jsx("span",{className:"text-xs text-[var(--theme-text)]/60 w-32 font-mono",children:e}),r.jsx(o,{pressed:!1,theme:e,children:"+1n8"}),r.jsx(o,{pressed:!0,theme:e,children:"+1n8"})]},e))}),args:{pressed:!1}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    pressed: true,
    children: "+1n6"
  }
}`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    pressed: false,
    children: "+1n6"
  }
}`,...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [pressed, setPressed] = useState(args.pressed);
    return <ToggleButton {...args} pressed={pressed} onClick={() => setPressed(p => !p)}>\r
                +1n6\r
            </ToggleButton>;
  },
  args: {
    pressed: false
  }
}`,...s.parameters?.docs?.source},description:{story:"Interactive controlled example — click to toggle",...s.parameters?.docs?.description}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4 p-4">\r
            {(["base", "inverted", "primary-light", "primary-dark", "secondary-light", "secondary-dark", "accent-light", "accent-dark"] as const).map(t => <div key={t} className="flex items-center gap-4 p-3 rounded-sm" data-theme={t}>\r
                    <span className="text-xs text-[var(--theme-text)]/60 w-32 font-mono">{t}</span>\r
                    <ToggleButton pressed={false} theme={t}>\r
                        +1n8\r
                    </ToggleButton>\r
                    <ToggleButton pressed={true} theme={t}>\r
                        +1n8\r
                    </ToggleButton>\r
                </div>)}\r
        </div>,
  args: {
    pressed: false
  }
}`,...t.parameters?.docs?.source},description:{story:"Side-by-side comparison across themes",...t.parameters?.docs?.description}}};const v=["Aktiivinen","Passiivinen","Interaktiivinen","Teemat"];export{a as Aktiivinen,s as Interaktiivinen,n as Passiivinen,t as Teemat,v as __namedExportsOrder,f as default};

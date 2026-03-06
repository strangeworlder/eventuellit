import{j as a}from"./jsx-runtime-u17CrQMm.js";import{R as t}from"./iframe-C2RddfHL.js";import{c as s}from"./Heading-C7jQQPe8.js";import{u as D,T as R,p as B}from"./Theme-CJEPQAsu.js";import"./preload-helper-PPVm8Dsz.js";import"./bundle-mjs-Ce1ZTWB2.js";const u=t.forwardRef(({className:x,src:c,alt:Q,variant:e="secondary",theme:h,sources:l=[],sizes:y="100vw",placeholderSrc:m,caption:g,loading:K="lazy",decoding:E="async",imgClassName:k,width:q,height:j,...T},N)=>{const[d,p]=t.useState(!1),f=t.useRef(null),S=D(),v=h??S,b=e==="primary"?B[v]:h,I=b??v,w=t.useMemo(()=>l.map(r=>`${r.type}:${r.srcSet}`).join("|"),[l]);return t.useEffect(()=>{p(!1)},[c,w]),t.useEffect(()=>{f.current?.complete&&p(!0)},[c,w]),a.jsx(R.Provider,{value:I,children:a.jsxs("figure",{ref:N,"data-theme":b,"data-variant":e,className:s("relative overflow-hidden rounded-xl",{"bg-[var(--theme-bg)] text-[var(--theme-text)]":e==="primary","bg-transparent text-[var(--theme-secondary)] border border-[var(--theme-secondary)]":e==="secondary","bg-[var(--theme-bg)] text-[var(--theme-accent)] border-b-4 border-b-[var(--theme-accent)] border-t-0 border-l-0 border-r-0":e==="accent"},x),...T,children:[m&&!d&&a.jsx("img",{src:m,alt:"","aria-hidden":"true",className:"absolute inset-0 h-full w-full scale-110 object-cover blur-lg opacity-90 transition-opacity duration-300"}),!m&&!d&&a.jsx("div",{"aria-hidden":"true",className:s("absolute inset-0 animate-pulse",{"bg-[var(--theme-primary)]/10":e==="primary","bg-[var(--theme-secondary)]/20":e==="secondary","bg-[var(--theme-accent)]/15":e==="accent"})}),a.jsxs("picture",{className:"block",children:[l.map(r=>a.jsx("source",{srcSet:r.srcSet,type:r.type,sizes:y},`${r.type}-${r.srcSet}`)),a.jsx("img",{ref:f,src:c,sizes:y,alt:Q,loading:K,decoding:E,width:q,height:j,onLoad:()=>p(!0),className:s("h-full w-full object-cover transition-opacity duration-300",d?"opacity-100":"opacity-0",k)})]}),g&&a.jsx("figcaption",{className:s("border-t px-3 py-2 text-sm",{"border-[var(--theme-primary)]/20 text-[var(--theme-text)]/80":e==="primary","border-[var(--theme-secondary)]/30 text-[var(--theme-secondary)]":e==="secondary","border-[var(--theme-accent)]/40 text-[var(--theme-accent)] font-semibold":e==="accent"}),children:g})]})})});u.displayName="ImageElement";u.__docgenInfo={description:`Lightweight, themed image primitive for editorial/media usage.\r
Supports responsive <picture> sources and a blur placeholder while loading.`,methods:[],displayName:"ImageElement",props:{src:{required:!0,tsType:{name:"string"},description:""},alt:{required:!0,tsType:{name:"string"},description:""},variant:{required:!1,tsType:{name:"union",raw:'"primary" | "secondary" | "accent"',elements:[{name:"literal",value:'"primary"'},{name:"literal",value:'"secondary"'},{name:"literal",value:'"accent"'}]},description:"",defaultValue:{value:'"secondary"',computed:!1}},theme:{required:!1,tsType:{name:"union",raw:`| "base"\r
| "inverted"\r
| "primary-light"\r
| "primary-dark"\r
| "secondary-light"\r
| "secondary-dark"\r
| "accent-light"\r
| "accent-dark"`,elements:[{name:"literal",value:'"base"'},{name:"literal",value:'"inverted"'},{name:"literal",value:'"primary-light"'},{name:"literal",value:'"primary-dark"'},{name:"literal",value:'"secondary-light"'},{name:"literal",value:'"secondary-dark"'},{name:"literal",value:'"accent-light"'},{name:"literal",value:'"accent-dark"'}]},description:""},sources:{required:!1,tsType:{name:"Array",elements:[{name:"ImageSource"}],raw:"ImageSource[]"},description:"",defaultValue:{value:"[]",computed:!1}},sizes:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"100vw"',computed:!1}},placeholderSrc:{required:!1,tsType:{name:"string"},description:""},caption:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},loading:{required:!1,tsType:{name:"union",raw:'"lazy" | "eager"',elements:[{name:"literal",value:'"lazy"'},{name:"literal",value:'"eager"'}]},description:"",defaultValue:{value:'"lazy"',computed:!1}},decoding:{required:!1,tsType:{name:"union",raw:'"async" | "auto" | "sync"',elements:[{name:"literal",value:'"async"'},{name:"literal",value:'"auto"'},{name:"literal",value:'"sync"'}]},description:"",defaultValue:{value:'"async"',computed:!1}},imgClassName:{required:!1,tsType:{name:"string"},description:""},width:{required:!1,tsType:{name:"number"},description:""},height:{required:!1,tsType:{name:"number"},description:""}},composes:["Omit"]};const A="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoICAkLCgoLDhgQDg0NDh0VFhEYIB8iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQ0NDw0NDisZFRkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAH4AfgMBIgACEQEDEQH/xAAXAAADAQAAAAAAAAAAAAAAAAABAgME/8QAHhABAQEAAgIDAQAAAAAAAAAAAQIDABEhMQQSIkH/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABcRAQEBAQAAAAAAAAAAAAAAAAEAESH/2gAMAwEAAhEDEQA/ALxJ8fQxqzKxKObK5YjN6Mmy3ee5mVQm0kW1bbkFqQ4fW9qJCVFQ8Dk7WjYx6H4WGNqelV8O8s7kWQ4DscQhHn4Q5f2dU8jGzT5rU1qVhG9r3vE0xqf4rY3J7x4q+R2k0V0H2sWH3QJX1Nw0xR0wqef/2Q==",z={title:"Suunnittelujarjestelma/Komponentit/ImageElement",component:u,parameters:{layout:"centered"},tags:["autodocs"]},n={args:{src:"https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80",alt:"Avaruusnäkymä",width:600,height:380,className:"w-80",caption:"Kuvan kuvateksti",placeholderSrc:A,variant:"secondary"}},o={args:{src:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",alt:"Pilvipeitteinen horisontti",width:480,height:320,className:"w-72",caption:"Ensisijainen korostus",placeholderSrc:A,variant:"primary"}},i={args:{src:"https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=900&q=80",alt:"Maski varjoissa",width:480,height:480,className:"w-72",caption:"Korostettu elementti",placeholderSrc:A,variant:"accent"},parameters:{layout:"padded"}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    src: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80",
    alt: "Avaruusnäkymä",
    width: 600,
    height: 380,
    className: "w-80",
    caption: "Kuvan kuvateksti",
    placeholderSrc: placeholder,
    variant: "secondary"
  }
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    alt: "Pilvipeitteinen horisontti",
    width: 480,
    height: 320,
    className: "w-72",
    caption: "Ensisijainen korostus",
    placeholderSrc: placeholder,
    variant: "primary"
  }
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    src: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=900&q=80",
    alt: "Maski varjoissa",
    width: 480,
    height: 480,
    className: "w-72",
    caption: "Korostettu elementti",
    placeholderSrc: placeholder,
    variant: "accent"
  },
  parameters: {
    layout: "padded"
  }
}`,...i.parameters?.docs?.source}}};const J=["Oletus","Primaarinen","Korostus"];export{i as Korostus,n as Oletus,o as Primaarinen,J as __namedExportsOrder,z as default};

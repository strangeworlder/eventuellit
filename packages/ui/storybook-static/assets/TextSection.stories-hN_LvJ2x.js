import{j as e}from"./jsx-runtime-u17CrQMm.js";import{T as r}from"./Text-BiVrnusf.js";import{R as u}from"./iframe-RLsCwdXb.js";import{a as d,c as k}from"./Heading-DaMVR3YC.js";import"./preload-helper-PPVm8Dsz.js";import"./bundle-mjs-Ce1ZTWB2.js";const a=u.forwardRef(({className:n,title:i,headingClassName:o="mb-4",children:l,...m},c)=>e.jsxs("section",{ref:c,className:k("flex flex-col mt-8",n),...m,children:[i&&e.jsx(d,{className:o,children:i}),l]}));a.displayName="TextSection";a.__docgenInfo={description:"A reusable container for text sections, optionally rendering a title heading.",methods:[],displayName:"TextSection",props:{title:{required:!1,tsType:{name:"string"},description:""},headingClassName:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"mb-4"',computed:!1}}}};const v={title:"Suunnittelujarjestelma/Komponentit/Tekstiosio",component:a,parameters:{layout:"centered"},args:{title:"Kuvaus"}},t={render:n=>e.jsx("div",{className:"max-w-2xl",children:e.jsx(a,{...n,children:e.jsx(r,{children:"Jakso alkaa tilanteessa, jossa miehisto etsii reittia nestemaisen avaruuden virtauksista pois ennen kuin huoltoaluksen aikaikkuna sulkeutuu."})})})},s={render:()=>e.jsx("div",{className:"max-w-2xl",children:e.jsx(a,{children:e.jsx(r,{children:"Tata rakennetta voi kayttaa myos pelkkaan tekstisisaltoon silloin, kun otsikko tulee ylemmalta tasolta."})})})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: args => <div className="max-w-2xl">\r
      <TextSection {...args}>\r
        <Text>\r
          Jakso alkaa tilanteessa, jossa miehisto etsii reittia nestemaisen\r
          avaruuden virtauksista pois ennen kuin huoltoaluksen aikaikkuna sulkeutuu.\r
        </Text>\r
      </TextSection>\r
    </div>
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <div className="max-w-2xl">\r
      <TextSection>\r
        <Text>\r
          Tata rakennetta voi kayttaa myos pelkkaan tekstisisaltoon silloin, kun\r
          otsikko tulee ylemmalta tasolta.\r
        </Text>\r
      </TextSection>\r
    </div>
}`,...s.parameters?.docs?.source}}};const g=["Otsikolla","IlmanOtsikkoa"];export{s as IlmanOtsikkoa,t as Otsikolla,g as __namedExportsOrder,v as default};

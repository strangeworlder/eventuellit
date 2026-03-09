import{j as e}from"./jsx-runtime-u17CrQMm.js";import{L as a,a as r}from"./List-CoKjD5Mu.js";import"./iframe-RLsCwdXb.js";import"./preload-helper-PPVm8Dsz.js";import"./Heading-DaMVR3YC.js";import"./bundle-mjs-Ce1ZTWB2.js";const u={title:"Suunnittelujarjestelma/Komponentit/List",component:a,parameters:{layout:"padded"},tags:["autodocs"]},s={args:{as:"ul"},render:t=>e.jsxs(a,{...t,children:[e.jsx(r,{children:"First item"}),e.jsx(r,{children:"Second item"}),e.jsx(r,{children:"Third item"})]})},n={args:{as:"ol"},render:t=>e.jsxs(a,{...t,children:[e.jsx(r,{children:"First step"}),e.jsx(r,{children:"Second step"}),e.jsx(r,{children:"Third step"})]})},i={args:{as:"ul",variant:"unbulleted"},render:t=>e.jsxs(a,{...t,children:[e.jsx(r,{children:"Item without bullets"}),e.jsx(r,{children:"Another item"})]})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    as: "ul"
  },
  render: args => <List {...args}>\r
            <ListItem>First item</ListItem>\r
            <ListItem>Second item</ListItem>\r
            <ListItem>Third item</ListItem>\r
        </List>
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    as: "ol"
  },
  render: args => <List {...args}>\r
            <ListItem>First step</ListItem>\r
            <ListItem>Second step</ListItem>\r
            <ListItem>Third step</ListItem>\r
        </List>
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    as: "ul",
    variant: "unbulleted"
  },
  render: args => <List {...args}>\r
            <ListItem>Item without bullets</ListItem>\r
            <ListItem>Another item</ListItem>\r
        </List>
}`,...i.parameters?.docs?.source}}};const L=["Unordered","Ordered","Unbulleted"];export{n as Ordered,i as Unbulleted,s as Unordered,L as __namedExportsOrder,u as default};

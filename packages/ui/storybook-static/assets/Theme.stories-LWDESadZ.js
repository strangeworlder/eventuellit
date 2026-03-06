import{j as r}from"./jsx-runtime-u17CrQMm.js";import{C as s,b as n,c as d,a as i}from"./Card-yR70UR06.js";import{T as m,p as l}from"./Theme-CJEPQAsu.js";import"./iframe-C2RddfHL.js";import"./Button-DX2V7SKz.js";import"./bundle-mjs-Ce1ZTWB2.js";import"./Heading-C7jQQPe8.js";import"./Icon-B5LAENwG.js";import"./dice-5-BzsbHJi_.js";import"./preload-helper-PPVm8Dsz.js";const o=["base","inverted","primary-light","primary-dark","secondary-light","secondary-dark","accent-light","accent-dark"],b={title:"Suunnittelujarjestelma/Perustat/Teema",parameters:{layout:"padded"}},a={render:()=>r.jsx("div",{className:"grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4",children:o.map(e=>r.jsx(m.Provider,{value:e,children:r.jsxs(s,{theme:e,variant:"subtle",children:[r.jsx(n,{children:r.jsx(d,{children:e})}),r.jsx(i,{children:r.jsxs("p",{className:"text-sm",children:["Tama kortti nayttaa, milta sisalto nayttaa teemakontekstissa",r.jsxs("span",{className:"font-bold",children:[" ",e]}),"."]})})]})},e))})},t={render:()=>r.jsx("div",{className:"grid grid-cols-1 tablet:grid-cols-2 gap-4",children:o.map(e=>r.jsxs("div",{className:"rounded-lg border border-[var(--theme-primary)]/20 p-4",children:[r.jsxs("p",{className:"text-sm mb-3",children:["Vanhemman teema: ",r.jsx("span",{className:"font-bold",children:e})]}),r.jsx(m.Provider,{value:e,children:r.jsxs(s,{variant:"primary",children:[r.jsx(n,{children:r.jsx(d,{children:"Primary-vaihto"})}),r.jsx(i,{children:r.jsxs("p",{className:"text-sm",children:["primaryThemeMap tulos:"," ",r.jsx("span",{className:"font-bold",children:l[e]})]})})]})})]},e))})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">\r
      {themeValues.map(theme => <ThemeContext.Provider key={theme} value={theme}>\r
          <Card theme={theme} variant="subtle">\r
            <CardHeader>\r
              <CardTitle>{theme}</CardTitle>\r
            </CardHeader>\r
            <CardContent>\r
              <p className="text-sm">\r
                Tama kortti nayttaa, milta sisalto nayttaa teemakontekstissa\r
                <span className="font-bold"> {theme}</span>.\r
              </p>\r
            </CardContent>\r
          </Card>\r
        </ThemeContext.Provider>)}\r
    </div>
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">\r
      {themeValues.map(theme => <div key={theme} className="rounded-lg border border-[var(--theme-primary)]/20 p-4">\r
          <p className="text-sm mb-3">\r
            Vanhemman teema: <span className="font-bold">{theme}</span>\r
          </p>\r
          <ThemeContext.Provider value={theme}>\r
            <Card variant="primary">\r
              <CardHeader>\r
                <CardTitle>Primary-vaihto</CardTitle>\r
              </CardHeader>\r
              <CardContent>\r
                <p className="text-sm">\r
                  primaryThemeMap tulos:{" "}\r
                  <span className="font-bold">{primaryThemeMap[theme]}</span>\r
                </p>\r
              </CardContent>\r
            </Card>\r
          </ThemeContext.Provider>\r
        </div>)}\r
    </div>
}`,...t.parameters?.docs?.source}}};const T=["Teemakartta","PrimaryVaihto"];export{t as PrimaryVaihto,a as Teemakartta,T as __namedExportsOrder,b as default};

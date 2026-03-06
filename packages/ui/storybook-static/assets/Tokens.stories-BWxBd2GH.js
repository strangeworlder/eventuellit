import{j as e}from"./jsx-runtime-u17CrQMm.js";const h={title:"Suunnittelujarjestelma/Perustat/Tokens",parameters:{layout:"padded"}},a={mobile:"640px",tablet:"768px",desktop:"1024px","x-wide":"1280px"},c={0:"0px",px:"1px","0.5":"0.125rem (2px)",1:"0.25rem (4px)","1.5":"0.375rem (6px)",2:"0.5rem (8px)","2.5":"0.625rem (10px)",3:"0.75rem (12px)","3.5":"0.875rem (14px)",4:"1rem (16px)",5:"1.25rem (20px)",6:"1.5rem (24px)",8:"2rem (32px)",10:"2.5rem (40px)",12:"3rem (48px)",16:"4rem (64px)",20:"5rem (80px)",24:"6rem (96px)",32:"8rem (128px)"},m={none:"0px",sm:"0.125rem",DEFAULT:"0.25rem",md:"0.375rem",lg:"0.5rem",xl:"0.75rem","2xl":"1rem","3xl":"1.5rem",full:"9999px"},t={render:()=>e.jsxs("div",{className:"space-y-8 flex flex-col font-sans",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-heading font-bold mb-4",children:"Breakpoints"}),e.jsxs("p",{className:"opacity-80 mb-6 max-w-prose",children:["These are the standard breakpoints defined in our Design System. Use them as prefixes in your Tailwind classes to apply responsive styles (e.g.,"," ",e.jsx("code",{className:"bg-white/10 px-1 py-0.5 rounded",children:"tablet:text-lg"}),","," ",e.jsx("code",{className:"bg-white/10 px-1 py-0.5 rounded",children:"desktop:flex-row"}),")."]}),e.jsx("div",{className:"border border-white/10 rounded-lg overflow-hidden bg-background",children:e.jsxs("table",{className:"w-full text-left border-collapse",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-b border-white/10 bg-white/5",children:[e.jsx("th",{className:"py-3 px-4 font-semibold",children:"Prefix"}),e.jsx("th",{className:"py-3 px-4 font-semibold",children:"Minimum Width"}),e.jsx("th",{className:"py-3 px-4 font-semibold",children:"CSS Variable"})]})}),e.jsx("tbody",{children:Object.entries(a).map(([s,r])=>e.jsxs("tr",{className:"border-b border-white/5 last:border-0",children:[e.jsx("td",{className:"py-3 px-4 whitespace-nowrap",children:e.jsxs("code",{className:"text-accent-300 font-bold bg-accent-900/50 px-2 py-1 rounded",children:[s,":"]})}),e.jsx("td",{className:"py-3 px-4 text-primary-200",children:r}),e.jsx("td",{className:"py-3 px-4",children:e.jsxs("code",{className:"opacity-70 text-sm",children:["--breakpoint-",s]})})]},s))})]})})]}),e.jsxs("div",{className:"mt-8 pt-8 border-t border-white/10",children:[e.jsx("h3",{className:"text-xl font-heading font-bold mb-4",children:"Visualizer"}),e.jsx("p",{className:"opacity-80 mb-6 text-sm",children:"Resize your browser window to see how the container responds to these breakpoints."}),e.jsxs("div",{className:"relative h-32 rounded-lg border-2 border-dashed border-white/20 bg-white/5 flex items-center justify-center p-4 text-center transition-all duration-300",children:[e.jsxs("div",{className:"absolute inset-0 flex items-center justify-center font-bold text-lg pointer-events-none",children:[e.jsxs("span",{className:"block mobile:hidden text-white/50",children:["Base (< ",a.mobile,")"]}),e.jsxs("span",{className:"hidden mobile:block tablet:hidden text-accent-300",children:["Mobile (≥ ",a.mobile,")"]}),e.jsxs("span",{className:"hidden tablet:block desktop:hidden text-secondary-300",children:["Tablet (≥ ",a.tablet,")"]}),e.jsxs("span",{className:"hidden desktop:block x-wide:hidden text-primary-300",children:["Desktop (≥ ",a.desktop,")"]}),e.jsxs("span",{className:"hidden x-wide:block text-green-300",children:["X-Wide (≥ ",a["x-wide"],")"]})]}),e.jsxs("div",{className:"absolute bottom-2 left-0 right-0 flex justify-center gap-2",children:[e.jsx("div",{className:"h-2 w-8 rounded-full bg-white/20 mobile:bg-white/50 transition-colors",title:"Mobile"}),e.jsx("div",{className:"h-2 w-8 rounded-full bg-white/20 tablet:bg-secondary-500 transition-colors",title:"Tablet"}),e.jsx("div",{className:"h-2 w-8 rounded-full bg-white/20 desktop:bg-primary-500 transition-colors",title:"Desktop"}),e.jsx("div",{className:"h-2 w-8 rounded-full bg-white/20 x-wide:bg-green-500 transition-colors",title:"X-Wide"})]})]})]})]})},i={render:()=>e.jsx("div",{className:"space-y-4 font-sans",children:e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-heading font-bold mb-4",children:"Spacing Scale"}),e.jsxs("p",{className:"opacity-80 mb-6 max-w-prose",children:["The spacing scale is used for margins, paddings, gaps, and positioning. It follows a predictable progression. Use Tailwind classes like ",e.jsx("code",{children:"p-4"}),", ",e.jsx("code",{children:"m-2"}),","," ",e.jsx("code",{children:"gap-8"}),"."]}),e.jsx("div",{className:"flex flex-col gap-2",children:Object.entries(c).map(([s,r])=>{const l=r.match(/(\d+)px/),o=l?parseInt(l[1],10):s==="0"?0:1;return e.jsxs("div",{className:"flex items-center gap-4 text-sm",children:[e.jsx("div",{className:"w-16 font-mono text-right opacity-70 border-r border-white/10 pr-4",children:s}),e.jsx("div",{className:"w-32 opacity-90",children:r}),e.jsx("div",{className:"flex-1",children:e.jsx("div",{className:"h-4 bg-primary-500 rounded-sm",style:{width:`${o}px`,minWidth:o>0?"1px":"0"}})})]},s)})})]})})},n={render:()=>e.jsx("div",{className:"space-y-4 font-sans",children:e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-heading font-bold mb-4",children:"Border Radius"}),e.jsxs("p",{className:"opacity-80 mb-6 max-w-prose",children:["The standard border radius scale. Use utility classes like ",e.jsx("code",{children:"rounded-md"}),","," ",e.jsx("code",{children:"rounded-full"}),"."]}),e.jsx("div",{className:"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6",children:Object.entries(m).map(([s,r])=>e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsxs("div",{className:"h-24 bg-white/10 border border-white/20 flex items-center justify-center",style:{borderRadius:r},children:[e.jsx("div",{className:"w-4 h-4 rounded-full bg-white/20 absolute top-2 left-2"}),e.jsx("div",{className:"w-4 h-4 rounded-full bg-white/20 absolute top-2 right-2"}),e.jsx("div",{className:"w-4 h-4 rounded-full bg-white/20 absolute bottom-2 left-2"}),e.jsx("div",{className:"w-4 h-4 rounded-full bg-white/20 absolute bottom-2 right-2"})]}),e.jsxs("div",{className:"text-sm",children:[e.jsx("span",{className:"font-bold font-mono",children:s==="DEFAULT"?"rounded":`rounded-${s}`}),e.jsx("div",{className:"opacity-70",children:r})]})]},s))})]})})},p={stack:{name:"layout-stack",description:"Single column layout with vertical spacing.",usage:"Ruleset pages, long-form content.",structure:"Flex Column (gap-10), px-4"},split:{name:"layout-split",description:"Two-column grid layout (2:1 ratio) on desktop.",usage:"Episode details, dashboards, sidebar layouts.",structure:"Grid (gap-4), px-4, 2fr 1fr on desktop"}},d={render:()=>e.jsx("div",{className:"space-y-12 font-sans",children:e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-heading font-bold mb-4",children:"Layout Tokens"}),e.jsx("p",{className:"opacity-80 mb-8 max-w-prose",children:"These tokens represent standard page structures in our application. They are implemented as utility classes rather than components to remain flexible."}),e.jsx("div",{className:"space-y-10",children:Object.entries(p).map(([s,r])=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-baseline gap-3",children:[e.jsxs("code",{className:"text-accent-300 font-bold bg-accent-900/50 px-2 py-1 rounded text-lg",children:[".",r.name]}),e.jsx("span",{className:"text-sm opacity-60 italic",children:r.description})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[e.jsxs("div",{className:"bg-white/5 border border-white/10 rounded-lg p-6 space-y-3",children:[e.jsx("div",{className:"flex justify-between text-xs opacity-50 uppercase tracking-widest",children:e.jsx("span",{children:"Structure"})}),e.jsx("p",{className:"font-mono text-sm",children:r.structure}),e.jsx("div",{className:"pt-4 flex justify-between text-xs opacity-50 uppercase tracking-widest",children:e.jsx("span",{children:"Common Usage"})}),e.jsx("p",{className:"text-sm",children:r.usage})]}),e.jsxs("div",{className:"relative border border-dashed border-white/20 rounded-lg bg-white/5 min-h-[200px] overflow-hidden p-2",children:[e.jsx("div",{className:"absolute top-2 right-2 text-[10px] opacity-30 font-mono",children:"Visual Preview"}),s==="stack"?e.jsxs("div",{className:"layout-stack py-4 h-full",children:[e.jsx("div",{className:"h-8 bg-primary-500/20 rounded border border-primary-500/30 w-full flex items-center justify-center text-xs",children:"Section 1"}),e.jsx("div",{className:"h-24 bg-primary-500/20 rounded border border-primary-500/30 w-full flex items-center justify-center text-xs",children:"Main Content"}),e.jsx("div",{className:"h-12 bg-primary-500/20 rounded border border-primary-500/30 w-full flex items-center justify-center text-xs",children:"Section 2"})]}):e.jsxs("div",{className:"layout-split py-4 h-full",children:[e.jsx("div",{className:"h-32 bg-secondary-500/20 rounded border border-secondary-500/30 flex items-center justify-center text-xs",children:"Main Column"}),e.jsx("div",{className:"h-32 bg-accent-500/20 rounded border border-accent-500/30 flex items-center justify-center text-xs",children:"Sidebar"})]})]})]})]},s))})]})})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-8 flex flex-col font-sans">\r
      <div>\r
        <h2 className="text-2xl font-heading font-bold mb-4">Breakpoints</h2>\r
        <p className="opacity-80 mb-6 max-w-prose">\r
          These are the standard breakpoints defined in our Design System. Use them as prefixes in\r
          your Tailwind classes to apply responsive styles (e.g.,{" "}\r
          <code className="bg-white/10 px-1 py-0.5 rounded">tablet:text-lg</code>,{" "}\r
          <code className="bg-white/10 px-1 py-0.5 rounded">desktop:flex-row</code>).\r
        </p>\r
\r
        <div className="border border-white/10 rounded-lg overflow-hidden bg-background">\r
          <table className="w-full text-left border-collapse">\r
            <thead>\r
              <tr className="border-b border-white/10 bg-white/5">\r
                <th className="py-3 px-4 font-semibold">Prefix</th>\r
                <th className="py-3 px-4 font-semibold">Minimum Width</th>\r
                <th className="py-3 px-4 font-semibold">CSS Variable</th>\r
              </tr>\r
            </thead>\r
            <tbody>\r
              {Object.entries(breakpoints).map(([name, value]) => <tr key={name} className="border-b border-white/5 last:border-0">\r
                  <td className="py-3 px-4 whitespace-nowrap">\r
                    <code className="text-accent-300 font-bold bg-accent-900/50 px-2 py-1 rounded">\r
                      {name}:\r
                    </code>\r
                  </td>\r
                  <td className="py-3 px-4 text-primary-200">{value}</td>\r
                  <td className="py-3 px-4">\r
                    <code className="opacity-70 text-sm">--breakpoint-{name}</code>\r
                  </td>\r
                </tr>)}\r
            </tbody>\r
          </table>\r
        </div>\r
      </div>\r
\r
      <div className="mt-8 pt-8 border-t border-white/10">\r
        <h3 className="text-xl font-heading font-bold mb-4">Visualizer</h3>\r
        <p className="opacity-80 mb-6 text-sm">\r
          Resize your browser window to see how the container responds to these breakpoints.\r
        </p>\r
        <div className="relative h-32 rounded-lg border-2 border-dashed border-white/20 bg-white/5 flex items-center justify-center p-4 text-center transition-all duration-300">\r
          <div className="absolute inset-0 flex items-center justify-center font-bold text-lg pointer-events-none">\r
            <span className="block mobile:hidden text-white/50">\r
              Base (&lt; {breakpoints.mobile})\r
            </span>\r
            <span className="hidden mobile:block tablet:hidden text-accent-300">\r
              Mobile (&ge; {breakpoints.mobile})\r
            </span>\r
            <span className="hidden tablet:block desktop:hidden text-secondary-300">\r
              Tablet (&ge; {breakpoints.tablet})\r
            </span>\r
            <span className="hidden desktop:block x-wide:hidden text-primary-300">\r
              Desktop (&ge; {breakpoints.desktop})\r
            </span>\r
            <span className="hidden x-wide:block text-green-300">\r
              X-Wide (&ge; {breakpoints["x-wide"]})\r
            </span>\r
          </div>\r
\r
          {/* Visual indicators for active breakpoint */}\r
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">\r
            <div className="h-2 w-8 rounded-full bg-white/20 mobile:bg-white/50 transition-colors" title="Mobile" />\r
            <div className="h-2 w-8 rounded-full bg-white/20 tablet:bg-secondary-500 transition-colors" title="Tablet" />\r
            <div className="h-2 w-8 rounded-full bg-white/20 desktop:bg-primary-500 transition-colors" title="Desktop" />\r
            <div className="h-2 w-8 rounded-full bg-white/20 x-wide:bg-green-500 transition-colors" title="X-Wide" />\r
          </div>\r
        </div>\r
      </div>\r
    </div>
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-4 font-sans">\r
      <div>\r
        <h2 className="text-2xl font-heading font-bold mb-4">Spacing Scale</h2>\r
        <p className="opacity-80 mb-6 max-w-prose">\r
          The spacing scale is used for margins, paddings, gaps, and positioning. It follows a\r
          predictable progression. Use Tailwind classes like <code>p-4</code>, <code>m-2</code>,{" "}\r
          <code>gap-8</code>.\r
        </p>\r
\r
        <div className="flex flex-col gap-2">\r
          {Object.entries(spacingScale).map(([name, value]) => {
          // Calculate pixel value solely for visualizing the bar width
          const pxMatch = value.match(/(\\d+)px/);
          const pxValue = pxMatch ? parseInt(pxMatch[1]!, 10) : name === "0" ? 0 : 1;
          return <div key={name} className="flex items-center gap-4 text-sm">\r
                <div className="w-16 font-mono text-right opacity-70 border-r border-white/10 pr-4">\r
                  {name}\r
                </div>\r
                <div className="w-32 opacity-90">{value}</div>\r
                <div className="flex-1">\r
                  <div className="h-4 bg-primary-500 rounded-sm" style={{
                width: \`\${pxValue}px\`,
                minWidth: pxValue > 0 ? "1px" : "0"
              }} />\r
                </div>\r
              </div>;
        })}\r
        </div>\r
      </div>\r
    </div>
}`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-4 font-sans">\r
      <div>\r
        <h2 className="text-2xl font-heading font-bold mb-4">Border Radius</h2>\r
        <p className="opacity-80 mb-6 max-w-prose">\r
          The standard border radius scale. Use utility classes like <code>rounded-md</code>,{" "}\r
          <code>rounded-full</code>.\r
        </p>\r
\r
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">\r
          {Object.entries(radiusScale).map(([name, value]) => {
          return <div key={name} className="flex flex-col gap-3">\r
                <div className="h-24 bg-white/10 border border-white/20 flex items-center justify-center" style={{
              borderRadius: value
            }}>\r
                  <div className="w-4 h-4 rounded-full bg-white/20 absolute top-2 left-2" />\r
                  <div className="w-4 h-4 rounded-full bg-white/20 absolute top-2 right-2" />\r
                  <div className="w-4 h-4 rounded-full bg-white/20 absolute bottom-2 left-2" />\r
                  <div className="w-4 h-4 rounded-full bg-white/20 absolute bottom-2 right-2" />\r
                </div>\r
                <div className="text-sm">\r
                  <span className="font-bold font-mono">\r
                    {name === "DEFAULT" ? "rounded" : \`rounded-\${name}\`}\r
                  </span>\r
                  <div className="opacity-70">{value}</div>\r
                </div>\r
              </div>;
        })}\r
        </div>\r
      </div>\r
    </div>
}`,...n.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-12 font-sans">\r
      <div>\r
        <h2 className="text-2xl font-heading font-bold mb-4">Layout Tokens</h2>\r
        <p className="opacity-80 mb-8 max-w-prose">\r
          These tokens represent standard page structures in our application. They are implemented\r
          as utility classes rather than components to remain flexible.\r
        </p>\r
\r
        <div className="space-y-10">\r
          {Object.entries(layoutTokens).map(([key, token]) => <div key={key} className="space-y-4">\r
              <div className="flex items-baseline gap-3">\r
                <code className="text-accent-300 font-bold bg-accent-900/50 px-2 py-1 rounded text-lg">\r
                  .{token.name}\r
                </code>\r
                <span className="text-sm opacity-60 italic">{token.description}</span>\r
              </div>\r
\r
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">\r
                <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-3">\r
                  <div className="flex justify-between text-xs opacity-50 uppercase tracking-widest">\r
                    <span>Structure</span>\r
                  </div>\r
                  <p className="font-mono text-sm">{token.structure}</p>\r
\r
                  <div className="pt-4 flex justify-between text-xs opacity-50 uppercase tracking-widest">\r
                    <span>Common Usage</span>\r
                  </div>\r
                  <p className="text-sm">{token.usage}</p>\r
                </div>\r
\r
                <div className="relative border border-dashed border-white/20 rounded-lg bg-white/5 min-h-[200px] overflow-hidden p-2">\r
                  <div className="absolute top-2 right-2 text-[10px] opacity-30 font-mono">Visual Preview</div>\r
\r
                  {key === 'stack' ? <div className="layout-stack py-4 h-full">\r
                      <div className="h-8 bg-primary-500/20 rounded border border-primary-500/30 w-full flex items-center justify-center text-xs">Section 1</div>\r
                      <div className="h-24 bg-primary-500/20 rounded border border-primary-500/30 w-full flex items-center justify-center text-xs">Main Content</div>\r
                      <div className="h-12 bg-primary-500/20 rounded border border-primary-500/30 w-full flex items-center justify-center text-xs">Section 2</div>\r
                    </div> : <div className="layout-split py-4 h-full">\r
                      <div className="h-32 bg-secondary-500/20 rounded border border-secondary-500/30 flex items-center justify-center text-xs">Main Column</div>\r
                      <div className="h-32 bg-accent-500/20 rounded border border-accent-500/30 flex items-center justify-center text-xs">Sidebar</div>\r
                    </div>}\r
                </div>\r
              </div>\r
            </div>)}\r
        </div>\r
      </div>\r
    </div>
}`,...d.parameters?.docs?.source}}};const b=["Breakpoints","Spacing","BorderRadius","Layout"];export{n as BorderRadius,t as Breakpoints,d as Layout,i as Spacing,b as __namedExportsOrder,h as default};

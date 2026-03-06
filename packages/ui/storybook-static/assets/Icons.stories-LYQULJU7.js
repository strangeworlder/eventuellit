import{j as e}from"./jsx-runtime-u17CrQMm.js";import{i as r,I as a}from"./Icon-B5LAENwG.js";import{D as o}from"./DiceIcon-Dm_XK5SR.js";import"./iframe-C2RddfHL.js";import"./dice-5-BzsbHJi_.js";import"./Button-DX2V7SKz.js";import"./bundle-mjs-Ce1ZTWB2.js";import"./preload-helper-PPVm8Dsz.js";const h={title:"Suunnittelujarjestelma/Perustat/Icons",parameters:{layout:"fullscreen",docs:{description:{component:`The icon system provides a consistent visual language for actions, navigation, and game concepts.\r
We primarily use **Lucide React** for general UI icons, supplemented by specialized game icons.\r
\r
### Usage Guidelines\r
- **Size**: Standard UI icons should typically be 16px or 20px. Larger sizes (32px+) are reserved for cards or headers.\r
- **Color**: Icons should inherit the current text color (\`currentColor\`) or follow the \`iconVariant\` patterns.\r
- **Context**: Only use icons when they add clarity. Don't use them for every single menu item unless necessary.`}}}},c={sparkles:"Magic, special effects, or leveling up.",dice5:"Game mechanics, random rolls, or luck-based actions.",book:"Rules, lore, journal entries, or inventory.","chevron-left":"Navigating back or to the previous item.","chevron-right":"Navigating forward or to the next item.",minus:"Decrementing values, removing items, or negative modifiers.",plus:"Incrementing values, adding items, or positive modifiers.",zap:"Energy, speed, quick actions, or electrical effects."},s={render:()=>e.jsxs("div",{className:"min-h-screen bg-black text-white font-sans flex flex-col",children:[e.jsxs("div",{className:"p-8 md:p-16 border-b border-white/10",style:{backgroundColor:"var(--color-background)",color:"var(--color-text)"},children:[e.jsx("h1",{className:"text-5xl font-extrabold font-heading mb-4",children:"Icons"}),e.jsx("p",{className:"text-xl max-w-3xl opacity-80 leading-relaxed",children:"Our icon set is based on Lucide React and follows a clean, geometric aesthetic. Use icons to provide visual cues and enhance the user interface."})]}),e.jsxs("div",{className:"p-8 md:p-16 flex flex-col gap-20",children:[e.jsxs("section",{children:[e.jsxs("div",{className:"flex flex-col gap-2 mb-8 border-b border-white/5 pb-4",children:[e.jsx("h2",{className:"text-3xl font-heading font-black",children:"General UI Icons"}),e.jsx("p",{className:"opacity-60",children:"Standard functional icons for navigation and control."})]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",children:Object.keys(r).map(n=>e.jsxs("div",{className:"flex flex-col p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-accent-500/50 hover:bg-white/10 transition-all group",children:[e.jsxs("div",{className:"flex items-center justify-between mb-4",children:[e.jsx("div",{className:"p-4 rounded-xl bg-accent-500/10 text-accent-400 group-hover:scale-110 transition-transform",children:e.jsx(a,{name:n,size:32})}),e.jsx("code",{className:"text-xs opacity-50 font-mono bg-black/30 px-2 py-1 rounded",children:n})]}),e.jsx("h3",{className:"text-lg font-heading font-bold mb-2 capitalize",children:n.replace("-"," ")}),e.jsx("p",{className:"text-sm opacity-70 leading-snug min-h-[3rem]",children:c[n]||"No description available."}),e.jsx("div",{className:"mt-6 pt-4 border-t border-white/5 flex gap-3",children:e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx("span",{className:"text-[10px] uppercase tracking-wider opacity-40",children:"Usage"}),e.jsx("code",{className:"text-[11px] bg-black/20 px-2 py-1 rounded",children:`<Icon name="${n}" />`})]})})]},n))})]}),e.jsxs("section",{children:[e.jsxs("div",{className:"flex flex-col gap-2 mb-8 border-b border-white/5 pb-4",children:[e.jsx("h2",{className:"text-3xl font-heading font-black",children:"Specialized Icons"}),e.jsx("p",{className:"opacity-60",children:"Domain-specific components for game mechanics."})]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",children:[4,6,8,10,12,20].map(n=>e.jsxs("div",{className:"flex flex-col p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-secondary-500/50 hover:bg-white/10 transition-all group",children:[e.jsxs("div",{className:"flex items-center justify-between mb-4",children:[e.jsx("div",{className:"p-2 rounded-xl bg-secondary-500/10 text-secondary-400 group-hover:scale-110 transition-transform",children:e.jsx(o,{faces:n,size:"lg"})}),e.jsxs("code",{className:"text-xs opacity-50 font-mono bg-black/30 px-2 py-1 rounded",children:["d",n]})]}),e.jsxs("h3",{className:"text-lg font-heading font-bold mb-2",children:["D",n," Die"]}),e.jsxs("p",{className:"text-sm opacity-70 leading-snug",children:["Visual representation of a ",n,"-sided die. Used in dice pools and roll results."]}),e.jsx("div",{className:"mt-6 pt-4 border-t border-white/5 flex gap-3",children:e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx("span",{className:"text-[10px] uppercase tracking-wider opacity-40",children:"Usage"}),e.jsx("code",{className:"text-[11px] bg-black/20 px-2 py-1 rounded",children:`<DiceIcon faces={${n}} />`})]})})]},n))})]}),e.jsxs("section",{className:"p-8 rounded-3xl bg-gradient-to-br from-primary-900/40 to-secondary-900/40 border border-white/10",children:[e.jsx("h2",{className:"text-2xl font-heading font-bold mb-4 italic",children:"Adding New Icons"}),e.jsxs("p",{className:"opacity-80 mb-6",children:["To add a new icon to the design system, import it from ",e.jsx("code",{className:"text-accent-300",children:"lucide-react"})," in",e.jsx("code",{className:"text-accent-300",children:" Icon.tsx"})," and add it to the ",e.jsx("code",{className:"text-accent-300",children:"icons"})," object."]}),e.jsx("div",{className:"bg-black/40 p-4 rounded-lg font-mono text-sm overflow-x-auto",children:e.jsx("pre",{className:"text-blue-300",children:`// packages/ui/src/components/Icon.tsx
export const icons = {
  // ... existing icons
  "new-icon": NewLucideIcon,
} as const;`})})]})]})]})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <div className="min-h-screen bg-black text-white font-sans flex flex-col">\r
            {/* Header section matching Themes.stories.tsx */}\r
            <div className="p-8 md:p-16 border-b border-white/10" style={{
      backgroundColor: "var(--color-background)",
      color: "var(--color-text)"
    }}>\r
                <h1 className="text-5xl font-extrabold font-heading mb-4">Icons</h1>\r
                <p className="text-xl max-w-3xl opacity-80 leading-relaxed">\r
                    Our icon set is based on Lucide React and follows a clean, geometric aesthetic.\r
                    Use icons to provide visual cues and enhance the user interface.\r
                </p>\r
            </div>\r
\r
            <div className="p-8 md:p-16 flex flex-col gap-20">\r
                {/* General UI Icons */}\r
                <section>\r
                    <div className="flex flex-col gap-2 mb-8 border-b border-white/5 pb-4">\r
                        <h2 className="text-3xl font-heading font-black">General UI Icons</h2>\r
                        <p className="opacity-60">Standard functional icons for navigation and control.</p>\r
                    </div>\r
\r
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">\r
                        {Object.keys(icons).map(name => <div key={name} className="flex flex-col p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-accent-500/50 hover:bg-white/10 transition-all group">\r
                                <div className="flex items-center justify-between mb-4">\r
                                    <div className="p-4 rounded-xl bg-accent-500/10 text-accent-400 group-hover:scale-110 transition-transform">\r
                                        <Icon name={name as any} size={32} />\r
                                    </div>\r
                                    <code className="text-xs opacity-50 font-mono bg-black/30 px-2 py-1 rounded">\r
                                        {name}\r
                                    </code>\r
                                </div>\r
\r
                                <h3 className="text-lg font-heading font-bold mb-2 capitalize">\r
                                    {name.replace("-", " ")}\r
                                </h3>\r
\r
                                <p className="text-sm opacity-70 leading-snug min-h-[3rem]">\r
                                    {iconUsage[name] || "No description available."}\r
                                </p>\r
\r
                                <div className="mt-6 pt-4 border-t border-white/5 flex gap-3">\r
                                    <div className="flex flex-col gap-1">\r
                                        <span className="text-[10px] uppercase tracking-wider opacity-40">Usage</span>\r
                                        <code className="text-[11px] bg-black/20 px-2 py-1 rounded">\r
                                            {\`<Icon name="\${name}" />\`}\r
                                        </code>\r
                                    </div>\r
                                </div>\r
                            </div>)}\r
                    </div>\r
                </section>\r
\r
                {/* Specialized Icons */}\r
                <section>\r
                    <div className="flex flex-col gap-2 mb-8 border-b border-white/5 pb-4">\r
                        <h2 className="text-3xl font-heading font-black">Specialized Icons</h2>\r
                        <p className="opacity-60">Domain-specific components for game mechanics.</p>\r
                    </div>\r
\r
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">\r
                        {([4, 6, 8, 10, 12, 20] as const).map(faces => <div key={faces} className="flex flex-col p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-secondary-500/50 hover:bg-white/10 transition-all group">\r
                                <div className="flex items-center justify-between mb-4">\r
                                    <div className="p-2 rounded-xl bg-secondary-500/10 text-secondary-400 group-hover:scale-110 transition-transform">\r
                                        <DiceIcon faces={faces} size="lg" />\r
                                    </div>\r
                                    <code className="text-xs opacity-50 font-mono bg-black/30 px-2 py-1 rounded">\r
                                        d{faces}\r
                                    </code>\r
                                </div>\r
\r
                                <h3 className="text-lg font-heading font-bold mb-2">\r
                                    D{faces} Die\r
                                </h3>\r
\r
                                <p className="text-sm opacity-70 leading-snug">\r
                                    Visual representation of a {faces}-sided die. Used in dice pools and roll results.\r
                                </p>\r
\r
                                <div className="mt-6 pt-4 border-t border-white/5 flex gap-3">\r
                                    <div className="flex flex-col gap-1">\r
                                        <span className="text-[10px] uppercase tracking-wider opacity-40">Usage</span>\r
                                        <code className="text-[11px] bg-black/20 px-2 py-1 rounded">\r
                                            {\`<DiceIcon faces={\${faces}} />\`}\r
                                        </code>\r
                                    </div>\r
                                </div>\r
                            </div>)}\r
                    </div>\r
                </section>\r
\r
                {/* Technical Implementation */}\r
                <section className="p-8 rounded-3xl bg-gradient-to-br from-primary-900/40 to-secondary-900/40 border border-white/10">\r
                    <h2 className="text-2xl font-heading font-bold mb-4 italic">Adding New Icons</h2>\r
                    <p className="opacity-80 mb-6">\r
                        To add a new icon to the design system, import it from <code className="text-accent-300">lucide-react</code> in\r
                        <code className="text-accent-300"> Icon.tsx</code> and add it to the <code className="text-accent-300">icons</code> object.\r
                    </p>\r
                    <div className="bg-black/40 p-4 rounded-lg font-mono text-sm overflow-x-auto">\r
                        <pre className="text-blue-300">\r
                            {\`// packages/ui/src/components/Icon.tsx
export const icons = {
  // ... existing icons
  "new-icon": NewLucideIcon,
} as const;\`}\r
                        </pre>\r
                    </div>\r
                </section>\r
            </div>\r
        </div>
}`,...s.parameters?.docs?.source},description:{story:"The complete gallery of available icons in the system.",...s.parameters?.docs?.description}}};const b=["Gallery"];export{s as Gallery,b as __namedExportsOrder,h as default};

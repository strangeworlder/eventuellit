import{j as n}from"./jsx-runtime-u17CrQMm.js";import{R as l}from"./iframe-C2RddfHL.js";import{c as i}from"./Button-DX2V7SKz.js";import{H as C,a as T}from"./Heading-C7jQQPe8.js";import{I as w}from"./Icon-B5LAENwG.js";import{u as _,T as N,p as j}from"./Theme-CJEPQAsu.js";const p=l.createContext({}),q=()=>l.useContext(p),u=l.forwardRef(({className:t,variant:e="primary",theme:a,iconName:r,iconVariant:d="primary",children:s,...o},f)=>{const x=_(),c=a??x,m=e==="primary"?j[c]:a,k=m??c;return n.jsx(N.Provider,{value:k,children:n.jsx(p.Provider,{value:{iconName:r,iconVariant:d},children:n.jsx("div",{ref:f,"data-theme":m,"data-variant":e,className:i("rounded-xl overflow-visible relative group",{"bg-[var(--theme-bg)] text-[var(--theme-text)]":e==="primary","bg-transparent text-[var(--theme-secondary)] border border-[var(--theme-secondary)]":e==="secondary","bg-[var(--theme-bg)] text-[var(--theme-accent)] border-b-4 border-b-[var(--theme-accent)] border-t-0 border-l-0 border-r-0":e==="accent","border-2 border-[var(--theme-primary)]/20 bg-[var(--theme-bg)] text-[var(--theme-text)] shadow-md":e==="subtle","bg-[var(--theme-secondary)]/10 text-[var(--theme-text)] border-l-8 border-l-[var(--theme-primary)] border-t-0 border-r-0 border-b-0 shadow-[inset_0_0_20px_color-mix(in_srgb,var(--theme-secondary)_10%,transparent)] hover:shadow-[inset_0_0_30px_color-mix(in_srgb,var(--theme-secondary)_15%,transparent)] transition-shadow":e==="rule","[corner-shape:scoop_round_round_round] rounded-tl-4xl":r},t),...o,children:n.jsx(C,{children:s})})})})});u.displayName="Card";const h=l.forwardRef(({className:t,theme:e,children:a,...r},d)=>{const{iconName:s,iconVariant:o}=q();return n.jsxs("div",{ref:d,"data-theme":e,className:i("flex flex-col space-y-1.5 p-4 tablet:p-6 border-b-2 border-current/20",t),...r,children:[s&&n.jsx("div",{className:i("w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 absolute -top-6 -left-6",{"border-[var(--theme-bg)] border-2 text-[var(--theme-bg)]":o==="primary","border-[var(--theme-primary)]/50 border-2 text-[var(--theme-primary)]/50":o==="secondary","border-[var(--theme-accent)]/50 border-2 text-[var(--theme-accent)]/50":o==="accent"}),children:n.jsx(w,{name:s,size:28})}),a]})});h.displayName="CardHeader";const v=l.forwardRef(({className:t,theme:e,...a},r)=>n.jsx(T,{ref:r,"data-theme":e,className:i("font-bold",t),...a}));v.displayName="CardTitle";const y=l.forwardRef(({className:t,theme:e,...a},r)=>n.jsx("p",{ref:r,"data-theme":e,className:i("text-lg font-bold uppercase tracking-wider opacity-80",t),...a}));y.displayName="CardDescription";const b=l.forwardRef(({className:t,variant:e="default",theme:a,...r},d)=>n.jsx("div",{ref:d,"data-theme":a,className:i("flex flex-col",{"gap-6 p-4 pt-4 tablet:p-6 tablet:pt-6":e==="default","gap-4 p-3 tablet:p-4":e==="dense","gap-4 p-4 tablet:p-6 text-[var(--theme-text)]/90 leading-relaxed font-light":e==="rule"},t),...r}));b.displayName="CardContent";const g=l.forwardRef(({className:t,theme:e,...a},r)=>n.jsx("div",{ref:r,"data-theme":e,className:i("flex items-center p-4 pt-0 tablet:p-6 tablet:pt-0",t),...a}));g.displayName="CardFooter";u.__docgenInfo={description:`The core container block for the Card subcomponent architecture.\r
Groups related concepts, providing thematic backgrounds, borders, and shadows.\r
\r
The **primary** variant doesn't hardcode colors — it swaps to a mapped \`data-theme\`,\r
so that all children (text, borders, nested components) inherit proper contrast\r
automatically from the CSS theme system.`,methods:[],displayName:"Card",props:{variant:{required:!1,tsType:{name:"union",raw:'"primary" | "secondary" | "accent" | "subtle" | "rule"',elements:[{name:"literal",value:'"primary"'},{name:"literal",value:'"secondary"'},{name:"literal",value:'"accent"'},{name:"literal",value:'"subtle"'},{name:"literal",value:'"rule"'}]},description:"The semantic visual style variant of the card.\r\n- `primary` (default): Swaps to a contrasting theme for the surface, ensuring accessible nesting.\r\n- `secondary`: Transparent background with secondary-colored border and text.\r\n- `accent`: Theme background with accent-colored text and a thick bottom accent border.\r\n- `subtle`: Light bordered surface card.\r\n- `rule`: Left-accented callout block.",defaultValue:{value:'"primary"',computed:!1}},theme:{required:!1,tsType:{name:"union",raw:`| "base"\r
| "inverted"\r
| "primary-light"\r
| "primary-dark"\r
| "secondary-light"\r
| "secondary-dark"\r
| "accent-light"\r
| "accent-dark"`,elements:[{name:"literal",value:'"base"'},{name:"literal",value:'"inverted"'},{name:"literal",value:'"primary-light"'},{name:"literal",value:'"primary-dark"'},{name:"literal",value:'"secondary-light"'},{name:"literal",value:'"secondary-dark"'},{name:"literal",value:'"accent-light"'},{name:"literal",value:'"accent-dark"'}]},description:"The theme context to apply, which modifies the component's CSS variables."},iconName:{required:!1,tsType:{name:"union",raw:"keyof typeof icons",elements:[{name:"literal",value:"sparkles"},{name:"literal",value:"dice5"},{name:"literal",value:"book"},{name:"literal",value:'"chevron-left"'},{name:"literal",value:'"chevron-right"'},{name:"literal",value:"minus"},{name:"literal",value:"plus"},{name:"literal",value:"zap"},{name:"literal",value:"shield"}]},description:"Optional icon to render in the CardHeader."},iconVariant:{required:!1,tsType:{name:"union",raw:'"primary" | "secondary" | "accent"',elements:[{name:"literal",value:'"primary"'},{name:"literal",value:'"secondary"'},{name:"literal",value:'"accent"'}]},description:'The color variant for the icon container. Defaults to "primary".',defaultValue:{value:'"primary"',computed:!1}}}};h.__docgenInfo={description:"Provides a standardized visual header for the Card, including padding and a subtle bottom border.",methods:[],displayName:"CardHeader",props:{theme:{required:!1,tsType:{name:"union",raw:`| "base"\r
| "inverted"\r
| "primary-light"\r
| "primary-dark"\r
| "secondary-light"\r
| "secondary-dark"\r
| "accent-light"\r
| "accent-dark"`,elements:[{name:"literal",value:'"base"'},{name:"literal",value:'"inverted"'},{name:"literal",value:'"primary-light"'},{name:"literal",value:'"primary-dark"'},{name:"literal",value:'"secondary-light"'},{name:"literal",value:'"secondary-dark"'},{name:"literal",value:'"accent-light"'},{name:"literal",value:'"accent-dark"'}]},description:""}}};v.__docgenInfo={description:"The title block of the Card. Automatically uses the global `Heading` component\r\nto ensure that heading hierarchy and typography stay consistent.",methods:[],displayName:"CardTitle",props:{theme:{required:!1,tsType:{name:"union",raw:`| "base"\r
| "inverted"\r
| "primary-light"\r
| "primary-dark"\r
| "secondary-light"\r
| "secondary-dark"\r
| "accent-light"\r
| "accent-dark"`,elements:[{name:"literal",value:'"base"'},{name:"literal",value:'"inverted"'},{name:"literal",value:'"primary-light"'},{name:"literal",value:'"primary-dark"'},{name:"literal",value:'"secondary-light"'},{name:"literal",value:'"secondary-dark"'},{name:"literal",value:'"accent-light"'},{name:"literal",value:'"accent-dark"'}]},description:""}}};y.__docgenInfo={description:"A bold uppercase text label, typically placed below the `CardTitle` to offer extra context.",methods:[],displayName:"CardDescription",props:{theme:{required:!1,tsType:{name:"union",raw:`| "base"\r
| "inverted"\r
| "primary-light"\r
| "primary-dark"\r
| "secondary-light"\r
| "secondary-dark"\r
| "accent-light"\r
| "accent-dark"`,elements:[{name:"literal",value:'"base"'},{name:"literal",value:'"inverted"'},{name:"literal",value:'"primary-light"'},{name:"literal",value:'"primary-dark"'},{name:"literal",value:'"secondary-light"'},{name:"literal",value:'"secondary-dark"'},{name:"literal",value:'"accent-light"'},{name:"literal",value:'"accent-dark"'}]},description:""}}};b.__docgenInfo={description:"The main container for the body of the Card.\r\nUse the `variant` prop to adjust padding density.",methods:[],displayName:"CardContent",props:{variant:{required:!1,tsType:{name:"union",raw:'"default" | "dense" | "rule"',elements:[{name:"literal",value:'"default"'},{name:"literal",value:'"dense"'},{name:"literal",value:'"rule"'}]},description:"",defaultValue:{value:'"default"',computed:!1}},theme:{required:!1,tsType:{name:"union",raw:`| "base"\r
| "inverted"\r
| "primary-light"\r
| "primary-dark"\r
| "secondary-light"\r
| "secondary-dark"\r
| "accent-light"\r
| "accent-dark"`,elements:[{name:"literal",value:'"base"'},{name:"literal",value:'"inverted"'},{name:"literal",value:'"primary-light"'},{name:"literal",value:'"primary-dark"'},{name:"literal",value:'"secondary-light"'},{name:"literal",value:'"secondary-dark"'},{name:"literal",value:'"accent-light"'},{name:"literal",value:'"accent-dark"'}]},description:""}}};g.__docgenInfo={description:"The bottom area of the Card, normally used for rendering action buttons.",methods:[],displayName:"CardFooter",props:{theme:{required:!1,tsType:{name:"union",raw:`| "base"\r
| "inverted"\r
| "primary-light"\r
| "primary-dark"\r
| "secondary-light"\r
| "secondary-dark"\r
| "accent-light"\r
| "accent-dark"`,elements:[{name:"literal",value:'"base"'},{name:"literal",value:'"inverted"'},{name:"literal",value:'"primary-light"'},{name:"literal",value:'"primary-dark"'},{name:"literal",value:'"secondary-light"'},{name:"literal",value:'"secondary-dark"'},{name:"literal",value:'"accent-light"'},{name:"literal",value:'"accent-dark"'}]},description:""}}};export{u as C,b as a,h as b,v as c,y as d,g as e};

import{j as h}from"./jsx-runtime-u17CrQMm.js";import{t as v,c as y}from"./bundle-mjs-Ce1ZTWB2.js";import{R as s}from"./iframe-RLsCwdXb.js";function f(...e){return v(y(e))}const b=({text:e})=>{const[n,d]=s.useState(null),[m,u]=s.useState({center:0,toggle:!1});return s.useEffect(()=>{if(!e)return;let a,r=!0;const o=()=>{const t=Math.random()*3e4+2e3;a=setTimeout(()=>{if(!r)return;const i=Array.from(e).map((l,c)=>l.trim()?c:-1).filter(l=>l!==-1);if(i.length>0){const l=i[Math.floor(Math.random()*i.length)];l!==void 0&&d(l),setTimeout(()=>{r&&(d(null),o())},500+Math.random()*1500)}else o()},t)};return o(),()=>{r=!1,clearTimeout(a)}},[e]),s.useEffect(()=>{if(!e)return;const a=Array.from(e).map((c,x)=>c.trim()?x:-1).filter(c=>c!==-1);if(a.length===0)return;u({center:a[Math.floor(Math.random()*a.length)]??0,toggle:!1});const t=(e.length*.15+4)*1e3,i=Math.max(1e4,t+500),l=setInterval(()=>{u(c=>({center:a[Math.floor(Math.random()*a.length)]??0,toggle:!c.toggle}))},i);return()=>clearInterval(l)},[e]),h.jsx(h.Fragment,{children:Array.from(e).map((a,r)=>{const o=Math.abs(r-m.center),t=n===r;return h.jsx("span",{className:f(t?"flicker-char":"",m.toggle?"breath-char-1":"breath-char-2","inline-block transition-colors duration-300"),style:{animationDelay:`${o*.15}s`},children:a===" "?" ":a},r)})})},w=e=>s.Children.map(e,n=>typeof n=="string"?h.jsx(b,{text:n}):n),p=s.createContext(2),k=({children:e})=>{const n=s.useContext(p),d=Math.min(n+1,6);return h.jsx(p.Provider,{value:d,children:e})},g=s.forwardRef(({className:e,as:n,variant:d,children:m,...u},a)=>{const r=s.useContext(p),o=n||`h${Math.min(Math.max(1,r),6)}`,t=d||o;let i=m;return t==="h1"&&(i=w(m)),h.jsxs(o,{ref:a,className:f("font-bold tracking-tight",{"font-black tracking-normal":["h1","h2","h4","h5"].includes(t),"font-heading text-4xl tablet:text-5xl uppercase text-[var(--theme-primary)]":t==="h1","font-heading text-3xl tablet:text-4xl uppercase text-[var(--theme-text)]":t==="h2","font-heading text-2xl tablet:text-3xl uppercase text-[var(--theme-primary)]":t==="h3","font-sans text-xl tablet:text-2xl border-l-4 pl-4 border-[var(--theme-primary)] uppercase text-[var(--theme-text)]":t==="h4","font-sans text-lg tablet:text-xl uppercase text-[var(--theme-secondary)]":t==="h5","border-b-2 border-[var(--theme-primary)] font-sans text-base tablet:text-lg uppercase text-[var(--theme-text)]":t==="h6"},e),...u,children:[t==="h1"&&h.jsx("style",{suppressHydrationWarning:!0,children:`
                        @keyframes breath-glow-1 {
                            0%, 100% { text-shadow: none; }
                            50% { text-shadow: 0 0 8px color-mix(in srgb, var(--theme-secondary) 33%, transparent); }
                        }
                        @keyframes breath-glow-2 {
                            0%, 100% { text-shadow: none; }
                            50% { text-shadow: 0 0 8px color-mix(in srgb, var(--theme-secondary) 33%, transparent); }
                        }
                        .breath-char-1 {
                            animation: breath-glow-1 4s ease-in-out forwards;
                        }
                        .breath-char-2 {
                            animation: breath-glow-2 4s ease-in-out forwards;
                        }
                        @keyframes fluorescent-flicker {
                            0% { opacity: 1; text-shadow: none; }
                            10% { opacity: 0.9; text-shadow: none; }
                            20% { opacity: 1; text-shadow: 0 0 8px var(--theme-secondary);}
                            30% { opacity: 0.9; text-shadow: none; }
                            40% { opacity: 1; text-shadow: none; }
                            50% { opacity: 0.85; text-shadow: none; }
                            60% { opacity: 1; text-shadow: 0 0 8px var(--theme-secondary);}
                            70% { opacity: 0.95; text-shadow: none; }
                            80% { opacity: 0.85; text-shadow: none; }
                            90% { opacity: 1; text-shadow: none; }
                            100% { opacity: 0.75; text-shadow: none; }
                        }
                        .flicker-char {
                            animation: fluorescent-flicker 0.8s infinite alternate !important;
                        }
                    `}),i]})});g.displayName="Heading";k.__docgenInfo={description:"",methods:[],displayName:"HeadingLevelProvider",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};g.__docgenInfo={description:"",methods:[],displayName:"Heading",props:{as:{required:!1,tsType:{name:"union",raw:'"h1" | "h2" | "h3" | "h4" | "h5" | "h6"',elements:[{name:"literal",value:'"h1"'},{name:"literal",value:'"h2"'},{name:"literal",value:'"h3"'},{name:"literal",value:'"h4"'},{name:"literal",value:'"h5"'},{name:"literal",value:'"h6"'}]},description:""},variant:{required:!1,tsType:{name:"union",raw:'"h1" | "h2" | "h3" | "h4" | "h5" | "h6"',elements:[{name:"literal",value:'"h1"'},{name:"literal",value:'"h2"'},{name:"literal",value:'"h3"'},{name:"literal",value:'"h4"'},{name:"literal",value:'"h5"'},{name:"literal",value:'"h6"'}]},description:""}}};export{k as H,g as a,p as b,f as c};

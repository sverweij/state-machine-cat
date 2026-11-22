var o=/(?:^$)|(?:^\/[/*])|(?:[;, "\t\n\r=\-><:{[])/,f=/(?:^")|(?:[;,{}])/,$=/(?:^")|(?:[;{])|(?:^\s|\s$)/,g=new Set(["label","type","color","active","class"]),c=new Set(["type","color","class","width"]);function s(t,n){return t.test(n)?`"${n.replaceAll('"',String.raw`\"`)}"`:n}function b(t){return Object.hasOwn(t,"label")||Object.hasOwn(t,"typeExplicitlySet")||Object.hasOwn(t,"color")||Object.hasOwn(t,"active")||Object.hasOwn(t,"class")}function a(t,n=""){return t.map(e=>`${n}# ${e}`).join(`
`)}function m(t){let[n,e]=String(t).split("e");if(e===void 0)return n;let r=n.replace(".",""),i=n.includes(".")?n.indexOf(".")+Number(e):n.length+Number(e);return i<=0?`0.${"0".repeat(-i)}${r}`:i>=r.length?r.padEnd(i,"0"):`${r.slice(0,i)}.${r.slice(i)}`}function u(t,n){return t==="type"?`${t}=${n}`:t==="active"?n?t:"":typeof n=="number"?`${t}=${m(n)}`:`${t}="${n.replaceAll('"','\\"')}"`}function O(t){return Object.entries(t).filter(([n])=>g.has(n)).filter(([n])=>n!=="type"||t.typeExplicitlySet).map(([n,e])=>u(n,e)).join(" ")}function E(t){return s(f,t.map(n=>`${n.type==="activity"?"":`${n.type}/ `}${n.body}`).join(`
    `))}function A(t,n=""){let e=n+s(o,t.name);return t.note&&(e=`${a(t.note,n)}
${e}`),b(t)&&(e+=` [${O(t)}]`),t.actions&&(e+=`: ${E(t.actions)}`),t.statemachine&&(e+=` {
`,e+=l(t.statemachine,null,`${n}    `),e+=`${n}}`),e}function d(t,n=""){return t.map(e=>A(e,n)).join(`,
`).concat(t.length>0?`;

`:"")}function I(t){return Object.entries(t).some(([n])=>c.has(n))}function h(t){return Object.entries(t).filter(([n])=>c.has(n)).map(([n,e])=>u(n,e)).join(" ")}function j(t,n=""){let e=`${n}${s(o,t.from)} => ${s(o,t.to)}`;return t.note&&(e=`${a(t.note,n)}
${e}`),I(t)&&(e+=` [${h(t)}]`),t.label&&(e+=`: ${s($,t.label)}`),e}function T(t,n=""){return t.map(e=>`${j(e,n)};
`).join("")}function l(t,n={},e=""){return d(t.states,e)+T(t.transitions||[],e)}export{l as default};
//# sourceMappingURL=smcat-232ZSS5Q.js.map

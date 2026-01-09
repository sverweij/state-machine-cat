import"./chunk-FW4363Y4.js";var r=/[;,{[ ]/,u=/[;,{}]/,l=/[;{]/,f=new Set(["label","type","color","active","class"]),s=new Set(["type","color","class"]);function i(t,n){return t.test(n)?`"${n}"`:n}function $(t){return Object.hasOwn(t,"label")||Object.hasOwn(t,"typeExplicitlySet")||Object.hasOwn(t,"color")||Object.hasOwn(t,"active")||Object.hasOwn(t,"class")}function o(t,n=""){return t.map(e=>`${n}# ${e}`).join(`
`)}function c(t,n){return t==="type"?`${t}=${n}`:t==="active"?n?t:"":`${t}="${n}"`}function g(t){return Object.entries(t).filter(([n])=>f.has(n)).filter(([n])=>n!=="type"||t.typeExplicitlySet).map(([n,e])=>c(n,e)).join(" ")}function O(t){return t.map(n=>`${n.type==="activity"?"":`${n.type}/ `}${n.body}`).map(n=>i(u,n)).join(`
    `)}function b(t,n=""){let e=n+i(r,t.name);return t.note&&(e=`${o(t.note,n)}
${e}`),$(t)&&(e+=` [${g(t)}]`),t.actions&&(e+=`: ${O(t.actions)}`),t.statemachine&&(e+=` {
`,e+=a(t.statemachine,null,`${n}    `),e+=`${n}}`),e}function E(t,n=""){return t.map(e=>b(e,n)).join(`,
`).concat(t.length>0?`;

`:"")}function m(t){return Object.entries(t).some(([n])=>s.has(n))}function A(t){return Object.entries(t).filter(([n])=>s.has(n)).map(([n,e])=>c(n,e)).join(" ")}function I(t,n=""){let e=`${n}${i(r,t.from)} => ${i(r,t.to)}`;return t.note&&(e=`${o(t.note,n)}
${e}`),m(t)&&(e+=` [${A(t)}]`),t.label&&(e+=`: ${i(l,t.label)}`),e}function j(t,n=""){return t.map(e=>`${I(e,n)};
`).join("")}function a(t,n={},e=""){return E(t.states,e)+j(t.transitions||[],e)}export{a as default};
//# sourceMappingURL=smcat-EVI24VSX.js.map

import{a as d}from"./chunk-WFFSAAHR.js";import{a as u}from"./chunk-3VLMYERO.js";import"./chunk-DSGGCMS6.js";import{b as l}from"./chunk-FW4363Y4.js";var t=l(d(),1),i=4;function s(n,e){let r=/^(?!\s*$)/gm;return n.replace(r," ".repeat(e))}function c(n){let e="";return n.event&&(e+=` event="${t.default.escape(n.event)}"`),n.cond&&(e+=` cond="${t.default.escape(n.cond)}"`),n.type&&(e+=` type="${t.default.escape(n.type)}"`),e+=` target="${t.default.escape(n.target)}"`,e}function S(n,e){let r=`
<transition${c(n)}/>`;return s(r,e*i)}function f(n,e){let r=`
<transition${c(n)}>
    ${t.default.escape(n.action)}
</transition>`;return s(r,e*i)}function $(n,e){return n.action?f(n,e):S(n,e)}function N(n,e){return(n??[]).map(r=>$(r,e)).join("")}function a(n,e,r){let g=`
<${e}>${t.default.escape(n)}</${e}>`;return s(g,r*i)}function C(n,e){return(n??[]).map(r=>a(r,"onentry",e)).join("")}function O(n,e){return(n??[]).map(r=>a(r,"onexit",e)).join("")}function I(n){let e=` id="${t.default.escape(n.id)}"`;return n.initial&&(e+=` initial="${t.default.escape(n.initial)}"`),n.type&&(e+=` type="${t.default.escape(n.type)}"`),e}function J(n,e){let r=`
<${n.kind}${I(n)}>`;return r+=m(n.states,e),r+=C(n.onentries,e),r+=O(n.onexits,e),r+=N(n.transitions,e),r+=`
</${n.kind}>`,s(r,e*i)}function m(n,e=1){return(n??[]).map(r=>J(r,e)).join("")}function b(n){return n?`initial="${n}" `:""}function o(n){return`<?xml version="1.0" encoding="UTF-8"?>
<scxml xmlns="http://www.w3.org/2005/07/scxml" ${b(n.initial)}version="1.0">${m(n.states)}
</scxml>
`}var y=n=>o(u(n)),T=y;export{T as default};
//# sourceMappingURL=scxml-LN22VNL2.js.map

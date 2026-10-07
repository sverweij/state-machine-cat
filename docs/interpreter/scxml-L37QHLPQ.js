import{b as e}from"./chunk-KMQXAY42.js";import{a as u}from"./chunk-NRSRDQQ6.js";import"./chunk-L2JDUAMS.js";var i=4;function s(n,r){let t=/^(?!\s*$)/gm;return n.replaceAll(t," ".repeat(r))}function c(n){let r="";return n.event&&(r+=` event="${e(n.event)}"`),n.cond&&(r+=` cond="${e(n.cond)}"`),n.type&&(r+=` type="${e(n.type)}"`),r+=` target="${e(n.target)}"`,r}function g(n,r){let t=`
<transition${c(n)}/>`;return s(t,r*i)}function d(n,r){let t=`
<transition${c(n)}>
    ${e(n.action)}
</transition>`;return s(t,r*i)}function S(n,r){return n.action?d(n,r):g(n,r)}function f(n,r){return(n??[]).map(t=>S(t,r)).join("")}function a(n,r,t){let m=`
<${r}>${e(n)}</${r}>`;return s(m,t*i)}function $(n,r){return n.map(t=>a(t,"onentry",r)).join("")}function N(n,r){return n.map(t=>a(t,"onexit",r)).join("")}function C(n){let r=` id="${e(n.id)}"`;return n.initial&&(r+=` initial="${e(n.initial)}"`),n.type&&(r+=` type="${e(n.type)}"`),r}function O(n,r){let t=`
<${n.kind}${C(n)}>`;return t+=l(n.states,r),t+=$(n.onentries??[],r),t+=N(n.onexits??[],r),t+=f(n.transitions??[],r),t+=`
</${n.kind}>`,s(t,r*i)}function l(n,r=1){return(n??[]).map(t=>O(t,r)).join("")}function I(n){return n?`initial="${n}" `:""}function o(n){return`<?xml version="1.0" encoding="UTF-8"?>
<scxml xmlns="http://www.w3.org/2005/07/scxml" ${I(n.initial)}version="1.0">${l(n.states)}
</scxml>
`}var J=n=>o(u(n)),j=J;export{j as default};
//# sourceMappingURL=scxml-L37QHLPQ.js.map

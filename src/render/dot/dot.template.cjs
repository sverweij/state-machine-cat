var Handlebars=require("handlebars/dist/handlebars.runtime"),template=Handlebars.template,templates=Handlebars.templates=Handlebars.templates||{};templates["dot.template.hbs"]=template({1:function(l,n,o,e,a,t,r){var u=null!=n?n:l.nullContext||{},c=l.hooks.helperMissing,i="function",s=l.hooks.blockHelperMissing,m=l.lookupProperty||function(l,n){if(Object.prototype.hasOwnProperty.call(l,n))return l[n]},p="",f=null!=(f=m(o,"noteName")||(null!=n?m(n,"noteName"):n))?f:c,h={name:"noteName",hash:{},fn:l.noop,inverse:l.program(2,a,0,t,r),data:a,loc:{start:{line:9,column:2},end:{line:26,column:15}}},d=typeof f==i?f.call(u,h):f;return null!=(d=m(o,"noteName")?d:s.call(n,d,h))&&(p+=d),f=null!=(f=m(o,"noteName")||(null!=n?m(n,"noteName"):n))?f:c,h={name:"noteName",hash:{},fn:l.program(23,a,0,t,r),inverse:l.noop,data:a,loc:{start:{line:27,column:2},end:{line:37,column:15}}},d=typeof f==i?f.call(u,h):f,null!=(d=m(o,"noteName")?d:s.call(n,d,h))&&(p+=d),p},2:function(l,n,o,e,a,t,r){var u=null!=n?n:l.nullContext||{},c=l.hooks.helperMissing,i="function",s=l.hooks.blockHelperMissing,m=l.lookupProperty||function(l,n){if(Object.prototype.hasOwnProperty.call(l,n))return l[n]},p="",f=null!=(f=m(o,"isCompositeSelf")||(null!=n?m(n,"isCompositeSelf"):n))?f:c,h={name:"isCompositeSelf",hash:{},fn:l.noop,inverse:l.program(3,a,0,t,r),data:a,loc:{start:{line:10,column:4},end:{line:16,column:24}}},d=typeof f==i?f.call(u,h):f;return null!=(d=m(o,"isCompositeSelf")?d:s.call(n,d,h))&&(p+=d),f=null!=(f=m(o,"isCompositeSelf")||(null!=n?m(n,"isCompositeSelf"):n))?f:c,h={name:"isCompositeSelf",hash:{},fn:l.program(16,a,0,t,r),inverse:l.noop,data:a,loc:{start:{line:17,column:4},end:{line:25,column:24}}},d=typeof f==i?f.call(u,h):f,null!=(d=m(o,"isCompositeSelf")?d:s.call(n,d,h))&&(p+=d),p},3:function(l,n,o,e,a,t,r){var u=null!=n?n:l.nullContext||{},c=l.hooks.helperMissing,i="function",s=l.hooks.blockHelperMissing,m=l.lookupProperty||function(l,n){if(Object.prototype.hasOwnProperty.call(l,n))return l[n]},p='    "'+(null!=(d=typeof(f=null!=(f=m(o,"from")||(null!=n?m(n,"from"):n))?f:c)==i?f.call(u,{name:"from",hash:{},data:a,loc:{start:{line:11,column:5},end:{line:11,column:15}}}):f)?d:"")+'" -> "'+(null!=(d=typeof(f=null!=(f=m(o,"to")||(null!=n?m(n,"to"):n))?f:c)==i?f.call(u,{name:"to",hash:{},data:a,loc:{start:{line:11,column:21},end:{line:11,column:29}}}):f)?d:"")+'" [label="',f=null!=(f=m(o,"label")||(null!=n?m(n,"label"):n))?f:c,h={name:"label",hash:{},fn:l.noop,inverse:l.program(4,a,0,t,r),data:a,loc:{start:{line:11,column:39},end:{line:11,column:60}}},d=typeof f==i?f.call(u,h):f;return null!=(d=m(o,"label")?d:s.call(n,d,h))&&(p+=d),p+=(null!=(d=typeof(f=null!=(f=m(o,"label")||(null!=n?m(n,"label"):n))?f:c)==i?f.call(u,{name:"label",hash:{},data:a,loc:{start:{line:11,column:60},end:{line:11,column:71}}}):f)?d:"")+'"',f=null!=(f=m(o,"fromComposite")||(null!=n?m(n,"fromComposite"):n))?f:c,h={name:"fromComposite",hash:{},fn:l.program(6,a,0,t,r),inverse:l.noop,data:a,loc:{start:{line:12,column:28},end:{line:12,column:92}}},d=typeof f==i?f.call(u,h):f,null!=(d=m(o,"fromComposite")?d:s.call(n,d,h))&&(p+=d),f=null!=(f=m(o,"toComposite")||(null!=n?m(n,"toComposite"):n))?f:c,h={name:"toComposite",hash:{},fn:l.program(8,a,0,t,r),inverse:l.noop,data:a,loc:{start:{line:13,column:28},end:{line:13,column:86}}},d=typeof f==i?f.call(u,h):f,null!=(d=m(o,"toComposite")?d:s.call(n,d,h))&&(p+=d),p+=null!=(d=m(o,"if").call(u,null!=n?m(n,"color"):n,{name:"if",hash:{},fn:l.program(10,a,0,t,r),inverse:l.program(12,a,0,t,r),data:a,loc:{start:{line:14,column:28},end:{line:14,column:139}}}))?d:"",f=null!=(f=m(o,"width")||(null!=n?m(n,"width"):n))?f:c,h={name:"width",hash:{},fn:l.program(14,a,0,t,r),inverse:l.noop,data:a,loc:{start:{line:15,column:28},end:{line:15,column:68}}},d=typeof f==i?f.call(u,h):f,null!=(d=m(o,"width")?d:s.call(n,d,h))&&(p+=d),p+' class="'+(null!=(d=typeof(f=null!=(f=m(o,"class")||(null!=n?m(n,"class"):n))?f:c)==i?f.call(u,{name:"class",hash:{},data:a,loc:{start:{line:15,column:76},end:{line:15,column:87}}}):f)?d:"")+'"]\n'},4:function(l,n,o,e,a){return" "},6:function(l,n,o,e,a){var t=l.lookupProperty||function(l,n){if(Object.prototype.hasOwnProperty.call(l,n))return l[n]};return' ltail="cluster_'+(null!=(t="function"==typeof(o=null!=(o=t(o,"from")||(null!=n?t(n,"from"):n))?o:l.hooks.helperMissing)?o.call(null!=n?n:l.nullContext||{},{name:"from",hash:{},data:a,loc:{start:{line:12,column:63},end:{line:12,column:73}}}):o)?t:"")+'"'},8:function(l,n,o,e,a){var t=l.lookupProperty||function(l,n){if(Object.prototype.hasOwnProperty.call(l,n))return l[n]};return' lhead="cluster_'+(null!=(t="function"==typeof(o=null!=(o=t(o,"to")||(null!=n?t(n,"to"):n))?o:l.hooks.helperMissing)?o.call(null!=n?n:l.nullContext||{},{name:"to",hash:{},data:a,loc:{start:{line:13,column:61},end:{line:13,column:69}}}):o)?t:"")+'"'},10:function(l,n,o,e,a,t,r){var u,c=l.lambda,l=l.lookupProperty||function(l,n){if(Object.prototype.hasOwnProperty.call(l,n))return l[n]};return' color="'+(null!=(u=c(null!=r[1]?l(r[1],"color"):r[1],n))?u:"")+'" fontcolor="'+(null!=(u=c(null!=r[1]?l(r[1],"color"):r[1],n))?u:"")+'"'},12:function(l,n,o,e,a){return' color="black" fontcolor="black"'},14:function(l,n,o,e,a){return' penwidth="'+(null!=(l=l.lambda(n,n))?l:"")+'"'},16:function(l,n,o,e,a,t,r){var u=null!=n?n:l.nullContext||{},c=l.hooks.helperMissing,i="function",s=l.hooks.blockHelperMissing,m=l.lookupProperty||function(l,n){if(Object.prototype.hasOwnProperty.call(l,n))return l[n]},p='      "'+(null!=(d=typeof(f=null!=(f=m(o,"from")||(null!=n?m(n,"from"):n))?f:c)==i?f.call(u,{name:"from",hash:{},data:a,loc:{start:{line:18,column:7},end:{line:18,column:17}}}):f)?d:"")+'" -> "self_'+(null!=(d=typeof(f=null!=(f=m(o,"name")||(null!=n?m(n,"name"):n))?f:c)==i?f.call(u,{name:"name",hash:{},data:a,loc:{start:{line:18,column:28},end:{line:18,column:38}}}):f)?d:"")+'" [label="',f=null!=(f=m(o,"label")||(null!=n?m(n,"label"):n))?f:c,h={name:"label",hash:{},fn:l.noop,inverse:l.program(4,a,0,t,r),data:a,loc:{start:{line:18,column:48},end:{line:18,column:69}}},d=typeof f==i?f.call(u,h):f;return null!=(d=m(o,"label")?d:s.call(n,d,h))&&(p+=d),p+=(null!=(d=typeof(f=null!=(f=m(o,"label")||(null!=n?m(n,"label"):n))?f:c)==i?f.call(u,{name:"label",hash:{},data:a,loc:{start:{line:18,column:69},end:{line:18,column:80}}}):f)?d:"")+'" arrowhead=none',f=null!=(f=m(o,"tailportflags")||(null!=n?m(n,"tailportflags"):n))?f:c,h={name:"tailportflags",hash:{},fn:l.program(17,a,0,t,r),inverse:l.noop,data:a,loc:{start:{line:19,column:28},end:{line:19,column:73}}},d=typeof f==i?f.call(u,h):f,null!=(d=m(o,"tailportflags")?d:s.call(n,d,h))&&(p+=d),p+=' ltail="cluster_'+(null!=(d=typeof(f=null!=(f=m(o,"from")||(null!=n?m(n,"from"):n))?f:c)==i?f.call(u,{name:"from",hash:{},data:a,loc:{start:{line:19,column:89},end:{line:19,column:99}}}):f)?d:"")+'"',f=null!=(f=m(o,"color")||(null!=n?m(n,"color"):n))?f:c,h={name:"color",hash:{},fn:l.program(19,a,0,t,r),inverse:l.noop,data:a,loc:{start:{line:20,column:28},end:{line:20,column:85}}},d=typeof f==i?f.call(u,h):f,null!=(d=m(o,"color")?d:s.call(n,d,h))&&(p+=d),p+=' class="'+(null!=(d=typeof(f=null!=(f=m(o,"class")||(null!=n?m(n,"class"):n))?f:c)==i?f.call(u,{name:"class",hash:{},data:a,loc:{start:{line:20,column:93},end:{line:20,column:104}}}):f)?d:"")+'"]\n      "self_'+(null!=(d=typeof(f=null!=(f=m(o,"name")||(null!=n?m(n,"name"):n))?f:c)==i?f.call(u,{name:"name",hash:{},data:a,loc:{start:{line:21,column:12},end:{line:21,column:22}}}):f)?d:"")+'" -> "'+(null!=(d=typeof(f=null!=(f=m(o,"from")||(null!=n?m(n,"from"):n))?f:c)==i?f.call(u,{name:"from",hash:{},data:a,loc:{start:{line:21,column:28},end:{line:21,column:38}}}):f)?d:"")+'" [lhead="cluster_'+(null!=(d=typeof(f=null!=(f=m(o,"from")||(null!=n?m(n,"from"):n))?f:c)==i?f.call(u,{name:"from",hash:{},data:a,loc:{start:{line:21,column:56},end:{line:21,column:66}}}):f)?d:"")+'"',f=null!=(f=m(o,"headportflags")||(null!=n?m(n,"headportflags"):n))?f:c,h={name:"headportflags",hash:{},fn:l.program(17,a,0,t,r),inverse:l.noop,data:a,loc:{start:{line:22,column:28},end:{line:22,column:73}}},d=typeof f==i?f.call(u,h):f,null!=(d=m(o,"headportflags")?d:s.call(n,d,h))&&(p+=d),f=null!=(f=m(o,"color")||(null!=n?m(n,"color"):n))?f:c,h={name:"color",hash:{},fn:l.program(21,a,0,t,r),inverse:l.noop,data:a,loc:{start:{line:23,column:28},end:{line:23,column:65}}},d=typeof f==i?f.call(u,h):f,null!=(d=m(o,"color")?d:s.call(n,d,h))&&(p+=d),f=null!=(f=m(o,"width")||(null!=n?m(n,"width"):n))?f:c,h={name:"width",hash:{},fn:l.program(14,a,0,t,r),inverse:l.noop,data:a,loc:{start:{line:24,column:28},end:{line:24,column:68}}},d=typeof f==i?f.call(u,h):f,null!=(d=m(o,"width")?d:s.call(n,d,h))&&(p+=d),p+' class="'+(null!=(d=typeof(f=null!=(f=m(o,"class")||(null!=n?m(n,"class"):n))?f:c)==i?f.call(u,{name:"class",hash:{},data:a,loc:{start:{line:24,column:76},end:{line:24,column:87}}}):f)?d:"")+'"]\n'},17:function(l,n,o,e,a){return" "+(null!=(l=l.lambda(n,n))?l:"")},19:function(l,n,o,e,a){var t,l=l.lambda;return' color="'+(null!=(t=l(n,n))?t:"")+'" fontcolor="'+(null!=(t=l(n,n))?t:"")+'"'},21:function(l,n,o,e,a){return' color="'+(null!=(l=l.lambda(n,n))?l:"")+'"'},23:function(l,n,o,e,a,t,r){var u,c=l.lambda,i=l.hooks.blockHelperMissing,s=null!=n?n:l.nullContext||{},m=l.lookupProperty||function(l,n){if(Object.prototype.hasOwnProperty.call(l,n))return l[n]};return'      "i_'+(null!=(u=c(n,n))?u:"")+'" [shape=point style=invis margin=0 width=0 height=0 fixedsize=true]\n      "'+(null!=(u=c(null!=r[1]?m(r[1],"from"):r[1],n))?u:"")+'" -> "i_'+(null!=(u=c(n,n))?u:"")+'" [arrowhead=none'+(null!=(u=i.call(n,c(null!=r[1]?m(r[1],"fromComposite"):r[1],n),{name:"../fromComposite",hash:{},fn:l.program(24,a,0,t,r),inverse:l.noop,data:a,loc:{start:{line:30,column:32},end:{line:30,column:105}}}))?u:"")+(null!=(u=m(o,"if").call(s,null!=r[1]?m(r[1],"color"):r[1],{name:"if",hash:{},fn:l.program(26,a,0,t,r),inverse:l.program(28,a,0,t,r),data:a,loc:{start:{line:31,column:32},end:{line:31,column:101}}}))?u:"")+']\n      "i_'+(null!=(u=c(n,n))?u:"")+'" -> "'+(null!=(u=c(null!=r[1]?m(r[1],"to"):r[1],n))?u:"")+'" [label="'+(null!=(u=i.call(n,c(null!=r[1]?m(r[1],"label"):r[1],n),{name:"../label",hash:{},fn:l.noop,inverse:l.program(4,a,0,t,r),data:a,loc:{start:{line:32,column:43},end:{line:32,column:70}}}))?u:"")+(null!=(u=c(null!=r[1]?m(r[1],"label"):r[1],n))?u:"")+'"'+(null!=(u=i.call(n,c(null!=r[1]?m(r[1],"toComposite"):r[1],n),{name:"../toComposite",hash:{},fn:l.program(30,a,0,t,r),inverse:l.noop,data:a,loc:{start:{line:33,column:32},end:{line:33,column:99}}}))?u:"")+(null!=(u=m(o,"if").call(s,null!=r[1]?m(r[1],"color"):r[1],{name:"if",hash:{},fn:l.program(10,a,0,t,r),inverse:l.program(12,a,0,t,r),data:a,loc:{start:{line:34,column:32},end:{line:34,column:146}}}))?u:"")+']\n      "i_'+(null!=(u=c(n,n))?u:"")+'" -> "'+(null!=(u=c(n,n))?u:"")+'" [style=dashed arrowtail=none arrowhead=none weight=0]\n      "'+(null!=(u=c(n,n))?u:"")+'" [label="'+(null!=(u=c(null!=r[1]?m(r[1],"noteFlattened"):r[1],n))?u:"")+'" shape=note fontsize=10 color=black fontcolor=black fillcolor="#ffffcc" penwidth=1.0]\n'},24:function(l,n,o,e,a,t,r){var u=l.lookupProperty||function(l,n){if(Object.prototype.hasOwnProperty.call(l,n))return l[n]};return' ltail="cluster_'+(null!=(l=l.lambda(null!=r[1]?u(r[1],"from"):r[1],n))?l:"")+'"'},26:function(l,n,o,e,a,t,r){var u=l.lookupProperty||function(l,n){if(Object.prototype.hasOwnProperty.call(l,n))return l[n]};return' color="'+(null!=(l=l.lambda(null!=r[1]?u(r[1],"color"):r[1],n))?l:"")+'"'},28:function(l,n,o,e,a){return' color="black"'},30:function(l,n,o,e,a,t,r){var u=l.lookupProperty||function(l,n){if(Object.prototype.hasOwnProperty.call(l,n))return l[n]};return' lhead="cluster_'+(null!=(l=l.lambda(null!=r[1]?u(r[1],"to"):r[1],n))?l:"")+'"'},compiler:[8,">= 4.3.0"],main:function(l,n,o,e,a,t,r){var u=null!=n?n:l.nullContext||{},c=l.hooks.helperMissing,i="function",s=l.lookupProperty||function(l,n){if(Object.prototype.hasOwnProperty.call(l,n))return l[n]},e='digraph "state transitions" {\n  '+(null!=(p=typeof(m=null!=(m=s(o,"graphAttributes")||(null!=n?s(n,"graphAttributes"):n))?m:c)==i?m.call(u,{name:"graphAttributes",hash:{},data:a,loc:{start:{line:2,column:2},end:{line:2,column:23}}}):m)?p:"")+"\n  node ["+(null!=(p=typeof(m=null!=(m=s(o,"nodeAttributes")||(null!=n?s(n,"nodeAttributes"):n))?m:c)==i?m.call(u,{name:"nodeAttributes",hash:{},data:a,loc:{start:{line:3,column:8},end:{line:3,column:28}}}):m)?p:"")+"]\n  edge ["+(null!=(p=typeof(m=null!=(m=s(o,"edgeAttributes")||(null!=n?s(n,"edgeAttributes"):n))?m:c)==i?m.call(u,{name:"edgeAttributes",hash:{},data:a,loc:{start:{line:4,column:8},end:{line:4,column:28}}}):m)?p:"")+"]\n\n"+(null!=(p=l.invokePartial(s(e,"dot.states.template.hbs"),n,{name:"dot.states.template.hbs",data:a,indent:"  ",helpers:o,partials:e,decorators:l.decorators}))?p:"")+"\n",m=null!=(m=s(o,"transitions")||(null!=n?s(n,"transitions"):n))?m:c,c={name:"transitions",hash:{},fn:l.program(1,a,0,t,r),inverse:l.noop,data:a,loc:{start:{line:8,column:2},end:{line:38,column:18}}},p=typeof m==i?m.call(u,c):m;return null!=(p=s(o,"transitions")?p:l.hooks.blockHelperMissing.call(n,p,c))&&(e+=p),e+"}\n"},usePartial:!0,useData:!0,useDepths:!0});
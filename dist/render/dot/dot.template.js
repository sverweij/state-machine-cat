var Handlebars=require("handlebars/dist/handlebars.runtime"),template=Handlebars.template,templates=Handlebars.templates=Handlebars.templates||{};templates["dot.template.hbs"]=template({1:function(l,n,o,e,a,t,r){var u=null!=n?n:l.nullContext||{},c=l.hooks.helperMissing,s="function",i=l.hooks.blockHelperMissing,m=l.lookupProperty||function(l,n){if(Object.prototype.hasOwnProperty.call(l,n))return l[n]},p="",f=null!=(f=m(o,"noteName")||(null!=n?m(n,"noteName"):n))?f:c,h={name:"noteName",hash:{},fn:l.noop,inverse:l.program(2,a,0,t,r),data:a,loc:{start:{line:9,column:2},end:{line:26,column:15}}},d=typeof f==s?f.call(u,h):f;return null!=(d=m(o,"noteName")?d:i.call(n,d,h))&&(p+=d),f=null!=(f=m(o,"noteName")||(null!=n?m(n,"noteName"):n))?f:c,h={name:"noteName",hash:{},fn:l.program(19,a,0,t,r),inverse:l.noop,data:a,loc:{start:{line:27,column:2},end:{line:37,column:15}}},d=typeof f==s?f.call(u,h):f,null!=(d=m(o,"noteName")?d:i.call(n,d,h))&&(p+=d),p},2:function(l,n,o,e,a){var t=null!=n?n:l.nullContext||{},r=l.hooks.helperMissing,u="function",c=l.hooks.blockHelperMissing,s=l.lookupProperty||function(l,n){if(Object.prototype.hasOwnProperty.call(l,n))return l[n]},i="",m=null!=(m=s(o,"isCompositeSelf")||(null!=n?s(n,"isCompositeSelf"):n))?m:r,p={name:"isCompositeSelf",hash:{},fn:l.noop,inverse:l.program(3,a,0),data:a,loc:{start:{line:10,column:4},end:{line:16,column:24}}},f=typeof m==u?m.call(t,p):m;return null!=(f=s(o,"isCompositeSelf")?f:c.call(n,f,p))&&(i+=f),m=null!=(m=s(o,"isCompositeSelf")||(null!=n?s(n,"isCompositeSelf"):n))?m:r,p={name:"isCompositeSelf",hash:{},fn:l.program(14,a,0),inverse:l.noop,data:a,loc:{start:{line:17,column:4},end:{line:25,column:24}}},f=typeof m==u?m.call(t,p):m,null!=(f=s(o,"isCompositeSelf")?f:c.call(n,f,p))&&(i+=f),i},3:function(l,n,o,e,a){var t=null!=n?n:l.nullContext||{},r=l.hooks.helperMissing,u="function",c=l.hooks.blockHelperMissing,s=l.lookupProperty||function(l,n){if(Object.prototype.hasOwnProperty.call(l,n))return l[n]},i='    "'+(null!=(f=typeof(m=null!=(m=s(o,"from")||(null!=n?s(n,"from"):n))?m:r)==u?m.call(t,{name:"from",hash:{},data:a,loc:{start:{line:11,column:5},end:{line:11,column:15}}}):m)?f:"")+'" -> "'+(null!=(f=typeof(m=null!=(m=s(o,"to")||(null!=n?s(n,"to"):n))?m:r)==u?m.call(t,{name:"to",hash:{},data:a,loc:{start:{line:11,column:21},end:{line:11,column:29}}}):m)?f:"")+'" [label="',m=null!=(m=s(o,"label")||(null!=n?s(n,"label"):n))?m:r,p={name:"label",hash:{},fn:l.noop,inverse:l.program(4,a,0),data:a,loc:{start:{line:11,column:39},end:{line:11,column:60}}},f=typeof m==u?m.call(t,p):m;return null!=(f=s(o,"label")?f:c.call(n,f,p))&&(i+=f),i+=(null!=(f=typeof(m=null!=(m=s(o,"label")||(null!=n?s(n,"label"):n))?m:r)==u?m.call(t,{name:"label",hash:{},data:a,loc:{start:{line:11,column:60},end:{line:11,column:71}}}):m)?f:"")+'"',m=null!=(m=s(o,"fromComposite")||(null!=n?s(n,"fromComposite"):n))?m:r,p={name:"fromComposite",hash:{},fn:l.program(6,a,0),inverse:l.noop,data:a,loc:{start:{line:12,column:28},end:{line:12,column:92}}},f=typeof m==u?m.call(t,p):m,null!=(f=s(o,"fromComposite")?f:c.call(n,f,p))&&(i+=f),m=null!=(m=s(o,"toComposite")||(null!=n?s(n,"toComposite"):n))?m:r,p={name:"toComposite",hash:{},fn:l.program(8,a,0),inverse:l.noop,data:a,loc:{start:{line:13,column:28},end:{line:13,column:86}}},f=typeof m==u?m.call(t,p):m,null!=(f=s(o,"toComposite")?f:c.call(n,f,p))&&(i+=f),m=null!=(m=s(o,"color")||(null!=n?s(n,"color"):n))?m:r,p={name:"color",hash:{},fn:l.program(10,a,0),inverse:l.noop,data:a,loc:{start:{line:14,column:28},end:{line:14,column:85}}},f=typeof m==u?m.call(t,p):m,null!=(f=s(o,"color")?f:c.call(n,f,p))&&(i+=f),m=null!=(m=s(o,"width")||(null!=n?s(n,"width"):n))?m:r,p={name:"width",hash:{},fn:l.program(12,a,0),inverse:l.noop,data:a,loc:{start:{line:15,column:28},end:{line:15,column:68}}},f=typeof m==u?m.call(t,p):m,null!=(f=s(o,"width")?f:c.call(n,f,p))&&(i+=f),i+' class="'+(null!=(f=typeof(m=null!=(m=s(o,"class")||(null!=n?s(n,"class"):n))?m:r)==u?m.call(t,{name:"class",hash:{},data:a,loc:{start:{line:15,column:76},end:{line:15,column:87}}}):m)?f:"")+'"]\n'},4:function(l,n,o,e,a){return" "},6:function(l,n,o,e,a){var t=l.lookupProperty||function(l,n){if(Object.prototype.hasOwnProperty.call(l,n))return l[n]};return' ltail="cluster_'+(null!=(t="function"==typeof(o=null!=(o=t(o,"from")||(null!=n?t(n,"from"):n))?o:l.hooks.helperMissing)?o.call(null!=n?n:l.nullContext||{},{name:"from",hash:{},data:a,loc:{start:{line:12,column:63},end:{line:12,column:73}}}):o)?t:"")+'"'},8:function(l,n,o,e,a){var t=l.lookupProperty||function(l,n){if(Object.prototype.hasOwnProperty.call(l,n))return l[n]};return' lhead="cluster_'+(null!=(t="function"==typeof(o=null!=(o=t(o,"to")||(null!=n?t(n,"to"):n))?o:l.hooks.helperMissing)?o.call(null!=n?n:l.nullContext||{},{name:"to",hash:{},data:a,loc:{start:{line:13,column:61},end:{line:13,column:69}}}):o)?t:"")+'"'},10:function(l,n,o,e,a){var t,l=l.lambda;return' color="'+(null!=(t=l(n,n))?t:"")+'" fontcolor="'+(null!=(t=l(n,n))?t:"")+'"'},12:function(l,n,o,e,a){return' penwidth="'+(null!=(l=l.lambda(n,n))?l:"")+'"'},14:function(l,n,o,e,a){var t=null!=n?n:l.nullContext||{},r=l.hooks.helperMissing,u="function",c=l.hooks.blockHelperMissing,s=l.lookupProperty||function(l,n){if(Object.prototype.hasOwnProperty.call(l,n))return l[n]},i='      "'+(null!=(f=typeof(m=null!=(m=s(o,"from")||(null!=n?s(n,"from"):n))?m:r)==u?m.call(t,{name:"from",hash:{},data:a,loc:{start:{line:18,column:7},end:{line:18,column:17}}}):m)?f:"")+'" -> "self_'+(null!=(f=typeof(m=null!=(m=s(o,"name")||(null!=n?s(n,"name"):n))?m:r)==u?m.call(t,{name:"name",hash:{},data:a,loc:{start:{line:18,column:28},end:{line:18,column:38}}}):m)?f:"")+'" [label="',m=null!=(m=s(o,"label")||(null!=n?s(n,"label"):n))?m:r,p={name:"label",hash:{},fn:l.noop,inverse:l.program(4,a,0),data:a,loc:{start:{line:18,column:48},end:{line:18,column:69}}},f=typeof m==u?m.call(t,p):m;return null!=(f=s(o,"label")?f:c.call(n,f,p))&&(i+=f),i+=(null!=(f=typeof(m=null!=(m=s(o,"label")||(null!=n?s(n,"label"):n))?m:r)==u?m.call(t,{name:"label",hash:{},data:a,loc:{start:{line:18,column:69},end:{line:18,column:80}}}):m)?f:"")+'" arrowhead=none',m=null!=(m=s(o,"tailportflags")||(null!=n?s(n,"tailportflags"):n))?m:r,p={name:"tailportflags",hash:{},fn:l.program(15,a,0),inverse:l.noop,data:a,loc:{start:{line:19,column:28},end:{line:19,column:73}}},f=typeof m==u?m.call(t,p):m,null!=(f=s(o,"tailportflags")?f:c.call(n,f,p))&&(i+=f),i+=' ltail="cluster_'+(null!=(f=typeof(m=null!=(m=s(o,"from")||(null!=n?s(n,"from"):n))?m:r)==u?m.call(t,{name:"from",hash:{},data:a,loc:{start:{line:19,column:89},end:{line:19,column:99}}}):m)?f:"")+'"',m=null!=(m=s(o,"color")||(null!=n?s(n,"color"):n))?m:r,p={name:"color",hash:{},fn:l.program(10,a,0),inverse:l.noop,data:a,loc:{start:{line:20,column:28},end:{line:20,column:85}}},f=typeof m==u?m.call(t,p):m,null!=(f=s(o,"color")?f:c.call(n,f,p))&&(i+=f),i+=' class="'+(null!=(f=typeof(m=null!=(m=s(o,"class")||(null!=n?s(n,"class"):n))?m:r)==u?m.call(t,{name:"class",hash:{},data:a,loc:{start:{line:20,column:93},end:{line:20,column:104}}}):m)?f:"")+'"]\n      "self_'+(null!=(f=typeof(m=null!=(m=s(o,"name")||(null!=n?s(n,"name"):n))?m:r)==u?m.call(t,{name:"name",hash:{},data:a,loc:{start:{line:21,column:12},end:{line:21,column:22}}}):m)?f:"")+'" -> "'+(null!=(f=typeof(m=null!=(m=s(o,"from")||(null!=n?s(n,"from"):n))?m:r)==u?m.call(t,{name:"from",hash:{},data:a,loc:{start:{line:21,column:28},end:{line:21,column:38}}}):m)?f:"")+'" [lhead="cluster_'+(null!=(f=typeof(m=null!=(m=s(o,"from")||(null!=n?s(n,"from"):n))?m:r)==u?m.call(t,{name:"from",hash:{},data:a,loc:{start:{line:21,column:56},end:{line:21,column:66}}}):m)?f:"")+'"',m=null!=(m=s(o,"headportflags")||(null!=n?s(n,"headportflags"):n))?m:r,p={name:"headportflags",hash:{},fn:l.program(15,a,0),inverse:l.noop,data:a,loc:{start:{line:22,column:28},end:{line:22,column:73}}},f=typeof m==u?m.call(t,p):m,null!=(f=s(o,"headportflags")?f:c.call(n,f,p))&&(i+=f),m=null!=(m=s(o,"color")||(null!=n?s(n,"color"):n))?m:r,p={name:"color",hash:{},fn:l.program(17,a,0),inverse:l.noop,data:a,loc:{start:{line:23,column:28},end:{line:23,column:65}}},f=typeof m==u?m.call(t,p):m,null!=(f=s(o,"color")?f:c.call(n,f,p))&&(i+=f),m=null!=(m=s(o,"width")||(null!=n?s(n,"width"):n))?m:r,p={name:"width",hash:{},fn:l.program(12,a,0),inverse:l.noop,data:a,loc:{start:{line:24,column:28},end:{line:24,column:68}}},f=typeof m==u?m.call(t,p):m,null!=(f=s(o,"width")?f:c.call(n,f,p))&&(i+=f),i+' class="'+(null!=(f=typeof(m=null!=(m=s(o,"class")||(null!=n?s(n,"class"):n))?m:r)==u?m.call(t,{name:"class",hash:{},data:a,loc:{start:{line:24,column:76},end:{line:24,column:87}}}):m)?f:"")+'"]\n'},15:function(l,n,o,e,a){return" "+(null!=(l=l.lambda(n,n))?l:"")},17:function(l,n,o,e,a){return' color="'+(null!=(l=l.lambda(n,n))?l:"")+'"'},19:function(l,n,o,e,a,t,r){var u,c=l.lambda,s=l.hooks.blockHelperMissing,i=l.lookupProperty||function(l,n){if(Object.prototype.hasOwnProperty.call(l,n))return l[n]};return'      "i_'+(null!=(u=c(n,n))?u:"")+'" [shape=point style=invis margin=0 width=0 height=0 fixedsize=true]\n      "'+(null!=(u=c(null!=r[1]?i(r[1],"from"):r[1],n))?u:"")+'" -> "i_'+(null!=(u=c(n,n))?u:"")+'" [arrowhead=none'+(null!=(u=s.call(n,c(null!=r[1]?i(r[1],"fromComposite"):r[1],n),{name:"../fromComposite",hash:{},fn:l.program(20,a,0,t,r),inverse:l.noop,data:a,loc:{start:{line:30,column:32},end:{line:30,column:105}}}))?u:"")+(null!=(u=s.call(n,c(null!=r[1]?i(r[1],"color"):r[1],n),{name:"../color",hash:{},fn:l.program(17,a,0,t,r),inverse:l.noop,data:a,loc:{start:{line:31,column:32},end:{line:31,column:75}}}))?u:"")+']\n      "i_'+(null!=(u=c(n,n))?u:"")+'" -> "'+(null!=(u=c(null!=r[1]?i(r[1],"to"):r[1],n))?u:"")+'" [label="'+(null!=(u=s.call(n,c(null!=r[1]?i(r[1],"label"):r[1],n),{name:"../label",hash:{},fn:l.noop,inverse:l.program(4,a,0,t,r),data:a,loc:{start:{line:32,column:43},end:{line:32,column:70}}}))?u:"")+(null!=(u=c(null!=r[1]?i(r[1],"label"):r[1],n))?u:"")+'"'+(null!=(u=s.call(n,c(null!=r[1]?i(r[1],"toComposite"):r[1],n),{name:"../toComposite",hash:{},fn:l.program(22,a,0,t,r),inverse:l.noop,data:a,loc:{start:{line:33,column:32},end:{line:33,column:99}}}))?u:"")+(null!=(u=s.call(n,c(null!=r[1]?i(r[1],"color"):r[1],n),{name:"../color",hash:{},fn:l.program(10,a,0,t,r),inverse:l.noop,data:a,loc:{start:{line:34,column:32},end:{line:34,column:95}}}))?u:"")+']\n      "i_'+(null!=(u=c(n,n))?u:"")+'" -> "'+(null!=(u=c(n,n))?u:"")+'" [style=dashed arrowtail=none arrowhead=none weight=0]\n      "'+(null!=(u=c(n,n))?u:"")+'" [label="'+(null!=(u=c(null!=r[1]?i(r[1],"noteFlattened"):r[1],n))?u:"")+'" shape=note fontsize=10 color=black fontcolor=black fillcolor="#ffffcc" penwidth=1.0]\n'},20:function(l,n,o,e,a,t,r){var u=l.lookupProperty||function(l,n){if(Object.prototype.hasOwnProperty.call(l,n))return l[n]};return' ltail="cluster_'+(null!=(l=l.lambda(null!=r[1]?u(r[1],"from"):r[1],n))?l:"")+'"'},22:function(l,n,o,e,a,t,r){var u=l.lookupProperty||function(l,n){if(Object.prototype.hasOwnProperty.call(l,n))return l[n]};return' lhead="cluster_'+(null!=(l=l.lambda(null!=r[1]?u(r[1],"to"):r[1],n))?l:"")+'"'},compiler:[8,">= 4.3.0"],main:function(l,n,o,e,a,t,r){var u=null!=n?n:l.nullContext||{},c=l.hooks.helperMissing,s="function",i=l.lookupProperty||function(l,n){if(Object.prototype.hasOwnProperty.call(l,n))return l[n]},e='digraph "state transitions" {\n  '+(null!=(p=typeof(m=null!=(m=i(o,"graphAttributes")||(null!=n?i(n,"graphAttributes"):n))?m:c)==s?m.call(u,{name:"graphAttributes",hash:{},data:a,loc:{start:{line:2,column:2},end:{line:2,column:23}}}):m)?p:"")+"\n  node ["+(null!=(p=typeof(m=null!=(m=i(o,"nodeAttributes")||(null!=n?i(n,"nodeAttributes"):n))?m:c)==s?m.call(u,{name:"nodeAttributes",hash:{},data:a,loc:{start:{line:3,column:8},end:{line:3,column:28}}}):m)?p:"")+"]\n  edge ["+(null!=(p=typeof(m=null!=(m=i(o,"edgeAttributes")||(null!=n?i(n,"edgeAttributes"):n))?m:c)==s?m.call(u,{name:"edgeAttributes",hash:{},data:a,loc:{start:{line:4,column:8},end:{line:4,column:28}}}):m)?p:"")+"]\n\n"+(null!=(p=l.invokePartial(i(e,"dot.states.template.hbs"),n,{name:"dot.states.template.hbs",data:a,indent:"  ",helpers:o,partials:e,decorators:l.decorators}))?p:"")+"\n",m=null!=(m=i(o,"transitions")||(null!=n?i(n,"transitions"):n))?m:c,c={name:"transitions",hash:{},fn:l.program(1,a,0,t,r),inverse:l.noop,data:a,loc:{start:{line:8,column:2},end:{line:38,column:18}}},p=typeof m==s?m.call(u,c):m;return null!=(p=i(o,"transitions")?p:l.hooks.blockHelperMissing.call(n,p,c))&&(e+=p),e+"}\n"},usePartial:!0,useData:!0,useDepths:!0});
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Handlebars = require("handlebars/dist/handlebars.runtime"), template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates["scxml.template.hbs"] = template({ 1: function (e, l, t, n, a) { var r = e.lookupProperty || function (e, l) { if (Object.prototype.hasOwnProperty.call(e, l))
        return e[l]; }; return 'initial="' + e.escapeExpression("function" == typeof (t = null != (t = r(t, "initial") || (null != l ? r(l, "initial") : l)) ? t : e.hooks.helperMissing) ? t.call(null != l ? l : e.nullContext || {}, { name: "initial", hash: {}, data: a, loc: { start: { line: 2, column: 71 }, end: { line: 2, column: 82 } } }) : t) + '" '; }, compiler: [8, ">= 4.3.0"], main: function (e, l, t, n, a) { var r, s = e.lookupProperty || function (e, l) { if (Object.prototype.hasOwnProperty.call(e, l))
        return e[l]; }; return '<?xml version="1.0" encoding="UTF-8"?>\n<scxml xmlns="http://www.w3.org/2005/07/scxml" ' + (null != (r = s(t, "if").call(null != l ? l : e.nullContext || {}, null != l ? s(l, "initial") : l, { name: "if", hash: {}, fn: e.program(1, a, 0), inverse: e.noop, data: a, loc: { start: { line: 2, column: 47 }, end: { line: 2, column: 91 } } })) ? r : "") + 'version="1.0">\n' + (null != (r = e.invokePartial(s(n, "scxml.states.template.hbs"), l, { name: "scxml.states.template.hbs", data: a, helpers: t, partials: n, decorators: e.decorators })) ? r : "") + "</scxml>\n"; }, usePartial: !0, useData: !0 });
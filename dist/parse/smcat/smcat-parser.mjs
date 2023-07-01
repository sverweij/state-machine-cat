import parserHelpers from "../parser-helpers.mjs";
function peg$subclass(child, parent) {
    function C() { this.constructor = child; }
    C.prototype = parent.prototype;
    child.prototype = new C();
}
function peg$SyntaxError(message, expected, found, location) {
    var self = Error.call(this, message);
    if (Object.setPrototypeOf) {
        Object.setPrototypeOf(self, peg$SyntaxError.prototype);
    }
    self.expected = expected;
    self.found = found;
    self.location = location;
    self.name = "SyntaxError";
    return self;
}
peg$subclass(peg$SyntaxError, Error);
function peg$padEnd(str, targetLength, padString) {
    padString = padString || " ";
    if (str.length > targetLength) {
        return str;
    }
    targetLength -= str.length;
    padString += padString.repeat(targetLength);
    return str + padString.slice(0, targetLength);
}
peg$SyntaxError.prototype.format = function (sources) {
    var str = "Error: " + this.message;
    if (this.location) {
        var src = null;
        var k;
        for (k = 0; k < sources.length; k++) {
            if (sources[k].source === this.location.source) {
                src = sources[k].text.split(/\r\n|\n|\r/g);
                break;
            }
        }
        var s = this.location.start;
        var offset_s = (this.location.source && (typeof this.location.source.offset === "function"))
            ? this.location.source.offset(s)
            : s;
        var loc = this.location.source + ":" + offset_s.line + ":" + offset_s.column;
        if (src) {
            var e = this.location.end;
            var filler = peg$padEnd("", offset_s.line.toString().length, ' ');
            var line = src[s.line - 1];
            var last = s.line === e.line ? e.column : line.length + 1;
            var hatLen = (last - s.column) || 1;
            str += "\n --> " + loc + "\n"
                + filler + " |\n"
                + offset_s.line + " | " + line + "\n"
                + filler + " | " + peg$padEnd("", s.column - 1, ' ')
                + peg$padEnd("", hatLen, "^");
        }
        else {
            str += "\n at " + loc;
        }
    }
    return str;
};
peg$SyntaxError.buildMessage = function (expected, found) {
    var DESCRIBE_EXPECTATION_FNS = {
        literal: function (expectation) {
            return "\"" + literalEscape(expectation.text) + "\"";
        },
        class: function (expectation) {
            var escapedParts = expectation.parts.map(function (part) {
                return Array.isArray(part)
                    ? classEscape(part[0]) + "-" + classEscape(part[1])
                    : classEscape(part);
            });
            return "[" + (expectation.inverted ? "^" : "") + escapedParts.join("") + "]";
        },
        any: function () {
            return "any character";
        },
        end: function () {
            return "end of input";
        },
        other: function (expectation) {
            return expectation.description;
        }
    };
    function hex(ch) {
        return ch.charCodeAt(0).toString(16).toUpperCase();
    }
    function literalEscape(s) {
        return s
            .replace(/\\/g, "\\\\")
            .replace(/"/g, "\\\"")
            .replace(/\0/g, "\\0")
            .replace(/\t/g, "\\t")
            .replace(/\n/g, "\\n")
            .replace(/\r/g, "\\r")
            .replace(/[\x00-\x0F]/g, function (ch) { return "\\x0" + hex(ch); })
            .replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) { return "\\x" + hex(ch); });
    }
    function classEscape(s) {
        return s
            .replace(/\\/g, "\\\\")
            .replace(/\]/g, "\\]")
            .replace(/\^/g, "\\^")
            .replace(/-/g, "\\-")
            .replace(/\0/g, "\\0")
            .replace(/\t/g, "\\t")
            .replace(/\n/g, "\\n")
            .replace(/\r/g, "\\r")
            .replace(/[\x00-\x0F]/g, function (ch) { return "\\x0" + hex(ch); })
            .replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) { return "\\x" + hex(ch); });
    }
    function describeExpectation(expectation) {
        return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
    }
    function describeExpected(expected) {
        var descriptions = expected.map(describeExpectation);
        var i, j;
        descriptions.sort();
        if (descriptions.length > 0) {
            for (i = 1, j = 1; i < descriptions.length; i++) {
                if (descriptions[i - 1] !== descriptions[i]) {
                    descriptions[j] = descriptions[i];
                    j++;
                }
            }
            descriptions.length = j;
        }
        switch (descriptions.length) {
            case 1:
                return descriptions[0];
            case 2:
                return descriptions[0] + " or " + descriptions[1];
            default:
                return descriptions.slice(0, -1).join(", ")
                    + ", or "
                    + descriptions[descriptions.length - 1];
        }
    }
    function describeFound(found) {
        return found ? "\"" + literalEscape(found) + "\"" : "end of input";
    }
    return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
};
function peg$parse(input, options) {
    options = options !== undefined ? options : {};
    var peg$FAILED = {};
    var peg$source = options.grammarSource;
    var peg$startRuleFunctions = { program: peg$parseprogram };
    var peg$startRuleFunction = peg$parseprogram;
    var peg$c0 = ",";
    var peg$c1 = ";";
    var peg$c2 = "[";
    var peg$c3 = "]";
    var peg$c4 = ":";
    var peg$c5 = "{";
    var peg$c6 = "}";
    var peg$c7 = "=";
    var peg$c8 = "label";
    var peg$c9 = "color";
    var peg$c10 = "class";
    var peg$c11 = "active";
    var peg$c12 = "type";
    var peg$c13 = "regular";
    var peg$c14 = "initial";
    var peg$c15 = "terminate";
    var peg$c16 = "final";
    var peg$c17 = "parallel";
    var peg$c18 = "history";
    var peg$c19 = "deephistory";
    var peg$c20 = "choice";
    var peg$c21 = "forkjoin";
    var peg$c22 = "fork";
    var peg$c23 = "join";
    var peg$c24 = "junction";
    var peg$c25 = "width";
    var peg$c26 = "external";
    var peg$c27 = "internal";
    var peg$c28 = "->";
    var peg$c29 = "=>>";
    var peg$c30 = "=>";
    var peg$c31 = ">>";
    var peg$c32 = ":>";
    var peg$c33 = "--";
    var peg$c34 = "==";
    var peg$c35 = "<-";
    var peg$c36 = "<<=";
    var peg$c37 = "<=";
    var peg$c38 = "<<";
    var peg$c39 = "<:";
    var peg$c40 = "#";
    var peg$c41 = ".";
    var peg$c42 = "\"";
    var peg$c43 = "\\\"";
    var peg$c44 = "/*";
    var peg$c45 = "*/";
    var peg$c46 = "//";
    var peg$r0 = /^[0-9]/;
    var peg$r1 = /^[a-zA-Z0-9_\- ]/;
    var peg$r2 = /^[^;, "\t\n\r=\-><:{[]/;
    var peg$r3 = /^[ \t]/;
    var peg$r4 = /^[\r\n]/;
    var peg$r5 = /^[^\r\n]/;
    var peg$e0 = peg$otherExpectation("statemachine");
    var peg$e1 = peg$literalExpectation(",", false);
    var peg$e2 = peg$literalExpectation(";", false);
    var peg$e3 = peg$otherExpectation("state");
    var peg$e4 = peg$literalExpectation("[", false);
    var peg$e5 = peg$literalExpectation("]", false);
    var peg$e6 = peg$literalExpectation(":", false);
    var peg$e7 = peg$literalExpectation("{", false);
    var peg$e8 = peg$literalExpectation("}", false);
    var peg$e9 = peg$otherExpectation("extended state attributes");
    var peg$e10 = peg$otherExpectation("extended state attribute");
    var peg$e11 = peg$literalExpectation("=", false);
    var peg$e12 = peg$otherExpectation("state attribute name");
    var peg$e13 = peg$literalExpectation("label", true);
    var peg$e14 = peg$literalExpectation("color", true);
    var peg$e15 = peg$otherExpectation("class attribute");
    var peg$e16 = peg$literalExpectation("class", true);
    var peg$e17 = peg$otherExpectation("state flag");
    var peg$e18 = peg$literalExpectation("active", true);
    var peg$e19 = peg$otherExpectation("state type");
    var peg$e20 = peg$literalExpectation("type", true);
    var peg$e21 = peg$otherExpectation("state type type");
    var peg$e22 = peg$literalExpectation("regular", false);
    var peg$e23 = peg$literalExpectation("initial", false);
    var peg$e24 = peg$literalExpectation("terminate", false);
    var peg$e25 = peg$literalExpectation("final", false);
    var peg$e26 = peg$literalExpectation("parallel", false);
    var peg$e27 = peg$literalExpectation("history", false);
    var peg$e28 = peg$literalExpectation("deephistory", false);
    var peg$e29 = peg$literalExpectation("choice", false);
    var peg$e30 = peg$literalExpectation("forkjoin", false);
    var peg$e31 = peg$literalExpectation("fork", false);
    var peg$e32 = peg$literalExpectation("join", false);
    var peg$e33 = peg$literalExpectation("junction", false);
    var peg$e34 = peg$otherExpectation("transition");
    var peg$e35 = peg$otherExpectation("extended transition attributes");
    var peg$e36 = peg$otherExpectation("extended transition attribute");
    var peg$e37 = peg$otherExpectation("transition attribute name");
    var peg$e38 = peg$otherExpectation("transition type name");
    var peg$e39 = peg$otherExpectation("numeric transition attribute name");
    var peg$e40 = peg$literalExpectation("width", true);
    var peg$e41 = peg$otherExpectation("transition type value");
    var peg$e42 = peg$literalExpectation("external", false);
    var peg$e43 = peg$literalExpectation("internal", false);
    var peg$e44 = peg$otherExpectation("left to right arrow");
    var peg$e45 = peg$literalExpectation("->", false);
    var peg$e46 = peg$literalExpectation("=>>", false);
    var peg$e47 = peg$literalExpectation("=>", false);
    var peg$e48 = peg$literalExpectation(">>", false);
    var peg$e49 = peg$literalExpectation(":>", false);
    var peg$e50 = peg$literalExpectation("--", false);
    var peg$e51 = peg$literalExpectation("==", false);
    var peg$e52 = peg$otherExpectation("right to left arrow");
    var peg$e53 = peg$literalExpectation("<-", false);
    var peg$e54 = peg$literalExpectation("<<=", false);
    var peg$e55 = peg$literalExpectation("<=", false);
    var peg$e56 = peg$literalExpectation("<<", false);
    var peg$e57 = peg$literalExpectation("<:", false);
    var peg$e58 = peg$literalExpectation("#", false);
    var peg$e59 = peg$literalExpectation(".", false);
    var peg$e60 = peg$classExpectation([["0", "9"]], false, false);
    var peg$e61 = peg$otherExpectation("double quoted string");
    var peg$e62 = peg$literalExpectation("\"", false);
    var peg$e63 = peg$literalExpectation("\\\"", false);
    var peg$e64 = peg$anyExpectation();
    var peg$e65 = peg$otherExpectation("valid class string");
    var peg$e66 = peg$classExpectation([["a", "z"], ["A", "Z"], ["0", "9"], "_", "-", " "], false, false);
    var peg$e67 = peg$otherExpectation("identifier");
    var peg$e68 = peg$classExpectation([";", ",", " ", "\"", "\t", "\n", "\r", "=", "-", ">", "<", ":", "{", "["], true, false);
    var peg$e69 = peg$otherExpectation("whitespace");
    var peg$e70 = peg$classExpectation([" ", "\t"], false, false);
    var peg$e71 = peg$otherExpectation("line end");
    var peg$e72 = peg$classExpectation(["\r", "\n"], false, false);
    var peg$e73 = peg$literalExpectation("/*", false);
    var peg$e74 = peg$literalExpectation("*/", false);
    var peg$e75 = peg$literalExpectation("//", false);
    var peg$e76 = peg$classExpectation(["\r", "\n"], true, false);
    var peg$e77 = peg$otherExpectation("comment");
    var peg$f0 = function (statemachine) {
        statemachine.states = parserHelpers.extractUndeclaredStates(statemachine);
        return parserHelpers.classifyForkJoins(statemachine);
    };
    var peg$f1 = function (states, transitions) {
        let lStateMachine = {};
        parserHelpers.setIf(lStateMachine, 'states', states);
        parserHelpers.setIfNotEmpty(lStateMachine, 'transitions', transitions);
        return lStateMachine;
    };
    var peg$f2 = function (state) { return state; };
    var peg$f3 = function (state) { return state; };
    var peg$f4 = function (states) {
        return parserHelpers.uniq(states[0].concat(states[1]), parserHelpers.stateEqual);
    };
    var peg$f5 = function (notes, id, attrs) { return attrs; };
    var peg$f6 = function (notes, id, extended_state_attributes, act) { return act; };
    var peg$f7 = function (notes, id, extended_state_attributes, actions, sm) { return sm; };
    var peg$f8 = function (notes, id, extended_state_attributes, actions, statemachine) {
        let lState = parserHelpers.initState(id);
        (extended_state_attributes || []).forEach(pExtendedAttribute => parserHelpers.setIf(lState, pExtendedAttribute.name, pExtendedAttribute.value));
        parserHelpers.setIf(lState, 'typeExplicitlySet', (extended_state_attributes || []).some(pExtendedAttribute => pExtendedAttribute.typeExplicitlySet));
        parserHelpers.setIf(lState, 'statemachine', statemachine);
        parserHelpers.setIfNotEmpty(lState, 'note', notes);
        if (Boolean(actions)) {
            parserHelpers.setIfNotEmpty(lState, 'actions', parserHelpers.extractActions(actions));
        }
        return lState;
    };
    var peg$f9 = function (name, value) {
        return { name, value };
    };
    var peg$f10 = function (name, value) {
        return { name, value };
    };
    var peg$f11 = function (name) {
        return { name, value: true };
    };
    var peg$f12 = function (name, value) {
        return { name, value, typeExplicitlySet: true };
    };
    var peg$f13 = function (name) {
        return name.toLowerCase();
    };
    var peg$f14 = function (name) {
        return name.toLowerCase();
    };
    var peg$f15 = function (name) {
        return name.toLowerCase();
    };
    var peg$f16 = function (name) {
        return name.toLowerCase();
    };
    var peg$f17 = function (notes, trans, attrs) { return attrs; };
    var peg$f18 = function (notes, trans, extended_attributes, lbl) { return lbl; };
    var peg$f19 = function (notes, trans, extended_attributes, label) {
        if (label) {
            trans.label = label;
            trans = Object.assign(trans, parserHelpers.parseTransitionExpression(label));
        }
        (extended_attributes || []).forEach(pExtendedAttribute => parserHelpers.setIf(trans, pExtendedAttribute.name, pExtendedAttribute.value));
        parserHelpers.setIfNotEmpty(trans, 'note', notes);
        return trans;
    };
    var peg$f20 = function (from_, to) {
        return {
            from: from_,
            to: to
        };
    };
    var peg$f21 = function (to, from_) {
        return {
            from: from_,
            to: to
        };
    };
    var peg$f22 = function (name, value) {
        return { name, value };
    };
    var peg$f23 = function (name, value) {
        return { name, value };
    };
    var peg$f24 = function (name, value) {
        return { name, value };
    };
    var peg$f25 = function (name, value) {
        return { name, value };
    };
    var peg$f26 = function (name) {
        return name.toLowerCase();
    };
    var peg$f27 = function (name) {
        return name.toLowerCase();
    };
    var peg$f28 = function (name) {
        return name;
    };
    var peg$f29 = function (com) {
        return com.join("").trim();
    };
    var peg$f30 = function (digits) { return parseFloat(digits.join("")); };
    var peg$f31 = function (digits) { return parseInt(digits.join(""), 10); };
    var peg$f32 = function (s) { return s.join("").replace(/\\\"/g, "\""); };
    var peg$f33 = function (c) { return c; };
    var peg$f34 = function (s) { return s.join(""); };
    var peg$f35 = function (c) { return c; };
    var peg$f36 = function (s) { return s.join("").trim(); };
    var peg$f37 = function (s) { return s.join("").trim(); };
    var peg$f38 = function (c) { return c; };
    var peg$f39 = function (c) { return c; };
    var peg$f40 = function (chars) { return chars.join(""); };
    var peg$f41 = function (c) { return c; };
    var peg$f42 = function (c) { return c; };
    var peg$f43 = function (c) { return c; };
    var peg$f44 = function (start, com, end) {
        return start + com.join("") + end;
    };
    var peg$f45 = function (start, com) {
        return start + com.join("");
    };
    var peg$currPos = 0;
    var peg$savedPos = 0;
    var peg$posDetailsCache = [{ line: 1, column: 1 }];
    var peg$maxFailPos = 0;
    var peg$maxFailExpected = [];
    var peg$silentFails = 0;
    var peg$result;
    if ("startRule" in options) {
        if (!(options.startRule in peg$startRuleFunctions)) {
            throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
        }
        peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }
    function text() {
        return input.substring(peg$savedPos, peg$currPos);
    }
    function offset() {
        return peg$savedPos;
    }
    function range() {
        return {
            source: peg$source,
            start: peg$savedPos,
            end: peg$currPos
        };
    }
    function location() {
        return peg$computeLocation(peg$savedPos, peg$currPos);
    }
    function expected(description, location) {
        location = location !== undefined
            ? location
            : peg$computeLocation(peg$savedPos, peg$currPos);
        throw peg$buildStructuredError([peg$otherExpectation(description)], input.substring(peg$savedPos, peg$currPos), location);
    }
    function error(message, location) {
        location = location !== undefined
            ? location
            : peg$computeLocation(peg$savedPos, peg$currPos);
        throw peg$buildSimpleError(message, location);
    }
    function peg$literalExpectation(text, ignoreCase) {
        return { type: "literal", text: text, ignoreCase: ignoreCase };
    }
    function peg$classExpectation(parts, inverted, ignoreCase) {
        return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
    }
    function peg$anyExpectation() {
        return { type: "any" };
    }
    function peg$endExpectation() {
        return { type: "end" };
    }
    function peg$otherExpectation(description) {
        return { type: "other", description: description };
    }
    function peg$computePosDetails(pos) {
        var details = peg$posDetailsCache[pos];
        var p;
        if (details) {
            return details;
        }
        else {
            p = pos - 1;
            while (!peg$posDetailsCache[p]) {
                p--;
            }
            details = peg$posDetailsCache[p];
            details = {
                line: details.line,
                column: details.column
            };
            while (p < pos) {
                if (input.charCodeAt(p) === 10) {
                    details.line++;
                    details.column = 1;
                }
                else {
                    details.column++;
                }
                p++;
            }
            peg$posDetailsCache[pos] = details;
            return details;
        }
    }
    function peg$computeLocation(startPos, endPos, offset) {
        var startPosDetails = peg$computePosDetails(startPos);
        var endPosDetails = peg$computePosDetails(endPos);
        var res = {
            source: peg$source,
            start: {
                offset: startPos,
                line: startPosDetails.line,
                column: startPosDetails.column
            },
            end: {
                offset: endPos,
                line: endPosDetails.line,
                column: endPosDetails.column
            }
        };
        if (offset && peg$source && (typeof peg$source.offset === "function")) {
            res.start = peg$source.offset(res.start);
            res.end = peg$source.offset(res.end);
        }
        return res;
    }
    function peg$fail(expected) {
        if (peg$currPos < peg$maxFailPos) {
            return;
        }
        if (peg$currPos > peg$maxFailPos) {
            peg$maxFailPos = peg$currPos;
            peg$maxFailExpected = [];
        }
        peg$maxFailExpected.push(expected);
    }
    function peg$buildSimpleError(message, location) {
        return new peg$SyntaxError(message, null, null, location);
    }
    function peg$buildStructuredError(expected, found, location) {
        return new peg$SyntaxError(peg$SyntaxError.buildMessage(expected, found), expected, found, location);
    }
    function peg$parseprogram() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;
        s1 = peg$parse_();
        s2 = peg$parsestatemachine();
        s3 = peg$parse_();
        peg$savedPos = s0;
        s0 = peg$f0(s2);
        return s0;
    }
    function peg$parsestatemachine() {
        var s0, s1, s2, s3;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parsestates();
        if (s1 === peg$FAILED) {
            s1 = null;
        }
        s2 = [];
        s3 = peg$parsetransition();
        while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parsetransition();
        }
        peg$savedPos = s0;
        s0 = peg$f1(s1, s2);
        peg$silentFails--;
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
            peg$fail(peg$e0);
        }
        return s0;
    }
    function peg$parsestates() {
        var s0, s1, s2, s3, s4, s5;
        s0 = peg$currPos;
        s1 = peg$currPos;
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parsestate();
        if (s4 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 44) {
                s5 = peg$c0;
                peg$currPos++;
            }
            else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$e1);
                }
            }
            if (s5 !== peg$FAILED) {
                peg$savedPos = s3;
                s3 = peg$f2(s4);
            }
            else {
                peg$currPos = s3;
                s3 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s3;
            s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$currPos;
            s4 = peg$parsestate();
            if (s4 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 44) {
                    s5 = peg$c0;
                    peg$currPos++;
                }
                else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$e1);
                    }
                }
                if (s5 !== peg$FAILED) {
                    peg$savedPos = s3;
                    s3 = peg$f2(s4);
                }
                else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s3;
                s3 = peg$FAILED;
            }
        }
        s3 = peg$currPos;
        s4 = peg$parsestate();
        if (s4 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 59) {
                s5 = peg$c1;
                peg$currPos++;
            }
            else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$e2);
                }
            }
            if (s5 !== peg$FAILED) {
                peg$savedPos = s3;
                s3 = peg$f3(s4);
            }
            else {
                peg$currPos = s3;
                s3 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s3;
            s3 = peg$FAILED;
        }
        if (s3 !== peg$FAILED) {
            s2 = [s2, s3];
            s1 = s2;
        }
        else {
            peg$currPos = s1;
            s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$f4(s1);
        }
        s0 = s1;
        return s0;
    }
    function peg$parsestate() {
        var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parsenote();
        while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$parsenote();
        }
        s2 = peg$parse_();
        s3 = peg$parseidentifier();
        if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            s5 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 91) {
                s6 = peg$c2;
                peg$currPos++;
            }
            else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$e4);
                }
            }
            if (s6 !== peg$FAILED) {
                s7 = peg$parseextended_state_attributes();
                if (input.charCodeAt(peg$currPos) === 93) {
                    s8 = peg$c3;
                    peg$currPos++;
                }
                else {
                    s8 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$e5);
                    }
                }
                if (s8 !== peg$FAILED) {
                    peg$savedPos = s5;
                    s5 = peg$f5(s1, s3, s7);
                }
                else {
                    peg$currPos = s5;
                    s5 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s5;
                s5 = peg$FAILED;
            }
            if (s5 === peg$FAILED) {
                s5 = null;
            }
            s6 = peg$parse_();
            s7 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 58) {
                s8 = peg$c4;
                peg$currPos++;
            }
            else {
                s8 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$e6);
                }
            }
            if (s8 !== peg$FAILED) {
                s9 = peg$parse_();
                s10 = peg$parsestring();
                if (s10 !== peg$FAILED) {
                    s11 = peg$parse_();
                    peg$savedPos = s7;
                    s7 = peg$f6(s1, s3, s5, s10);
                }
                else {
                    peg$currPos = s7;
                    s7 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s7;
                s7 = peg$FAILED;
            }
            if (s7 === peg$FAILED) {
                s7 = null;
            }
            s8 = peg$parse_();
            s9 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 123) {
                s10 = peg$c5;
                peg$currPos++;
            }
            else {
                s10 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$e7);
                }
            }
            if (s10 !== peg$FAILED) {
                s11 = peg$parse_();
                s12 = peg$parsestatemachine();
                if (s12 !== peg$FAILED) {
                    s13 = peg$parse_();
                    if (input.charCodeAt(peg$currPos) === 125) {
                        s14 = peg$c6;
                        peg$currPos++;
                    }
                    else {
                        s14 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$e8);
                        }
                    }
                    if (s14 !== peg$FAILED) {
                        peg$savedPos = s9;
                        s9 = peg$f7(s1, s3, s5, s7, s12);
                    }
                    else {
                        peg$currPos = s9;
                        s9 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s9;
                    s9 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s9;
                s9 = peg$FAILED;
            }
            if (s9 === peg$FAILED) {
                s9 = null;
            }
            s10 = peg$parse_();
            peg$savedPos = s0;
            s0 = peg$f8(s1, s3, s5, s7, s9);
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e3);
            }
        }
        return s0;
    }
    function peg$parseextended_state_attributes() {
        var s0, s1;
        peg$silentFails++;
        s0 = [];
        s1 = peg$parseextended_state_attribute();
        while (s1 !== peg$FAILED) {
            s0.push(s1);
            s1 = peg$parseextended_state_attribute();
        }
        peg$silentFails--;
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
            peg$fail(peg$e9);
        }
        return s0;
    }
    function peg$parseextended_state_attribute() {
        var s0, s1, s2, s3, s4, s5, s6, s7;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parse_();
        s2 = peg$parseextended_state_string_attribute_name();
        if (s2 !== peg$FAILED) {
            s3 = peg$parse_();
            if (input.charCodeAt(peg$currPos) === 61) {
                s4 = peg$c7;
                peg$currPos++;
            }
            else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$e11);
                }
            }
            if (s4 !== peg$FAILED) {
                s5 = peg$parse_();
                s6 = peg$parsequotedstring();
                if (s6 !== peg$FAILED) {
                    s7 = peg$parse_();
                    peg$savedPos = s0;
                    s0 = peg$f9(s2, s6);
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parse_();
            s2 = peg$parseclass_attribute_name();
            if (s2 !== peg$FAILED) {
                s3 = peg$parse_();
                if (input.charCodeAt(peg$currPos) === 61) {
                    s4 = peg$c7;
                    peg$currPos++;
                }
                else {
                    s4 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$e11);
                    }
                }
                if (s4 !== peg$FAILED) {
                    s5 = peg$parse_();
                    s6 = peg$parseclass_string();
                    if (s6 !== peg$FAILED) {
                        s7 = peg$parse_();
                        peg$savedPos = s0;
                        s0 = peg$f10(s2, s6);
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parse_();
                s2 = peg$parseextended_state_boolean_attribute_name();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parse_();
                    peg$savedPos = s0;
                    s0 = peg$f11(s2);
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = peg$parse_();
                    s2 = peg$parseextended_state_type_attribute_name();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parse_();
                        if (input.charCodeAt(peg$currPos) === 61) {
                            s4 = peg$c7;
                            peg$currPos++;
                        }
                        else {
                            s4 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$e11);
                            }
                        }
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parse_();
                            s6 = peg$parseextended_state_type_attribute_type();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parse_();
                                peg$savedPos = s0;
                                s0 = peg$f12(s2, s6);
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
            }
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e10);
            }
        }
        return s0;
    }
    function peg$parseextended_state_string_attribute_name() {
        var s0, s1;
        peg$silentFails++;
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 5).toLowerCase() === peg$c8) {
            s1 = input.substr(peg$currPos, 5);
            peg$currPos += 5;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e13);
            }
        }
        if (s1 === peg$FAILED) {
            if (input.substr(peg$currPos, 5).toLowerCase() === peg$c9) {
                s1 = input.substr(peg$currPos, 5);
                peg$currPos += 5;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$e14);
                }
            }
        }
        if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$f13(s1);
        }
        s0 = s1;
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e12);
            }
        }
        return s0;
    }
    function peg$parseclass_attribute_name() {
        var s0, s1;
        peg$silentFails++;
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 5).toLowerCase() === peg$c10) {
            s1 = input.substr(peg$currPos, 5);
            peg$currPos += 5;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e16);
            }
        }
        if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$f14(s1);
        }
        s0 = s1;
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e15);
            }
        }
        return s0;
    }
    function peg$parseextended_state_boolean_attribute_name() {
        var s0, s1;
        peg$silentFails++;
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 6).toLowerCase() === peg$c11) {
            s1 = input.substr(peg$currPos, 6);
            peg$currPos += 6;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e18);
            }
        }
        if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$f15(s1);
        }
        s0 = s1;
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e17);
            }
        }
        return s0;
    }
    function peg$parseextended_state_type_attribute_name() {
        var s0, s1;
        peg$silentFails++;
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 4).toLowerCase() === peg$c12) {
            s1 = input.substr(peg$currPos, 4);
            peg$currPos += 4;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e20);
            }
        }
        if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$f16(s1);
        }
        s0 = s1;
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e19);
            }
        }
        return s0;
    }
    function peg$parseextended_state_type_attribute_type() {
        var s0, s1;
        peg$silentFails++;
        if (input.substr(peg$currPos, 7) === peg$c13) {
            s0 = peg$c13;
            peg$currPos += 7;
        }
        else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e22);
            }
        }
        if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 7) === peg$c14) {
                s0 = peg$c14;
                peg$currPos += 7;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$e23);
                }
            }
            if (s0 === peg$FAILED) {
                if (input.substr(peg$currPos, 9) === peg$c15) {
                    s0 = peg$c15;
                    peg$currPos += 9;
                }
                else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$e24);
                    }
                }
                if (s0 === peg$FAILED) {
                    if (input.substr(peg$currPos, 5) === peg$c16) {
                        s0 = peg$c16;
                        peg$currPos += 5;
                    }
                    else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$e25);
                        }
                    }
                    if (s0 === peg$FAILED) {
                        if (input.substr(peg$currPos, 8) === peg$c17) {
                            s0 = peg$c17;
                            peg$currPos += 8;
                        }
                        else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$e26);
                            }
                        }
                        if (s0 === peg$FAILED) {
                            if (input.substr(peg$currPos, 7) === peg$c18) {
                                s0 = peg$c18;
                                peg$currPos += 7;
                            }
                            else {
                                s0 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$e27);
                                }
                            }
                            if (s0 === peg$FAILED) {
                                if (input.substr(peg$currPos, 11) === peg$c19) {
                                    s0 = peg$c19;
                                    peg$currPos += 11;
                                }
                                else {
                                    s0 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$e28);
                                    }
                                }
                                if (s0 === peg$FAILED) {
                                    if (input.substr(peg$currPos, 6) === peg$c20) {
                                        s0 = peg$c20;
                                        peg$currPos += 6;
                                    }
                                    else {
                                        s0 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$e29);
                                        }
                                    }
                                    if (s0 === peg$FAILED) {
                                        if (input.substr(peg$currPos, 8) === peg$c21) {
                                            s0 = peg$c21;
                                            peg$currPos += 8;
                                        }
                                        else {
                                            s0 = peg$FAILED;
                                            if (peg$silentFails === 0) {
                                                peg$fail(peg$e30);
                                            }
                                        }
                                        if (s0 === peg$FAILED) {
                                            if (input.substr(peg$currPos, 4) === peg$c22) {
                                                s0 = peg$c22;
                                                peg$currPos += 4;
                                            }
                                            else {
                                                s0 = peg$FAILED;
                                                if (peg$silentFails === 0) {
                                                    peg$fail(peg$e31);
                                                }
                                            }
                                            if (s0 === peg$FAILED) {
                                                if (input.substr(peg$currPos, 4) === peg$c23) {
                                                    s0 = peg$c23;
                                                    peg$currPos += 4;
                                                }
                                                else {
                                                    s0 = peg$FAILED;
                                                    if (peg$silentFails === 0) {
                                                        peg$fail(peg$e32);
                                                    }
                                                }
                                                if (s0 === peg$FAILED) {
                                                    if (input.substr(peg$currPos, 8) === peg$c24) {
                                                        s0 = peg$c24;
                                                        peg$currPos += 8;
                                                    }
                                                    else {
                                                        s0 = peg$FAILED;
                                                        if (peg$silentFails === 0) {
                                                            peg$fail(peg$e33);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e21);
            }
        }
        return s0;
    }
    function peg$parsetransition() {
        var s0, s1, s2, s3, s4, s5, s6, s7, s8;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parsenote();
        while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$parsenote();
        }
        s2 = peg$parsetransitionbase();
        if (s2 !== peg$FAILED) {
            s3 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 91) {
                s4 = peg$c2;
                peg$currPos++;
            }
            else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$e4);
                }
            }
            if (s4 !== peg$FAILED) {
                s5 = peg$parseextended_transition_attributes();
                if (input.charCodeAt(peg$currPos) === 93) {
                    s6 = peg$c3;
                    peg$currPos++;
                }
                else {
                    s6 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$e5);
                    }
                }
                if (s6 !== peg$FAILED) {
                    s7 = peg$parse_();
                    peg$savedPos = s3;
                    s3 = peg$f17(s1, s2, s5);
                }
                else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s3;
                s3 = peg$FAILED;
            }
            if (s3 === peg$FAILED) {
                s3 = null;
            }
            s4 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 58) {
                s5 = peg$c4;
                peg$currPos++;
            }
            else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$e6);
                }
            }
            if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                s7 = peg$parsetransitionstring();
                if (s7 !== peg$FAILED) {
                    s8 = peg$parse_();
                    peg$savedPos = s4;
                    s4 = peg$f18(s1, s2, s3, s7);
                }
                else {
                    peg$currPos = s4;
                    s4 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s4;
                s4 = peg$FAILED;
            }
            if (s4 === peg$FAILED) {
                s4 = null;
            }
            if (input.charCodeAt(peg$currPos) === 59) {
                s5 = peg$c1;
                peg$currPos++;
            }
            else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$e2);
                }
            }
            if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s0 = peg$f19(s1, s2, s3, s4);
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e34);
            }
        }
        return s0;
    }
    function peg$parsetransitionbase() {
        var s0, s1, s2, s3, s4, s5, s6, s7;
        s0 = peg$currPos;
        s1 = peg$parse_();
        s2 = peg$parseidentifier();
        if (s2 !== peg$FAILED) {
            s3 = peg$parse_();
            s4 = peg$parsefwdarrowtoken();
            if (s4 !== peg$FAILED) {
                s5 = peg$parse_();
                s6 = peg$parseidentifier();
                if (s6 !== peg$FAILED) {
                    s7 = peg$parse_();
                    peg$savedPos = s0;
                    s0 = peg$f20(s2, s6);
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parse_();
            s2 = peg$parseidentifier();
            if (s2 !== peg$FAILED) {
                s3 = peg$parse_();
                s4 = peg$parsebckarrowtoken();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parse_();
                    s6 = peg$parseidentifier();
                    if (s6 !== peg$FAILED) {
                        s7 = peg$parse_();
                        peg$savedPos = s0;
                        s0 = peg$f21(s2, s6);
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        return s0;
    }
    function peg$parseextended_transition_attributes() {
        var s0, s1;
        peg$silentFails++;
        s0 = [];
        s1 = peg$parseextended_transition_attribute();
        while (s1 !== peg$FAILED) {
            s0.push(s1);
            s1 = peg$parseextended_transition_attribute();
        }
        peg$silentFails--;
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
            peg$fail(peg$e35);
        }
        return s0;
    }
    function peg$parseextended_transition_attribute() {
        var s0, s1, s2, s3, s4, s5, s6, s7;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parse_();
        s2 = peg$parseextended_transition_string_attribute_name();
        if (s2 !== peg$FAILED) {
            s3 = peg$parse_();
            if (input.charCodeAt(peg$currPos) === 61) {
                s4 = peg$c7;
                peg$currPos++;
            }
            else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$e11);
                }
            }
            if (s4 !== peg$FAILED) {
                s5 = peg$parse_();
                s6 = peg$parsequotedstring();
                if (s6 !== peg$FAILED) {
                    s7 = peg$parse_();
                    peg$savedPos = s0;
                    s0 = peg$f22(s2, s6);
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parse_();
            s2 = peg$parseclass_attribute_name();
            if (s2 !== peg$FAILED) {
                s3 = peg$parse_();
                if (input.charCodeAt(peg$currPos) === 61) {
                    s4 = peg$c7;
                    peg$currPos++;
                }
                else {
                    s4 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$e11);
                    }
                }
                if (s4 !== peg$FAILED) {
                    s5 = peg$parse_();
                    s6 = peg$parseclass_string();
                    if (s6 !== peg$FAILED) {
                        s7 = peg$parse_();
                        peg$savedPos = s0;
                        s0 = peg$f23(s2, s6);
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parse_();
                s2 = peg$parseextended_transition_type_name();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parse_();
                    if (input.charCodeAt(peg$currPos) === 61) {
                        s4 = peg$c7;
                        peg$currPos++;
                    }
                    else {
                        s4 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$e11);
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parse_();
                        s6 = peg$parseextended_transition_type_value();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parse_();
                            peg$savedPos = s0;
                            s0 = peg$f24(s2, s6);
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = peg$parse_();
                    s2 = peg$parseextended_transition_numeric_attribute_name();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parse_();
                        if (input.charCodeAt(peg$currPos) === 61) {
                            s4 = peg$c7;
                            peg$currPos++;
                        }
                        else {
                            s4 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$e11);
                            }
                        }
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parse_();
                            s6 = peg$parsepositive_number();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parse_();
                                peg$savedPos = s0;
                                s0 = peg$f25(s2, s6);
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
            }
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e36);
            }
        }
        return s0;
    }
    function peg$parseextended_transition_string_attribute_name() {
        var s0, s1;
        peg$silentFails++;
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 5).toLowerCase() === peg$c9) {
            s1 = input.substr(peg$currPos, 5);
            peg$currPos += 5;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e14);
            }
        }
        if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$f26(s1);
        }
        s0 = s1;
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e37);
            }
        }
        return s0;
    }
    function peg$parseextended_transition_type_name() {
        var s0, s1;
        peg$silentFails++;
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 4).toLowerCase() === peg$c12) {
            s1 = input.substr(peg$currPos, 4);
            peg$currPos += 4;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e20);
            }
        }
        if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$f27(s1);
        }
        s0 = s1;
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e38);
            }
        }
        return s0;
    }
    function peg$parseextended_transition_numeric_attribute_name() {
        var s0, s1;
        peg$silentFails++;
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 5).toLowerCase() === peg$c25) {
            s1 = input.substr(peg$currPos, 5);
            peg$currPos += 5;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e40);
            }
        }
        if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$f28(s1);
        }
        s0 = s1;
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e39);
            }
        }
        return s0;
    }
    function peg$parseextended_transition_type_value() {
        var s0, s1;
        peg$silentFails++;
        if (input.substr(peg$currPos, 8) === peg$c26) {
            s0 = peg$c26;
            peg$currPos += 8;
        }
        else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e42);
            }
        }
        if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 8) === peg$c27) {
                s0 = peg$c27;
                peg$currPos += 8;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$e43);
                }
            }
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e41);
            }
        }
        return s0;
    }
    function peg$parsefwdarrowtoken() {
        var s0, s1;
        peg$silentFails++;
        if (input.substr(peg$currPos, 2) === peg$c28) {
            s0 = peg$c28;
            peg$currPos += 2;
        }
        else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e45);
            }
        }
        if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 3) === peg$c29) {
                s0 = peg$c29;
                peg$currPos += 3;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$e46);
                }
            }
            if (s0 === peg$FAILED) {
                if (input.substr(peg$currPos, 2) === peg$c30) {
                    s0 = peg$c30;
                    peg$currPos += 2;
                }
                else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$e47);
                    }
                }
                if (s0 === peg$FAILED) {
                    if (input.substr(peg$currPos, 2) === peg$c31) {
                        s0 = peg$c31;
                        peg$currPos += 2;
                    }
                    else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$e48);
                        }
                    }
                    if (s0 === peg$FAILED) {
                        if (input.substr(peg$currPos, 2) === peg$c32) {
                            s0 = peg$c32;
                            peg$currPos += 2;
                        }
                        else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$e49);
                            }
                        }
                        if (s0 === peg$FAILED) {
                            if (input.substr(peg$currPos, 2) === peg$c33) {
                                s0 = peg$c33;
                                peg$currPos += 2;
                            }
                            else {
                                s0 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$e50);
                                }
                            }
                            if (s0 === peg$FAILED) {
                                if (input.substr(peg$currPos, 2) === peg$c34) {
                                    s0 = peg$c34;
                                    peg$currPos += 2;
                                }
                                else {
                                    s0 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$e51);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e44);
            }
        }
        return s0;
    }
    function peg$parsebckarrowtoken() {
        var s0, s1;
        peg$silentFails++;
        if (input.substr(peg$currPos, 2) === peg$c35) {
            s0 = peg$c35;
            peg$currPos += 2;
        }
        else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e53);
            }
        }
        if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 3) === peg$c36) {
                s0 = peg$c36;
                peg$currPos += 3;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$e54);
                }
            }
            if (s0 === peg$FAILED) {
                if (input.substr(peg$currPos, 2) === peg$c37) {
                    s0 = peg$c37;
                    peg$currPos += 2;
                }
                else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$e55);
                    }
                }
                if (s0 === peg$FAILED) {
                    if (input.substr(peg$currPos, 2) === peg$c38) {
                        s0 = peg$c38;
                        peg$currPos += 2;
                    }
                    else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$e56);
                        }
                    }
                    if (s0 === peg$FAILED) {
                        if (input.substr(peg$currPos, 2) === peg$c39) {
                            s0 = peg$c39;
                            peg$currPos += 2;
                        }
                        else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$e57);
                            }
                        }
                    }
                }
            }
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e52);
            }
        }
        return s0;
    }
    function peg$parsenote() {
        var s0, s1, s2, s3, s4;
        s0 = peg$currPos;
        s1 = peg$parse_();
        if (input.charCodeAt(peg$currPos) === 35) {
            s2 = peg$c40;
            peg$currPos++;
        }
        else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e58);
            }
        }
        if (s2 !== peg$FAILED) {
            s3 = [];
            s4 = peg$parseslcomtok();
            while (s4 !== peg$FAILED) {
                s3.push(s4);
                s4 = peg$parseslcomtok();
            }
            peg$savedPos = s0;
            s0 = peg$f29(s3);
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        return s0;
    }
    function peg$parsepositive_number() {
        var s0;
        s0 = peg$parsepositive_real();
        if (s0 === peg$FAILED) {
            s0 = peg$parsecardinal();
        }
        return s0;
    }
    function peg$parsepositive_real() {
        var s0, s1, s2, s3, s4;
        s0 = peg$currPos;
        s1 = peg$currPos;
        s2 = peg$parsecardinal();
        if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 46) {
                s3 = peg$c41;
                peg$currPos++;
            }
            else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$e59);
                }
            }
            if (s3 !== peg$FAILED) {
                s4 = peg$parsecardinal();
                if (s4 !== peg$FAILED) {
                    s2 = [s2, s3, s4];
                    s1 = s2;
                }
                else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s1;
            s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$f30(s1);
        }
        s0 = s1;
        return s0;
    }
    function peg$parsecardinal() {
        var s0, s1, s2;
        s0 = peg$currPos;
        s1 = [];
        if (peg$r0.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
        }
        else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e60);
            }
        }
        if (s2 !== peg$FAILED) {
            while (s2 !== peg$FAILED) {
                s1.push(s2);
                if (peg$r0.test(input.charAt(peg$currPos))) {
                    s2 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$e60);
                    }
                }
            }
        }
        else {
            s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$f31(s1);
        }
        s0 = s1;
        return s0;
    }
    function peg$parsetransitionstring() {
        var s0;
        s0 = peg$parsequotedstring();
        if (s0 === peg$FAILED) {
            s0 = peg$parseunquotedtransitionstring();
        }
        return s0;
    }
    function peg$parsestring() {
        var s0;
        s0 = peg$parsequotedstring();
        if (s0 === peg$FAILED) {
            s0 = peg$parseunquotedstring();
        }
        return s0;
    }
    function peg$parsequotedstring() {
        var s0, s1, s2, s3;
        peg$silentFails++;
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 34) {
            s1 = peg$c42;
            peg$currPos++;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e62);
            }
        }
        if (s1 !== peg$FAILED) {
            s2 = peg$parsestringcontent();
            if (input.charCodeAt(peg$currPos) === 34) {
                s3 = peg$c42;
                peg$currPos++;
            }
            else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$e62);
                }
            }
            if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s0 = peg$f32(s2);
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e61);
            }
        }
        return s0;
    }
    function peg$parsestringcontent() {
        var s0, s1, s2, s3;
        s0 = [];
        s1 = peg$currPos;
        s2 = peg$currPos;
        peg$silentFails++;
        if (input.charCodeAt(peg$currPos) === 34) {
            s3 = peg$c42;
            peg$currPos++;
        }
        else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e62);
            }
        }
        peg$silentFails--;
        if (s3 === peg$FAILED) {
            s2 = undefined;
        }
        else {
            peg$currPos = s2;
            s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
            if (input.substr(peg$currPos, 2) === peg$c43) {
                s3 = peg$c43;
                peg$currPos += 2;
            }
            else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$e63);
                }
            }
            if (s3 === peg$FAILED) {
                if (input.length > peg$currPos) {
                    s3 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$e64);
                    }
                }
            }
            if (s3 !== peg$FAILED) {
                peg$savedPos = s1;
                s1 = peg$f33(s3);
            }
            else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s1;
            s1 = peg$FAILED;
        }
        while (s1 !== peg$FAILED) {
            s0.push(s1);
            s1 = peg$currPos;
            s2 = peg$currPos;
            peg$silentFails++;
            if (input.charCodeAt(peg$currPos) === 34) {
                s3 = peg$c42;
                peg$currPos++;
            }
            else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$e62);
                }
            }
            peg$silentFails--;
            if (s3 === peg$FAILED) {
                s2 = undefined;
            }
            else {
                peg$currPos = s2;
                s2 = peg$FAILED;
            }
            if (s2 !== peg$FAILED) {
                if (input.substr(peg$currPos, 2) === peg$c43) {
                    s3 = peg$c43;
                    peg$currPos += 2;
                }
                else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$e63);
                    }
                }
                if (s3 === peg$FAILED) {
                    if (input.length > peg$currPos) {
                        s3 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$e64);
                        }
                    }
                }
                if (s3 !== peg$FAILED) {
                    peg$savedPos = s1;
                    s1 = peg$f33(s3);
                }
                else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
        }
        return s0;
    }
    function peg$parseclass_string() {
        var s0, s1, s2, s3;
        peg$silentFails++;
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 34) {
            s1 = peg$c42;
            peg$currPos++;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e62);
            }
        }
        if (s1 !== peg$FAILED) {
            s2 = peg$parseclass_stringcontent();
            if (input.charCodeAt(peg$currPos) === 34) {
                s3 = peg$c42;
                peg$currPos++;
            }
            else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$e62);
                }
            }
            if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s0 = peg$f34(s2);
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e65);
            }
        }
        return s0;
    }
    function peg$parseclass_stringcontent() {
        var s0, s1, s2, s3;
        s0 = [];
        s1 = peg$currPos;
        s2 = peg$currPos;
        peg$silentFails++;
        if (input.charCodeAt(peg$currPos) === 34) {
            s3 = peg$c42;
            peg$currPos++;
        }
        else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e62);
            }
        }
        peg$silentFails--;
        if (s3 === peg$FAILED) {
            s2 = undefined;
        }
        else {
            peg$currPos = s2;
            s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
            if (peg$r1.test(input.charAt(peg$currPos))) {
                s3 = input.charAt(peg$currPos);
                peg$currPos++;
            }
            else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$e66);
                }
            }
            if (s3 !== peg$FAILED) {
                peg$savedPos = s1;
                s1 = peg$f35(s3);
            }
            else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s1;
            s1 = peg$FAILED;
        }
        while (s1 !== peg$FAILED) {
            s0.push(s1);
            s1 = peg$currPos;
            s2 = peg$currPos;
            peg$silentFails++;
            if (input.charCodeAt(peg$currPos) === 34) {
                s3 = peg$c42;
                peg$currPos++;
            }
            else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$e62);
                }
            }
            peg$silentFails--;
            if (s3 === peg$FAILED) {
                s2 = undefined;
            }
            else {
                peg$currPos = s2;
                s2 = peg$FAILED;
            }
            if (s2 !== peg$FAILED) {
                if (peg$r1.test(input.charAt(peg$currPos))) {
                    s3 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$e66);
                    }
                }
                if (s3 !== peg$FAILED) {
                    peg$savedPos = s1;
                    s1 = peg$f35(s3);
                }
                else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
        }
        return s0;
    }
    function peg$parseunquotedtransitionstring() {
        var s0, s1;
        s0 = peg$currPos;
        s1 = peg$parsetransitionnonsep();
        peg$savedPos = s0;
        s1 = peg$f36(s1);
        s0 = s1;
        return s0;
    }
    function peg$parseunquotedstring() {
        var s0, s1;
        s0 = peg$currPos;
        s1 = peg$parsenonsep();
        peg$savedPos = s0;
        s1 = peg$f37(s1);
        s0 = s1;
        return s0;
    }
    function peg$parsenonsep() {
        var s0, s1, s2, s3;
        s0 = [];
        s1 = peg$currPos;
        s2 = peg$currPos;
        peg$silentFails++;
        if (input.charCodeAt(peg$currPos) === 44) {
            s3 = peg$c0;
            peg$currPos++;
        }
        else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e1);
            }
        }
        if (s3 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 59) {
                s3 = peg$c1;
                peg$currPos++;
            }
            else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$e2);
                }
            }
            if (s3 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 123) {
                    s3 = peg$c5;
                    peg$currPos++;
                }
                else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$e7);
                    }
                }
            }
        }
        peg$silentFails--;
        if (s3 === peg$FAILED) {
            s2 = undefined;
        }
        else {
            peg$currPos = s2;
            s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
            if (input.length > peg$currPos) {
                s3 = input.charAt(peg$currPos);
                peg$currPos++;
            }
            else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$e64);
                }
            }
            if (s3 !== peg$FAILED) {
                peg$savedPos = s1;
                s1 = peg$f38(s3);
            }
            else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s1;
            s1 = peg$FAILED;
        }
        while (s1 !== peg$FAILED) {
            s0.push(s1);
            s1 = peg$currPos;
            s2 = peg$currPos;
            peg$silentFails++;
            if (input.charCodeAt(peg$currPos) === 44) {
                s3 = peg$c0;
                peg$currPos++;
            }
            else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$e1);
                }
            }
            if (s3 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 59) {
                    s3 = peg$c1;
                    peg$currPos++;
                }
                else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$e2);
                    }
                }
                if (s3 === peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 123) {
                        s3 = peg$c5;
                        peg$currPos++;
                    }
                    else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$e7);
                        }
                    }
                }
            }
            peg$silentFails--;
            if (s3 === peg$FAILED) {
                s2 = undefined;
            }
            else {
                peg$currPos = s2;
                s2 = peg$FAILED;
            }
            if (s2 !== peg$FAILED) {
                if (input.length > peg$currPos) {
                    s3 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$e64);
                    }
                }
                if (s3 !== peg$FAILED) {
                    peg$savedPos = s1;
                    s1 = peg$f38(s3);
                }
                else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
        }
        return s0;
    }
    function peg$parsetransitionnonsep() {
        var s0, s1, s2, s3;
        s0 = [];
        s1 = peg$currPos;
        s2 = peg$currPos;
        peg$silentFails++;
        if (input.charCodeAt(peg$currPos) === 59) {
            s3 = peg$c1;
            peg$currPos++;
        }
        else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e2);
            }
        }
        if (s3 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 123) {
                s3 = peg$c5;
                peg$currPos++;
            }
            else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$e7);
                }
            }
        }
        peg$silentFails--;
        if (s3 === peg$FAILED) {
            s2 = undefined;
        }
        else {
            peg$currPos = s2;
            s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
            if (input.length > peg$currPos) {
                s3 = input.charAt(peg$currPos);
                peg$currPos++;
            }
            else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$e64);
                }
            }
            if (s3 !== peg$FAILED) {
                peg$savedPos = s1;
                s1 = peg$f39(s3);
            }
            else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s1;
            s1 = peg$FAILED;
        }
        while (s1 !== peg$FAILED) {
            s0.push(s1);
            s1 = peg$currPos;
            s2 = peg$currPos;
            peg$silentFails++;
            if (input.charCodeAt(peg$currPos) === 59) {
                s3 = peg$c1;
                peg$currPos++;
            }
            else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$e2);
                }
            }
            if (s3 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 123) {
                    s3 = peg$c5;
                    peg$currPos++;
                }
                else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$e7);
                    }
                }
            }
            peg$silentFails--;
            if (s3 === peg$FAILED) {
                s2 = undefined;
            }
            else {
                peg$currPos = s2;
                s2 = peg$FAILED;
            }
            if (s2 !== peg$FAILED) {
                if (input.length > peg$currPos) {
                    s3 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$e64);
                    }
                }
                if (s3 !== peg$FAILED) {
                    peg$savedPos = s1;
                    s1 = peg$f39(s3);
                }
                else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
        }
        return s0;
    }
    function peg$parseidentifier() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = [];
        if (peg$r2.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
        }
        else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e68);
            }
        }
        if (s2 !== peg$FAILED) {
            while (s2 !== peg$FAILED) {
                s1.push(s2);
                if (peg$r2.test(input.charAt(peg$currPos))) {
                    s2 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$e68);
                    }
                }
            }
        }
        else {
            s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$f40(s1);
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
            s0 = peg$parsequotedstring();
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e67);
            }
        }
        return s0;
    }
    function peg$parsewhitespace() {
        var s0, s1;
        peg$silentFails++;
        s0 = peg$currPos;
        if (peg$r3.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e70);
            }
        }
        if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$f41(s1);
        }
        s0 = s1;
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e69);
            }
        }
        return s0;
    }
    function peg$parselineend() {
        var s0, s1;
        peg$silentFails++;
        s0 = peg$currPos;
        if (peg$r4.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e72);
            }
        }
        if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$f42(s1);
        }
        s0 = s1;
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e71);
            }
        }
        return s0;
    }
    function peg$parsemlcomstart() {
        var s0;
        if (input.substr(peg$currPos, 2) === peg$c44) {
            s0 = peg$c44;
            peg$currPos += 2;
        }
        else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e73);
            }
        }
        return s0;
    }
    function peg$parsemlcomend() {
        var s0;
        if (input.substr(peg$currPos, 2) === peg$c45) {
            s0 = peg$c45;
            peg$currPos += 2;
        }
        else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e74);
            }
        }
        return s0;
    }
    function peg$parsemlcomtok() {
        var s0, s1, s2;
        s0 = peg$currPos;
        s1 = peg$currPos;
        peg$silentFails++;
        if (input.substr(peg$currPos, 2) === peg$c45) {
            s2 = peg$c45;
            peg$currPos += 2;
        }
        else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e74);
            }
        }
        peg$silentFails--;
        if (s2 === peg$FAILED) {
            s1 = undefined;
        }
        else {
            peg$currPos = s1;
            s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
            if (input.length > peg$currPos) {
                s2 = input.charAt(peg$currPos);
                peg$currPos++;
            }
            else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$e64);
                }
            }
            if (s2 !== peg$FAILED) {
                peg$savedPos = s0;
                s0 = peg$f43(s2);
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        return s0;
    }
    function peg$parsemlcomment() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;
        s1 = peg$parsemlcomstart();
        if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$parsemlcomtok();
            while (s3 !== peg$FAILED) {
                s2.push(s3);
                s3 = peg$parsemlcomtok();
            }
            s3 = peg$parsemlcomend();
            if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s0 = peg$f44(s1, s2, s3);
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        return s0;
    }
    function peg$parseslcomstart() {
        var s0;
        if (input.substr(peg$currPos, 2) === peg$c46) {
            s0 = peg$c46;
            peg$currPos += 2;
        }
        else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e75);
            }
        }
        return s0;
    }
    function peg$parseslcomtok() {
        var s0;
        if (peg$r5.test(input.charAt(peg$currPos))) {
            s0 = input.charAt(peg$currPos);
            peg$currPos++;
        }
        else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e76);
            }
        }
        return s0;
    }
    function peg$parseslcomment() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;
        s1 = peg$parseslcomstart();
        if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$parseslcomtok();
            while (s3 !== peg$FAILED) {
                s2.push(s3);
                s3 = peg$parseslcomtok();
            }
            peg$savedPos = s0;
            s0 = peg$f45(s1, s2);
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        return s0;
    }
    function peg$parsecomment() {
        var s0, s1;
        peg$silentFails++;
        s0 = peg$parseslcomment();
        if (s0 === peg$FAILED) {
            s0 = peg$parsemlcomment();
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e77);
            }
        }
        return s0;
    }
    function peg$parse_() {
        var s0, s1;
        s0 = [];
        s1 = peg$parsewhitespace();
        if (s1 === peg$FAILED) {
            s1 = peg$parselineend();
            if (s1 === peg$FAILED) {
                s1 = peg$parsecomment();
            }
        }
        while (s1 !== peg$FAILED) {
            s0.push(s1);
            s1 = peg$parsewhitespace();
            if (s1 === peg$FAILED) {
                s1 = peg$parselineend();
                if (s1 === peg$FAILED) {
                    s1 = peg$parsecomment();
                }
            }
        }
        return s0;
    }
    peg$result = peg$startRuleFunction();
    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
        return peg$result;
    }
    else {
        if (peg$result !== peg$FAILED && peg$currPos < input.length) {
            peg$fail(peg$endExpectation());
        }
        throw peg$buildStructuredError(peg$maxFailExpected, peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null, peg$maxFailPos < input.length
            ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
            : peg$computeLocation(peg$maxFailPos, peg$maxFailPos));
    }
}
export { peg$SyntaxError as SyntaxError, peg$parse as parse };
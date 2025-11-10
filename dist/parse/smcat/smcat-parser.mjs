import parserHelpers from "../parser-helpers.mjs";
class peg$SyntaxError extends SyntaxError {
	constructor(message, expected, found, location) {
		super(message);
		this.expected = expected;
		this.found = found;
		this.location = location;
		this.name = "SyntaxError";
	}
	format(sources) {
		let str = "Error: " + this.message;
		if (this.location) {
			let src = null;
			const st = sources.find((s) => s.source === this.location.source);
			if (st) {
				src = st.text.split(/\r\n|\n|\r/g);
			}
			const s = this.location.start;
			const offset_s =
				this.location.source &&
				typeof this.location.source.offset === "function"
					? this.location.source.offset(s)
					: s;
			const loc =
				this.location.source + ":" + offset_s.line + ":" + offset_s.column;
			if (src) {
				const e = this.location.end;
				const filler = "".padEnd(offset_s.line.toString().length, " ");
				const line = src[s.line - 1];
				const last = s.line === e.line ? e.column : line.length + 1;
				const hatLen = last - s.column || 1;
				str +=
					"\n --> " +
					loc +
					"\n" +
					filler +
					" |\n" +
					offset_s.line +
					" | " +
					line +
					"\n" +
					filler +
					" | " +
					"".padEnd(s.column - 1, " ") +
					"".padEnd(hatLen, "^");
			} else {
				str += "\n at " + loc;
			}
		}
		return str;
	}
	static buildMessage(expected, found) {
		function hex(ch) {
			return ch.codePointAt(0).toString(16).toUpperCase();
		}
		const nonPrintable = Object.prototype.hasOwnProperty.call(
			RegExp.prototype,
			"unicode",
		)
			? new RegExp("[\\p{C}\\p{Mn}\\p{Mc}]", "gu")
			: null;
		function unicodeEscape(s) {
			if (nonPrintable) {
				return s.replace(nonPrintable, (ch) => "\\u{" + hex(ch) + "}");
			}
			return s;
		}
		function literalEscape(s) {
			return unicodeEscape(
				s
					.replace(/\\/g, "\\\\")
					.replace(/"/g, '\\"')
					.replace(/\0/g, "\\0")
					.replace(/\t/g, "\\t")
					.replace(/\n/g, "\\n")
					.replace(/\r/g, "\\r")
					.replace(/[\x00-\x0F]/g, (ch) => "\\x0" + hex(ch))
					.replace(/[\x10-\x1F\x7F-\x9F]/g, (ch) => "\\x" + hex(ch)),
			);
		}
		function classEscape(s) {
			return unicodeEscape(
				s
					.replace(/\\/g, "\\\\")
					.replace(/\]/g, "\\]")
					.replace(/\^/g, "\\^")
					.replace(/-/g, "\\-")
					.replace(/\0/g, "\\0")
					.replace(/\t/g, "\\t")
					.replace(/\n/g, "\\n")
					.replace(/\r/g, "\\r")
					.replace(/[\x00-\x0F]/g, (ch) => "\\x0" + hex(ch))
					.replace(/[\x10-\x1F\x7F-\x9F]/g, (ch) => "\\x" + hex(ch)),
			);
		}
		const DESCRIBE_EXPECTATION_FNS = {
			literal(expectation) {
				return '"' + literalEscape(expectation.text) + '"';
			},
			class(expectation) {
				const escapedParts = expectation.parts.map((part) =>
					Array.isArray(part)
						? classEscape(part[0]) + "-" + classEscape(part[1])
						: classEscape(part),
				);
				return (
					"[" +
					(expectation.inverted ? "^" : "") +
					escapedParts.join("") +
					"]" +
					(expectation.unicode ? "u" : "")
				);
			},
			any() {
				return "any character";
			},
			end() {
				return "end of input";
			},
			other(expectation) {
				return expectation.description;
			},
		};
		function describeExpectation(expectation) {
			return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
		}
		function describeExpected(expected) {
			const descriptions = expected.map(describeExpectation);
			descriptions.sort();
			if (descriptions.length > 0) {
				let j = 1;
				for (let i = 1; i < descriptions.length; i++) {
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
					return (
						descriptions.slice(0, -1).join(", ") +
						", or " +
						descriptions[descriptions.length - 1]
					);
			}
		}
		function describeFound(found) {
			return found ? '"' + literalEscape(found) + '"' : "end of input";
		}
		return (
			"Expected " +
			describeExpected(expected) +
			" but " +
			describeFound(found) +
			" found."
		);
	}
}
function peg$parse(input, options) {
	options = options !== undefined ? options : {};
	const peg$FAILED = {};
	const peg$source = options.grammarSource;
	const peg$startRuleFunctions = {
		program: peg$parseprogram,
	};
	let peg$startRuleFunction = peg$parseprogram;
	const peg$c0 = ",";
	const peg$c1 = ";";
	const peg$c2 = "[";
	const peg$c3 = "]";
	const peg$c4 = ":";
	const peg$c5 = "{";
	const peg$c6 = "}";
	const peg$c7 = "=";
	const peg$c8 = "label";
	const peg$c9 = "color";
	const peg$c10 = "class";
	const peg$c11 = "active";
	const peg$c12 = "type";
	const peg$c13 = "regular";
	const peg$c14 = "initial";
	const peg$c15 = "terminate";
	const peg$c16 = "final";
	const peg$c17 = "parallel";
	const peg$c18 = "history";
	const peg$c19 = "deephistory";
	const peg$c20 = "choice";
	const peg$c21 = "forkjoin";
	const peg$c22 = "fork";
	const peg$c23 = "join";
	const peg$c24 = "junction";
	const peg$c25 = "width";
	const peg$c26 = "external";
	const peg$c27 = "internal";
	const peg$c28 = "->";
	const peg$c29 = "=>>";
	const peg$c30 = "=>";
	const peg$c31 = ">>";
	const peg$c32 = ":>";
	const peg$c33 = "--";
	const peg$c34 = "==";
	const peg$c35 = "<-";
	const peg$c36 = "<<=";
	const peg$c37 = "<=";
	const peg$c38 = "<<";
	const peg$c39 = "<:";
	const peg$c40 = "#";
	const peg$c41 = ".";
	const peg$c42 = '"';
	const peg$c43 = '\\"';
	const peg$c44 = "/*";
	const peg$c45 = "*/";
	const peg$c46 = "//";
	const peg$r0 = /^[0-9]/;
	const peg$r1 = /^[a-zA-Z0-9_\- ]/;
	const peg$r2 = /^[,;{]/;
	const peg$r3 = /^[;{]/;
	const peg$r4 = /^[^;, "\t\n\r=\-><:{[]/;
	const peg$r5 = /^[ \t]/;
	const peg$r6 = /^[\r\n]/;
	const peg$r7 = /^[^\r\n]/;
	const peg$e0 = peg$literalExpectation(",", false);
	const peg$e1 = peg$literalExpectation(";", false);
	const peg$e2 = peg$otherExpectation("state");
	const peg$e3 = peg$literalExpectation("[", false);
	const peg$e4 = peg$literalExpectation("]", false);
	const peg$e5 = peg$literalExpectation(":", false);
	const peg$e6 = peg$literalExpectation("{", false);
	const peg$e7 = peg$literalExpectation("}", false);
	const peg$e8 = peg$otherExpectation("extended state attribute");
	const peg$e9 = peg$literalExpectation("=", false);
	const peg$e10 = peg$otherExpectation("state attribute name");
	const peg$e11 = peg$literalExpectation("label", true);
	const peg$e12 = peg$literalExpectation("color", true);
	const peg$e13 = peg$otherExpectation("class attribute");
	const peg$e14 = peg$literalExpectation("class", true);
	const peg$e15 = peg$otherExpectation("state flag");
	const peg$e16 = peg$literalExpectation("active", true);
	const peg$e17 = peg$otherExpectation("state type");
	const peg$e18 = peg$literalExpectation("type", true);
	const peg$e19 = peg$otherExpectation("state type type");
	const peg$e20 = peg$literalExpectation("regular", false);
	const peg$e21 = peg$literalExpectation("initial", false);
	const peg$e22 = peg$literalExpectation("terminate", false);
	const peg$e23 = peg$literalExpectation("final", false);
	const peg$e24 = peg$literalExpectation("parallel", false);
	const peg$e25 = peg$literalExpectation("history", false);
	const peg$e26 = peg$literalExpectation("deephistory", false);
	const peg$e27 = peg$literalExpectation("choice", false);
	const peg$e28 = peg$literalExpectation("forkjoin", false);
	const peg$e29 = peg$literalExpectation("fork", false);
	const peg$e30 = peg$literalExpectation("join", false);
	const peg$e31 = peg$literalExpectation("junction", false);
	const peg$e32 = peg$otherExpectation("transition");
	const peg$e33 = peg$otherExpectation("extended transition attribute");
	const peg$e34 = peg$otherExpectation("transition attribute name");
	const peg$e35 = peg$otherExpectation("transition type name");
	const peg$e36 = peg$otherExpectation("numeric transition attribute name");
	const peg$e37 = peg$literalExpectation("width", true);
	const peg$e38 = peg$otherExpectation("transition type value");
	const peg$e39 = peg$literalExpectation("external", false);
	const peg$e40 = peg$literalExpectation("internal", false);
	const peg$e41 = peg$otherExpectation("left to right arrow");
	const peg$e42 = peg$literalExpectation("->", false);
	const peg$e43 = peg$literalExpectation("=>>", false);
	const peg$e44 = peg$literalExpectation("=>", false);
	const peg$e45 = peg$literalExpectation(">>", false);
	const peg$e46 = peg$literalExpectation(":>", false);
	const peg$e47 = peg$literalExpectation("--", false);
	const peg$e48 = peg$literalExpectation("==", false);
	const peg$e49 = peg$otherExpectation("right to left arrow");
	const peg$e50 = peg$literalExpectation("<-", false);
	const peg$e51 = peg$literalExpectation("<<=", false);
	const peg$e52 = peg$literalExpectation("<=", false);
	const peg$e53 = peg$literalExpectation("<<", false);
	const peg$e54 = peg$literalExpectation("<:", false);
	const peg$e55 = peg$literalExpectation("#", false);
	const peg$e56 = peg$literalExpectation(".", false);
	const peg$e57 = peg$classExpectation([["0", "9"]], false, false, false);
	const peg$e58 = peg$otherExpectation("double quoted string");
	const peg$e59 = peg$literalExpectation('"', false);
	const peg$e60 = peg$literalExpectation('\\"', false);
	const peg$e61 = peg$anyExpectation();
	const peg$e62 = peg$otherExpectation("valid class string");
	const peg$e63 = peg$classExpectation(
		[["a", "z"], ["A", "Z"], ["0", "9"], "_", "-", " "],
		false,
		false,
		false,
	);
	const peg$e64 = peg$classExpectation([",", ";", "{"], false, false, false);
	const peg$e65 = peg$classExpectation([";", "{"], false, false, false);
	const peg$e66 = peg$otherExpectation("identifier");
	const peg$e67 = peg$classExpectation(
		[";", ",", " ", '"', "\t", "\n", "\r", "=", "-", ">", "<", ":", "{", "["],
		true,
		false,
		false,
	);
	const peg$e68 = peg$otherExpectation("whitespace");
	const peg$e69 = peg$classExpectation([" ", "\t"], false, false, false);
	const peg$e70 = peg$otherExpectation("line end");
	const peg$e71 = peg$classExpectation(["\r", "\n"], false, false, false);
	const peg$e72 = peg$literalExpectation("/*", false);
	const peg$e73 = peg$literalExpectation("*/", false);
	const peg$e74 = peg$literalExpectation("//", false);
	const peg$e75 = peg$classExpectation(["\r", "\n"], true, false, false);
	const peg$e76 = peg$otherExpectation("comment");
	function peg$f0(statemachine) {
		statemachine.states = parserHelpers.extractUndeclaredStates(statemachine);
		return parserHelpers.classifyForkJoins(statemachine);
	}
	function peg$f1(states, transitions) {
		let lStateMachine = {};
		parserHelpers.setIf(lStateMachine, "states", states);
		parserHelpers.setIfNotEmpty(lStateMachine, "transitions", transitions);
		return lStateMachine;
	}
	function peg$f2(state) {
		return state;
	}
	function peg$f3(state) {
		return state;
	}
	function peg$f4(states) {
		return parserHelpers.uniq(
			states[0].concat(states[1]),
			parserHelpers.stateEqual,
		);
	}
	function peg$f5(notes, id, attrs) {
		return attrs;
	}
	function peg$f6(notes, id, extended_state_attributes, act) {
		return act;
	}
	function peg$f7(notes, id, extended_state_attributes, actions, sm) {
		return sm;
	}
	function peg$f8(notes, id, extended_state_attributes, actions, statemachine) {
		let lState = parserHelpers.initState(id);
		for (const lExtendedAttribute of extended_state_attributes || []) {
			parserHelpers.setIf(
				lState,
				lExtendedAttribute.name,
				lExtendedAttribute.value,
			);
		}
		parserHelpers.setIf(
			lState,
			"typeExplicitlySet",
			(extended_state_attributes || []).some(
				(pExtendedAttribute) => pExtendedAttribute.typeExplicitlySet,
			),
		);
		parserHelpers.setIf(lState, "statemachine", statemachine);
		parserHelpers.setIfNotEmpty(lState, "note", notes);
		if (actions) {
			parserHelpers.setIfNotEmpty(
				lState,
				"actions",
				parserHelpers.extractActions(actions),
			);
		}
		return lState;
	}
	function peg$f9(name, value) {
		return { name, value };
	}
	function peg$f10(name, value) {
		return { name, value };
	}
	function peg$f11(name) {
		return { name, value: true };
	}
	function peg$f12(name, value) {
		return { name, value, typeExplicitlySet: true };
	}
	function peg$f13(name) {
		return name.toLowerCase();
	}
	function peg$f14(name) {
		return name.toLowerCase();
	}
	function peg$f15(name) {
		return name.toLowerCase();
	}
	function peg$f16(name) {
		return name.toLowerCase();
	}
	function peg$f17(notes, trans, attrs) {
		return attrs;
	}
	function peg$f18(notes, trans, extended_attributes, lbl) {
		return lbl;
	}
	function peg$f19(notes, trans, extended_attributes, label) {
		if (label) {
			trans.label = label;
			trans = Object.assign(
				trans,
				parserHelpers.parseTransitionExpression(label),
			);
		}
		for (const lExtendedAttribute of extended_attributes || []) {
			parserHelpers.setIf(
				trans,
				lExtendedAttribute.name,
				lExtendedAttribute.value,
			);
		}
		parserHelpers.setIfNotEmpty(trans, "note", notes);
		trans.id = options.counter.next();
		return trans;
	}
	function peg$f20(from_, to) {
		return {
			from: from_,
			to: to,
		};
	}
	function peg$f21(to, from_) {
		return {
			from: from_,
			to: to,
		};
	}
	function peg$f22(name, value) {
		return { name, value };
	}
	function peg$f23(name, value) {
		return { name, value };
	}
	function peg$f24(name, value) {
		return { name, value };
	}
	function peg$f25(name, value) {
		return { name, value };
	}
	function peg$f26(name) {
		return name.toLowerCase();
	}
	function peg$f27(name) {
		return name.toLowerCase();
	}
	function peg$f28(name) {
		return name;
	}
	function peg$f29(com) {
		return com.join("").trim();
	}
	function peg$f30(digits) {
		return parseFloat(digits.join(""));
	}
	function peg$f31(digits) {
		return parseInt(digits.join(""), 10);
	}
	function peg$f32(s) {
		return s.join("").replace(/\\\"/g, '"');
	}
	function peg$f33(c) {
		return c;
	}
	function peg$f34(s) {
		return s.join("");
	}
	function peg$f35(c) {
		return c;
	}
	function peg$f36(s) {
		return s.join("").trim();
	}
	function peg$f37(s) {
		return s.join("").trim();
	}
	function peg$f38(c) {
		return c;
	}
	function peg$f39(c) {
		return c;
	}
	function peg$f40(chars) {
		return chars.join("");
	}
	let peg$currPos = options.peg$currPos | 0;
	let peg$savedPos = peg$currPos;
	const peg$posDetailsCache = [{ line: 1, column: 1 }];
	let peg$maxFailPos = peg$currPos;
	let peg$maxFailExpected = options.peg$maxFailExpected || [];
	let peg$silentFails = options.peg$silentFails | 0;
	let peg$result;
	if (options.startRule) {
		if (!(options.startRule in peg$startRuleFunctions)) {
			throw new Error(
				"Can't start parsing from rule \"" + options.startRule + '".',
			);
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
			end: peg$currPos,
		};
	}
	function location() {
		return peg$computeLocation(peg$savedPos, peg$currPos);
	}
	function expected(description, location) {
		location =
			location !== undefined
				? location
				: peg$computeLocation(peg$savedPos, peg$currPos);
		throw peg$buildStructuredError(
			[peg$otherExpectation(description)],
			input.substring(peg$savedPos, peg$currPos),
			location,
		);
	}
	function error(message, location) {
		location =
			location !== undefined
				? location
				: peg$computeLocation(peg$savedPos, peg$currPos);
		throw peg$buildSimpleError(message, location);
	}
	function peg$getUnicode(pos = peg$currPos) {
		const cp = input.codePointAt(pos);
		if (cp === undefined) {
			return "";
		}
		return String.fromCodePoint(cp);
	}
	function peg$literalExpectation(text, ignoreCase) {
		return { type: "literal", text, ignoreCase };
	}
	function peg$classExpectation(parts, inverted, ignoreCase, unicode) {
		return { type: "class", parts, inverted, ignoreCase, unicode };
	}
	function peg$anyExpectation() {
		return { type: "any" };
	}
	function peg$endExpectation() {
		return { type: "end" };
	}
	function peg$otherExpectation(description) {
		return { type: "other", description };
	}
	function peg$computePosDetails(pos) {
		let details = peg$posDetailsCache[pos];
		let p;
		if (details) {
			return details;
		} else {
			if (pos >= peg$posDetailsCache.length) {
				p = peg$posDetailsCache.length - 1;
			} else {
				p = pos;
				while (!peg$posDetailsCache[--p]) {}
			}
			details = peg$posDetailsCache[p];
			details = {
				line: details.line,
				column: details.column,
			};
			while (p < pos) {
				if (input.charCodeAt(p) === 10) {
					details.line++;
					details.column = 1;
				} else {
					details.column++;
				}
				p++;
			}
			peg$posDetailsCache[pos] = details;
			return details;
		}
	}
	function peg$computeLocation(startPos, endPos, offset) {
		const startPosDetails = peg$computePosDetails(startPos);
		const endPosDetails = peg$computePosDetails(endPos);
		const res = {
			source: peg$source,
			start: {
				offset: startPos,
				line: startPosDetails.line,
				column: startPosDetails.column,
			},
			end: {
				offset: endPos,
				line: endPosDetails.line,
				column: endPosDetails.column,
			},
		};
		if (offset && peg$source && typeof peg$source.offset === "function") {
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
		return new peg$SyntaxError(
			peg$SyntaxError.buildMessage(expected, found),
			expected,
			found,
			location,
		);
	}
	function peg$parseprogram() {
		let s0, s1, s2, s3;
		s0 = peg$currPos;
		s1 = peg$parse_();
		s2 = peg$parsestatemachine();
		s3 = peg$parse_();
		peg$savedPos = s0;
		s0 = peg$f0(s2);
		return s0;
	}
	function peg$parsestatemachine() {
		let s0, s1, s2, s3;
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
		return s0;
	}
	function peg$parsestates() {
		let s0, s1, s2, s3, s4, s5;
		s0 = peg$currPos;
		s1 = peg$currPos;
		s2 = [];
		s3 = peg$currPos;
		s4 = peg$parsestate();
		if (s4 !== peg$FAILED) {
			if (input.charCodeAt(peg$currPos) === 44) {
				s5 = peg$c0;
				peg$currPos++;
			} else {
				s5 = peg$FAILED;
				if (peg$silentFails === 0) {
					peg$fail(peg$e0);
				}
			}
			if (s5 !== peg$FAILED) {
				peg$savedPos = s3;
				s3 = peg$f2(s4);
			} else {
				peg$currPos = s3;
				s3 = peg$FAILED;
			}
		} else {
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
				} else {
					s5 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$e0);
					}
				}
				if (s5 !== peg$FAILED) {
					peg$savedPos = s3;
					s3 = peg$f2(s4);
				} else {
					peg$currPos = s3;
					s3 = peg$FAILED;
				}
			} else {
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
			} else {
				s5 = peg$FAILED;
				if (peg$silentFails === 0) {
					peg$fail(peg$e1);
				}
			}
			if (s5 !== peg$FAILED) {
				peg$savedPos = s3;
				s3 = peg$f3(s4);
			} else {
				peg$currPos = s3;
				s3 = peg$FAILED;
			}
		} else {
			peg$currPos = s3;
			s3 = peg$FAILED;
		}
		if (s3 !== peg$FAILED) {
			s2 = [s2, s3];
			s1 = s2;
		} else {
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
		let s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14;
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
			} else {
				s6 = peg$FAILED;
				if (peg$silentFails === 0) {
					peg$fail(peg$e3);
				}
			}
			if (s6 !== peg$FAILED) {
				s7 = peg$parseextended_state_attributes();
				if (input.charCodeAt(peg$currPos) === 93) {
					s8 = peg$c3;
					peg$currPos++;
				} else {
					s8 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$e4);
					}
				}
				if (s8 !== peg$FAILED) {
					peg$savedPos = s5;
					s5 = peg$f5(s1, s3, s7);
				} else {
					peg$currPos = s5;
					s5 = peg$FAILED;
				}
			} else {
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
			} else {
				s8 = peg$FAILED;
				if (peg$silentFails === 0) {
					peg$fail(peg$e5);
				}
			}
			if (s8 !== peg$FAILED) {
				s9 = peg$parse_();
				s10 = peg$parsestring();
				if (s10 !== peg$FAILED) {
					s11 = peg$parse_();
					peg$savedPos = s7;
					s7 = peg$f6(s1, s3, s5, s10);
				} else {
					peg$currPos = s7;
					s7 = peg$FAILED;
				}
			} else {
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
			} else {
				s10 = peg$FAILED;
				if (peg$silentFails === 0) {
					peg$fail(peg$e6);
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
					} else {
						s14 = peg$FAILED;
						if (peg$silentFails === 0) {
							peg$fail(peg$e7);
						}
					}
					if (s14 !== peg$FAILED) {
						peg$savedPos = s9;
						s9 = peg$f7(s1, s3, s5, s7, s12);
					} else {
						peg$currPos = s9;
						s9 = peg$FAILED;
					}
				} else {
					peg$currPos = s9;
					s9 = peg$FAILED;
				}
			} else {
				peg$currPos = s9;
				s9 = peg$FAILED;
			}
			if (s9 === peg$FAILED) {
				s9 = null;
			}
			s10 = peg$parse_();
			peg$savedPos = s0;
			s0 = peg$f8(s1, s3, s5, s7, s9);
		} else {
			peg$currPos = s0;
			s0 = peg$FAILED;
		}
		peg$silentFails--;
		if (s0 === peg$FAILED) {
			s1 = peg$FAILED;
			if (peg$silentFails === 0) {
				peg$fail(peg$e2);
			}
		}
		return s0;
	}
	function peg$parseextended_state_attributes() {
		let s0, s1;
		peg$silentFails++;
		s0 = [];
		s1 = peg$parseextended_state_attribute();
		while (s1 !== peg$FAILED) {
			s0.push(s1);
			s1 = peg$parseextended_state_attribute();
		}
		peg$silentFails--;
		return s0;
	}
	function peg$parseextended_state_attribute() {
		let s0, s1, s2, s3, s4, s5, s6, s7;
		peg$silentFails++;
		s0 = peg$currPos;
		s1 = peg$parse_();
		s2 = peg$parseextended_state_string_attribute_name();
		if (s2 !== peg$FAILED) {
			s3 = peg$parse_();
			if (input.charCodeAt(peg$currPos) === 61) {
				s4 = peg$c7;
				peg$currPos++;
			} else {
				s4 = peg$FAILED;
				if (peg$silentFails === 0) {
					peg$fail(peg$e9);
				}
			}
			if (s4 !== peg$FAILED) {
				s5 = peg$parse_();
				s6 = peg$parsequotedstring();
				if (s6 !== peg$FAILED) {
					s7 = peg$parse_();
					peg$savedPos = s0;
					s0 = peg$f9(s2, s6);
				} else {
					peg$currPos = s0;
					s0 = peg$FAILED;
				}
			} else {
				peg$currPos = s0;
				s0 = peg$FAILED;
			}
		} else {
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
				} else {
					s4 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$e9);
					}
				}
				if (s4 !== peg$FAILED) {
					s5 = peg$parse_();
					s6 = peg$parseclass_string();
					if (s6 !== peg$FAILED) {
						s7 = peg$parse_();
						peg$savedPos = s0;
						s0 = peg$f10(s2, s6);
					} else {
						peg$currPos = s0;
						s0 = peg$FAILED;
					}
				} else {
					peg$currPos = s0;
					s0 = peg$FAILED;
				}
			} else {
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
				} else {
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
						} else {
							s4 = peg$FAILED;
							if (peg$silentFails === 0) {
								peg$fail(peg$e9);
							}
						}
						if (s4 !== peg$FAILED) {
							s5 = peg$parse_();
							s6 = peg$parseextended_state_type_attribute_type();
							if (s6 !== peg$FAILED) {
								s7 = peg$parse_();
								peg$savedPos = s0;
								s0 = peg$f12(s2, s6);
							} else {
								peg$currPos = s0;
								s0 = peg$FAILED;
							}
						} else {
							peg$currPos = s0;
							s0 = peg$FAILED;
						}
					} else {
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
				peg$fail(peg$e8);
			}
		}
		return s0;
	}
	function peg$parseextended_state_string_attribute_name() {
		let s0, s1;
		peg$silentFails++;
		s0 = peg$currPos;
		s1 = input.substr(peg$currPos, 5);
		if (s1.toLowerCase() === peg$c8) {
			peg$currPos += 5;
		} else {
			s1 = peg$FAILED;
			if (peg$silentFails === 0) {
				peg$fail(peg$e11);
			}
		}
		if (s1 === peg$FAILED) {
			s1 = input.substr(peg$currPos, 5);
			if (s1.toLowerCase() === peg$c9) {
				peg$currPos += 5;
			} else {
				s1 = peg$FAILED;
				if (peg$silentFails === 0) {
					peg$fail(peg$e12);
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
				peg$fail(peg$e10);
			}
		}
		return s0;
	}
	function peg$parseclass_attribute_name() {
		let s0, s1;
		peg$silentFails++;
		s0 = peg$currPos;
		s1 = input.substr(peg$currPos, 5);
		if (s1.toLowerCase() === peg$c10) {
			peg$currPos += 5;
		} else {
			s1 = peg$FAILED;
			if (peg$silentFails === 0) {
				peg$fail(peg$e14);
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
				peg$fail(peg$e13);
			}
		}
		return s0;
	}
	function peg$parseextended_state_boolean_attribute_name() {
		let s0, s1;
		peg$silentFails++;
		s0 = peg$currPos;
		s1 = input.substr(peg$currPos, 6);
		if (s1.toLowerCase() === peg$c11) {
			peg$currPos += 6;
		} else {
			s1 = peg$FAILED;
			if (peg$silentFails === 0) {
				peg$fail(peg$e16);
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
				peg$fail(peg$e15);
			}
		}
		return s0;
	}
	function peg$parseextended_state_type_attribute_name() {
		let s0, s1;
		peg$silentFails++;
		s0 = peg$currPos;
		s1 = input.substr(peg$currPos, 4);
		if (s1.toLowerCase() === peg$c12) {
			peg$currPos += 4;
		} else {
			s1 = peg$FAILED;
			if (peg$silentFails === 0) {
				peg$fail(peg$e18);
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
				peg$fail(peg$e17);
			}
		}
		return s0;
	}
	function peg$parseextended_state_type_attribute_type() {
		let s0, s1;
		peg$silentFails++;
		if (input.substr(peg$currPos, 7) === peg$c13) {
			s0 = peg$c13;
			peg$currPos += 7;
		} else {
			s0 = peg$FAILED;
			if (peg$silentFails === 0) {
				peg$fail(peg$e20);
			}
		}
		if (s0 === peg$FAILED) {
			if (input.substr(peg$currPos, 7) === peg$c14) {
				s0 = peg$c14;
				peg$currPos += 7;
			} else {
				s0 = peg$FAILED;
				if (peg$silentFails === 0) {
					peg$fail(peg$e21);
				}
			}
			if (s0 === peg$FAILED) {
				if (input.substr(peg$currPos, 9) === peg$c15) {
					s0 = peg$c15;
					peg$currPos += 9;
				} else {
					s0 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$e22);
					}
				}
				if (s0 === peg$FAILED) {
					if (input.substr(peg$currPos, 5) === peg$c16) {
						s0 = peg$c16;
						peg$currPos += 5;
					} else {
						s0 = peg$FAILED;
						if (peg$silentFails === 0) {
							peg$fail(peg$e23);
						}
					}
					if (s0 === peg$FAILED) {
						if (input.substr(peg$currPos, 8) === peg$c17) {
							s0 = peg$c17;
							peg$currPos += 8;
						} else {
							s0 = peg$FAILED;
							if (peg$silentFails === 0) {
								peg$fail(peg$e24);
							}
						}
						if (s0 === peg$FAILED) {
							if (input.substr(peg$currPos, 7) === peg$c18) {
								s0 = peg$c18;
								peg$currPos += 7;
							} else {
								s0 = peg$FAILED;
								if (peg$silentFails === 0) {
									peg$fail(peg$e25);
								}
							}
							if (s0 === peg$FAILED) {
								if (input.substr(peg$currPos, 11) === peg$c19) {
									s0 = peg$c19;
									peg$currPos += 11;
								} else {
									s0 = peg$FAILED;
									if (peg$silentFails === 0) {
										peg$fail(peg$e26);
									}
								}
								if (s0 === peg$FAILED) {
									if (input.substr(peg$currPos, 6) === peg$c20) {
										s0 = peg$c20;
										peg$currPos += 6;
									} else {
										s0 = peg$FAILED;
										if (peg$silentFails === 0) {
											peg$fail(peg$e27);
										}
									}
									if (s0 === peg$FAILED) {
										if (input.substr(peg$currPos, 8) === peg$c21) {
											s0 = peg$c21;
											peg$currPos += 8;
										} else {
											s0 = peg$FAILED;
											if (peg$silentFails === 0) {
												peg$fail(peg$e28);
											}
										}
										if (s0 === peg$FAILED) {
											if (input.substr(peg$currPos, 4) === peg$c22) {
												s0 = peg$c22;
												peg$currPos += 4;
											} else {
												s0 = peg$FAILED;
												if (peg$silentFails === 0) {
													peg$fail(peg$e29);
												}
											}
											if (s0 === peg$FAILED) {
												if (input.substr(peg$currPos, 4) === peg$c23) {
													s0 = peg$c23;
													peg$currPos += 4;
												} else {
													s0 = peg$FAILED;
													if (peg$silentFails === 0) {
														peg$fail(peg$e30);
													}
												}
												if (s0 === peg$FAILED) {
													if (input.substr(peg$currPos, 8) === peg$c24) {
														s0 = peg$c24;
														peg$currPos += 8;
													} else {
														s0 = peg$FAILED;
														if (peg$silentFails === 0) {
															peg$fail(peg$e31);
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
				peg$fail(peg$e19);
			}
		}
		return s0;
	}
	function peg$parsetransition() {
		let s0, s1, s2, s3, s4, s5, s6, s7, s8;
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
			} else {
				s4 = peg$FAILED;
				if (peg$silentFails === 0) {
					peg$fail(peg$e3);
				}
			}
			if (s4 !== peg$FAILED) {
				s5 = peg$parseextended_transition_attributes();
				if (input.charCodeAt(peg$currPos) === 93) {
					s6 = peg$c3;
					peg$currPos++;
				} else {
					s6 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$e4);
					}
				}
				if (s6 !== peg$FAILED) {
					s7 = peg$parse_();
					peg$savedPos = s3;
					s3 = peg$f17(s1, s2, s5);
				} else {
					peg$currPos = s3;
					s3 = peg$FAILED;
				}
			} else {
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
			} else {
				s5 = peg$FAILED;
				if (peg$silentFails === 0) {
					peg$fail(peg$e5);
				}
			}
			if (s5 !== peg$FAILED) {
				s6 = peg$parse_();
				s7 = peg$parsetransitionstring();
				if (s7 !== peg$FAILED) {
					s8 = peg$parse_();
					peg$savedPos = s4;
					s4 = peg$f18(s1, s2, s3, s7);
				} else {
					peg$currPos = s4;
					s4 = peg$FAILED;
				}
			} else {
				peg$currPos = s4;
				s4 = peg$FAILED;
			}
			if (s4 === peg$FAILED) {
				s4 = null;
			}
			if (input.charCodeAt(peg$currPos) === 59) {
				s5 = peg$c1;
				peg$currPos++;
			} else {
				s5 = peg$FAILED;
				if (peg$silentFails === 0) {
					peg$fail(peg$e1);
				}
			}
			if (s5 !== peg$FAILED) {
				peg$savedPos = s0;
				s0 = peg$f19(s1, s2, s3, s4);
			} else {
				peg$currPos = s0;
				s0 = peg$FAILED;
			}
		} else {
			peg$currPos = s0;
			s0 = peg$FAILED;
		}
		peg$silentFails--;
		if (s0 === peg$FAILED) {
			s1 = peg$FAILED;
			if (peg$silentFails === 0) {
				peg$fail(peg$e32);
			}
		}
		return s0;
	}
	function peg$parsetransitionbase() {
		let s0, s1, s2, s3, s4, s5, s6, s7;
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
				} else {
					peg$currPos = s0;
					s0 = peg$FAILED;
				}
			} else {
				peg$currPos = s0;
				s0 = peg$FAILED;
			}
		} else {
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
					} else {
						peg$currPos = s0;
						s0 = peg$FAILED;
					}
				} else {
					peg$currPos = s0;
					s0 = peg$FAILED;
				}
			} else {
				peg$currPos = s0;
				s0 = peg$FAILED;
			}
		}
		return s0;
	}
	function peg$parseextended_transition_attributes() {
		let s0, s1;
		peg$silentFails++;
		s0 = [];
		s1 = peg$parseextended_transition_attribute();
		while (s1 !== peg$FAILED) {
			s0.push(s1);
			s1 = peg$parseextended_transition_attribute();
		}
		peg$silentFails--;
		return s0;
	}
	function peg$parseextended_transition_attribute() {
		let s0, s1, s2, s3, s4, s5, s6, s7;
		peg$silentFails++;
		s0 = peg$currPos;
		s1 = peg$parse_();
		s2 = peg$parseextended_transition_string_attribute_name();
		if (s2 !== peg$FAILED) {
			s3 = peg$parse_();
			if (input.charCodeAt(peg$currPos) === 61) {
				s4 = peg$c7;
				peg$currPos++;
			} else {
				s4 = peg$FAILED;
				if (peg$silentFails === 0) {
					peg$fail(peg$e9);
				}
			}
			if (s4 !== peg$FAILED) {
				s5 = peg$parse_();
				s6 = peg$parsequotedstring();
				if (s6 !== peg$FAILED) {
					s7 = peg$parse_();
					peg$savedPos = s0;
					s0 = peg$f22(s2, s6);
				} else {
					peg$currPos = s0;
					s0 = peg$FAILED;
				}
			} else {
				peg$currPos = s0;
				s0 = peg$FAILED;
			}
		} else {
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
				} else {
					s4 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$e9);
					}
				}
				if (s4 !== peg$FAILED) {
					s5 = peg$parse_();
					s6 = peg$parseclass_string();
					if (s6 !== peg$FAILED) {
						s7 = peg$parse_();
						peg$savedPos = s0;
						s0 = peg$f23(s2, s6);
					} else {
						peg$currPos = s0;
						s0 = peg$FAILED;
					}
				} else {
					peg$currPos = s0;
					s0 = peg$FAILED;
				}
			} else {
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
					} else {
						s4 = peg$FAILED;
						if (peg$silentFails === 0) {
							peg$fail(peg$e9);
						}
					}
					if (s4 !== peg$FAILED) {
						s5 = peg$parse_();
						s6 = peg$parseextended_transition_type_value();
						if (s6 !== peg$FAILED) {
							s7 = peg$parse_();
							peg$savedPos = s0;
							s0 = peg$f24(s2, s6);
						} else {
							peg$currPos = s0;
							s0 = peg$FAILED;
						}
					} else {
						peg$currPos = s0;
						s0 = peg$FAILED;
					}
				} else {
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
						} else {
							s4 = peg$FAILED;
							if (peg$silentFails === 0) {
								peg$fail(peg$e9);
							}
						}
						if (s4 !== peg$FAILED) {
							s5 = peg$parse_();
							s6 = peg$parsepositive_number();
							if (s6 !== peg$FAILED) {
								s7 = peg$parse_();
								peg$savedPos = s0;
								s0 = peg$f25(s2, s6);
							} else {
								peg$currPos = s0;
								s0 = peg$FAILED;
							}
						} else {
							peg$currPos = s0;
							s0 = peg$FAILED;
						}
					} else {
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
				peg$fail(peg$e33);
			}
		}
		return s0;
	}
	function peg$parseextended_transition_string_attribute_name() {
		let s0, s1;
		peg$silentFails++;
		s0 = peg$currPos;
		s1 = input.substr(peg$currPos, 5);
		if (s1.toLowerCase() === peg$c9) {
			peg$currPos += 5;
		} else {
			s1 = peg$FAILED;
			if (peg$silentFails === 0) {
				peg$fail(peg$e12);
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
				peg$fail(peg$e34);
			}
		}
		return s0;
	}
	function peg$parseextended_transition_type_name() {
		let s0, s1;
		peg$silentFails++;
		s0 = peg$currPos;
		s1 = input.substr(peg$currPos, 4);
		if (s1.toLowerCase() === peg$c12) {
			peg$currPos += 4;
		} else {
			s1 = peg$FAILED;
			if (peg$silentFails === 0) {
				peg$fail(peg$e18);
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
				peg$fail(peg$e35);
			}
		}
		return s0;
	}
	function peg$parseextended_transition_numeric_attribute_name() {
		let s0, s1;
		peg$silentFails++;
		s0 = peg$currPos;
		s1 = input.substr(peg$currPos, 5);
		if (s1.toLowerCase() === peg$c25) {
			peg$currPos += 5;
		} else {
			s1 = peg$FAILED;
			if (peg$silentFails === 0) {
				peg$fail(peg$e37);
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
				peg$fail(peg$e36);
			}
		}
		return s0;
	}
	function peg$parseextended_transition_type_value() {
		let s0, s1;
		peg$silentFails++;
		if (input.substr(peg$currPos, 8) === peg$c26) {
			s0 = peg$c26;
			peg$currPos += 8;
		} else {
			s0 = peg$FAILED;
			if (peg$silentFails === 0) {
				peg$fail(peg$e39);
			}
		}
		if (s0 === peg$FAILED) {
			if (input.substr(peg$currPos, 8) === peg$c27) {
				s0 = peg$c27;
				peg$currPos += 8;
			} else {
				s0 = peg$FAILED;
				if (peg$silentFails === 0) {
					peg$fail(peg$e40);
				}
			}
		}
		peg$silentFails--;
		if (s0 === peg$FAILED) {
			s1 = peg$FAILED;
			if (peg$silentFails === 0) {
				peg$fail(peg$e38);
			}
		}
		return s0;
	}
	function peg$parsefwdarrowtoken() {
		let s0, s1;
		peg$silentFails++;
		if (input.substr(peg$currPos, 2) === peg$c28) {
			s0 = peg$c28;
			peg$currPos += 2;
		} else {
			s0 = peg$FAILED;
			if (peg$silentFails === 0) {
				peg$fail(peg$e42);
			}
		}
		if (s0 === peg$FAILED) {
			if (input.substr(peg$currPos, 3) === peg$c29) {
				s0 = peg$c29;
				peg$currPos += 3;
			} else {
				s0 = peg$FAILED;
				if (peg$silentFails === 0) {
					peg$fail(peg$e43);
				}
			}
			if (s0 === peg$FAILED) {
				if (input.substr(peg$currPos, 2) === peg$c30) {
					s0 = peg$c30;
					peg$currPos += 2;
				} else {
					s0 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$e44);
					}
				}
				if (s0 === peg$FAILED) {
					if (input.substr(peg$currPos, 2) === peg$c31) {
						s0 = peg$c31;
						peg$currPos += 2;
					} else {
						s0 = peg$FAILED;
						if (peg$silentFails === 0) {
							peg$fail(peg$e45);
						}
					}
					if (s0 === peg$FAILED) {
						if (input.substr(peg$currPos, 2) === peg$c32) {
							s0 = peg$c32;
							peg$currPos += 2;
						} else {
							s0 = peg$FAILED;
							if (peg$silentFails === 0) {
								peg$fail(peg$e46);
							}
						}
						if (s0 === peg$FAILED) {
							if (input.substr(peg$currPos, 2) === peg$c33) {
								s0 = peg$c33;
								peg$currPos += 2;
							} else {
								s0 = peg$FAILED;
								if (peg$silentFails === 0) {
									peg$fail(peg$e47);
								}
							}
							if (s0 === peg$FAILED) {
								if (input.substr(peg$currPos, 2) === peg$c34) {
									s0 = peg$c34;
									peg$currPos += 2;
								} else {
									s0 = peg$FAILED;
									if (peg$silentFails === 0) {
										peg$fail(peg$e48);
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
				peg$fail(peg$e41);
			}
		}
		return s0;
	}
	function peg$parsebckarrowtoken() {
		let s0, s1;
		peg$silentFails++;
		if (input.substr(peg$currPos, 2) === peg$c35) {
			s0 = peg$c35;
			peg$currPos += 2;
		} else {
			s0 = peg$FAILED;
			if (peg$silentFails === 0) {
				peg$fail(peg$e50);
			}
		}
		if (s0 === peg$FAILED) {
			if (input.substr(peg$currPos, 3) === peg$c36) {
				s0 = peg$c36;
				peg$currPos += 3;
			} else {
				s0 = peg$FAILED;
				if (peg$silentFails === 0) {
					peg$fail(peg$e51);
				}
			}
			if (s0 === peg$FAILED) {
				if (input.substr(peg$currPos, 2) === peg$c37) {
					s0 = peg$c37;
					peg$currPos += 2;
				} else {
					s0 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$e52);
					}
				}
				if (s0 === peg$FAILED) {
					if (input.substr(peg$currPos, 2) === peg$c38) {
						s0 = peg$c38;
						peg$currPos += 2;
					} else {
						s0 = peg$FAILED;
						if (peg$silentFails === 0) {
							peg$fail(peg$e53);
						}
					}
					if (s0 === peg$FAILED) {
						if (input.substr(peg$currPos, 2) === peg$c39) {
							s0 = peg$c39;
							peg$currPos += 2;
						} else {
							s0 = peg$FAILED;
							if (peg$silentFails === 0) {
								peg$fail(peg$e54);
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
				peg$fail(peg$e49);
			}
		}
		return s0;
	}
	function peg$parsenote() {
		let s0, s1, s2, s3, s4;
		s0 = peg$currPos;
		s1 = peg$parse_();
		if (input.charCodeAt(peg$currPos) === 35) {
			s2 = peg$c40;
			peg$currPos++;
		} else {
			s2 = peg$FAILED;
			if (peg$silentFails === 0) {
				peg$fail(peg$e55);
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
		} else {
			peg$currPos = s0;
			s0 = peg$FAILED;
		}
		return s0;
	}
	function peg$parsepositive_number() {
		let s0;
		s0 = peg$parsepositive_real();
		if (s0 === peg$FAILED) {
			s0 = peg$parsecardinal();
		}
		return s0;
	}
	function peg$parsepositive_real() {
		let s0, s1, s2, s3, s4;
		s0 = peg$currPos;
		s1 = peg$currPos;
		s2 = peg$parsecardinal();
		if (s2 !== peg$FAILED) {
			if (input.charCodeAt(peg$currPos) === 46) {
				s3 = peg$c41;
				peg$currPos++;
			} else {
				s3 = peg$FAILED;
				if (peg$silentFails === 0) {
					peg$fail(peg$e56);
				}
			}
			if (s3 !== peg$FAILED) {
				s4 = peg$parsecardinal();
				if (s4 !== peg$FAILED) {
					s2 = [s2, s3, s4];
					s1 = s2;
				} else {
					peg$currPos = s1;
					s1 = peg$FAILED;
				}
			} else {
				peg$currPos = s1;
				s1 = peg$FAILED;
			}
		} else {
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
		let s0, s1, s2;
		s0 = peg$currPos;
		s1 = [];
		s2 = input.charAt(peg$currPos);
		if (peg$r0.test(s2)) {
			peg$currPos++;
		} else {
			s2 = peg$FAILED;
			if (peg$silentFails === 0) {
				peg$fail(peg$e57);
			}
		}
		if (s2 !== peg$FAILED) {
			while (s2 !== peg$FAILED) {
				s1.push(s2);
				s2 = input.charAt(peg$currPos);
				if (peg$r0.test(s2)) {
					peg$currPos++;
				} else {
					s2 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$e57);
					}
				}
			}
		} else {
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
		let s0;
		s0 = peg$parsequotedstring();
		if (s0 === peg$FAILED) {
			s0 = peg$parseunquotedtransitionstring();
		}
		return s0;
	}
	function peg$parsestring() {
		let s0;
		s0 = peg$parsequotedstring();
		if (s0 === peg$FAILED) {
			s0 = peg$parseunquotedstring();
		}
		return s0;
	}
	function peg$parsequotedstring() {
		let s0, s1, s2, s3;
		peg$silentFails++;
		s0 = peg$currPos;
		if (input.charCodeAt(peg$currPos) === 34) {
			s1 = peg$c42;
			peg$currPos++;
		} else {
			s1 = peg$FAILED;
			if (peg$silentFails === 0) {
				peg$fail(peg$e59);
			}
		}
		if (s1 !== peg$FAILED) {
			s2 = peg$parsestringcontent();
			if (input.charCodeAt(peg$currPos) === 34) {
				s3 = peg$c42;
				peg$currPos++;
			} else {
				s3 = peg$FAILED;
				if (peg$silentFails === 0) {
					peg$fail(peg$e59);
				}
			}
			if (s3 !== peg$FAILED) {
				peg$savedPos = s0;
				s0 = peg$f32(s2);
			} else {
				peg$currPos = s0;
				s0 = peg$FAILED;
			}
		} else {
			peg$currPos = s0;
			s0 = peg$FAILED;
		}
		peg$silentFails--;
		if (s0 === peg$FAILED) {
			s1 = peg$FAILED;
			if (peg$silentFails === 0) {
				peg$fail(peg$e58);
			}
		}
		return s0;
	}
	function peg$parsestringcontent() {
		let s0, s1, s2, s3;
		s0 = [];
		s1 = peg$currPos;
		s2 = peg$currPos;
		peg$silentFails++;
		if (input.charCodeAt(peg$currPos) === 34) {
			s3 = peg$c42;
			peg$currPos++;
		} else {
			s3 = peg$FAILED;
			if (peg$silentFails === 0) {
				peg$fail(peg$e59);
			}
		}
		peg$silentFails--;
		if (s3 === peg$FAILED) {
			s2 = undefined;
		} else {
			peg$currPos = s2;
			s2 = peg$FAILED;
		}
		if (s2 !== peg$FAILED) {
			if (input.substr(peg$currPos, 2) === peg$c43) {
				s3 = peg$c43;
				peg$currPos += 2;
			} else {
				s3 = peg$FAILED;
				if (peg$silentFails === 0) {
					peg$fail(peg$e60);
				}
			}
			if (s3 === peg$FAILED) {
				if (input.length > peg$currPos) {
					s3 = input.charAt(peg$currPos);
					peg$currPos++;
				} else {
					s3 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$e61);
					}
				}
			}
			if (s3 !== peg$FAILED) {
				peg$savedPos = s1;
				s1 = peg$f33(s3);
			} else {
				peg$currPos = s1;
				s1 = peg$FAILED;
			}
		} else {
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
			} else {
				s3 = peg$FAILED;
				if (peg$silentFails === 0) {
					peg$fail(peg$e59);
				}
			}
			peg$silentFails--;
			if (s3 === peg$FAILED) {
				s2 = undefined;
			} else {
				peg$currPos = s2;
				s2 = peg$FAILED;
			}
			if (s2 !== peg$FAILED) {
				if (input.substr(peg$currPos, 2) === peg$c43) {
					s3 = peg$c43;
					peg$currPos += 2;
				} else {
					s3 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$e60);
					}
				}
				if (s3 === peg$FAILED) {
					if (input.length > peg$currPos) {
						s3 = input.charAt(peg$currPos);
						peg$currPos++;
					} else {
						s3 = peg$FAILED;
						if (peg$silentFails === 0) {
							peg$fail(peg$e61);
						}
					}
				}
				if (s3 !== peg$FAILED) {
					peg$savedPos = s1;
					s1 = peg$f33(s3);
				} else {
					peg$currPos = s1;
					s1 = peg$FAILED;
				}
			} else {
				peg$currPos = s1;
				s1 = peg$FAILED;
			}
		}
		return s0;
	}
	function peg$parseclass_string() {
		let s0, s1, s2, s3;
		peg$silentFails++;
		s0 = peg$currPos;
		if (input.charCodeAt(peg$currPos) === 34) {
			s1 = peg$c42;
			peg$currPos++;
		} else {
			s1 = peg$FAILED;
			if (peg$silentFails === 0) {
				peg$fail(peg$e59);
			}
		}
		if (s1 !== peg$FAILED) {
			s2 = peg$parseclass_stringcontent();
			if (input.charCodeAt(peg$currPos) === 34) {
				s3 = peg$c42;
				peg$currPos++;
			} else {
				s3 = peg$FAILED;
				if (peg$silentFails === 0) {
					peg$fail(peg$e59);
				}
			}
			if (s3 !== peg$FAILED) {
				peg$savedPos = s0;
				s0 = peg$f34(s2);
			} else {
				peg$currPos = s0;
				s0 = peg$FAILED;
			}
		} else {
			peg$currPos = s0;
			s0 = peg$FAILED;
		}
		peg$silentFails--;
		if (s0 === peg$FAILED) {
			s1 = peg$FAILED;
			if (peg$silentFails === 0) {
				peg$fail(peg$e62);
			}
		}
		return s0;
	}
	function peg$parseclass_stringcontent() {
		let s0, s1, s2, s3;
		s0 = [];
		s1 = peg$currPos;
		s2 = peg$currPos;
		peg$silentFails++;
		if (input.charCodeAt(peg$currPos) === 34) {
			s3 = peg$c42;
			peg$currPos++;
		} else {
			s3 = peg$FAILED;
			if (peg$silentFails === 0) {
				peg$fail(peg$e59);
			}
		}
		peg$silentFails--;
		if (s3 === peg$FAILED) {
			s2 = undefined;
		} else {
			peg$currPos = s2;
			s2 = peg$FAILED;
		}
		if (s2 !== peg$FAILED) {
			s3 = input.charAt(peg$currPos);
			if (peg$r1.test(s3)) {
				peg$currPos++;
			} else {
				s3 = peg$FAILED;
				if (peg$silentFails === 0) {
					peg$fail(peg$e63);
				}
			}
			if (s3 !== peg$FAILED) {
				peg$savedPos = s1;
				s1 = peg$f35(s3);
			} else {
				peg$currPos = s1;
				s1 = peg$FAILED;
			}
		} else {
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
			} else {
				s3 = peg$FAILED;
				if (peg$silentFails === 0) {
					peg$fail(peg$e59);
				}
			}
			peg$silentFails--;
			if (s3 === peg$FAILED) {
				s2 = undefined;
			} else {
				peg$currPos = s2;
				s2 = peg$FAILED;
			}
			if (s2 !== peg$FAILED) {
				s3 = input.charAt(peg$currPos);
				if (peg$r1.test(s3)) {
					peg$currPos++;
				} else {
					s3 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$e63);
					}
				}
				if (s3 !== peg$FAILED) {
					peg$savedPos = s1;
					s1 = peg$f35(s3);
				} else {
					peg$currPos = s1;
					s1 = peg$FAILED;
				}
			} else {
				peg$currPos = s1;
				s1 = peg$FAILED;
			}
		}
		return s0;
	}
	function peg$parseunquotedtransitionstring() {
		let s0, s1;
		s0 = peg$currPos;
		s1 = peg$parsetransitionnonsep();
		peg$savedPos = s0;
		s1 = peg$f36(s1);
		s0 = s1;
		return s0;
	}
	function peg$parseunquotedstring() {
		let s0, s1;
		s0 = peg$currPos;
		s1 = peg$parsenonsep();
		peg$savedPos = s0;
		s1 = peg$f37(s1);
		s0 = s1;
		return s0;
	}
	function peg$parsenonsep() {
		let s0, s1, s2, s3;
		s0 = [];
		s1 = peg$currPos;
		s2 = peg$currPos;
		peg$silentFails++;
		s3 = input.charAt(peg$currPos);
		if (peg$r2.test(s3)) {
			peg$currPos++;
		} else {
			s3 = peg$FAILED;
			if (peg$silentFails === 0) {
				peg$fail(peg$e64);
			}
		}
		peg$silentFails--;
		if (s3 === peg$FAILED) {
			s2 = undefined;
		} else {
			peg$currPos = s2;
			s2 = peg$FAILED;
		}
		if (s2 !== peg$FAILED) {
			if (input.length > peg$currPos) {
				s3 = input.charAt(peg$currPos);
				peg$currPos++;
			} else {
				s3 = peg$FAILED;
				if (peg$silentFails === 0) {
					peg$fail(peg$e61);
				}
			}
			if (s3 !== peg$FAILED) {
				peg$savedPos = s1;
				s1 = peg$f38(s3);
			} else {
				peg$currPos = s1;
				s1 = peg$FAILED;
			}
		} else {
			peg$currPos = s1;
			s1 = peg$FAILED;
		}
		while (s1 !== peg$FAILED) {
			s0.push(s1);
			s1 = peg$currPos;
			s2 = peg$currPos;
			peg$silentFails++;
			s3 = input.charAt(peg$currPos);
			if (peg$r2.test(s3)) {
				peg$currPos++;
			} else {
				s3 = peg$FAILED;
				if (peg$silentFails === 0) {
					peg$fail(peg$e64);
				}
			}
			peg$silentFails--;
			if (s3 === peg$FAILED) {
				s2 = undefined;
			} else {
				peg$currPos = s2;
				s2 = peg$FAILED;
			}
			if (s2 !== peg$FAILED) {
				if (input.length > peg$currPos) {
					s3 = input.charAt(peg$currPos);
					peg$currPos++;
				} else {
					s3 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$e61);
					}
				}
				if (s3 !== peg$FAILED) {
					peg$savedPos = s1;
					s1 = peg$f38(s3);
				} else {
					peg$currPos = s1;
					s1 = peg$FAILED;
				}
			} else {
				peg$currPos = s1;
				s1 = peg$FAILED;
			}
		}
		return s0;
	}
	function peg$parsetransitionnonsep() {
		let s0, s1, s2, s3;
		s0 = [];
		s1 = peg$currPos;
		s2 = peg$currPos;
		peg$silentFails++;
		s3 = input.charAt(peg$currPos);
		if (peg$r3.test(s3)) {
			peg$currPos++;
		} else {
			s3 = peg$FAILED;
			if (peg$silentFails === 0) {
				peg$fail(peg$e65);
			}
		}
		peg$silentFails--;
		if (s3 === peg$FAILED) {
			s2 = undefined;
		} else {
			peg$currPos = s2;
			s2 = peg$FAILED;
		}
		if (s2 !== peg$FAILED) {
			if (input.length > peg$currPos) {
				s3 = input.charAt(peg$currPos);
				peg$currPos++;
			} else {
				s3 = peg$FAILED;
				if (peg$silentFails === 0) {
					peg$fail(peg$e61);
				}
			}
			if (s3 !== peg$FAILED) {
				peg$savedPos = s1;
				s1 = peg$f39(s3);
			} else {
				peg$currPos = s1;
				s1 = peg$FAILED;
			}
		} else {
			peg$currPos = s1;
			s1 = peg$FAILED;
		}
		while (s1 !== peg$FAILED) {
			s0.push(s1);
			s1 = peg$currPos;
			s2 = peg$currPos;
			peg$silentFails++;
			s3 = input.charAt(peg$currPos);
			if (peg$r3.test(s3)) {
				peg$currPos++;
			} else {
				s3 = peg$FAILED;
				if (peg$silentFails === 0) {
					peg$fail(peg$e65);
				}
			}
			peg$silentFails--;
			if (s3 === peg$FAILED) {
				s2 = undefined;
			} else {
				peg$currPos = s2;
				s2 = peg$FAILED;
			}
			if (s2 !== peg$FAILED) {
				if (input.length > peg$currPos) {
					s3 = input.charAt(peg$currPos);
					peg$currPos++;
				} else {
					s3 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$e61);
					}
				}
				if (s3 !== peg$FAILED) {
					peg$savedPos = s1;
					s1 = peg$f39(s3);
				} else {
					peg$currPos = s1;
					s1 = peg$FAILED;
				}
			} else {
				peg$currPos = s1;
				s1 = peg$FAILED;
			}
		}
		return s0;
	}
	function peg$parseidentifier() {
		let s0, s1, s2;
		peg$silentFails++;
		s0 = peg$currPos;
		s1 = [];
		s2 = input.charAt(peg$currPos);
		if (peg$r4.test(s2)) {
			peg$currPos++;
		} else {
			s2 = peg$FAILED;
			if (peg$silentFails === 0) {
				peg$fail(peg$e67);
			}
		}
		if (s2 !== peg$FAILED) {
			while (s2 !== peg$FAILED) {
				s1.push(s2);
				s2 = input.charAt(peg$currPos);
				if (peg$r4.test(s2)) {
					peg$currPos++;
				} else {
					s2 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$e67);
					}
				}
			}
		} else {
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
				peg$fail(peg$e66);
			}
		}
		return s0;
	}
	function peg$parsewhitespace() {
		let s0, s1;
		peg$silentFails++;
		s0 = input.charAt(peg$currPos);
		if (peg$r5.test(s0)) {
			peg$currPos++;
		} else {
			s0 = peg$FAILED;
			if (peg$silentFails === 0) {
				peg$fail(peg$e69);
			}
		}
		peg$silentFails--;
		if (s0 === peg$FAILED) {
			s1 = peg$FAILED;
			if (peg$silentFails === 0) {
				peg$fail(peg$e68);
			}
		}
		return s0;
	}
	function peg$parselineend() {
		let s0, s1;
		peg$silentFails++;
		s0 = input.charAt(peg$currPos);
		if (peg$r6.test(s0)) {
			peg$currPos++;
		} else {
			s0 = peg$FAILED;
			if (peg$silentFails === 0) {
				peg$fail(peg$e71);
			}
		}
		peg$silentFails--;
		if (s0 === peg$FAILED) {
			s1 = peg$FAILED;
			if (peg$silentFails === 0) {
				peg$fail(peg$e70);
			}
		}
		return s0;
	}
	function peg$parsemlcomstart() {
		let s0;
		if (input.substr(peg$currPos, 2) === peg$c44) {
			s0 = peg$c44;
			peg$currPos += 2;
		} else {
			s0 = peg$FAILED;
			if (peg$silentFails === 0) {
				peg$fail(peg$e72);
			}
		}
		return s0;
	}
	function peg$parsemlcomend() {
		let s0;
		if (input.substr(peg$currPos, 2) === peg$c45) {
			s0 = peg$c45;
			peg$currPos += 2;
		} else {
			s0 = peg$FAILED;
			if (peg$silentFails === 0) {
				peg$fail(peg$e73);
			}
		}
		return s0;
	}
	function peg$parsemlcomtok() {
		let s0, s1, s2;
		s0 = peg$currPos;
		s1 = peg$currPos;
		peg$silentFails++;
		if (input.substr(peg$currPos, 2) === peg$c45) {
			s2 = peg$c45;
			peg$currPos += 2;
		} else {
			s2 = peg$FAILED;
			if (peg$silentFails === 0) {
				peg$fail(peg$e73);
			}
		}
		peg$silentFails--;
		if (s2 === peg$FAILED) {
			s1 = undefined;
		} else {
			peg$currPos = s1;
			s1 = peg$FAILED;
		}
		if (s1 !== peg$FAILED) {
			if (input.length > peg$currPos) {
				s2 = input.charAt(peg$currPos);
				peg$currPos++;
			} else {
				s2 = peg$FAILED;
				if (peg$silentFails === 0) {
					peg$fail(peg$e61);
				}
			}
			if (s2 !== peg$FAILED) {
				s1 = [s1, s2];
				s0 = s1;
			} else {
				peg$currPos = s0;
				s0 = peg$FAILED;
			}
		} else {
			peg$currPos = s0;
			s0 = peg$FAILED;
		}
		return s0;
	}
	function peg$parsemlcomment() {
		let s0, s1, s2, s3;
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
				s1 = [s1, s2, s3];
				s0 = s1;
			} else {
				peg$currPos = s0;
				s0 = peg$FAILED;
			}
		} else {
			peg$currPos = s0;
			s0 = peg$FAILED;
		}
		return s0;
	}
	function peg$parseslcomstart() {
		let s0;
		if (input.substr(peg$currPos, 2) === peg$c46) {
			s0 = peg$c46;
			peg$currPos += 2;
		} else {
			s0 = peg$FAILED;
			if (peg$silentFails === 0) {
				peg$fail(peg$e74);
			}
		}
		return s0;
	}
	function peg$parseslcomtok() {
		let s0;
		s0 = input.charAt(peg$currPos);
		if (peg$r7.test(s0)) {
			peg$currPos++;
		} else {
			s0 = peg$FAILED;
			if (peg$silentFails === 0) {
				peg$fail(peg$e75);
			}
		}
		return s0;
	}
	function peg$parseslcomment() {
		let s0, s1, s2, s3;
		s0 = peg$currPos;
		s1 = peg$parseslcomstart();
		if (s1 !== peg$FAILED) {
			s2 = [];
			s3 = peg$parseslcomtok();
			while (s3 !== peg$FAILED) {
				s2.push(s3);
				s3 = peg$parseslcomtok();
			}
			s1 = [s1, s2];
			s0 = s1;
		} else {
			peg$currPos = s0;
			s0 = peg$FAILED;
		}
		return s0;
	}
	function peg$parsecomment() {
		let s0, s1;
		peg$silentFails++;
		s0 = peg$parseslcomment();
		if (s0 === peg$FAILED) {
			s0 = peg$parsemlcomment();
		}
		peg$silentFails--;
		if (s0 === peg$FAILED) {
			s1 = peg$FAILED;
			if (peg$silentFails === 0) {
				peg$fail(peg$e76);
			}
		}
		return s0;
	}
	function peg$parse_() {
		let s0, s1;
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
	const peg$success = peg$result !== peg$FAILED && peg$currPos === input.length;
	function peg$throw() {
		if (peg$result !== peg$FAILED && peg$currPos < input.length) {
			peg$fail(peg$endExpectation());
		}
		throw peg$buildStructuredError(
			peg$maxFailExpected,
			peg$maxFailPos < input.length ? peg$getUnicode(peg$maxFailPos) : null,
			peg$maxFailPos < input.length
				? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
				: peg$computeLocation(peg$maxFailPos, peg$maxFailPos),
		);
	}
	if (options.peg$library) {
		return {
			peg$result,
			peg$currPos,
			peg$FAILED,
			peg$maxFailExpected,
			peg$maxFailPos,
			peg$success,
			peg$throw: peg$success ? undefined : peg$throw,
		};
	}
	if (peg$success) {
		return peg$result;
	} else {
		peg$throw();
	}
}
const peg$allowedStartRules = ["program"];
export {
	peg$allowedStartRules as StartRules,
	peg$SyntaxError as SyntaxError,
	peg$parse as parse,
};

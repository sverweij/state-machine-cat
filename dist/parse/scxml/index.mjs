import { XMLParser } from "fast-xml-parser";
import he from "he";
import traverse from "neotraverse";
import { Counter } from "../../counter.mjs";
import parserHelpers from "../parser-helpers.mjs";
import utl from "../../transform/utl.mjs";
import { castArray } from "./utl.mjs";
import { normalizeMachine } from "./normalize-machine.mjs";
const formatLabel = utl.formatLabel;
function extractActions(pState, pActionType) {
	return castArray(pState[pActionType]).map((pAction) => ({
		type: pActionType === "onexit" ? "exit" : "entry",
		body: he.decode(pAction).trim(),
	}));
}
function extractActionsFromInvokes(pInvokeTriggers) {
	return castArray(pInvokeTriggers).map((pInvokeTrigger) => {
		const lId = he.decode(pInvokeTrigger.id || "").trim();
		return {
			type: "activity",
			body: lId || he.decode(pInvokeTrigger || "").trim(),
		};
	});
}
function deriveActions(pState) {
	let lReturnValue = [];
	if (pState.onentry) {
		lReturnValue = lReturnValue.concat(extractActions(pState, "onentry"));
	}
	if (pState.invoke) {
		lReturnValue = lReturnValue.concat(
			extractActionsFromInvokes(pState.invoke),
		);
	}
	if (pState.onexit) {
		lReturnValue = lReturnValue.concat(extractActions(pState, "onexit"));
	}
	return lReturnValue;
}
function deriveStateType(pType, pState) {
	return pType === "history" && pState.type === "deep" ? "deephistory" : pType;
}
function mapState(pType) {
	return (pState) => {
		const lReturnValue = {
			name: pState.id,
			type: deriveStateType(pType, pState),
		};
		if (parserHelpers.getStateType(pState.id) !== lReturnValue.type) {
			lReturnValue.typeExplicitlySet = true;
		}
		if (pState.onentry || pState.onexit || pState.invoke) {
			lReturnValue.actions = deriveActions(pState);
		}
		if (
			Object.keys(pState).some((pKey) =>
				["initial", "state", "history", "parallel", "final"].includes(pKey),
			)
		) {
			lReturnValue.statemachine = mapMachine(pState);
		}
		return lReturnValue;
	};
}
function extractTransitionAttributesFromObject(pTransition) {
	const lReturnValue = {};
	if (pTransition.event) {
		lReturnValue.event = pTransition.event.split(/\s+/).join("\n");
	}
	if (pTransition.cond) {
		lReturnValue.cond = pTransition.cond;
	}
	if (pTransition["#text"]) {
		lReturnValue.action = he.decode(pTransition["#text"]).trim();
	}
	if (pTransition.type) {
		lReturnValue.type = pTransition.type;
	}
	return lReturnValue;
}
function extractTransitionAttributes(pTransition) {
	const lReturnValue = {};
	if (typeof pTransition === "string") {
		lReturnValue.action = he.decode(pTransition).trim();
	} else {
		Object.assign(
			lReturnValue,
			extractTransitionAttributesFromObject(pTransition),
		);
	}
	const lLabel = formatLabel(
		lReturnValue.event,
		lReturnValue.cond,
		lReturnValue.action,
	);
	if (lLabel) {
		lReturnValue.label = lLabel;
	}
	return lReturnValue;
}
function reduceTransition(pState, pCounter) {
	return (pAllTransitions, pTransition) => {
		const lTargets = (pTransition?.target ?? pState.id).split(/\s+/);
		const lTransitionAttributes = extractTransitionAttributes(pTransition);
		return pAllTransitions.concat(
			lTargets.map((pTarget) => ({
				id: pCounter.next(),
				from: pState.id,
				to: pTarget,
				...lTransitionAttributes,
			})),
		);
	};
}
function extractTransitions(pStates, pCounter) {
	return pStates
		.filter((pState) => Object.hasOwn(pState, "transition"))
		.reduce((pAllTransitions, pThisState) => {
			const lTransitionAsArray = castArray(pThisState.transition);
			return pAllTransitions.concat(
				lTransitionAsArray.reduce(reduceTransition(pThisState, pCounter), []),
			);
		}, []);
}
function mapMachine(pSCXMLStateMachine) {
	const lNormalizedMachine = normalizeMachine(pSCXMLStateMachine);
	const lReturnValue = {
		states: lNormalizedMachine.initial
			.map(mapState("initial"))
			.concat(lNormalizedMachine.state.map(mapState("regular")))
			.concat(lNormalizedMachine.parallel.map(mapState("parallel")))
			.concat(lNormalizedMachine.history.map(mapState("history")))
			.concat(lNormalizedMachine.final.map(mapState("final"))),
	};
	const lCounter = new Counter();
	const lTransitions = extractTransitions(lNormalizedMachine.initial, lCounter)
		.concat(extractTransitions(lNormalizedMachine.state, lCounter))
		.concat(extractTransitions(lNormalizedMachine.parallel, lCounter));
	if (lTransitions.length > 0) {
		lReturnValue.transitions = lTransitions;
	}
	return lReturnValue;
}
function deDuplicateAttributesAndTags(pObject, pAttributeNamePrefix) {
	return traverse(pObject).map(function deDuplicate() {
		if (this.key?.startsWith(pAttributeNamePrefix)) {
			const pUnPrefixedAttributeName = this.key.slice(
				pAttributeNamePrefix.length,
			);
			if (this.parent.keys.includes(pUnPrefixedAttributeName)) {
				this.remove();
			} else {
				this.parent.node[pUnPrefixedAttributeName] = this.node;
				this.remove();
			}
		}
	});
}
export function parse(pSCXMLString) {
	const lTrimmedSCXMLString = pSCXMLString.trim();
	const lAttributeNamePrefix = "@_";
	let lXMLAsJSON = {};
	const lXMLParser = new XMLParser({
		attributeNamePrefix: lAttributeNamePrefix,
		ignoreAttributes: false,
		parseTagValue: true,
		processEntities: false,
		tagValueProcessor: (_pTagName, pTagValue) => he.decode(pTagValue),
		stopNodes: ["*.onentry", "*.onexit", "*.transition"],
	});
	try {
		lXMLAsJSON = deDuplicateAttributesAndTags(
			lXMLParser.parse(lTrimmedSCXMLString, true),
			lAttributeNamePrefix,
		);
	} catch (pError) {
		throw new Error("That doesn't look like valid xml ...\n");
	}
	return mapMachine(
		lXMLAsJSON?.scxml ?? {
			xmlns: "http://www.w3.org/2005/07/scxml",
			version: "1.0",
		},
	);
}

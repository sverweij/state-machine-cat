import { equal } from "node:assert/strict";
import XMLNameValidator from "xml-name-validator";
import makeValidXMLName from "../../../src/render/scjson/make-valid-xml-name.mjs";

function checkExpectationAndValidity(pExpectation, pValue) {
  const lValueToTest = makeValidXMLName(pValue);

  equal(lValueToTest, pExpectation);
  equal(XMLNameValidator.name(lValueToTest), true);
}

describe("#makeValidXMLName", () => {
  it("returns an __empty when not passed a value", () => {
    checkExpectationAndValidity("__empty");
  });

  it("returns an _-prefixed uuidv4 for null", () => {
    checkExpectationAndValidity("__empty", null);
  });

  it("returns an _-prefixed uuidv4 for empty strings", () => {
    checkExpectationAndValidity("__empty", "");
  });

  it('start chars: smacks an "_" before valid NameChar, but invalid NameStartChar (numbers)', () => {
    checkExpectationAndValidity("_9", "9");
  });

  it('start chars: smacks an "_" before valid NameChar, but invalid NameStartChar (.)', () => {
    checkExpectationAndValidity("_.", ".");
  });

  it('start chars: smacks an "_" before valid NameChar, but invalid NameStartChar (-)', () => {
    checkExpectationAndValidity("_-", "-");
  });

  it("start chars: replaces start characters that are invalid NameChars", () => {
    checkExpectationAndValidity("_", "]");
  });

  it("start chars: leaves valid NameStartChars alone", () => {
    checkExpectationAndValidity(":", ":");
    checkExpectationAndValidity("A", "A");
    checkExpectationAndValidity("態", "態");
  });

  it("tail chars: leaves valid XML names alone", () => {
    checkExpectationAndValidity("有限狀態機", "有限狀態機");
  });

  it("tail chars: replaces invalid NameChars", () => {
    checkExpectationAndValidity("finite_state_machine", "finite state machine");
  });

  it("smoke test", () => {
    checkExpectationAndValidity("_3_little_小豬", "3 little 小豬");
  });
});

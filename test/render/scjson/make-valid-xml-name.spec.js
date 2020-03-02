const chai = require("chai");
const XMLNameValidator = require("xml-name-validator");
const makeValidXMLName = require("../../../src/render/scjson/make-valid-xml-name");

const expect = chai.expect;

function checkExpectationAndValidity(pExpectation, pValue) {
  const lValueToTest = makeValidXMLName(pValue);

  expect(lValueToTest).to.equal(pExpectation);
  expect(XMLNameValidator.name(lValueToTest).success).to.equal(true);
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

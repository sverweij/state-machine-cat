import { deepEqual, equal } from "node:assert/strict";
import { parse } from "../../src/cli/attributes-parser.mjs";

function assertSyntaxError(pProgram, pParseFunction, pErrorType) {
  if (!pErrorType) {
    pErrorType = "SyntaxError";
  }
  try {
    let lStillRan = false;

    if (pParseFunction(pProgram)) {
      lStillRan = true;
    }
    equal(lStillRan, false);
  } catch (pError) {
    equal(pError.name, pErrorType);
  }
}
/*
Statements   : 87.53% ( 2577/2944 )
Branches     : 65.46% ( 1696/2591 )
Functions    : 92.61% ( 376/406 )
Lines        : 90.43% ( 2391/2644 )
*/
describe("#cli - properties-parse", () => {
  describe("happy day - one param", () => {
    it("one string param", () => {
      deepEqual(parse('stringu="a string"'), [
        { name: "stringu", value: "a string" },
      ]);
    });
    it("one unquoted string param", () => {
      deepEqual(parse("stringu=another_string"), [
        { name: "stringu", value: "another_string" },
      ]);
    });
    it("one boolean param", () => {
      deepEqual(parse("booleaneu=false"), [
        { name: "booleaneu", value: false },
      ]);
    });
    it("one boolean param (true)", () => {
      deepEqual(parse("booleaneu=true"), [{ name: "booleaneu", value: true }]);
    });
    it("one integer param", () => {
      deepEqual(parse("interu=481"), [{ name: "interu", value: 481 }]);
    });
    it("one float param", () => {
      deepEqual(parse("floatu=3.14"), [{ name: "floatu", value: 3.14 }]);
    });
    it("one param embedded in spacy stuff", () => {
      deepEqual(parse(" spaces \t=\r\n    false "), [
        { name: "spaces", value: false },
      ]);
    });
  });

  describe("happy day - multiple params", () => {
    it("two string params", () => {
      deepEqual(parse(' stringu= "a string " stringb = string'), [
        { name: "stringu", value: "a string " },
        { name: "stringb", value: "string" },
      ]);
    });
  });

  describe("alternates", () => {
    it("empty string", () => {
      assertSyntaxError("", parse);
    });
    it("only a number", () => {
      assertSyntaxError("481", parse);
    });
    it("only a boolean", () => {
      assertSyntaxError("true", parse);
    });
    it("only a string", () => {
      assertSyntaxError('"a string"', parse);
    });
    it("only an unquoted string", () => {
      assertSyntaxError("unquoted_string", parse);
    });
    it("only a number=", () => {
      assertSyntaxError("481=", parse);
    });
    it("only a boolean=", () => {
      assertSyntaxError("true=", parse);
    });
    it("only a string=", () => {
      assertSyntaxError('"a string"=', parse);
    });
    it("only an unquoted string=", () => {
      assertSyntaxError("unquoted_string=", parse);
    });
    it("only an unquoted after a KV pair string", () => {
      assertSyntaxError("key=value unquoted_string", parse);
    });
    it("only an unquoted after a KV pair string=", () => {
      assertSyntaxError("key=value unquoted_string=", parse);
    });
  });
});

import { expect } from "chai";
import { parse } from "../../src/cli/attributes-parser.js";

function assertSyntaxError(pProgram, pParseFunction, pErrorType) {
  if (!pErrorType) {
    pErrorType = "SyntaxError";
  }
  try {
    let lStillRan = false;

    if (pParseFunction(pProgram)) {
      lStillRan = true;
    }
    expect(lStillRan).to.equal(false);
  } catch (pError) {
    expect(pError.name).to.equal(pErrorType);
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
      expect(parse('stringu="a string"')).to.deep.equal([
        { name: "stringu", value: "a string" },
      ]);
    });
    it("one unquoted string param", () => {
      expect(parse("stringu=another_string")).to.deep.equal([
        { name: "stringu", value: "another_string" },
      ]);
    });
    it("one boolean param", () => {
      expect(parse("booleaneu=false")).to.deep.equal([
        { name: "booleaneu", value: false },
      ]);
    });
    it("one boolean param (true)", () => {
      expect(parse("booleaneu=true")).to.deep.equal([
        { name: "booleaneu", value: true },
      ]);
    });
    it("one integer param", () => {
      expect(parse("interu=481")).to.deep.equal([
        { name: "interu", value: 481 },
      ]);
    });
    it("one float param", () => {
      expect(parse("floatu=3.14")).to.deep.equal([
        { name: "floatu", value: 3.14 },
      ]);
    });
    it("one param embedded in spacy stuff", () => {
      expect(parse(" spaces \t=\r\n    false ")).to.deep.equal([
        { name: "spaces", value: false },
      ]);
    });
  });

  describe("happy day - multiple params", () => {
    it("two string params", () => {
      expect(parse(' stringu= "a string " stringb = string')).to.deep.equal([
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

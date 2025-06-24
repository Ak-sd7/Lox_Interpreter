import type { Token } from "./types";
import { isAlpha, isAlphaNumeric, isDigit } from "./utils";
export class Tokenizer {
  private fileContent: string;
  private tokens: Token[] = [];
  private line: number = 1;
  private hasError: boolean = false;
  private index: number = 0;
  private start: number = 0;

  private keywords = new Map<string, string>([
    ["and", "AND"],
    ["class", "CLASS"],
    ["else", "ELSE"],
    ["false", "FALSE"],
    ["for", "FOR"],
    ["fun", "FUN"],
    ["if", "IF"],
    ["nil", "NIL"],
    ["or", "OR"],
    ["print", "PRINT"],
    ["return", "RETURN"],
    ["super", "SUPER"],
    ["this", "THIS"],
    ["true", "TRUE"],
    ["var", "VAR"],
    ["while", "WHILE"],
  ]);

  constructor(fileContent: string) {
    this.fileContent = fileContent;
  }

  private checkNextChar(nextChar: string): boolean {
    if (
      this.index >= this.fileContent.length - 1 ||
      this.fileContent[this.index + 1] !== nextChar
    )
      return false;
    this.index++;
    if (nextChar == "/") {
      while (
        this.index < this.fileContent.length &&
        this.fileContent[this.index] !== "\n"
      ) {
        this.index++;
      }
      this.index--;
    }
    if (nextChar == '"') {
    }
    return true;
  }

  private identify(
    character: string
  ): [string, string, string] | [string, string] | null {
    switch (character) {
      case "(":
        return ["LEFT_PAREN", "("];
        break;
      case ")":
        return ["RIGHT_PAREN", ")"];
        break;
      case "{":
        return ["LEFT_BRACE", "{"];
        break;
      case "}":
        return ["RIGHT_BRACE", "}"];
        break;
      case ",":
        return ["COMMA", ","];
        break;
      case "*":
        return ["STAR", "*"];
        break;
      case "+":
        return ["PLUS", "+"];
        break;
      case ".":
        return ["DOT", "."];
        break;
      case ";":
        return ["SEMICOLON", ";"];
        break;
      case "-":
        return ["MINUS", "-"];
        break;
      case "=":
        return this.checkNextChar("=") ? ["EQUAL_EQUAL", "=="] : ["EQUAL", "="];
        break;
      case "<":
        return this.checkNextChar("=") ? ["LESS_EQUAL", "<="] : ["LESS", "<"];
        break;
      case ">":
        return this.checkNextChar("=")
          ? ["GREATER_EQUAL", ">="]
          : ["GREATER", ">"];
        break;
      case "!":
        return this.checkNextChar("=") ? ["BANG_EQUAL", "!="] : ["BANG", "!"];
        break;
      case "/":
        return this.checkNextChar("/") ? null : ["SLASH", "/"];
        break;
      case '"':
        this.start = this.index;
        this.index++;
        while (
          this.index < this.fileContent.length &&
          this.fileContent[this.index] !== '"'
        ) {
          if (this.fileContent[this.index] == "\n") this.line++;
          this.index++;
        }
        if (this.index >= this.fileContent.length) {
          console.error(`[line ${this.line}] Error: Unterminated string.`);
          this.hasError = true;
          return null;
        }
        const subString: string = this.fileContent.substring(
          this.start + 1,
          this.index
        );
        return ["STRING", `"${subString}"`, subString];
        break;
      case " ":
      case "\t":
      case "\r":
        return null;
        break;
      case "\n":
        this.line++;
        return null;
        break;
      default:
        if (isDigit(character)) {
          let hasDecimal: boolean = false;
          this.start = this.index;

          while (
            this.index < this.fileContent.length &&
            isDigit(this.fileContent[this.index])
          ) {
            this.index++;
          }

          if (
            this.index < this.fileContent.length &&
            this.fileContent[this.index] == "." &&
            this.index + 1 < this.fileContent.length &&
            isDigit(this.fileContent[this.index + 1])
          ) {
            this.index++;
            hasDecimal = true;
            while (
              this.index < this.fileContent.length &&
              isDigit(this.fileContent[this.index])
            ) {
              this.index++;
            }
          }
          const numberValue = this.fileContent.substring(
            this.start,
            this.index
          );

          let literalValue = numberValue;
          if (hasDecimal) {
            // Remove trailing zeros from the decimal part
            literalValue = literalValue.replace(/(\.\d*?)0+$/, "$1");
            if (literalValue.endsWith(".")) {
              literalValue += "0";
            }
          } else {
            // For integers, add .0
            literalValue += ".0";
          }
          this.index--;
          return ["NUMBER", numberValue, literalValue];
        }
        if (isAlpha(character)) {
          this.start = this.index;
          while (
            this.index < this.fileContent.length &&
            isAlphaNumeric(this.fileContent[this.index])
          ) {
            this.index++;
          }
          const identifierValue: string = this.fileContent.substring(
            this.start,
            this.index
          );
          let identifier: string | undefined;
          if (this.keywords.has(identifierValue))
            identifier = this.keywords.get(identifierValue);
          if (identifier === undefined) identifier = "IDENTIFIER";
          this.index--;
          return [identifier, identifierValue];
        }
        console.error(
          `[line ${this.line}] Error: Unexpected character: ${character}`
        );
        this.hasError = true;
        return null;
    }
  }

  public tokenize(): Token[] {
    this.tokens = [];
    this.line = 1;
    this.hasError = false;
    this.index = 0;

    for (; this.index < this.fileContent.length; this.index++) {
      const lexical_analysis = this.identify(this.fileContent[this.index]);
      if (lexical_analysis !== null) {
        const lexeme: string = lexical_analysis[1];
        const token_type: string = lexical_analysis[0];
        let literal: string = "null";
        lexical_analysis.length == 3 ? (literal = lexical_analysis[2]) : "null";
        this.tokens.push([token_type, lexeme, literal]);
      }
    }

    this.tokens.push(["EOF", "", "null"]);
    return this.tokens;
  }

  public hasErrors(): boolean {
    return this.hasError;
  }

  public printTokens(): void {
    for (let token: number = 0; token < this.tokens.length; token++) {
      const value: Token = this.tokens[token];
      console.log(`${value[0]} ${value[1]} ${value[2]}`);
    }
  }
}

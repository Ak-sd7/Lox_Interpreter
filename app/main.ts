import fs from "fs";
const args: string[] = process.argv.slice(2); // Skip the first two arguments (node path and script path)

if (args.length < 2) {
  console.error("Usage: ./your_program.sh tokenize <filename>");
  process.exit(1);
}

const command: string = args[0];

if (command !== "tokenize") {
  console.error(`Usage: Unknown command: ${command}`);
  process.exit(1);
}

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.error("Logs from your program will appear here!");

let tokens: [string, string, string][] = [];
let line: number = 1,
  hasError: boolean = false,
  index = 0,
  start: number = 0,
  end: number = 0;

const checkNextChar = (nextChar: string): boolean => {
  if (index >= fileContent.length - 1 || fileContent[index + 1] !== nextChar)
    return false;
  index++;
  if (nextChar == "/") {
    while (index < fileContent.length && fileContent[index] !== "\n") {
      index++;
    }
    index--;
  }
  if (nextChar == '"') {
  }
  return true;
};

const isDigit = (character: string): boolean => {
  if (character >= "0" && character <= "9") return true;
  return false;
};

const isAlpha = (character: string): boolean => {
  return (
    (character >= "a" && character <= "z") ||
    (character >= "A" && character <= "Z") ||
    character === "_"
  );
};

const isAlphaNumeric = (character: string): boolean => {
  return isAlpha(character) || isDigit(character);
};

let keywords = new Map<string, string>([
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

const identify = (
  character: string
): [string, string, string] | [string, string] | null => {
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
      return checkNextChar("=") ? ["EQUAL_EQUAL", "=="] : ["EQUAL", "="];
      break;
    case "<":
      return checkNextChar("=") ? ["LESS_EQUAL", "<="] : ["LESS", "<"];
      break;
    case ">":
      return checkNextChar("=") ? ["GREATER_EQUAL", ">="] : ["GREATER", ">"];
      break;
    case "!":
      return checkNextChar("=") ? ["BANG_EQUAL", "!="] : ["BANG", "!"];
      break;
    case "/":
      return checkNextChar("/") ? null : ["SLASH", "/"];
      break;
    case '"':
      start = index;
      index++;
      while (index < fileContent.length && fileContent[index] !== '"') {
        if (fileContent[index] == "\n") line++;
        index++;
      }
      end = index;
      if (index >= fileContent.length) {
        console.error(`[line ${line}] Error: Unterminated string.`);
        hasError = true;
        return null;
      }
      const subString: string = fileContent.substring(start + 1, index);
      return ["STRING", `"${subString}"`, subString];
      break;
    case " ":
    case "\t":
    case "\r":
      return null;
      break;
    case "\n":
      line++;
      return null;
      break;
    default:
      if (isDigit(character)) {
        let hasDecimal: boolean = false;
        start = index;

        while (index < fileContent.length && isDigit(fileContent[index])) {
          index++;
        }

        if (
          index < fileContent.length &&
          fileContent[index] == "." &&
          index + 1 < fileContent.length &&
          isDigit(fileContent[index + 1])
        ) {
          index++;
          hasDecimal = true;
          while (index < fileContent.length && isDigit(fileContent[index])) {
            index++;
          }
        }
        const numberValue = fileContent.substring(start, index);

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
        index--;
        return ["NUMBER", numberValue, literalValue];
      }
      if (isAlpha(character)) {
        start = index;
        while (
          index < fileContent.length &&
          isAlphaNumeric(fileContent[index])
        ) {
          index++;
        }
        const identifierValue: string = fileContent.substring(start, index);
        let identifier: string | undefined;
        if (keywords.has(identifierValue))
          identifier = keywords.get(identifierValue);
        if (identifier === undefined) identifier = "IDENTIFIER";
        index--;
        return [identifier, identifierValue];
      }
      console.error(`[line ${line}] Error: Unexpected character: ${character}`);
      hasError = true;
      return null;
  }
};

const filename: string = args[1];

// Uncomment this block to pass the first stage

const fileContent: string = fs.readFileSync(filename, "utf8");

for (; index < fileContent.length; index++) {
  const lexical_analysis = identify(fileContent[index]);
  if (lexical_analysis !== null) {
    const lexeme: string = lexical_analysis[1];
    const token_type: string = lexical_analysis[0];
    let literal: string = "null";
    lexical_analysis.length == 3 ? (literal = lexical_analysis[2]) : "null";
    tokens.push([token_type, lexeme, literal]);
  }
}

tokens.push(["EOF", "", "null"]);

for (let token: number = 0; token < tokens.length; token++) {
  const value: [string, string, string] = tokens[token];
  console.log(`${value[0]} ${value[1]} ${value[2]}`);
}

if (hasError) {
  process.exit(65);
}

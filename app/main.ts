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
  hasComment: boolean = false;

const checkNextChar = (nextChar: string): boolean => {
  if (index == fileContent.length - 1 || fileContent[index + 1] !== nextChar)
    return false;
  index++;
  if(nextChar=="/")
		hasComment = true;
  return true;
};

const identify = (character: string): [string, string] | null => {
  switch (character) {
    case "(":
      return ["LEFT_PAREN", "("];
    case ")":
      return ["RIGHT_PAREN", ")"];
    case "{":
      return ["LEFT_BRACE", "{"];
    case "}":
      return ["RIGHT_BRACE", "}"];
    case ",":
      return ["COMMA", ","];
    case "*":
      return ["STAR", "*"];
    case "+":
      return ["PLUS", "+"];
    case ".":
      return ["DOT", "."];
    case ";":
      return ["SEMICOLON", ";"];
    case "-":
      return ["MINUS", "-"];
    case "=":
      return checkNextChar("=") ? ["EQUAL_EQUAL", "=="] : ["EQUAL", "="];
    case "<":
      return checkNextChar("=") ? ["LESS_EQUAL", "<="] : ["LESS", "<"];
    case ">":
      return checkNextChar("=") ? ["GREATER_EQUAL", ">="] : ["GREATER", ">"];
    case "!":
      return checkNextChar("=") ? ["BANG_EQUAL", "!="] : ["BANG", "!"];
    case "/":
      return checkNextChar("/") ? null: ["SLASH", "/"];
	case " ":
		return null;
    default:
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
  if(hasComment) {
		break;
  }
  if (lexical_analysis !== null) {
    const lexeme: string = lexical_analysis[1];
    const token_type: string = lexical_analysis[0];
    const literal: string = "null";
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

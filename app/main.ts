import fs from "fs";
import { Tokenizer } from "./tokenize";
import { Parser } from "./parse";
import { Ast } from "./ast";
const args: string[] = process.argv.slice(2); // Skip the first two arguments (node path and script path)

if (args.length < 2) {
  console.error("Usage: ./your_program.sh tokenize <filename>");
  process.exit(1);
}

const command: string = args[0];

if (command !== "tokenize" && command !== "parse") {
  console.error(`Usage: Unknown command: ${command}`);
  process.exit(1);
}

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.error("Logs from your program will appear here!");

const filename: string = args[1];
const fileContent: string = fs.readFileSync(filename, "utf8");

const tokenizer = new Tokenizer(fileContent);
const tokens = tokenizer.tokenize();
console.log(tokens);
if(command==="tokenize") {
  tokenizer.printTokens();

  if (tokenizer.hasErrors()) {
    process.exit(65);
  }
}else if(command==="parse") {
  if (tokenizer.hasErrors()) {
    process.exit(65);
  }

  const parser = new Parser(tokens);
  const expression = parser.parse();

  if(expression===null) {
    process.exit(65);
  }

  const astStruct = new Ast();
  console.log(astStruct.print(expression));
}


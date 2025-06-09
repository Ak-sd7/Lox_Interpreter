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

const identify = (character: string): string => {
  switch (character) {
    case "(":
      return "LEFT_PAREN";
      break;
    case ")":
      return "RIGHT_PAREN";
      break;
  }
  return "";
};

const filename: string = args[1];

// Uncomment this block to pass the first stage

const fileContent: string = fs.readFileSync(filename, "utf8");

for (let ch: number = 0; ch < fileContent.length; ch++) {
  const lexeme: string = fileContent[ch];
  const token_type: string = identify(lexeme);
  const literal: string = "null";
  tokens.push([token_type, lexeme, literal]);
}

for(let token:number=0; token<tokens.length; token++) {
  const value: [string, string, string] = tokens[token];
  console.log(`${value[0]} ${value[1]} ${value[2]}`);
}

console.log("EOF  null");


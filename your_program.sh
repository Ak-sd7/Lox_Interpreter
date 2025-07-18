#!/bin/sh

set -e # Exit early if any commands fail

# Check if we have enough arguments
if [ $# -lt 2 ]; then
    echo "Usage: $0 <command> <filename>"
    echo "Commands: tokenize, parse, evaluate"
    echo "Example: $0 evaluate test1.lox"
    exit 1
fi

# Run the interpreter
exec bun run "$(dirname "$0")/app/main.ts" "$@"
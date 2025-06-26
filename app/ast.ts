import { Exp, Binary, Unary, Literal, Grouping } from "./visitor";
import type { Visitor } from "./visitor";
/*
BinaryExp {
  left: Literal { value: 5 },    // ← This is an Exp
  operator: ["PLUS", "+", "+"],
  right: Literal { value: 3 }    // ← This is also an Exp
}
(5 + 3) * 2
visitBinaryExp(*) 
  → generate("*", ...)
    → leftBinaryExp.accept(this)
      → visitBinaryExp(+)
        → generate("+", ...)
          → LiteralExp(5).accept(this) → "5.0"
          → LiteralExp(3).accept(this) → "3.0"
        → returns "(+ 5.0 3.0)"
    → rightLiteralExp.accept(this) → "2.0"
  → returns "(* (+ 5.0 3.0) 2.0)"
*/

export class Ast implements Visitor<string>{
	print(exp: Exp): string {
		return exp.accept(this);
	}

	visitBinaryExp(exp: Binary): string {
		return this.generate(exp.operator[1], exp.left, exp.right);
	}

	visitGroupingExp(exp: Grouping): string {
		return this.generate("group", exp.operator);
	}

	visitUnaryExp(exp: Unary): string {
		return this.generate(exp.operator[1], exp.right);
	}

	visitLiteralExp(exp: Literal): string {
		if(typeof exp.operand === "boolean")
			return exp.operand.toString();

		if(exp.operand === null)
			return "nil";

		if(typeof exp.operand === "number") {
			const numStr = exp.operand.toString();
      		return numStr.includes('.') ? numStr : numStr + '.0';
		}
		return exp.operand.toString();
	}

	private generate(operator: string, ...exps: Exp[]) {
		// used recusrion to print over the expressions as in AST;
		const result = [operator];

		for(const exp of exps) {
			result.push(exp.accept(this));
		}
		return `(${result.join(' ')})`;
	}
}
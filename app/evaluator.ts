import type { Exp, Literal, Binary, Grouping, Unary} from "./visitor";
import type { Visitor } from "./visitor";

export class Evaluator implements Visitor<any> {
	evaluate(exp: Exp):any {
		return exp.accept(this);
	}

	visitBinaryExp(exp: Binary): any {
		const right = this.evaluate(exp.right);
		const left = this.evaluate(exp.left);
		const operator: string = exp.operator[1];
		switch(operator) {
			case "+":
				if(typeof left === "number" && typeof right === 'number'){
					return left + right;
				}
				if(typeof left === "string" || typeof right === "string") {
					return this.convert(left) + this.convert(right);
				}
				throw new Error(`Invalid operands for '+': ${typeof left} and ${typeof right}`);

			case "-":
				this.checkType(operator, right, left);
				return left - right;

			case "*":
				this.checkType(operator, left, right);
				return left*right;
			
			case "/":
				this.checkType(operator, left, right);
				if(right === 0)
					throw new Error("Division By Zero");
					return left / right;
				
			case ">":
				this.checkType(operator, left, right);
				return left > right;
			
			case ">=":
				this.checkType(operator, left, right);
				return left >= right;
			
			case "<":
				this.checkType(operator, left, right);
				return left < right;
			
			case "<=":
				this.checkType(operator, left, right);
				return left <= right;
			
			case "==":
				return this.checkEqual(left, right);
			
			case "!=":
				return !this.checkEqual(left, right);
			
			default:
				throw new Error(`Unknown binary operator: ${operator}`);
		}
	}

	visitGroupingExp(exp: Grouping): string {
		return this.evaluate(exp.operator);
	}

	visitLiteralExp(exp: Literal): any {
		if (exp.operand === null) {
			return "nil";
		}
		return exp.operand;
	}

	visitUnaryExp(exp: Unary): any {
		const right = this.evaluate(exp.right);
		const operator: string = exp.operator[1];

		switch(operator) {
			case "!":
				return !this.isTrue(right);
			case "-":
				this.checkNumber(operator, right);
				return -right;
			default:
				throw new Error(`Unknown unary operator: ${operator}`);
		}
	}

	private checkNumber(operator: string, operand: any): void {
		if(typeof operand != "number")
			throw new Error(`Operand must be a number for '${operator}' operator`);
	}

	private isTrue(operand: any): boolean {
		if(operand === null || operand === undefined)
			return false;
		if(typeof operand === "boolean")
			return operand;
		return true;
	}

	private convert(operand: any): string {
		if (operand === null) return "nil";
		if (typeof operand === "boolean") return operand.toString();
		if (typeof operand === "number") {
			const numStr = operand.toString();
			return numStr.includes('.') ? numStr : numStr + '.0';
		}
		return operand.toString();
	}

	private checkType(operator: string, left: any, right:any): void {
		if(typeof left !== "number" || typeof right !== "number")
			throw new Error(`Operands must be numbers for '${operator}' operator`);
	}

	private checkEqual(left: any, right: any): boolean {
		if(left === null && right === null)
			return true;
		if(left === null || right === null)
			return false;
		return left === right;
	}
}
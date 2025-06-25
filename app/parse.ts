import type { Token } from "./types";
import type { Visitor } from "./visitor";
import { Binary, Unary, Grouping, Exp, Literal} from "./visitor";

export class Parser {
	private tokens: Token[];
	private current: number = 0;

	constructor(tokens:Token[]) {
		this.tokens = tokens;
	}

	parse(): Exp | null {
		try {
			return this.expression();
		} catch (error) {
			return null;
		}
	}

	private expression(): Exp {
		return this.equality();
	}

	private equality(): Exp {
		let expr = this.comparison();

		while(this.match("BANG_EQUAL", "EQUAL_EQUAL")) {
			const operator = this.previous();
			const right = this.comparison();
			expr = new Binary(expr, operator, right);
		}
		return expr;
	}

	private comparison(): Exp {
		let expr = this.term();
		while(this.match("LESS", "GREATER", "GREATER_EQUAL", "LESS_EQUAL")) {
			const operator = this.previous();
			const right = this.term();
			expr = new Binary(expr, operator, right);
		}
		return expr;
	}

	private term(): Exp {
		let expr = this.factor();
		while(this.match("MINUS", "PLUS")) {
			const operator = this.previous();
			const right = this.factor();
			expr = new Binary(expr, operator, right);
		}
		return expr;
	}

	private factor(): Exp {
		let expr = this.unary();
		while(this.match("SLASH", "STAR")) {
			const operator = this.previous();
			const right = this.unary();
			expr = new Binary(expr, operator, right);
		}
		return expr;
	}

	private unary(): Exp {
		if(this.match("BANG", "MINUS")) {
			const operator = this.previous();
			const right = this.unary();
			return new Unary(operator, right);
		}
		return this.primary();
	}

	private primary(): Exp {
		if(this.match("FALSE"))
			return new Literal(false);

		if(this.match("TRUE"))
			return new Literal(true);

		if(this.match("NIL"))
			return new Literal(null);

		if(this.match("NUMBER"))
				return new Literal(parseFloat(this.previous()[2]));

		if(this.match("STRING"))
			return new Literal(this.previous()[2]);

		if(this.match("LEFT_PAREN")) {
			const exp = this.expression();
			this.consume("RIGHT_PAREN", "error");
			return new Grouping(exp);
		}
		throw new Error("error");
	}

	private match(...types: string[]): boolean {
		for(const type of types) {
			if(this.check(type)) {
				this.advance();
				return true;
			}
		}
		return false;
	}

	private check(type: string): boolean {
		if(this.isEnd())
			return false;
		return type === this.peek()[0];
	}

	private advance(): Token {
		if(!this.isEnd())
			this.current++;
		return this.previous();
	}

	private previous(): Token {
		return this.tokens[this.current-1];
	}

	private isEnd(): boolean {
		return this.peek()[0] === "EOF";
	}

	private peek(): Token {
		return this.tokens[this.current];
	}

	private consume(type: string, err: string) {
		if(this.check(type))
			return this.advance();
		throw new Error(err);
	}
}
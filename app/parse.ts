import type { Token } from "./types";
import type { Visitor } from "./visitor";
import { Binary, Unary, Grouping, Exp, Literal} from "./visitor";

export class Parser {
	private tokens: Token[];
	private current: Number = 0;
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
		let expr = this.comparision();

		while(this.match("BANG_EQUAL", "EQUAL_EQUAL")) {
			const operator = 
		}
	}

	private comparision(): Exp {
		let expr = this.term();
	}

	private term(): Exp {
		let expr = this.factor();
	}

	private factor(): Exp {
		let expr = this.unary();
	}

	private unary(): Exp {
		let expr = this.primary();
	}

	private primary(): Exp {
		
	}
}
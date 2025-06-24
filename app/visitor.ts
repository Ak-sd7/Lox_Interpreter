import type { Token } from "./types";

export abstract class Exp {
  abstract accept<T>(visitor: Visitor<T>): T;
}

export class Binary extends Exp {
  constructor(public left: Exp, public operator: Token, public right: Exp) {
    super();
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitBinaryExp(this);
  }
}

export class Unary extends Exp {
  constructor(public operator: Token, public right: Exp) {
    super();
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitUnaryExp(this);
  }
}

export class Grouping extends Exp {
  constructor(public operator: Exp) {
    super();
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitGroupingExp(this);
  }
}

export class Literal extends Exp {
  constructor(public operand: any) {
    super();
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitLiteralExp(this);
  }
}

export interface Visitor<T> {
  visitBinaryExp(exp: Binary): T;
  visitUnaryExp(exp: Unary): T;
  visitGroupingExp(exp: Grouping): T;
  visitLiteralExp(exp: Literal): T;
}


export class Expression{
    constructor(){
        this.Op;
        this.LeftOperand;
        this.RightOperand;
        this.top;
        this.bot;
        this.prev;
        this.next;
        this.hasIf;
    }
};

export class Axiom{
    constructor(){
        this.id;
        this.left = [];
        this.right = [];
    }
};
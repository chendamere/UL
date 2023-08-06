
export class Expression{
    constructor(){
        this.Op;
        this.top;
        this.bot;
        this.prev;
        this.next;
        this.hasIf;
        this.ret;
        this.parameters = [];
    }
};

export class Axiom{
    constructor(){
        this.id;
        this.left = [];
        this.right = [];
    }
};
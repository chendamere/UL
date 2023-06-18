
import {Axiom, Expression} from "./UL_dataType.js"

function isChar(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}

export class UL_kernel {

    constructor(parsedRules){
        this.var_table;
        this.name_table;
        this.StringTable = parsedRules;
        this.axiomTable;
        
        this.init();
    }
    init() {
        console.log("Universal Language ")
        this.parse_all_axiom_from_table(false)
        this.communtative_induction(this.axiomTable[this.axiomTable.length-1])
        this.transitive_induction(this.axiomTable[this.axiomTable.length-1], this.axiomTable[this.axiomTable.length-2])
        this.substitution_induction(this.axiomTable[this.axiomTable.length-2],this.axiomTable[this.axiomTable.length-1], 1)
    } 
    
    print_all_axiom() {
        let i = 0;
        for(; i < this.axiomTable.length; i++) {
            console.log(this.axiomTable[i]);        
        }
    }

    communtative_induction(r, debug){
        const newRule = new Axiom()
        newRule.left = r.right
        newRule.right = r.left
    
        this.axiomTable.push(newRule)
        if(debug){
            console.log(newRule, r)
        }
    }

    transitive_induction(r1, r2, debug){
        if(!this.Ruletext_equal(r1.right, r2.left, true)) {
            if(debug) {
                cout << "Tran_induction: r1.right and r2.left does not match" << endl;
            }
            return;
        }

        const newRule = new Axiom()
        newRule.left = r1.left;
        newRule.right = r2.right;
        this.axiomTable.push(newRule)
        if(debug){
            console.log(newRule, r1,r2)
        }
    }

    substitution_induction(r1, r2, offset, debug){
        //r2 must be generated through reflexivity 
        //which can be done with commutative induction follow by transitive induction to generate left right equivalent rule

        console.log(r2.right, r2.left)
        if(!this.Ruletext_equal(r2.right, r2.left)){
            console.log("r2 is not left-right equivalent")
            return
        }
        let L_leftSlice = r2.left.slice(0,offset)
        let L_insertSlice = r1.left
        let L_rightSlice = r2.left.slice(offset, r1.left.length)
        let newLeft = [].concat(L_leftSlice,L_insertSlice,L_rightSlice)
        
        let R_leftSlice = r2.right.slice(0,offset)
        let R_insertSlice = r1.right
        let R_rightSlice  = r2.right.slice(offset, r2.right.length)

        let newRight = [].concat(R_leftSlice,R_insertSlice,R_rightSlice)

        var newRule = new Axiom()
        newRule.left = newLeft
        newRule.right = newRight
        this.axiomTable.push(newRule)
    }
    
    Ruletext_equal(rt1, rt2, debug){
        //has to check entired rule text because need to consider naming conflict of entire rule text
        let e1_var_sequence = []
        let e2_var_sequence = []

        let NameTable1 = {}
        let NameTable2 = {}

        if(debug){
            console.log("begin checking expression")
        }

        for(let i = 0; i < rt1.length; i++) {
            if(rt1[i] == undefined || rt1[i] === null) continue;
            else if(rt1[i].Op !== rt2[i].Op) {
                console.log(rt1[i].Op, " is different from ", rt2[i].Op)
                return false
            }
        }

        if(debug) console.log("Operators are the same")

        //left expression variables
        let varCount = 0
        for(let i = 0; i < rt1.length; i ++) {
            if(rt1[i].Op === undefined) continue;
            var exp = rt1[i]
            var left = exp.LeftOperand
            var right = exp.RightOperand

            if(NameTable1[left] === undefined) {
                varCount ++;
                NameTable1[left] = varCount;
            } 
            e1_var_sequence.push(NameTable1[left]);
    
            if(NameTable1[right] === undefined) {
                varCount ++;
                NameTable1[right] = varCount;
            }
            e1_var_sequence.push(NameTable1[right]);
        }

        //right expression variables
        varCount = 0
        for(let i = 0; i < rt2.length; i ++) {
            if(rt2[i].Op === undefined) continue;
            var exp = rt2[i]
            var left = exp.LeftOperand
            var right = exp.RightOperand

            if(NameTable2[left] === undefined) {
                varCount ++;
                NameTable2[left] = varCount;
            } 
            e2_var_sequence.push(NameTable2[left]);
    
            if(NameTable2[right] === undefined) {
                varCount ++;
                NameTable2[right] = varCount;
            }
            e2_var_sequence.push(NameTable2[right]);
        }
        if(debug) {
            console.log("Comparing variable sequence: ")
        }
        for(let i = 0; i < e1_var_sequence.length; i++) {
            if(debug) {
                console.log(e1_var_sequence[i], e2_var_sequence[i]);
            }
            if(e1_var_sequence[i] != e2_var_sequence[i]) {
                console.log("FAIL! Expressions are not equivalent")
                return false;
            }
            if((e1_var_sequence[i] == e2_var_sequence[i]) && (e1_var_sequence[i] == 0))
            {
                if (debug) {
                    console.log("PASS! Expressions are equivalent")
                }
                return true;
            } 
        }
        return true;
    }

    parse_all_axiom_from_table(debug) {

        const axiomTable = [];

        console.log("Begin parsing axioms from file: ")
        for(let i = 0; i < this.StringTable.length; i++){
            
            var line = this.StringTable[i]
            if(line === ''){continue}
            
            //if line does not have contain \[\] skip it
            if(!line.includes('\[') && !line.includes('\]')){
                continue
            }
            
            //ignore \[ \]
            line = line.replace('\\[','').replace('\\]','')

            const newAxiom = new Axiom()
            const [leftExps, rightExps] = line.split("\\Rq");
            var PleftExps = leftExps.split(',')
            var PrightExps = rightExps.split(',')

            let RightLast = PrightExps.length - 1
            let Leftlast = PleftExps.length - 1

            //remove meta character '\r'
            PrightExps[RightLast] = PrightExps[RightLast].replace('\r','')
            //remove whie space at ends and beginning
            PleftExps[0] = PleftExps[Leftlast].replace(' ','')
            PleftExps[Leftlast] = PleftExps[Leftlast].replace(' ','')
            PrightExps[0] = PrightExps[0].replace(' ','')
            PrightExps[RightLast] = PrightExps[RightLast].replace(' ','')

            var leftExprs = true;

            for(const ExprString of [PleftExps,PrightExps]){

                var curExpr = new Expression();
                var top = false
                var bot = false
                var mid = false
                var add = true
                var eqTable = [] // store all eq as return expression
                for(let j = 0; j < ExprString.length; j ++) {
                    if(eqTable.length === 0) {
                        add = true;
                    }
                    const expr = ExprString[j];
    
                    var left = true;
                    if(expr === '') {
                        continue;
                    }
                    
                    if(expr === '}{'){
                        bot = true;
                        continue;
                    }

                    if(expr === '}'){
                        bot = false;
                        curExpr = eqTable.pop();
                        continue;
                    }
                    const newExpr = new Expression();
                    
                    let n = 0
                    console.log(expr)
                    while(n < expr.length) {
                        var c = expr[n];

                        if(c === ' '){
                            n++
                            continue;
                        }

                        //need to be able to prse variables with subscripts 
                        //detect underscore ex : i_{20}
                        if(isChar(c)) {
                            var operand = "";
                            while(c !== ' ' && c !== '}'  && c !== '{' && c !== '\\' && c !== undefined){
                                console.log(c)
                                operand += c
                                c = expr[++n]
                            }
    
                            if(left){
                                newExpr.LeftOperand = operand;
                                left = false;
                            }
                            else{
                                newExpr.RightOperand = operand;
                                left = true;
                            }
                            console.log(operand)
                        }
                        
                        //detect operator
                        if(c === '\\') {
                            var op = ""
                            while(c !== undefined && c !== ' ' && c !== '{'){
                                op += c
                                c = expr[++n]
                            }
                            if(op === "\\eq"){
                                var left = true;
                                
                                while(c != '}'){
                                    c = expr[++n]
                                    if(isChar(c) && left){
                                        newExpr.LeftOperand = c
                                        left = false
                                    }else if(isChar(c) && !left) {
                                        newExpr.RightOperand = c
                                    }
                                    if(c === "\\"){
                                        while(c !== undefined && c !== ' ' && c !== '}'){
                                            op += c
                                            c = expr[++n]
                                        }
                                        //console.log(op)
                                        newExpr.Op = op;
                                    }
                                }

                                //signal for next expression to be top
                                eqTable.push(newExpr)
                                mid = true;
                                break;
                            }
                            newExpr.Op = op;
                            left = false;
                            
                        }
                        n++;
                    }
                    if(debug){
                        console.log(newExpr)
                    }
                    
                    if(leftExprs && !bot && !top && add ) {
                        newAxiom.left.push(newExpr)
                    }
                    else if(!bot && !top && add){
                        newAxiom.right.push(newExpr)
                    }

                    //head expression will point to first expression, head does not have prev, head.prev ===undefined
                    //last expression.next === undefined
                    
                    newExpr.prev = curExpr
                    if(!bot && !top){
                        curExpr.next = newExpr
                    }
                    else if(top) {
                        if(mid){
                            eqTable[eqTable.length-2].top = newExpr

                        }else {
                            eqTable[eqTable.length-1].top = newExpr
                        }
                        top = false
                    }
                    else if(bot) {
                        newExpr.prev = eqTable[eqTable.length-1]
                        eqTable[eqTable.length-1].bot = newExpr
                        bot = false
                    }
                    curExpr = newExpr;
                    //console.log(eqTable);

                    if(mid){
                        add = false;
                        top = true;
                        mid = false;
                    }
                }
                leftExprs = false;

            }
            if(debug) {
                console.log(newAxiom)
            }

            axiomTable.push(newAxiom)
        }
        //finished parsing
        this.axiomTable = axiomTable;
        if(debug) {
            console.log(this.axiomTable)
        }
    }   
}

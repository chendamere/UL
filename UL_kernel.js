
import {Axiom, Expression} from "./UL_dataType.js"

function isChar(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}

export class UL_kernel {

    constructor(){
        this.StringTable=[];
        this.proofString = [];
        this.proofTable;
        this.axiomTable;
        this.functionTable;
        this.intermediate_theorems=[]
        //this.init() 
    }
    init() {
        console.log("Universal Language ")
        //this.parse_all_axiom_from_table(false)
        //console.log(this.proof)
        //console.log(this.proofString)
        this.parse_all_proof_from_table(false)
        // this.communtative_induction(this.axiomTable[this.axiomTable.length-1], false)
        // this.transitive_induction(this.axiomTable[this.axiomTable.length-1], this.axiomTable[this.axiomTable.length-2], false)
        // this.substitution_induction(this.axiomTable[this.axiomTable.length-2],this.axiomTable[this.axiomTable.length-1], 1, false)
    } 

    generate_intermediate_rules(RuleTexts){

        //require database to have all necessary axioms
        // format: from premises ==> conclusion: output all intermediate rules

        console.log("generating intermediate rules")
        let allNewRules = []

        let i = 0
        var done = false
        while(i < RuleTexts.length) {
            var newRule = new Axiom();
            
            const curRuletext = RuleTexts[i]
            var targetRuleText = RuleTexts[i+1]
            // try all strategies to see if if same_expression return true

            for(const rule of this.axiomTable) {

                if(this.Ruletext_equal(rule.left, curRuletext, false)) {
                    if(this.Ruletext_equal(rule.right, targetRuleText, false)){
                        allNewRules.push(rule.right)
                        break;
                    }
                    for(const rule2 of this.axiomTable) {
                        if(this.Ruletext_equal(rule.left , rule2.right, false)){
                            newRule = this.transitive_induction(rule, rule2)
                            if(this.Ruletext_equal(newRule.right, targetRuleText)){
                                allNewRules.push(rule.right)
                                break; 
                            }
                        }
                        let maxOffsetLeft = rule2.left.length - 1
                        let left = rule2.left
                        let selfRule1 = new Axiom()
                        selfRule1.left = left
                        selfRule1.right = left

                        let maxOffsetRight = rule2.right.length - 1
                        let right = rule2.right
                        let selfRule2 = new Axiom()
                        selfRule2.left = right
                        selfRule2.right = right

                        for(let i = 0; i < maxOffsetLeft; i++) {
                            newRule = this.substitution_induction(rule, selfRule1, false)
                            if(this.Ruletext_equal(newRule.right, targetRuleText)){
                                allNewRules.push(rule.right)
                                done = true;
                                break; 
                            }
                        }
                        if(done){
                            done = false 
                            break;
                        }
                        for(let i = 0; i < maxOffsetRight; i++) {
                            newRule = this.substitution_induction(rule, selfRule2, false)
                            if(this.Ruletext_equal(newRule.right, targetRuleText)){
                                allNewRules.push(rule.right)
                                break; 
                            }
                        }
                    }
                }
            }
            i++
        }
        console.log(allNewRules)
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
        return newRule
    }

    transitive_induction(r1, r2, debug){
        if(!this.Ruletext_equal(r1.right, r2.left, false)) {
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
        return newRule

    }

    substitution_induction(r1, r2, offset, debug){
        //r2 must be generated through reflexivity 
        //which can be done with commutative induction follow by transitive induction to generate left right equivalent rule

        if(debug){
            console.log(r2.right, r2.left)
        }

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
        return newRule

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
            if(rt1[i] === undefined || rt1[i] === null) continue;
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

    parse_all_proof_from_table(debug) {
        const exprTable = [];

        console.log("Begin parsing axioms from file ")
        for(let i = 0; i < this.proofString.length; i++){
            
            var line = this.proofString[i]
            if(line === ''){continue}
            
            //ignore \[ \]

            line = line.replace('\\Rq','').replace('proof:','')
            var PExps = line.split(',')
            PExps[PExps.length - 1] = PExps[PExps.length - 1].replace('\r','')
            //console.log(PExps)
            for(let i = 0; i < PExps.length-1;i++) {
                let expression = PExps[i]
                
                if(expression === '') continue

                if(expression[0] === ' '){
                    expression = expression.slice(1,expression.length)
                }
                if(expression[expression.length-1] === ' '){
                    expression = expression.slice(0,expression.length-1)
                }

                if(expression.includes('\\eq') || expression.includes('\\Brs')){
                    //remove } at the end
                    expression = expression.slice(0,expression.length-1)
                }

                PExps[i] = expression
            }
            // console.log(PExps)
            var exprs = this.parse_expressions(PExps, false)
            //console.log(exprs)
            exprTable.push(exprs)

        }
        // finished parsing
        this.proofTable = exprTable;

        if(debug) {
            console.log(this.proofTable)
        }
    }   
    
    parse_all_axiom_from_table(debug) {

        const axiomTable = [];
        console.log("Begin parsing axioms from file ")
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
            PleftExps[0] = PleftExps[0].replace(' ','')
            PleftExps[Leftlast] = PleftExps[Leftlast].replace(' ','')
            PrightExps[0] = PrightExps[0].replace(' ','')
            PrightExps[RightLast] = PrightExps[RightLast].replace(' ','')

            newAxiom.right = this.parse_expressions(PrightExps, false)
            newAxiom.left = this.parse_expressions(PleftExps, false)
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

    parse_expressions(ExprString, debug) {

        //make sure to include comma at beginning and end of expression !!!

        //console.log(ExprString)
        var exprs = []
        var curExpr = new Expression();
        var top = false
        var bot = false
        var mid = false
        var add = true
        var eqTable = [] // store all eq as return expression
        console.log(ExprString)
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
                //console.log("reset")
                curExpr = eqTable.pop();
                continue;
            }
            const newExpr = new Expression();
            
            let n = 0
            while(n < expr.length) {
                var c = expr[n];
                if(c === ' '){
                    n++
                    continue;
                }
                if(isChar(c)) {
                    var operand = "";
                    while(c !== ' ' && c !== '}'  && c !== '{' && c !== '\\' && c !== undefined){
                        //console.log(c)
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
                    //console.log(operand)
                }
                
                //detect operator
                if(c === '\\') {
                    var op = ""
                    while(c !== undefined && c !== ' ' && c !== '{'){
                        op += c
                        c = expr[++n]
                    }

                    //need to detect variations of \eq || op === "\\Blb" || op === "\\Bb" || op === "\\Bls"
                    // \\Brs{}{}
                    if(op === "\\eq" ){
                        left = true;
                        
                        while(c != '}'){
                            c = expr[n++]
                            if(isChar(c) && left){
                                newExpr.LeftOperand = c
                                left = false
                            }else if(isChar(c) && !left) {
                                newExpr.RightOperand = c
                            }
                            if(c === "\\" || c === '}'){
                                while(c !== undefined && c !== ' ' && c !== '}'){
                                    op += c
                                    c = expr[n++]
                                }
                                //console.log(op)
                                newExpr.Op = op;
                            }
                        }
                        //signal for next expression to be top
                        eqTable.push(newExpr)
                        mid = true;
                        break;
                    }else if(op === '\\Brs'){
                        newExpr.Op = op;
                        eqTable.push(newExpr)
                        mid = true;
                        break;
                    }
                    newExpr.Op = op;
                    left = false;
                    
                }
                n++;
            }
            
            if(!bot && !top && add ) {
                console.log("added")
                exprs.push(newExpr)
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

            if(mid){
                add = false;
                top = true;
                mid = false;
            }
        }
        return exprs;
    } 

    Check_Brs(r1,r2){
        for(let i = 0; i < r1.length - 1; i ++) {
            //if Brs then find last eq and check prev from the last top and bot expression
            let expr1 = r1[i]
            if(expr1.Op === '\\Brs'){
                for(let j = r2.length -1; j > 0; j--){
                    let expr2 = r2[j]
                    if(expr2.Op.includes('\\eq')){
                        
                        let BrTop = expr1.top
                        while(BrTop.next !== undefined) BrTop = BrTop.next
                        let BrBot = expr1.bot
                        while(BrBot.next !== undefined) BrBot = BrBot.next

                        let eqTop = expr2.top
                        while(eqTop.next !== undefined) eqTop = eqTop.next
                        let eqBot = expr2.bot
                        while(eqBot.next !== undefined) eqBot = eqBot.next
                        
                        let BrExprsTop = []
                        let eqExprsTop = []
                        while(BrTop !== undefined && eqTop !== undefined){
                            BrExprsTop.push(BrTop)
                            eqExprsTop.push(eqTop)
                            BrTop = BrTop.prev
                            eqTop = eqTop.prev
                            if(!this.Ruletext_equal(BrExprsTop,eqExprsTop)) {
                                return false
                            }
                        }

                        let BrExprsBot = []
                        let eqExprsBot = []
                        while(BrBot !== undefined && eqBot !== undefined){
                            BrExprsBot.push(BrBot)
                            eqExprsBot.push(eqBot)
                            BrBot = BrBot.prev
                            eqBot = eqBot.prev
                            if(!this.Ruletext_equal(BrExprsBot,eqExprsBot)) {
                                return false
                            }
                        }
                        
                    }

                
                }
                //no eq
                return false;
            }

        }
        //finished checking all expr in r1
        return true
    }

    rule_applicable(r1, r2){
        //split between Brs and eq
        if(!this.Check_Brs(r1,r2)) return false
        else if(!this.Check_Brs(r2.r1)) return false
        return true
    }

    add_check_code_var(table, c, exprs){
        //exprs is array of array
        //if code var not assigned, then true
        if(table[c] === undefined){
            table[c] = exprs
            return table
        }
    }

    check_code_vars(table, c, exprs){
        //if c is not a code var, then false
        if(c.Op !== '\\Tc') return false

        //if exprs does not contain code variable and is expression
        if(exprs.length > 1){
            if(!this.Ruletext_equals(table[c], exprs) ){
                return false
            }else{
                return true
            }
        }
        else{
            //if exprs is also code variable, make sure it can eventually return to c or undeined
            let tempTable = {}
            let temp = c
            while(temp.Op === '\\Tc'){
                if(tempTable[temp.right] || table[temp.right] === undefined){
                    return true
                }
                tempTable[temp.right] = true
                temp = table[temp.right]
            }

            if(temp !== c) { 
                console.log("something weird happend")
                return false
            }
        }
    }
}

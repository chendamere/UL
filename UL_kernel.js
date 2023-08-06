
import {Axiom, Expression} from "./UL_dataType.js"


//NOTES for parsing from latex file:
// in the title: no need of \ for : _
// also the subsection titles will not parse for &
// need to parse for proof format and \begin{math}
// also fix R(i), R(j) so R() should be function and the operand is in between ()
// and Rd():r
// and Rc(i;j)
// also comments that starts with % needs to be parsed
// comma incorrectly displayed when there are more than 2 braches
// parse induction  (==>)
// one rule taking up multiple lines 

function isChar(str) {
    // console.log(str)
    return str.length === 1 && str.match(/[a-z]/i);
}

export class UL_kernel {

    constructor(){
        this.title = ""
        this.subsectionsIndex=[];
        this.subsubsectionsIndex=[];
        this.StringTable = [];
        this.proofString = [];
        this.proofTable = [];
        this.axiomTable = [];
        this.functionTable;
        this.intermediate_theorems=[]
        this.numberOfLines;
        this.FunctionNames = [
            "R(",
            "R_(" ,
            "Rd(" ,
            "Rc(" ,
            "&Tm(",
            "&Fam(",
            "Del(",
            "Ins(",
            "Cpo(",
            "Rcpo(",
            "IsCpo(",
            "&Tm(",
            "Rcpm(",
            "IsCpm(",
            "+",
            "times",
        ]
    }
    init() {
        // console.log(this.axiomTable)
        console.log("Universal Language ")
        //this.parse_all_axiom_from_table(false)

        this.parse_all_axiom_from_table(false)
        //console.log(this.axiomTable)
        // this.communtative_induction(this.axiomTable[this.axiomTable.length-1], false)
        // this.transitive_induction(this.axiomTable[this.axiomTable.length-1], this.axiomTable[this.axiomTable.length-2], false)
        // console.log(this.Ruletext_equal(this.axiomTable[this.axiomTable.length-1], this.axiomTable[this.axiomTable.length-2]))
        // console.log(this.axiomTable[0].left, this.axiomTable[0].right)
        // console.log(this.rule_applicable(this.axiomTable[0].left, this.axiomTable[0].right))            

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
            var left = exp.parameters[0]
            var right = exp.parameters[1]
            var third = exp.parameters[2]

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
            var left = exp.parameters[0]
            var right = exp.parameters[1]
            var third = exp.parameters[2]

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

    include_left_split(expression){
        if(expression.includes('\\eq') || expression.includes('\\Bls') || expression.includes('\\Blb') || expression.includes('\\Bb') || expression.includes('\\Bs')){
            return true
        }
        else return false
    }

    include_right_split(expression){
        if(expression.includes('\\Brs') || expression.includes('\\Brb') || expression.includes('\\Bb') || expression.includes('\\Bs')){
            return true
        }
        else return false
    }

    includeFn(expr){
        for(const name of this.FunctionNames){
            if(expr.includes(name)) return true
        }
        return false
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
                if(expression[expression.length] === ' '){
                    console.log(expression)
                    expression = expression.slice(0,expression.length)
                }
                if(this.include_left_split(expression)|| this.include_right_split(expression)){
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
            
            //remove trailing white space
            for(let i = 0; i < line.length -1; i ++) {
                if( line[i] === ']') {
                    line = line.slice(0, i+1)
                    break
                }
            }

            //ignore \[ \]
            line = line.replace('\\[','').replace('\\]','')

            const newAxiom = new Axiom()
            const [leftExps, rightExps] = line.split("\\Rq");
            var PleftExps = leftExps.split(',')
            // console.log(leftExps, rightExps)
            if(rightExps !== undefined){
                var PrightExps = rightExps.split(',')

            }

            //remove meta character '\r'
            PrightExps[PrightExps.length-1] = PrightExps[PrightExps.length-1].replace('\r','')
            PleftExps[PleftExps.length-1] = PleftExps[PleftExps.length-1].replace('\r','')

            //remove whie space at ends and beginning
            for(const exps of [PleftExps,PrightExps]){
                for(let i = 0; i < exps.length;i++) {
                    let expression = exps[i]       
                           
                    if(expression === '') continue
    
                    
                    let j = 0; 
                    while(j<expression.length){
                        if(expression[0] === ' '){
                            expression = expression.slice(1,expression.length)
                            // console.log(expression)
                            j++
                        }      
                        else break              
                    }
             
                    j = expression.length
                    while(j > 0){
                        if(expression[expression.length-1] === ' '){
                            expression = expression.slice(0,expression.length-1)
                            j--
                        }
                        else break
                    }
                   
                    if(this.include_left_split(expression)|| this.include_right_split(expression)){
                        //remove } at the end
                        expression = expression.slice(0,expression.length-1)
                    }
                    exps[i] = expression
                }
            }
           
            newAxiom.left = this.parse_expressions(PleftExps, true)
            newAxiom.right = this.parse_expressions(PrightExps, false)
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
        // console.log(ExprString)

        //make sure to include comma at beginning and end of expression !!!

        var exprs = []
        var curExpr = new Expression();
        var top = false
        var bot = false
        var newBranch = false
        var add = true
        var eqTable = [] // store all eq as return expression
        for(let j = 0; j < ExprString.length; j ++) {
            if(eqTable.length === 0) {
                add = true;
            }
            const expr = ExprString[j];

            if(expr === '') {
                continue;
            }
            
            //setting indicator for branch function parsing
            if(expr.includes('}{')){
                top = false;
                bot = true;
                continue;
            }

            if(expr === '}'){
                top = false
                bot = false;
                newBranch = false;
                let temp = curExpr

                curExpr = eqTable.pop();

                if(curExpr !== temp && (this.include_left_split(temp.Op) || this.include_right_split(temp.Op))){
                    if(curExpr.bot === undefined){
                        curExpr.bot = temp
                    }
                    else{
                        let botExp = curExpr.bot;
                        while(botExp.next !== undefined){
                            botExp = botExp.next
                        }
                        botExp = temp
                    }
                    
                }
                continue;
            }
            const newExpr = new Expression();
            
            //Functions parsing
            let n = 0
            var c = expr[n];
            if(this.includeFn(expr) && !(expr.includes("+") || expr.includes("\\times")) ){
                
                var temp = c
                while(c !== "("){
                    c = expr[++n]
                    temp += c
                }
                newExpr.Op = temp + ")"
                //parsing parameters of function expressions
                var operand = "";
                let pOffset = 0
                n++
                while(n<expr.length){
                    c = expr[n]
                    if(c === ' '){
                        n++
                        continue;
                    }
                    if(c === ";" || c === ")"){
                        newExpr.parameters.push(operand)
                        operand = ""
                        pOffset += 1
                    }else{
                        operand += c
                        c = expr[n]
                    }
                    n++
                }
            }
            else{
                //normal expressions parsing
                while(n < expr.length) {

                    c = expr[n];
                    if(c === ' '){
                        n++
                        continue;
                    }

                    if(isChar(c) || c === '\\'){
    
                        var operand = "";
                        operand = expr[n] + expr[n+1] + expr[n+2]
    
                        //special flag object
                        if(operand === '\\In' || operand === "\\Ip" || operand === "\\It"){
                            // console.log(operand)
                        }else{
                            operand = ""
    
                            if(isChar(c)) {
                                while(c !== ' ' && c !== '}' && c !== undefined && c !== '\\' && c !== ";" && c !== ")" && c !== "+" && c !== ":"){
                                    operand += c
                                    c = expr[++n]
                                }
                            }                        
                        }

                        if(operand.length !== 0) newExpr.parameters.push(operand)
                    }
                    if(c === ':'){
                        c = expr[++n]
                        newExpr.ret = c
                        n++
                    }


                    
                    //if first detected character is \\ , then its operator
                    if(c === '+'){
                        newExpr.Op = "+"
                    }
                    if(c === '\\') {
                        var op = ""
                        while(c !== undefined && c !== ' ' && c !== '{'){
                            op += c
                            c = expr[++n]
                        }
                        
                        //see function to see what is going on
                        if(this.include_left_split(op)){
                            
                            while(c !== '}'){
                                c = expr[n++]
    
                                //parsing operand and operator in the branch function
                                if(isChar(c)){
                                    let operand = "";
                                    while(c !== '}'  && c !== '{' && c !== '\\' && c !== ')' && c !== undefined){
                                        if(operand === 'if('){
                                            operand = ""
                                            newExpr.hasIf = true
                                        }
                                        if(c!== " ") operand += c
    
                                        c = expr[n++]
                                    }
                                    if(operand.length !== 0) newExpr.parameters.push(operand)
                                }

                                if(c === "\\" || c === '}'){
                                    while(c !== undefined && c !== ' ' && c !== '}' && c !==')'){
                                        op += c
                                        c = expr[n++]
                                    }
                                    
                                    newExpr.Op = op;
                                }
                            }
                            //signal for next expression to be top
    
                            eqTable.push(newExpr)
                            newBranch = true;
                            break;
                        }else if(this.include_right_split(op)){
                            newExpr.Op = op;
                            eqTable.push(newExpr)
                            newBranch = true;
                            break;
                        }
                        newExpr.Op = op;
                        
                        //make code variable and rule text variable parameter strating on the second one 
                        if(op === '\\Tc' || op === '\\Tt'){
                            newExpr.parameters.push(newExpr[0])
                            newExpr[0] === ""
                        }
                    }
                    n++;
                }
            }           
            
            if(!bot && !top && add ) {
                exprs.push(newExpr)
            }

            //head expression will point to first expression, head does not have prev, head.prev ===undefined
            //last expression.next === undefined
            newExpr.prev = curExpr
            if(!bot && !top){
                curExpr.next = newExpr
            }
            else if(top) {
                if(newBranch){
                    //if its a newly added branch exp
                    eqTable[eqTable.length-2].top = newExpr

                }else {
                    eqTable[eqTable.length-1].top = newExpr
                }
                top = false
            }
            else if(bot) {
                if(newExpr.parameters.length=== 0 && newExpr.Op === undefined)
                {
                    //ignore empty expression at the end, happens when branch parsing returns to root branch
                }
                else{
                    newExpr.prev = eqTable[eqTable.length-1]
                    eqTable[eqTable.length-1].bot = newExpr
                }
                bot = false
            }
            curExpr = newExpr;

            if(newBranch){
                add = false;
                top = true;
                newBranch = false;
            }
        }
        
        return exprs;
    } 

    Check_Brs(r1,r2){
        for(let i = 0; i < r1.length - 1; i ++) {
            //if Brs then find last eq and check prev from the last top and bot expression
            let expr1 = r1[i]
            if(this.include_right_split(expr1.Op)){
                //find last eq or brs in r2
                for(let j = r2.length -1; j > 0; j--){
                    let expr2 = r2[j]
                    if(this.include_left_split(expr2.Op)|| this.include_right_split(expr2.Op)){
                        
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
                        return true   
                    }
                }
                //no eq
                return false;
            }

        }
        //no brs found
        return true
    }

    rule_applicable(r1, r2){
        //split between Brs and eq
        if(!this.Check_Brs(r1,r2)) return false
        else if(!this.Check_Brs(r2,r1)) return false
        return true
    }

    add_code_var(table, c, exprs){
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
            //if exprs is also code variable, make sure it eventually return to c or undefined
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

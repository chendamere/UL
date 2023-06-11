
import {Axiom, Expression} from "./UL_dataType.js"
const SIZE = 50;
function isChar(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}
export class UL_kernel {

    constructor(canvas, parsedRules){
        // global camera variables
        this.canvas = canvas;
        this.canvas.width = 700;
        this.canvas.height = 1280;
        this.canvas.style.width = "700px";
        this.canvas.style.height = "1280px";

        this.var_table;
        this.name_table;
        this.StringTable = parsedRules;
        this.axiomTable;
        
        // global drawing variables
        //global position data variable 
        this.init();
        this.display();
    }
    init() {
        console.log("Universal Language ")
        
        this.parse_all_axiom_from_table(false)
        this.print_all_axiom()
    } 
    
    print_all_axiom() {
        let i = 0;
        for(; i < this.axiomTable.length; i++) {
            console.log(this.axiomTable[i]);        
        }
    }
    
    parse_all_axiom_from_table(debug) {

        const axiomTable = [];

        console.log("Begin parsing axioms from file: ")
        for(let i = 0; i < this.StringTable.length; i++){
            if(this.StringTable[i] === ''){continue;}

            const newAxiom = new Axiom()
            const [leftExps, rightExps] = this.StringTable[i].split("<=>");
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
                    
                    // if(debug){
                    //     console.log(expr)
                    // }
    
                    var left = true;
                    if(expr === '') {
                        continue;
                    }
                    
                    if(expr === '}{'){
                        bot = true;
                        continue;
                        //console.log("skip")
                    }

                    if(expr === '}'){
                        bot = false;
                        curExpr = eqTable.pop();
                        continue;
                    }
                    const newExpr = new Expression();
                    
                    let n = 0
                    while(n < expr.length) {
                        var c = expr[n];

                        if(c === ' '){
                            n++;
                            continue;
                        }

                        if(left && isChar(c)){
                            newExpr.LeftOperand = c;
                            left = false;
                        }
                        else if(isChar(c)) {
                            newExpr.RightOperand = c;
                            left = true;
                        }
                        
                        //detect operator
                        if(c === '\\') {
                            var op = ""
                            op+=c
                            c = expr[++n]
                            op+=c
                            c = expr[++n]
                            op+=c
                            
                            if(op === "\\eq"){
                                while(c != '}'){
                                    c = expr[++n]
                                    op+=c
                                }
                                eqTable.push(newExpr)
                                newExpr.Op = op;
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
            // if(debug) {
            //     console.log(newAxiom)
            // }

            axiomTable.push(newAxiom)
        }
        //finished parsing
        this.axiomTable = axiomTable;
        if(debug) {
            console.log(this.axiomTable)
        }
    }   

    display(){
        for(let i = 0; i < this.axiomTable.length; i++) {
            var context = this.canvas.getContext("2d");
            context.font = "30px Helvetica, sans-serif ";
            context.textAlign = "start";
            context.textBaseline = "bottom";
            context.fillStyle = "#000000"; //color

            //render symbols
            const image = document.getElementById('UL_oe');
            image.addEventListener("load", (e) => {
                context.drawImage(image, 33, 71, 104, 124, 21, 20, 87, 104);
            });
            
            var message = ""
            for(const o of this.axiomTable[i].left){
                if(o.LeftOperand !== undefined){
                    message = o.LeftOperand + " "
                    context.fillText(message, 10, i*50);
                }
                console.log(o.Op)
                
                if(o.Op === '\\Oe'){
                    //console.log("display")
                    context.drawImage(image,20,i*50, 80,60);
                }

                if(o.RightOperand !== undefined){
                    message = o.RightOperand
                    context.fillText(message, 100, i*50);
                }
                
            }

            
        }
    }

    mainLoop(){
    }
}
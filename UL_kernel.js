
import {Axiom, Expression} from "./UL_dataType.js"
const SIZE = 50;

function isChar(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}
function drawLine(ctx, begin, end, stroke = 'black', width = 1) {
    if (stroke) {
        ctx.strokeStyle = stroke;
    }

    if (width) {
        ctx.lineWidth = width;
    }

    ctx.beginPath();
    ctx.moveTo(...begin);
    ctx.lineTo(...end);
    ctx.stroke();
}
export class UL_kernel {

    constructor(canvas, parsedRules, symbols){
        // global camera variables
        this.canvas = canvas;
        this.canvas.width = 1400;
        this.canvas.height = 2560;
        this.canvas.style.width = "1400px";
        this.canvas.style.height = "2560px";

        this.var_table;
        this.name_table;
        this.StringTable = parsedRules;
        this.axiomTable;
        this.symbols = symbols
        this.images = {}

        //display
        this.beginLine = true;
        this.context = this.canvas.getContext("2d");
        this.height = 0;
        this.pos = 20;
        this.botSplit = true
        this.bracketSize = 1.0
        this.returnY;
        this.textScale = 1.0

        //handling image src
        for(const symbol of this.symbols){
            const id = "UL_" + String(symbol).slice(-2)
            //console.log(id)
            var image = document.getElementById(id);
            this.images[symbol] = image
        }
        console.log(this.images)
        
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
                                        op+=c
                                        c = expr[++n]
                                        op+=c
                                        c = expr[++n]
                                        op+=c
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

    display(){

        for(let i = 0; i < this.axiomTable.length; i++) {
            let context = this.context
            let size = String(this.textScale * 30)
            context.font = size+ "px Helvetica, sans-serif ";
            context.textAlign = "start";
            context.textBaseline = "bottom";
            context.fillStyle = "#000000"; //color
            
            var leftExp = true;
            this.adjust = true;

            //resset x pos every line
            this.pos = 20*this.textScale
            for(const EXPS of [this.axiomTable[i].left, this.axiomTable[i].right]){
                this.bracketSize = 1.0
                
                for(const o of EXPS){
                    //parse line if expression has \eq
                    //console.log(o,pos,height)
                    this.displayExpression(o)
                    //console.log(this.height)
                }

                if(leftExp){
                    //display REQ
                    this.displayREQ();
                    leftExp = false
                }
            }

            this.beginLine = true;
            this.height += 50*this.textScale
        }
    }

    displayREQ(){
        const id = "UL_Rq"
        const image = document.getElementById(id);
        //console.log(image)
        if(this.returnY !== undefined){ this.height = this.returnY}
        
        this.context.drawImage(image, this.pos,  this.height + 15 * this.textScale,  this.textScale * 48,this.textScale * 36);
        this.pos += 70 * this.textScale
        this.context.fillText(",", this.pos, this.height + 50*this.textScale);
        this.pos += 20 * this.textScale


    }
    displayTB(o) {
        this.pos+=20*this.textScale
        var context = this.canvas.getContext("2d");

        var tempX = this.pos
        var tempY = this.height
        var tempSize = this.bracketSize
        //top

        this.height -= 50 * this.bracketSize*this.textScale
        context.fillText(",", this.pos, this.height + 50*this.textScale);
        this.pos += 20*this.textScale

        this.bracketSize *= 0.5
        this.displayExpression(o.top)        

        //bot
        this.pos = tempX
        this.height =tempY
        this.bracketSize = tempSize 

        this.height += 50 * this.bracketSize*this.textScale
        context.fillText(",", this.pos, this.height + 50*this.textScale);
        this.pos += 20*this.textScale

        this.bracketSize *= 0.5
        this.displayExpression(o.top)

    }

    displayExpression(o){
        //console.log(o)
        //console.log(this.pos, this.height)
        var context = this.context
        let OP = o.Op;
        let leftOperand = o.LeftOperand 
        let rightOperand = o.RightOperand
        var message = ""
        var left = true;
        let bracket = false
    
        if(String(o.Op).includes('\\eq')){
            OP = o.Op.slice(3)
            if(this.adjust) {
                if(this.botSplit ){
                    this.height += 70*this.textScale
                    this.botSplit = false
                }
                else{
                    this.height -= 70*this.textScale
                }
                this.adjust = false
                this.returnY = this.height;
            }

            bracket = true
        }
        if(this.beginLine){
            context.fillText(",", this.pos, this.height + 50*this.textScale);
            this.beginLine = false
            this.pos += 20*this.textScale
        }
        if(leftOperand !== undefined){
            message = o.LeftOperand + " "
            //console.log(message)
            context.fillText(message, this.pos, this.height + 50*this.textScale);
            left = false;
        }
        //display operator
        for(const symbol of this.symbols){
            if(OP === symbol){
                var image = this.images[OP]
                this.pos += 15*this.textScale
                context.drawImage(image, this.pos, this.height + 15 * this.textScale, 48 * this.textScale, 36 * this.textScale);
                break;
            }
        }

        //display right operand
        if(rightOperand !== undefined){
            message = o.RightOperand
            this.pos += 50*this.textScale
            //console.log(message)
            context.fillText(message, this.pos, this.height + 50*this.textScale);
            left = true
        }

        if(!left){
            this.pos+=20*this.textScale
        }
        this.pos += 40*this.textScale
        if(bracket){
            this.drawBracket(this.pos, this.height + 45*this.textScale, this.bracketSize);
            //console.log(this.pos, this.height)
            this.displayTB(o);
            this.botSplit = false;
        }
        else {
            context.fillText(",", this.pos, this.height + 50*this.textScale);
            this.pos += 35*this.textScale
        }
        this.pos += 20*this.textScale
    }

    drawBracket(x, y, size) {
        var context = this.canvas.getContext("2d");
        drawLine(context, [x, y+ size*(-10)*this.textScale],    [x-10, y+size*(-10)*this.textScale], 'black', 2 * this.textScale);
        drawLine(context, [x, y+ size*(-10+60)*this.textScale], [x,    y+size*(-10-60)*this.textScale], 'black', 2* this.textScale);
        drawLine(context, [x, y+ size*(-10-60)*this.textScale], [x+10, y+size*(-10-60)*this.textScale], 'black', 2* this.textScale);
        drawLine(context, [x, y+ size*(-10+60)*this.textScale], [x+10, y+size*(-10+60)*this.textScale], 'black', 2* this.textScale);
    }

    mainLoop(){
    }
}

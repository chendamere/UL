import {UL_kernel} from "./UL_kernel.js"

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

function hasNumber(myString) {
    return /\d/.test(myString);
}
export class Display {

    constructor(UL_kernel, canvas){

        this.kernel = UL_kernel
        this.canvas = canvas;
        //this.StringTable = this.kernel.parsedRules;
        this.axiomTable = this.kernel.axiomTable;
        this.proof = this.kernel.proofTable

        this.symbols = ["\\Oa"
            ,"\\Ob"
            ,"\\Oc"
            ,"\\Od"
            ,"\\Oe"
            ,"\\Og"
            ,"\\On"
            ,"\\Op"
            ,"\\Or"
            ,"\\Os"
            ,"\\Ot"
            ,"\\Pne"
            ,"\\Pnl"
            ,"\\Pu"
            ,"\\Ps"
            ,"\\Tc"
            ,"\\Tt"
            ,"\\Pe"
        ]

        //this.canvas.width = 1500;
        // this.canvas.height = 5000;

        this.images = {}
        this.beginLine = true;
        this.context = this.canvas.getContext("2d");
        this.context.canvas.width  = window.innerWidth/1.5;

        // console.log(this.context.canvas.height)
        this.heightOffset = 40;
        this.pos = 20;
        this.botSplit = true
        this.bracketSize = 1.0
        this.returnY;
        this.textScale = 0.5
        this.numEq = 0;
        this.maxXpos = 0;
        this.adjust = true;

        //handling image src
        for(const symbol of this.symbols){
            const id = "UL_" + String(symbol).slice(-2)
            //console.log(id)
            var image = document.getElementById(id);
            this.images[symbol] = image
        }
    }

    

    init() {

        var numSplit = this.count_splits_in_table()

        var height = (this.kernel.subsectionsIndex.length*150) +(this.kernel.subsubsectionsIndex.length*100) + (this.axiomTable.length - numSplit)*20 + (numSplit * 80)
        console.log(numSplit)
        window.innerHeight = height
        this.context.canvas.height = window.innerHeight;

        if(this.axiomTable.length !== 0) {
            this.display_from_table();
        }
        console.log(this.axiomTable)
        

        // if(this.proof.length !== 0)
        // {
        //     console.log(this.proof)
        //     this.display_from_proof()
        // }
        
    }

    count_splits_in_table(){
        var count = 0
        for(let i = 0; i < this.axiomTable.length; i++) {
            var found = false
            for(const EXPS of [this.axiomTable[i].left, this.axiomTable[i].right]){
                // console.log(EXPS)
                // if(found) continue
                for(const o of EXPS){
                    if((this.include_left_split(o.Op) || this.include_right_split(o.Op)) && !found){
                        // console.log(o.Op)
                        count += 1
                        found = true
                        break
                    }
                }
            }
        }
        return count
    }

    display_from_table(){
        //console.log(this.axiomTable.length)
        let context = this.context
        let size = String(this.textScale * 30)
        context.font = size+ "px Helvetica, sans-serif ";
        context.textAlign = "start";
        context.textBaseline = "bottom";
        context.fillStyle = "#000000"; //color
        var InSubSubSection = false;
        var InSubsection = false;

        // console.log(this.kernel.subsectionsIndex)
        // console.log(this.kernel.subsubsectionsIndex)
        console.log(this.kernel.subsectionsIndex)



        for(let i = 0; i < this.axiomTable.length; i++) {

            this.returnY = undefined
            this.numEq = 0;
            
            var leftExp = true;
            this.adjust = true;
            var eqSkipLine = true

            //resset x pos every line
            this.pos = 20*this.textScale

            for(const subsec of this.kernel.subsectionsIndex){
                //display subsection title
                if(i === subsec[1]){
                    // console.log(i,subsec)
                    context.font = size*2 + "px Helvetica, sans-serif ";
                    this.pos = 120*this.textScale
                    context.fillText(subsec[0], this.pos, this.heightOffset + 50 * this.textScale);
                    context.font = size + "px Helvetica, sans-serif ";
                    this.heightOffset += 50 * this.textScale*2
                    this.pos = 20*this.textScale
                    InSubsection = true
                    break
                }

                if(i === subsec[2]){
                    // console.log(subsec)
                    this.heightOffset += 50 * this.textScale*2
                    
                }
            }
            

            for(const subsubsec of this.kernel.subsubsectionsIndex){
                //display subsubsection title
                if(i === subsubsec[1]){
                    //console.log(i,subsubsec)
                    context.font = size*1.5 + "px Helvetica, sans-serif ";
                    this.pos = 220*this.textScale
                    context.fillText(subsubsec[0], this.pos, this.heightOffset + 50 * this.textScale);
                    context.font = size + "px Helvetica, sans-serif ";
                    this.heightOffset += 70 * this.textScale*1.5
                    this.pos = 20*this.textScale
                    InSubSubSection = true
                    break
                }
                if(i === subsubsec[2]){
                    // console.log(subsubsec)

                    this.heightOffset += 50 * this.textScale*2
                    
                }
            }

            if(InSubsection){
                this.pos += 150*this.textScale
            }
            if(InSubSubSection){
                this.pos += 150*this.textScale
            }

            for(const EXPS of [this.axiomTable[i].left, this.axiomTable[i].right]){
                for(const o of EXPS){
                    if((this.include_left_split(o.Op) || this.include_right_split(o.Op) )&& eqSkipLine){
                        this.heightOffset += 50 * this.textScale
                        eqSkipLine = false
                        break
                    }
                }
            }
            
            for(const EXPS of [this.axiomTable[i].left, this.axiomTable[i].right]){
                this.bracketSize = 1.0
                if(this.beginLine){
                    context.fillText(String(i+1)+": ", this.pos, this.heightOffset + 50 * this.textScale);
                    this.pos += 60* this.textScale
                    context.fillText(",", this.pos, this.heightOffset + 50 * this.textScale);
                    this.beginLine = false
                    this.pos += 30*this.textScale
                }
                
                for(const o of EXPS){
                    
                    //parse line if expression has \eq
                    if(o === undefined) continue;
                    //console.log(o)
                    if(this.include_right_split(o.Op)||this.include_left_split(o.Op)){
                        if(this.adjust) {
                            this.adjust = false
                            this.returnY = this.heightOffset;
                            this.numEq += 1;
                        }
                    }
                    this.displayExpression(o)
                }

                if(leftExp){
                    //display REQ  
                    this.displayRQ(); 
                    leftExp = false
                    this.pos += 10*this.textScale

                }
            }

            this.beginLine = true;
            this.heightOffset += 50*this.textScale+this.numEq*30
        }
    }

    display_from_proof(){
        //console.log(this.axiomTable.length)
        let context = this.context
        let size = String(this.textScale * 30)
        context.font = size+ "px Helvetica, sans-serif ";
        context.textAlign = "start";
        context.textBaseline = "bottom";
        context.fillStyle = "#000000"; //color
        
        for(let i = 0; i < this.proof.length; i++) {

            this.returnY = undefined
            this.numEq = 0;
            this.adjust = true;
            var eqSkipLine = true

            //resset x pos every line
            this.pos = 20*this.textScale

            for(const EXPS of [this.proof[i]]){
                this.bracketSize = 1.0
                for(const o of EXPS){
                    if((this.include_right_split(o.Op)||this.include_left_split(o.Op)) && eqSkipLine){
                        this.heightOffset += 50 * this.textScale
                        eqSkipLine = false
                        break
                    }
                }
                if(this.beginLine){
                    context.fillText(String(i+1)+": ", this.pos, this.heightOffset + 50 * this.textScale);
                    this.pos += 60* this.textScale
                    context.fillText(",", this.pos, this.heightOffset + 50 * this.textScale);
                    this.beginLine = false
                    this.pos += 20*this.textScale
                }    
                for(const o of EXPS){
                    //parse line if expression has \eq
                    if(o === undefined) continue;
                    if(this.include_right_split(o.Op)||this.include_left_split(o.Op)){
                        if(this.adjust) {
                            this.adjust = false
                            this.returnY = this.heightOffset;
                            this.numEq += 1;
                        }
                    }
                    //console.log(o)
                    this.displayExpression(o)
                }
            }

            this.beginLine = true;
            this.heightOffset += 50*this.textScale+this.numEq*30
        }
    }

    displayRQ(){
        const id = "UL_Rq"
        const image = document.getElementById(id);
        if(this.returnY !== undefined){
            this.heightOffset = this.returnY
        }
        this.context.drawImage(image, this.pos,  this.heightOffset + 15 * this.textScale,  this.textScale * 36,this.textScale * 36);
        this.pos += 60 * this.textScale
        this.context.fillText(",", this.pos, this.heightOffset + 50*this.textScale);
        this.pos += 20 * this.textScale
    }

    displayTB(o) {
        this.pos+=20*this.textScale
        var context = this.canvas.getContext("2d");

        const tempX = this.pos
        const tempY = this.heightOffset
        var tempSize = this.bracketSize
        this.maxXpos = this.pos + 20*this.textScale;
        
        //top expressions
        this.heightOffset -= 50 * this.bracketSize*this.textScale
        context.fillText(",", this.pos, this.heightOffset + 50*this.textScale);
        this.pos += 20*this.textScale

        this.bracketSize *= 0.5
        let expression = o.top
        if(expression !== undefined){
            this.displayExpression(expression)
            while(expression.next !== undefined){
                expression = expression.next
                //console.log(expression)

                this.displayExpression(expression)
            }
            if(this.pos > this.maxXpos){
                this.maxXpos = this.pos
            }
        }

        //bot expressions

        expression = o.bot
        this.pos = tempX
        this.heightOffset =tempY
        this.bracketSize = tempSize 

        this.heightOffset += 50 * this.bracketSize*this.textScale
        context.fillText(",", this.pos, this.heightOffset + 50*this.textScale);
        this.pos += 20*this.textScale
        if(expression !== undefined){
            this.bracketSize *= 0.5
            this.displayExpression(expression)
            while(expression.next !== undefined){
                expression = expression.next
                //console.log(expression)
                //console.log(this.pos)
                this.displayExpression(expression)
            }
                        
        }
        this.pos = this.maxXpos
        this.bracketSize = tempSize 
        this.heightOffset =tempY

    }

    padding(message){
        var extraScaling = 0.7
        var multiple = false
        for(const Char of message) {
            //console.log(Char)
            if(Char === 'm' || Char ==='w' || Char === 'M' || Char ==='W' || Char === '_'){
                if(multiple){
                    this.pos += 30*this.textScale*extraScaling
                }else{
                    this.pos += 30*this.textScale

                }
            }
            else if(Char === 'i' || Char === 'l' || Char === 'j' || Char === 'I' || Char === 'J' || Char ==="1"){
                if(multiple){
                    this.pos += 10*this.textScale*extraScaling
                }else{
                this.pos += 10*this.textScale
                }
            }
            else{
                //console.log(Char)
                if(multiple){
                    this.pos += 20*this.textScale*extraScaling
                }else{
                    this.pos += 20*this.textScale
                }
            }
            multiple = true
        }
    }

    displaySubscriptMessage(message,curMessage){
        var context = this.context
        context.fillText(message, this.pos, this.heightOffset + 50*this.textScale);
        this.pos += 10 * this.textScale
        let size = String(this.textScale * 30)
        context.font = size/2 + "px Helvetica, sans-serif ";
        context.fillText(curMessage, this.pos, this.heightOffset + 55*this.textScale);
        this.pos += 15   * this.textScale

        context.font = size + "px Helvetica, sans-serif ";
    }
    subscript(message){
        var curMessage = message;
        for(let i = 0; i<message.length; i++){
            if(message[i] === '_'){
                if(message[i+1] !== undefined)
                {
                    if(Number.isInteger(parseInt(message[i+1]))){
                        curMessage = message.slice(i+1)
                        message = message.slice(0,i)
                        // console.log(curMessage)
                        this.displaySubscriptMessage(message,curMessage)
                    }
                    else if(message[i+1] === '{'){
                        let j = i+1 
                        while(j !== '}'){
                            curMessage += message[j++]
                        }
                        message = message.slice(0,i)
                        this.displaySubscriptMessage(message,curMessage)
                    }
                    else{break}
                }
                else{break}
            }
        }
    }

    displayExpression(o){

        if(o === undefined) return;
        //console.log(this.pos, this.heightOffset)
        var context = this.context
        let OP = o.Op;
        let leftOperand = o.LeftOperand 
        let rightOperand = o.RightOperand
        var message = ""
        var left = true;
        let bracket = false   
        let BackBracket = false    
        //console.log(o.Op)
 
        if(this.include_left_split(o.Op)){
            //console.log("here")
            if(o.Op.length ===3){
                //just eq
                //console.log(o.Op)
            }
            else if(o.Op.includes("\\Blb")){
                OP = o.Op.slice(4)
                //console.log(OP)
            }
            else{
                //console.log(o.Op)
                OP = o.Op.slice(3)
            }
            //sconsole.log(this.adjust)
            bracket = true
        }

        if(this.include_right_split(o.Op)){
            //console.log("yes")
            if(o.Op.length === 4){
                // console.log(o.Op)
            }
            else{
                OP = o.Op.slice(4)
            }
            //sconsole.log(this.adjust)
            BackBracket = true
        }

        if(o.hasIf) {
            let message = "if("
            context.fillText(message, this.pos, this.heightOffset + 50*this.textScale);
            // this.pos += (message.length-1)*10
            this.pos += 30*this.textScale
        }

        //display left operand
        if(leftOperand !== undefined){
            message = leftOperand
            //console.log(message)

            if(message.includes('_')){
                this.subscript(message)
            }
            else{
                context.fillText(message, this.pos, this.heightOffset + 50*this.textScale);
                this.padding(message)

            }            
            //add extra padding 
            // this.pos += (message.length-1)*10
            // console.log((message.length-1)*10)
            left = false;
        }
        //display operator
        for(const symbol of this.symbols){
            if(OP === symbol){
                var image = this.images[OP]
                context.drawImage(image, this.pos, this.heightOffset + 15 * this.textScale, 36 * this.textScale, 36 * this.textScale);
                this.pos += 40*this.textScale
                break;
            }
        }

        //display right operand
        if(rightOperand !== undefined){
            message = rightOperand
            
            if(message.includes('_')){
                this.subscript(message)
            }
            else{
                context.fillText(message, this.pos, this.heightOffset + 50*this.textScale);
                this.padding(message)
            }         
            left = true
        }
        if(o.hasIf) {
            context.fillText(")", this.pos, this.heightOffset + 50*this.textScale);
            this.pos += 10*this.textScale
        }

        // if(!left){
        //     this.pos+=10*this.textScale
        // }
        //for \Or
        // if(left && rightOperand === undefined){
        //     //console.log("yes")
        //     this.pos+=10*this.textScale
        // }
        if(bracket){
            this.pos += 40*this.textScale
            this.drawBracket(this.pos, this.heightOffset + 45*this.textScale, this.bracketSize);
            //console.log(this.pos, this.heightOffset)
            //display top and bot expression
            this.pos+=20*this.textScale

            this.displayTB(o);
        }
        else if(BackBracket){
            this.displayTB(o)
            this.pos+=20*this.textScale
            this.drawBackBracket(this.pos, this.heightOffset + 45*this.textScale, this.bracketSize)
            this.pos+=20*this.textScale

        }
        else {
            this.pos += 10*this.textScale

            context.fillText(",", this.pos, this.heightOffset + 50*this.textScale);
            this.pos += 20*this.textScale
        }
        //this.pos += 20*this.textScale
        if(this.pos > this.maxXpos){
            this.maxXpos = this.pos
        }
    }

    drawBracket(x, y, size) {
        var context = this.canvas.getContext("2d");
        drawLine(context, [x, y+ size*(-10)*this.textScale],    [x-10, y+size*(-10)*this.textScale], 'black', 2 * this.textScale);
        drawLine(context, [x, y+ size*(-10+60)*this.textScale], [x,    y+size*(-10-60)*this.textScale], 'black', 2* this.textScale);
        drawLine(context, [x, y+ size*(-10-60)*this.textScale], [x+10, y+size*(-10-60)*this.textScale], 'black', 2* this.textScale);
        drawLine(context, [x, y+ size*(-10+60)*this.textScale], [x+10, y+size*(-10+60)*this.textScale], 'black', 2* this.textScale);
    }

    drawBackBracket(x, y, size) {
        var context = this.canvas.getContext("2d");
        drawLine(context, [x, y+ size*(-10)*this.textScale],    [x+10, y+size*(-10)*this.textScale], 'black', 2 * this.textScale);
        drawLine(context, [x, y+ size*(-10+60)*this.textScale], [x,    y+size*(-10-60)*this.textScale], 'black', 2* this.textScale);
        drawLine(context, [x, y+ size*(-10-60)*this.textScale], [x-10, y+size*(-10-60)*this.textScale], 'black', 2* this.textScale);
        drawLine(context, [x, y+ size*(-10+60)*this.textScale], [x-10, y+size*(-10+60)*this.textScale], 'black', 2* this.textScale);
        this.pos += 20*this.textScale
    }

    include_left_split(expression){
        if(expression === undefined) return false
        if(expression.includes('\\eq') || expression.includes('\\Bls') || expression.includes('\\Blb') || expression.includes('\\Bb') || expression.includes('\\Bs')){
            return true
        }
        else return false
    }

    include_right_split(expression){
        if(expression === undefined) return false
        if(expression.includes('\\Brs')){
            return true
        }
        else return false
    }
}
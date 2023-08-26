
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

export class Proof_Display{
    constructor(start, proof_table, display_pos_x, display_pos_y, kernel) {
        this.ctx = document.getElementById("highlight_canvas").getContext("2d")
        this.canvas = this.ctx.canvas

        this.proofs = proof_table;
        this.x = display_pos_x;
        this.y = display_pos_y;
        this.numEq;
        this.returnY;
        this.textScale = 0.4
        this.kernel = kernel
        this.start = start;

        this.width = 300;

        // console.log(this.proofs)
        this.numSplit = this.count_splits_in_table();
        // console.log(this.numSplit)
        this.height = 50 + (this.proofs.length - this.numSplit)*25 + (this.numSplit * 100);
        this.key;

        this.pos = this.x+10;
        this.heightOffset= this.y+10;

        this.symbols = [
            "\\Oa"
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
            ,"\\Pnl"
            ,"\\Pne"
            ,"\\Pu"
            ,"\\Ps"
            ,"\\Tc"
            ,"\\Tt"
            ,"\\Pe"
            ,"\\Pp"
            ,"\\Pn"
            ,"\\Pc"
            ,"\\Pb"
            ,"\\nPb"
            ,"\\nPp"
            ,"\\nPn"
            ,"\\nPc"
            ,"\\nPe"
            ,"\\nPne"
            ,"\\nPnl"
            ,"\\nPu"
            ,"\\nPs"
            ,"\\nPe"
            ,"\\Pnm"
            ,"\\nPnm"
        ]
        this.FunctionNames = [
            "R()",
            "R_()" ,
            "Rd()" ,
            "Rc()" ,
            "&Tm()",
            "&Fam()",
            "Del()",
            "Ins()",
            "Cpo()",
            "Rcpo()",
            "IsCpo()",
            "&Tm()",
            "Rcpm()",
            "IsCpm()",
            "+",
            "\\times",
        ]
        
        this.images = {}
        //handling image src
        for(const symbol of this.symbols){
            const id = "UL_" + String(symbol).slice(1, this.symbols.length)
            // console.log(id)
            var image = document.getElementById(id);
            this.images[symbol] = image
        }
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

    displayRQ(){
        const id = "UL_Rq"
        const image = document.getElementById(id);
        if(this.returnY !== undefined){
            this.heightOffset = this.returnY
        }
        this.ctx.drawImage(image, this.pos,  this.heightOffset + 15 * this.textScale,  this.textScale * 36,this.textScale * 36);
        this.pos += 60 * this.textScale
        // this.context.fillText(",", this.pos, this.heightOffset + 50*this.textScale);
        // this.pos += 20 * this.textScale
    }
    drawBracket(x, y, size) {
        var ctx = this.canvas.getContext("2d");
        drawLine(ctx, [x, y+ size*(-10)*this.textScale],    [x-10, y+size*(-10)*this.textScale], 'black', 2 * this.textScale);
        drawLine(ctx, [x, y+ size*(-10+60)*this.textScale], [x,    y+size*(-10-60)*this.textScale], 'black', 2* this.textScale);
        drawLine(ctx, [x, y+ size*(-10-60)*this.textScale], [x+10, y+size*(-10-60)*this.textScale], 'black', 2* this.textScale);
        drawLine(ctx, [x, y+ size*(-10+60)*this.textScale], [x+10, y+size*(-10+60)*this.textScale], 'black', 2* this.textScale);
    }

    drawBackBracket(x, y, size) {
        var ctx = this.canvas.getContext("2d");
        drawLine(ctx, [x, y+ size*(-10)*this.textScale],    [x+10, y+size*(-10)*this.textScale], 'black', 2 * this.textScale);
        drawLine(ctx, [x, y+ size*(-10+60)*this.textScale], [x,    y+size*(-10-60)*this.textScale], 'black', 2* this.textScale);
        drawLine(ctx, [x, y+ size*(-10-60)*this.textScale], [x-10, y+size*(-10-60)*this.textScale], 'black', 2* this.textScale);
        drawLine(ctx, [x, y+ size*(-10+60)*this.textScale], [x-10, y+size*(-10+60)*this.textScale], 'black', 2* this.textScale);
        this.pos += 20 * this.textScale
        this.ctx.fillText(",", this.pos, this.heightOffset + 50*this.textScale);
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
        if(expression.includes('\\Brs') || expression.includes('\\Bb') || expression.includes('\\Bs')){
            return true
        }
        else return false
    }

    init(){
        // console.log(this.ctx.canvas)
        if(this.ctx.canvas.hidden === true){
            this.ctx.canvas.hidden = false
        }
        console.log(this.proofs)
        this.ctx.clearRect(this.x, this.y, this.width, this.height)
        this.ctx.fillStyle = "white"
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.display()
    }

    clear(){
        // console.log("clear")
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    padding(message, sub){
        
        var extraScaling = 0.7
        var multiple = false
        for(const Char of message) {
            //console.log(Char)
            if(Char === 'm' || Char ==='w' || Char === 'M' || Char ==='W' || Char === '_' || Char ==="&" || Char ==="C" || Char === "R"){
                // console.log(Char)

                // if(multiple){
                //     this.pos += 30*this.textScale*extraScaling
                // }else{
                    this.pos += 30*this.textScale

                // }
            }
            else if(Char === 'i' || Char === 'l' || Char === 'j' || Char === 'I' || Char === 'J' || Char ==="1" || Char === "2" || Char === "2"){
                // console.log(Char)
                // if(multiple){
                //     this.pos += 10*this.textScale*extraScaling
                // }else{
                    this.pos += 10*this.textScale
                // }
            }
            else{
                //console.log(Char)
                // console.log(Char)
                if(multiple){
                    this.pos += 20*this.textScale*extraScaling
                }else{
                    this.pos += 20*this.textScale
                }
            }
            multiple = true
        }
    }

    display(){
        // console.log(this.proofs,this.canvas)
        //this.ctx.clearRect(this.x, this.y, this.width, this.height)

        let context = this.ctx
        let size = String(this.textScale * 30)
        context.font = size+ "px Helvetica, sans-serif ";
        context.textAlign = "start";
        context.textBaseline = "bottom";
        context.fillStyle = "#000000"; //color

        let chapter = this.proofs
        for(let i = 0; i < chapter.length; i++) {
            // console.log(chapter[i])
            this.returnY = undefined
            this.numEq = 0;
            this.adjust = true;
            var eqSkipLine = true

            //resset x pos every line
            this.pos = this.x + 20*this.textScale

            for(const EXP of chapter[i]){
                    if((this.include_left_split(EXP.Op) || this.include_right_split(EXP.Op) )&& eqSkipLine){
                        this.heightOffset += 50 * this.textScale
                        eqSkipLine = false
                        break
                    }
                if(!eqSkipLine)break
            }
            
            for(const EXP of chapter[i]){
                this.bracketSize = 1.0
                if(this.beginLine){
                    //display REQ  
                    this.pos += 20*this.textScale
                    this.displayRQ(); 
                    this.beginLine = false
                    this.beginExprs = true
                    this.pos += 10*this.textScale
                }
                if(EXP.length === 0){
                    context.fillText(",", this.pos, this.heightOffset + 50*this.textScale);
                    this.pos += 20*this.textScale
                }
                //parse line if expression has \eq
                if(EXP === undefined) continue;
                if(this.include_right_split(EXP.Op)||this.include_left_split(EXP.Op)){
                    if(this.adjust) {
                        this.adjust = false
                        this.returnY = this.heightOffset;
                        this.numEq += 1;
                    }
                }
                // console.log(EXP)
                this.displayExpression(EXP)
            }
            this.beginLine = true;
            this.heightOffset += 50*this.textScale+this.numEq*50
        }
    }

    
    count_splits_in_table(){
        var count = 0
        for(const EXPS of this.proofs){
            var found = false;
            for(const o of EXPS){
                if((this.include_left_split(o.Op) || this.include_right_split(o.Op)) && !found){
                    found = true;
                    count += 1
                    break
                }
            }
        }
        return count
    }

    displayExpression(o){

        if(o === undefined) return;
        let context = this.ctx
        let OP = o.Op;
        let leftOperand = o.parameters[0]
        let rightOperand = o.parameters[1]
        var message = ""
        let bracket = false   
        let BackBracket = false    

        if(this.beginExprs){
            this.beginExprs = false
            if(this.include_left_split(o.Op) || !this.include_right_split(o.Op)){
                context.fillText(",", this.pos, this.heightOffset + 50*this.textScale);
                this.pos += 20 * this.textScale
            }
        }


        if(this.include_left_split(o.Op)){
            //console.log("here")
            if(o.Op.length ===3){
                //just eq
                //console.log(o.Op)
            }
            else if(o.Op.includes("\\Blb") || o.Op.includes("\\Bls")){
                OP = o.Op.slice(4)
                //console.log(OP)
            }
            else{
                //console.log(o.Op)
                OP = o.Op.slice(3)
            }
            //console.log(this.adjust)
            bracket = true
        }

        if(this.include_right_split(o.Op)){
            //console.log("yes")
            if(o.Op.length === 4 || o.Op.length === 3){
                // console.log(o.Op)
            }
            else if(o.Op.includes("\\Blb") || o.Op.includes("\\Bls")){
                OP = o.Op.slice(4)
                //console.log(OP)
            }
            else if(o.Op.includes("\\Bb") || o.Op.includes("\\Bs")){
                OP = o.Op.slice(3)
                //console.log(OP)
            }
            //sconsole.log(this.adjust)
            BackBracket = true
        }
        // console.log(o.Op)

        if(this.isRfn(o.Op) && o.Op !== "+" && o.Op !== "\\times"){
            message = o.Op.slice(0, message.length-1)
            context.fillText(message, this.pos, this.heightOffset + 50*this.textScale);
            this.padding(message)
        }

        if(o.hasIf) {
            let message = "if("
            context.fillText(message, this.pos, this.heightOffset + 50*this.textScale);
            // this.pos += (message.length-1)*10
            this.pos += 30*this.textScale
        }

        //display left operand
        if(leftOperand !== undefined){

            //display flag object 
            if(leftOperand === "\\In"){
                message = "&Shi"
            }
            else if(leftOperand === "\\Ip"){
                message = "&Shj"
            }
            else if(leftOperand === "\\It"){
                message = "&SVi"
            }
            else{
                message = leftOperand
            }

            if(message.includes('_')){
                this.subscript(message)
            }
            else{
                context.fillText(message, this.pos, this.heightOffset + 50*this.textScale);
                this.padding(message)
            }
            
        }
        //display operator
        for(const symbol of this.symbols){
            if(OP === symbol){
                var image = this.images[OP]
                //if Pu or nPu then its a 3 height 5 width
                if(OP ==="\\Pu" || OP ==="\\nPu"){
                    context.drawImage(image, this.pos, this.heightOffset + 15 * this.textScale, 60 * this.textScale, 36 * this.textScale);
                    this.pos += 52*this.textScale
                }
                else{                    
                    context.drawImage(image, this.pos, this.heightOffset + 15 * this.textScale, 36 * this.textScale, 36 * this.textScale);
                    this.pos += 40*this.textScale
                }
                
                break;
            }
            else if(OP ==="\\sim"){
                // console.log("~")
                context.fillText('~', this.pos, this.heightOffset + 50*this.textScale);
                this.pos += 30*this.textScale
                break
            }
        }

        if(OP ==="+"){
            // console.log("+")
            context.fillText("+", this.pos, this.heightOffset + 50 * this.textScale);
            this.pos += 20*this.textScale
        }
        else if(OP ==="\\times"){
            // console.log("x")
            context.fillText("x", this.pos, this.heightOffset + 50 * this.textScale);
            this.pos += 20*this.textScale
        }

        //display right operand
        if(rightOperand !== undefined){
            if(this.isRfn(o.Op) && (o.Op !== "+" && o.Op !== "\\times")){
                context.fillText(";", this.pos, this.heightOffset + 50*this.textScale);
                this.pos += 10*this.textScale
            }

            message = rightOperand
            
            if(message.includes('_')){
                this.subscript(message)
            }
            else{
                context.fillText(message, this.pos, this.heightOffset + 50*this.textScale);
                this.padding(message)
            }
        }
        if(o.parameters[2] !== undefined){
            context.fillText(";", this.pos, this.heightOffset + 50*this.textScale);
            this.pos += 10*this.textScale
            message = o.parameters[2]
            if(message.includes('_')){
                this.subscript(message)
            }
            else{
                context.fillText(message, this.pos, this.heightOffset + 50*this.textScale);
                this.padding(message)
            }
        }

        if(o.ret !== undefined){
            message = ": " + o.ret
            context.fillText(message, this.pos, this.heightOffset + 50*this.textScale);
            this.padding(":"+o.ret)
        }

        if((o.hasIf || this.isRfn(o.Op))  && o.Op !== "+" && o.Op !== "\\times") {
            context.fillText(")", this.pos, this.heightOffset + 50*this.textScale);
            this.pos += 10*this.textScale
        }

        if(bracket){
            this.pos += 40*this.textScale
            this.drawBracket(this.pos, this.heightOffset + 45*this.textScale, this.bracketSize);
            //display top and bot expression
            this.pos+=20*this.textScale
            this.displayTB(o);
            this.pos+=20*this.textScale

            if(BackBracket){
                this.drawBackBracket(this.pos, this.heightOffset + 45*this.textScale, this.bracketSize)
            }
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

    isRfn(op){
        for(const name of this.FunctionNames)
        {
            if(op === name){
                return true
            }
        }
        return false
    }
}

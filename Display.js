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
export class Display {

    constructor(UL_kernel, canvas, symbols){

        this.kernel = UL_kernel
        this.canvas = canvas;
        this.symbols = symbols

        this.canvas.width = 5120;
        this.canvas.height = 5120;
        this.canvas.style.width = "5120px";
        this.canvas.style.height = "5120px";

        this.var_table = this.kernel.var_table;
        this.name_table = this.kernel.name_table;
        this.StringTable = this.kernel.parsedRules;
        this.axiomTable = this.kernel.axiomTable;
        this.images = {}

        //display
        this.beginLine = true;
        this.context = this.canvas.getContext("2d");
        this.height = 0;
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
            console.log(id)
            var image = document.getElementById(id);
            this.images[symbol] = image
        }
        
        this.init();
    }

    init() {
        this.display_from_table();
    }

    display_from_table(){
        //console.log(this.axiomTable.length)
        let context = this.context
        let size = String(this.textScale * 30)
        context.font = size+ "px Helvetica, sans-serif ";
        context.textAlign = "start";
        context.textBaseline = "bottom";
        context.fillStyle = "#000000"; //color

        for(let i = 0; i < this.axiomTable.length; i++) {

            this.returnY = undefined
            this.numEq = 0;
            
            var leftExp = true;
            this.adjust = true;
            var eqSkipLine = true

            
            //resset x pos every line
            this.pos = 20*this.textScale
            
            for(const EXPS of [this.axiomTable[i].left, this.axiomTable[i].right]){
                this.bracketSize = 1.0
                for(const o of EXPS){
                    if(String(o.Op).includes('\\eq') && eqSkipLine){
                        this.height += 50 * this.textScale
                        eqSkipLine = false
                        break
                    }
                }
                if(this.beginLine){
                    context.fillText(String(i)+": ", this.pos, this.height + 50 * this.textScale);
                    this.pos += 60* this.textScale
                    context.fillText(",", this.pos, this.height + 50 * this.textScale);
                    this.beginLine = false
                    this.pos += 20*this.textScale
                }
                
                for(const o of EXPS){
                    
                    //parse line if expression has \eq
                    //console.log(o,pos,height)
                    // console.log(this.height, o )

                    if(o === undefined) continue;
                    //console.log(this.height,o)//------------------ 180
                    if(String(o.Op).includes('\\eq')){
                        //sconsole.log(this.adjust)
                        if(this.adjust) {
                            this.adjust = false
                            this.returnY = this.height;
                            this.numEq += 1;
                        }
                    }
                    this.displayExpression(o) //--------------- 145
                    //console.log(this.height,o)
                    //console.log(this.height)
                }

                if(leftExp){
                    //display REQ
                    
                    this.displayRQ(); 
                    leftExp = false
                }
            }

            this.beginLine = true;
            this.height += 50*this.textScale+this.numEq*30
        }
    }

    displayRQ(){
        const id = "UL_Rq"
        const image = document.getElementById(id);
        //console.log(image)
        if(this.returnY !== undefined){
            this.height = this.returnY
        }
        this.context.drawImage(image, this.pos,  this.height + 15 * this.textScale,  this.textScale * 36,this.textScale * 36);
        this.pos += 70 * this.textScale
        this.context.fillText(",", this.pos, this.height + 50*this.textScale);
        this.pos += 20 * this.textScale


    }
    displayTB(o) {
        this.pos+=20*this.textScale
        var context = this.canvas.getContext("2d");

        const tempX = this.pos
        const tempY = this.height
        var tempSize = this.bracketSize
        this.maxXpos = this.pos;
        
        //top expressions
        this.height -= 50 * this.bracketSize*this.textScale
        context.fillText(",", this.pos, this.height + 50*this.textScale);
        this.pos += 20*this.textScale

        this.bracketSize *= 0.5
        let expression = o.top
        if(expression !== undefined){
            this.displayExpression(expression)
            while(expression.next !== undefined){
                expression = expression.next
                this.displayExpression(expression)
            }
            if(this.pos > this.maxXpos){
                this.maxXpos = this.pos
            }
        }

        //bot expressions

        expression = o.bot
        this.pos = tempX
        this.height =tempY
        this.bracketSize = tempSize 

        this.height += 50 * this.bracketSize*this.textScale
        context.fillText(",", this.pos, this.height + 50*this.textScale);
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
        this.height =tempY

    }

    displayExpression(o){

        if(o === undefined) return;
        //console.log(this.pos, this.height)
        var context = this.context
        let OP = o.Op;
        let leftOperand = o.LeftOperand 
        let rightOperand = o.RightOperand
        var message = ""
        var left = true;
        let bracket = false
        this.botSplit = true
        
        if(String(o.Op).includes('\\eq')){
            OP = o.Op.slice(3)
            //sconsole.log(this.adjust)
            bracket = true
        }
        
        // if(this.beginLine){
        //     context.fillText(",", this.pos, this.height + 50 * this.textScale);
        //     this.beginLine = false
        //     this.pos += 20*this.textScale
        // }

        //display left operand
        if(leftOperand !== undefined){
            message = o.LeftOperand + " "
            //console.log(message)
            
            context.fillText(message, this.pos, this.height + 50*this.textScale);
            //add extra padding if detect underscore
            this.pos += (message.length-2)*10
            left = false;
        }
        //display operator
        for(const symbol of this.symbols){
            if(OP === symbol){
                var image = this.images[OP]
                this.pos += 15*this.textScale
                context.drawImage(image, this.pos, this.height + 15 * this.textScale, 36 * this.textScale, 36 * this.textScale);
                break;
            }
        }

        //display right operand
        if(rightOperand !== undefined){
            message = o.RightOperand
            this.pos += 50*this.textScale
            //console.log(message)
            context.fillText(message, this.pos, this.height + 50*this.textScale);

            //add extra padding if detect underscore
            this.pos += (message.length)*10
            
            left = true
        }

        if(!left){
            this.pos+=20*this.textScale
        }
        this.pos += 40*this.textScale
        if(bracket){
            this.drawBracket(this.pos, this.height + 45*this.textScale, this.bracketSize);
            //console.log(this.pos, this.height)

            //display top and bot expression
            this.displayTB(o);
            // this.botSplit = false;
        }
        else {
            context.fillText(",", this.pos, this.height + 50*this.textScale);
            this.pos += 35*this.textScale
        }
        this.pos += 20*this.textScale
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
}
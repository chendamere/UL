
import AnalyseCode from './UL_Interpreter/lexer-analyser.js'
import ParseTokens from './UL_Interpreter/parser-analyser.js';
import ProofAssistant from './UL_Interpreter/ProofAssistant.js'
import {RuleNormalize, expsNormalize, Parser, ParseRules, Parse_rules_and_titles} from './UL_Interpreter/latex-chapters.js';
const parse = Parser(AnalyseCode,ParseTokens)

const dir = [
    // 'Addition.tex',
    // 'Axioms_of_Assign_operator.tex',
    // 'Function_Cpo(r).tex',
    // 'Multiplication.tex',
    // 'Next_Order_Induction.tex',
    // 'Paradox.tex',
    // 'Previous_Order_Induction.tex',
    // 'Recursive_Function_R_(i).tex',
    // 'Recursive_Function_R(i).tex',
    // 'Recursive_Function_Rc(i_j).tex',
    // 'Recursive_Function_Rc(i;j).tex',
    // 'Recursive_Function_Rcpm(i_j_r).tex',
    // 'Recursive_Function_Rcpm(i;j;r).tex',
    // 'Rules_of_Assign_Operator_in_Temporary_Space.tex',
    // 'Rules_of_Node_ring.tex',
    // 'Rules_of_Empty_Branch_Function.tex',
    // 'Rules_of_Number_Equal_Relationship.tex',
    // 'Rules_of_Number_More_Than_and_Less_Than_Relationship.tex',
    // 'Rules_of_Relationship_of_Node_Connectivity.tex',
    // 'Rules_of_Relationship_of_Node_Continuity.tex',
    // 'Rules_of_Relationship_of_Subnode.tex',
    // 'Rules_of_Three_Fundamental_Relationships.tex',
    // 'Swap_Theorems_of_the_Same_Operand.tex',
    // 'Theorems_of_Assign_Operator.tex',
    // 'Theorems_of_Delete_Node_Function_Del(j).tex',
    // 'Theorems_of_Insert_Node_Function_Ins(t;j).tex',
    // 'Theorems_of_Insert_Node_Function_Ins(t_j).tex',
    // 'Theorems_of_Operators_and_Relationships.tex',
    // 'Theorems_of_Relationship_Of_Node_Null_Comparison.tex',
    // 'Theorems_of_Relationship_Of_Node_Value_Comparison.tex',
    // 'Tree_Order_Induction.tex'
    'axioms.tex'
]


var allLines = document.getElementById('allLines')
if(!allLines){
    allLines = document.createElement('div');
    allLines.id = 'allLines'
    allLines.hidden = 'false'
} 

for(const f of dir) {
 
    const text = await (await fetch("../../../public/js/UL_Interpreter/axiom/" + f)).text();
    
    let lines = []
    let line = ''
    for(const char of text){
        if(char === '\n'){
            if(line.length > 1){
                lines.push(line)
            }
            line = ''
        }
        else{line += char}
    }
    for(const l of lines){
        var lineDiv = document.createElement('div')
        lineDiv.innerHTML = l
        allLines.appendChild(lineDiv)
    }

}
document.body.appendChild(allLines)


{
    const chatInput = document.getElementById('chatInput');
    const messagesDiv = document.getElementById('messages');
    const lastStatementDiv = document.getElementById('lastStatement');
    const Addbutton = document.getElementById('get-rules-btn');
    const delExpbtn = document.getElementById('delExpbtn')
    const clearbutton = document.getElementById('clearbtn');
    const allLinesdiv = document.getElementById('allLines')
    const tableBody = document.getElementById('tableBody');


    const output = document.createElement('div')
    output.id = 'output'
    output.hidden = 'true'

    var allLines = []

    for(var i =0; i < allLinesdiv.children.length; i ++){
        var d = allLinesdiv.children[i].innerHTML
        allLines.push(d)
    }

    var parsed_chapter = Parse_rules_and_titles(allLines)

    for(const l of parsed_chapter.rules) {
        const newDiv = document.createElement('div')
        newDiv.innerHTML = l 
        output.appendChild(newDiv)
    } 
    document.body.appendChild(output)
    let pr = ParseRules([parsed_chapter], parse)
    const pf = new ProofAssistant(pr, parse, [])

    const svgMap = {
        '#10': `<svg cache-id="e49b5b6fb703408e8f9dd5e61f1ce45a" id="e4n1Xm3WGuO1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width='20' height = '20'  viewBox="0 0 300 300" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><path d="M24.24878,150C24.24878,79.46997,80.54952,22.29409,150,22.29409s125.75122,57.17588,125.75122,127.70591-56.30074,127.70591-125.75122,127.70591-125.75122-57.17588-125.75122-127.70591Z" opacity="0.96" fill="rgba(255,255,255,0)" stroke="#000" stroke-width="20"/><line x1="0" y1="-63.852955" x2="0" y2="63.852955" transform="matrix(0-1-.881338 0 150 120.658471)" stroke="#020202" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/><line x1="0" y1="-63.852955" x2="0" y2="63.852955" transform="matrix(0-1-.881338 0 150 176.98888)" stroke="#020202" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/><ellipse rx="30.808191" ry="30.808191" transform="translate(210.904886 207.797071)" fill="rgba(210,219,237,0)" stroke-width="0"/></svg>`,
        '#11': `<svg id="eAIbe1sHOYm1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 300 300" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><path d="M24.24878,150C24.24878,79.46997,80.54952,22.29409,150,22.29409s125.75122,57.17588,125.75122,127.70591-56.30074,127.70591-125.75122,127.70591-125.75122-57.17588-125.75122-127.70591Z" opacity="0.96" fill="rgba(255,255,255,0)" stroke="#000" stroke-width="20"/><line x1="0" y1="-63.852955" x2="0" y2="63.852955" transform="matrix(-.707107 0.707107-1.328777-1.328777 150.000005 149.999994)" stroke="#020202" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/><line x1="0" y1="-63.852955" x2="0" y2="63.852955" transform="matrix(-.707107-.707107 1.330011-1.330011 150.078803 149.921208)" stroke="#020202" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/><ellipse rx="30.808191" ry="30.808191" transform="translate(210.904886 207.797071)" fill="rgba(210,219,237,0)" stroke-width="0"/></svg>`,
        '#1': `<svg id="eiU7aoF9RO41" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width='20' height = '20' viewBox="0 0 300 300" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><path d="M24.24878,150C24.24878,79.46997,80.54952,22.29409,150,22.29409s125.75122,57.17588,125.75122,127.70591-56.30074,127.70591-125.75122,127.70591-125.75122-57.17588-125.75122-127.70591Z" opacity="0.96" fill="rgba(255,255,255,0)" stroke="#000" stroke-width="20"/><ellipse rx="30.808191" ry="30.808191" transform="matrix(1.218635 0 0 1.218635 148.303547 150)" stroke="#000" stroke-width="20"/></svg>`,
        '#2': `<svg id="ePLihnCFNK01" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width='20' height = '20' viewBox="0 0 300 300" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><path d="M24.24878,150C24.24878,79.46997,80.54952,22.29409,150,22.29409s125.75122,57.17588,125.75122,127.70591-56.30074,127.70591-125.75122,127.70591-125.75122-57.17588-125.75122-127.70591Z" opacity="0.96" fill="rgba(255,255,255,0)" stroke="#000" stroke-width="20"/><ellipse rx="30.808191" ry="30.808191" transform="matrix(1.218635 0 0 1.218635 148.303547 150)" fill="rgba(210,219,237,0)" stroke="#000" stroke-width="20"/></svg>`,
        '#3': `<svg id="e5SAnh3wmR01" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width='20' height = '20' viewBox="0 0 300 300" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><path d="M24.24878,150C24.24878,79.46997,80.54952,22.29409,150,22.29409s125.75122,57.17588,125.75122,127.70591-56.30074,127.70591-125.75122,127.70591-125.75122-57.17588-125.75122-127.70591Z" opacity="0.96" fill="rgba(255,255,255,0)" stroke="#000" stroke-width="20"/><line x1="0" y1="-63.852955" x2="0" y2="63.852955" transform="matrix(0-1-.881338 0 150 150)" stroke="#020202" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/><line x1="0" y1="-63.852955" x2="0" y2="63.852955" transform="matrix(-1 0 0 0.881338 150.000005 150)" stroke="#020202" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/><ellipse rx="30.808191" ry="30.808191" transform="translate(210.904886 207.797071)" fill="rgba(210,219,237,0)" stroke-width="0"/></svg>`,
        '#4': `<svg id="eKOja9lwIe41" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width='20' height = '20' viewBox="0 0 300 300" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><path d="M24.24878,150C24.24878,79.46997,80.54952,22.29409,150,22.29409s125.75122,57.17588,125.75122,127.70591-56.30074,127.70591-125.75122,127.70591-125.75122-57.17588-125.75122-127.70591Z" opacity="0.96" fill="rgba(255,255,255,0)" stroke="#000" stroke-width="20"/><line x1="0" y1="-63.852955" x2="0" y2="63.852955" transform="matrix(0-1-.881338 0 150 150)" stroke="#020202" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/><ellipse rx="30.808191" ry="30.808191" transform="translate(210.904886 207.797071)" fill="rgba(210,219,237,0)" stroke-width="0"/></svg>`,
        '#5': `<svg id="eQNoIv7iwcU1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width='20' height = '20' viewBox="0 0 300 300" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><path d="M24.24878,150C24.24878,79.46997,80.54952,22.29409,150,22.29409s125.75122,57.17588,125.75122,127.70591-56.30074,127.70591-125.75122,127.70591-125.75122-57.17588-125.75122-127.70591Z" opacity="0.96" fill="rgba(255,255,255,0)" stroke="#000" stroke-width="20"/><line x1="0" y1="-63.852955" x2="0" y2="63.852955" transform="matrix(-.707107-.707107-.476916 0.476916 180.096695 180.452492)" stroke="#020202" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/><line x1="0" y1="-63.852955" x2="0" y2="63.852955" transform="matrix(.707107-.707107-.476916-.476916 119.547508 180.452492)" stroke="#020202" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/><line x1="0" y1="-63.852955" x2="0" y2="63.852955" transform="matrix(0 1-.95383 0 150 213.797063)" stroke="#020202" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/><line x1="0" y1="-63.852955" x2="0" y2="63.852955" transform="matrix(1 0 0 1.418299 150 115.856672)" stroke="#020202" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/><ellipse rx="30.808191" ry="30.808191" transform="translate(210.904886 207.797071)" fill="rgba(210,219,237,0)" stroke-width="0"/></svg>`,
        '#6': `<svg id="eNx3YK1RWBO1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width='20' height = '20' viewBox="0 0 300 300" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><path d="M24.24878,150C24.24878,79.46997,80.54952,22.29409,150,22.29409s125.75122,57.17588,125.75122,127.70591-56.30074,127.70591-125.75122,127.70591-125.75122-57.17588-125.75122-127.70591Z" opacity="0.96" fill="rgba(255,255,255,0)" stroke="#000" stroke-width="20"/><line x1="0" y1="-63.852955" x2="0" y2="63.852955" transform="translate(150 86.147045)" stroke="#020202" stroke-width="20"/><line x1="0" y1="-63.852955" x2="0" y2="63.852955" transform="matrix(-.707107-.707107-.680539 0.680539 104.849143 195.150857)" stroke="#020202" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/><line x1="0" y1="-63.852955" x2="0" y2="63.852955" transform="matrix(-.707107 0.707107-.681089-.681089 195.150857 195.150857)" stroke="#020202" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        '#7': `<svg id="exn2M65PkR41" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width='20' height = '20' viewBox="0 0 300 300" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><path d="M24.24878,150C24.24878,79.46997,80.54952,22.29409,150,22.29409s125.75122,57.17588,125.75122,127.70591-56.30074,127.70591-125.75122,127.70591-125.75122-57.17588-125.75122-127.70591Z" opacity="0.96" fill="rgba(255,255,255,0)" stroke="#000" stroke-width="20"/><line x1="0" y1="-63.852955" x2="0" y2="63.852955" transform="translate(150 86.147045)" stroke="#020202" stroke-width="20"/><line x1="0" y1="-63.852955" x2="0" y2="63.852955" transform="matrix(-.707107-.707107-.680539 0.680539 104.849143 195.150857)" stroke="#020202" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/><line x1="0" y1="-63.852955" x2="0" y2="63.852955" transform="matrix(.707107-.707107-.230492-.230492 164.717599 166.414053)" stroke="#020202" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/><ellipse rx="30.808191" ry="30.808191" transform="translate(202.869611 200.048371)" fill="rgba(210,219,237,0)" stroke="#000" stroke-width="20"/></svg>`,
        '#8': `<svg id="ex3Afg0GO5y1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width='20' height = '20' viewBox="0 0 300 300" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><path d="M24.24878,150C24.24878,79.46997,80.54952,22.29409,150,22.29409s125.75122,57.17588,125.75122,127.70591-56.30074,127.70591-125.75122,127.70591-125.75122-57.17588-125.75122-127.70591Z" opacity="0.96" fill="rgba(255,255,255,0)" stroke="#000" stroke-width="20"/><line x1="0" y1="-63.852955" x2="0" y2="63.852955" transform="translate(150 86.147045)" stroke="#020202" stroke-width="20"/><line x1="0" y1="-63.852955" x2="0" y2="63.852955" transform="matrix(-.707107-.707107-.680539 0.680539 104.849143 195.150857)" stroke="#020202" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/><line x1="0" y1="-63.852955" x2="0" y2="63.852955" transform="matrix(-.707107 0.707107-.396104-.396104 175.292426 176.98888)" stroke="#020202" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/><line x1="0" y1="-63.852955" x2="0" y2="63.852955" transform="matrix(.707107 0.707107 0.6232-.6232 200.584854 202.281308)" stroke="#020202" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/><ellipse rx="30.808191" ry="30.808191" transform="translate(210.904886 207.797071)" fill="rgba(210,219,237,0)" stroke-width="0"/></svg>`,
        '#9': `<svg id="eQFHwDrPJeL1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width='20' height = '20' viewBox="0 0 300 300" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><path d="M24.24878,150C24.24878,79.46997,80.54952,22.29409,150,22.29409s125.75122,57.17588,125.75122,127.70591-56.30074,127.70591-125.75122,127.70591-125.75122-57.17588-125.75122-127.70591Z" opacity="0.96" fill="rgba(255,255,255,0)" stroke="#000" stroke-width="20"/><line x1="0" y1="-63.852955" x2="0" y2="63.852955" transform="matrix(0 1-.973371 0 138.81135 120.658463)" stroke="#020202" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/><line x1="0" y1="-63.852955" x2="0" y2="63.852955" transform="matrix(0 1-.973371 0 138.81135 176.98888)" stroke="#020202" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/><line x1="0" y1="-63.852955" x2="0" y2="63.852955" transform="matrix(.707107-.707107-.366224-.366224 211.404885 127.615512)" stroke="#020202" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/><line x1="0" y1="-63.852955" x2="0" y2="63.852955" transform="matrix(.707107 0.707107 0.366224-.366224 211.404888 171.384487)" stroke="#020202" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/><ellipse rx="30.808191" ry="30.808191" transform="translate(210.904886 207.797071)" fill="rgba(210,219,237,0)" stroke-width="0"/></svg>`,
        '@': ` <svg id="eFT5q2AHyvY1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width='20' height = '20' viewBox="0 0 300 300" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><line x1="-82.285411" y1="0" x2="82.285411" y2="0" transform="matrix(1.093504 0 0 1.061635 150.17649 106.392135)" fill="none" stroke="#000" stroke-width="20" stroke-linecap="round"/><line x1="-82.285411" y1="0" x2="82.285411" y2="0" transform="matrix(1.093504 0 0 1.061635 150.17649 192.594874)" fill="none" stroke="#000" stroke-width="20" stroke-linecap="round"/><line x1="-82.285411" y1="0" x2="82.285411" y2="0" transform="matrix(.319473 0.380733-.766044 0.642788 252.780189 120.171269)" fill="none" stroke="#000" stroke-width="20" stroke-linecap="round"/><line x1="-82.285411" y1="0" x2="82.285411" y2="0" transform="matrix(.319473 0.380733-.766044 0.642788 47.219811 179.828731)" fill="none" stroke="#000" stroke-width="20" stroke-linecap="round"/><line x1="-82.285411" y1="0" x2="82.285411" y2="0" transform="matrix(.319473-.380733 0.766044 0.642788 47.219811 120.171269)" fill="none" stroke="#000" stroke-width="20" stroke-linecap="round"/><line x1="-82.285411" y1="0" x2="82.285411" y2="0" transform="matrix(.319473-.380733 0.766044 0.642788 252.780189 179.828731)" fill="none" stroke="#000" stroke-width="20" stroke-linecap="round"/></svg>`,
        '!': ``
    };

    var prevExp = document.getElementById('prevExp')
    var endExps = document.getElementById('endExps')
    var AllExp = document.getElementById('AllExp')

    if(!prevExp){
        prevExp = document.createElement('div')
        prevExp.id = 'prevExp'
        endExps = document.createElement('div')
        endExps.id = 'endExps'
        AllExp = document.createElement('AllExp')
        AllExp.id = 'AllExp'
    }

    let statementEntered = false;

    function updatePlaceholder() {
        if (statementEntered) {
            chatInput.placeholder = 'Enter an equivalent expression';
        } else {
            chatInput.placeholder = 'Enter an proof statement';
        }
    }

    // enter rules in box
    chatInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            const messageText = chatInput.value;
            // console.log(messageText)

            //check if empty
            if(messageText.trim().length === 0) {
                chatInput.value = '';
                return
            }
            
            //next expression
            if (statementEntered && !messageText.trim().startsWith('@')) {
                alert('All subsequent inputs must start with "@"');
                return;
            }

            //displaying message
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message');
            
            //format svg
            let formattedMessage = messageText;


            //check if rule exists to allow such action
            if(statementEntered){
                console.log('exp incoming')

                //first character is @, dont remove because need for expsNormalize

                //normalize
                let s
                try{
                    s = expsNormalize(formattedMessage.slice(0,formattedMessage.length)) 
                }catch{
                    console.log("could not normalize")
                    console.log(s)
                    return
                }

                //check if rule is provable
                //set up variables
                let newrule = '! ' + prevExp.innerText + ' @ ' + s + '\n'
                let parsed_newrule
                try{
                    parsed_newrule = pf.genRule(newrule)[0]
                }
                catch{
                    console.log("parsing error" )
                    alert(parsed_newrule)
                    return
                }

                //checking logic
                if(pf.isRule(parsed_newrule)){
                    console.log('1')                       
                }
                else if(pf.trim_and_check(parsed_newrule)){
                    console.log('2')
                }
                else{
                    console.log(parsed_newrule)
                    alert('cant generate expression')
                    return
                }


                //exist condition
                if(pf.Same(parsed_newrule.rightexps, endExps.innerText)){
                    alert('proof complete!')
                    return
                }
                else{
                    //assign prev
                    const nr = document.createElement('div')
                    nr.innerHTML = prevExp.innerText
                    AllExp.appendChild(nr)

                    prevExp.innerText = s
                    // console.log('valid expression!')
                }
                console.log('here')
            }
            else{
                console.log('statement incoming')

                try{
                    //remove the first character because it is '!'
                    const s = RuleNormalize(formattedMessage.slice(1,formattedMessage.length)) 
                    console.log(s)
                    let r = pf.genRule(s + '\n')[0]
                    console.log(r)

                    let flag = pf.isRule(r) 
                    console.log(pf)
                    // if rule already exists in database
                    if(flag){
                        alert('rule exists')
                        return
                    }
                    
                    prevExp.innerText = pf.ExpToString(r.leftexps) 

                    const nr = document.createElement('div')
                    nr.innerText = prevExp.innerText
                    AllExp.appendChild(nr)
                    endExps.innerText = r.rightexps
                }
                catch{
                    alert('rule syntax error');
                    return
                }
            }

            //switch string with svg
            for (const [key, svg] of Object.entries(svgMap)) {
                formattedMessage = formattedMessage.replace(new RegExp(key, 'g'), svg);
            }

            //display proof
            if (messageText.trim().startsWith('!')) {
                statementEntered = true;
                lastStatementDiv.innerHTML = `Proof Statement:   ${formattedMessage}`;
            }else{
                messageDiv.innerHTML = formattedMessage;
                messagesDiv.appendChild(messageDiv);
            }

            //clear inut box
            chatInput.value = '';
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
            updatePlaceholder();

        }
    });


    // Listen for keydown events to detect Ctrl+C
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'q') {
            // lastStatement = '';
            statementEntered = false;
            lastStatementDiv.textContent = '';
            messagesDiv.innerHTML = '';
            console.log("Last Statement cleared and StatementEntered set to false.");
        }
    });


    //delete prev rule btn
    delExpbtn.addEventListener('click', function() {

        // console.log(AllExp)
        if(AllExp.children.length > 0 && messagesDiv.children.length > 0){
            AllExp.removeChild(AllExp.lastChild);
            messagesDiv.removeChild(messagesDiv.lastChild);

            //re assign prevExp
            if(AllExp.lastChild){
                prevExp.innerText = AllExp.lastChild

            }
        }
        

    });
    //get all axioms btn
    Addbutton.addEventListener("click", function() {
        // const parser = Parser(AnalyseCode, ParseTokens)
        // const checker = new ProofAssistant(allaxioms, parser, [])
    
        while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        } 
        

        const output = document.getElementById('output');
        const messages = []

        for(const a of output.children){
            // console.log(a.innerHTML)
            messages.push(a.innerHTML)
        }
        
        messages.forEach(message => {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            
            // Create the main text element
            const textElement = document.createElement('div');
            textElement.textContent = message;
            // textElement.classList.add('text');
            
            // Create the expandable full text element
            const fullTextElement = document.createElement('div');
            fullTextElement.textContent = message;
            fullTextElement.classList.add('full-text');
            
            // Create the expand button
            const expandBtn = document.createElement('span');
            expandBtn.textContent = 'Show more';
            expandBtn.classList.add('expand-btn');

            expandBtn.addEventListener('click', function() {
                if (fullTextElement.classList.contains('show')) {
                    textElement.classList.remove('hide');
                    fullTextElement.classList.remove('show');
                    expandBtn.textContent = 'Show more';
                } else {
                    textElement.classList.add('hide')
                    fullTextElement.classList.add('show');
                    expandBtn.textContent = 'Show less';
                }
            });
            
            // Append elements to the cell
            cell.appendChild(textElement);
            cell.appendChild(fullTextElement);
            cell.appendChild(expandBtn);

            // Append cell to row
            row.appendChild(cell);
    
            // Append row to table body
            tableBody.appendChild(row);
        });
    });

    //clear axioms btn
    clearbutton.addEventListener("click", function() {
        const tableBody = document.getElementById('tableBody');
        // remove all child
        while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }        
    });

}
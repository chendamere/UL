import {UL_kernel} from "./UL_kernel.js";
import {Display} from "./Display.js"
import { Proof_Display } from "./Proof_Display.js";

var UL
var display;
var canvas;
var highlightCanvas;
const parsedChapters = []
const parsedProofs = []
var sub_section_index = {}

var chapterNames = [
    "Testing",
    "Testing",
    "Rules_of_Operators",
    // "Rules_of_Three_Fundamental_Relationships",
    // "Theorems_of_Relationship_of_Node_Null_Comparison",
    // "Theorems_of_Relationship_of_Node_Value_Comparison",
    // "Theorems_of_Relationship_of_Identical_Node_Comparison",
    // "Rules_of_Empty_Branch_Function",
    // "Swap_Theorems_of_the_Same_Operand",
    // "Theorems_of_Operators_and_Relationships",
    // "Next_Order_Induction",
    // "Recursive_Function_R(i)",
    // "Previous_Order_Induction",
    // "Recursive_Function_R_(i)",
    // "Rules_of_Node_Ring",
    // "Rules_of_Relationship_of_Node_Connectivity",
    // "Rules_of_Relationship_of_Node_Continuity",
    // "Rules_of_Relationship_of_Subnode",
    // "Tree_Order_Induction",
    // "Recursive_Function_Rc(i;j)",
    // "Rules_of_Number_Equal_Relationship",
    // "Rules_of_Number_More_Than_and_Less_Than_Relationship",
    // "Rules_of_Assign_Operator_in_Temporary_Space",
    // "Axioms_of_Assign_Operator",
    // "Theorems_of_Insert_Node_Function_Ins(t;j)",
    // "Theorems_of_Delete_Node_Function_Del(j)",
    // "Theorems_of_Assign_Operator",
    // "Function_Cpo(r)",
    // "Recursive_Function_Rcpo(i;r)",
    // "Addition",
    // "Next_Order_Induction",
    // "Recursive_Function_Rcpm(i;j;r)",
    // "Multiplication",
    // "Paradox",
]
window.addEventListener('load', function () {
    UL  = new UL_kernel();
    canvas = document.getElementById('UL_kernel');
    highlightCanvas = document.getElementById('highlight_canvas')
    

    init()
})


const Parse = async (path) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            //console.log(path)
            var ret = doGET(path).then(handleFileData)
            resolve(ret)
        });
    });
};


for(let i = 0; i <= chapterNames.length-1; i++){
    let ret = await Parse("./database/latex/" +chapterNames[i]+".tex")
    // console.log(parsedProofs, parsedChapters)
    parsedChapters.push(ret[0])
    parsedProofs.push(ret[1])
}
create_sections(parsedChapters)

let btns = document.getElementsByTagName("button")
for (var i = 0; i < btns.length; i++)
{
    if(btns[i].classList.contains("section-btn"))
        btns[i].onclick = function()
        {
            // console.log(this)
            document.getElementById("section-name").innerHTML = this.innerHTML
            let parent = (this.parentElement.parentElement.parentElement)
            document.getElementById("chapterName").innerText = parent.children[1].innerText            

            // console.log(this.innerHTML)
            
            init()         
        };
}   


function getMousePos(canvas, evt) {
    // console.log(canvas);
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };

}

// highlight
canvas.addEventListener("mousemove", function (evt) {
    var mousePos = getMousePos(canvas, evt);
    let ctx = document.getElementById("highlight_canvas").getContext("2d")

    if((display !== undefined || display !== null)){
        let allPos = display.exprPosition;
        for(const key in allPos){
            allPos = display.exprPosition;
            let [x0,y0,x1,y1,isHighlighted] = allPos[key]
            // console.log(ctx.canvas.style.zIndex,isHighlighted, mousePos)

            if((mousePos.x < x1 && mousePos.x > x0) && (mousePos.y < y1 && mousePos.y > y0)){
                if(!isHighlighted){
                    ctx.clearRect(x0, y0, ctx.canvas.width, ctx.canvas.height)
                    ctx.globalAlpha = 0.2;
                    ctx.fillStyle = "red";
                    ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
                    ctx.globalAlpha = 1.0;
                    (display.exprPosition[key])[4] = true;
                    ctx.canvas.style.zIndex = "2";
                    display.MouseUpdate(x1, y0);
                    break;
                }
            }

        }
    }
}, false);

//remove highlight
highlightCanvas.addEventListener("mousemove", function (evt) {
    var mousePos = getMousePos(highlightCanvas, evt);
    let ctx = document.getElementById("highlight_canvas").getContext("2d")

    if((display !== undefined || display !== null) && ctx.canvas.style.zIndex === "2"){
        let allPos = display.exprPosition;
        for(const key in allPos){
            allPos = display.exprPosition;
            let [x0,y0,x1,y1,isHighlighted] = allPos[key]
            // console.log(ctx.canvas.style.zIndex,isHighlighted, mousePos)

            if(isHighlighted){
                if(!((mousePos.x < x1 && mousePos.x > x0) && (mousePos.y < y1 && mousePos.y > y0)))
                {
                    ctx.clearRect(x0, y0, ctx.canvas.width, ctx.canvas.height)
                    ctx.canvas.style.zIndex = "0";
                    (display.exprPosition[key])[4] = false;    

                    break;
                }
            }
        }
    }
}, false);


function init() {

    console.log("window loaded")
    
    let htmlChapterName = document.getElementById("chapterName").firstChild.data
    let btnTitle = document.getElementById("section-name").innerHTML

    //extract subsection to parsed_strTable
    let add = false

    //reset stringtable
    UL.StringTable = []
    UL.subsectionsIndex = []
    UL.subsubsectionsIndex = []
    UL.proofString = []
    UL.proofTable = []
    let numSubSec = 0
    let numSubSubSec = 0

    // console.log(parsedChapters)
    for(let i = 0; i < parsedChapters.length; i++){

        let chapter = parsedChapters[i]
        let subsection = [];
        let subsubsection = [];
        let offset;
        let chapterFound = false;
        let subSectionFound= false;
        let index = 0;
        let j = 0;
        for(; j < chapter.length; j ++,index ++) {
            let line = chapter[j]

            //first detect chapter name

            if(line[0] === "@"){
                if(line.includes(htmlChapterName)){
                    chapterFound = true;
                }
            }
            offset = numSubSubSec+numSubSec+1
            if(line[0] === "#" && chapterFound){
                if(line.includes(btnTitle)){
                    UL.title = line.slice(1,line.length)
                    //detect section title
                    add = true
                    subSectionFound = true;
                    index = 0
                    continue
                }
                if(add){
                    //if already adding, then finished parsing section
                    break;
                }
            }
            else if(subSectionFound){
                if(line[0] === "%"){
                    numSubSubSec += 1
                    if(subsubsection.length===0){
                        subsubsection.push(line.slice(1,line.length))
                        subsubsection.push(index-(offset))    
                    }
                    else if(subsubsection.length===2){
                        subsubsection.push(index-(offset))
                        UL.subsubsectionsIndex.push(subsubsection)
                        subsubsection = []
                        subsubsection.push(line.slice(1,line.length))
                        subsubsection.push(index-(offset))
                    }
                    else{
                        console.log("parsing subsubsection error")
                    }
                }
                else if(line[0] === "$"){
                    numSubSec += 1
                    if(subsection.length===0){
                        //should -2 because chapter name and section name
                        subsection.push(line.slice(1,line.length))
                        subsection.push(index-(offset))
                        // console.log(line, subsection)

                    }
                    else if(subsection.length===2){
                        subsection.push(index-(offset))
                        UL.subsectionsIndex.push(subsection)
                        subsection = []
                        subsection.push(line.slice(1,line.length))
                        subsection.push(index-(offset))
                        // console.log(line, subsection, index, offset)

                    }
                    else{
                        console.log("parsing subsection error")
                    }
                }
                else if(add) {

                    UL.StringTable.push(line)
                }
            }

        }
        if(subSectionFound){
            //edge cases
            if(subsection.length === 2) {
                subsection.push(index-(offset))
                UL.subsectionsIndex.push(subsection)
                subsection = []
            }
            if(subsubsection.length === 2) {
                subsubsection.push(index-(offset))
                UL.subsubsectionsIndex.push(subsubsection)
                subsubsection = []
            }   
            break;
        }
    }

    // console.log(parsedProofs)
    for(let i = 0; i< parsedProofs.length; i++) {
        let line = (parsedProofs[i])[0]
        let list = []
        
        if(line.includes("@"))
        {
            let chapterName = document.getElementById("chapterName").innerText

            if(line.includes(chapterName))
            {
                for(let j = 1; j<parsedProofs[i].length;j++){
                    list.push((parsedProofs[i])[j])
                }
                UL.proofString = list
            }

        }            
    }
    // console.log(UL.proofString)

    // console.log(UL.subsectionsIndex,UL.subsubsectionsIndex)
    // console.log(parsedChapters)
    //display title
    document.title = UL.title
    document.getElementById('title').innerHTML = UL.title

    //reset highlight layer
    document.getElementById("highlight_canvas").getContext("2d").canvas.style.zIndex = "0"


    UL.init()
    display = new Display(UL, canvas)
    display.init()    
}


async function doGET(path) {
    const promise = new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", path);

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                // The request is done; did it work?
                if (xhr.status == 200) {
                    // ***Yes, use `xhr.responseText` here***
                    xhr.onload = () => {
                        resolve(xhr.responseText)
                    }
                } else {
                    // ***No, tell the callback the call failed***
                }
            }
        };
        
        xhr.send();
    })
    return promise;
}


function handleFileData(fileData) {

    let beginMath = false
    let beginProof = false;
    
    if (!fileData) {
        // Show error
        return;
    }
    const tempTable = []
    const proofTable = []
    const theorems = fileData.split('\n')
    let prev;
    for(const line of theorems) {
        // console.log(line)
        var parsed_line = ""

        if(line.includes("\\begin{math}")){
            beginMath = true
            continue
        }
        if(line.includes("\\end{math}")) {
            beginMath = false
            beginProof = false
            continue
        }

        parsed_line = line.replaceAll("\r","")
        let i = parsed_line.length-1
        let j = 0
        while(i > 0 && (parsed_line[i] === "\\" || parsed_line[i] === " ")){
            i--
        }
        while(j < parsed_line.length-1 && parsed_line[j] === " "){
            j++
        }
        parsed_line = parsed_line.slice(j,i+1)
        // console.log(parsed_line)

        if(parsed_line.includes("proof")) beginProof = true;

        if(parsed_line.length <= 1) {continue}
        else if((parsed_line.includes("\\[") && parsed_line.includes("\\]"))){
            tempTable.push(parsed_line)
        }
        else if(parsed_line.toLowerCase().includes("chapter")){
            parsed_line = parsed_line.replace("\\chapter","@").replace("{","").replace("}","")
            tempTable.push(parsed_line)
            proofTable.push(parsed_line);

            //console.log(parsed_line)
        }
        else if(parsed_line.toLowerCase().includes("subsubsection")){
            parsed_line = parsed_line.replace("\\subsubsection","%").replace("{","").replace("}","")
            tempTable.push(parsed_line)
        }
        else if(parsed_line.toLowerCase().includes("subsection")){
            parsed_line = parsed_line.replace("\\subsection","$").replace("{","").replace("}","")
            tempTable.push(parsed_line)
        }
        else if(parsed_line.toLowerCase().includes("section")){
            parsed_line = parsed_line.replace("\\section","#").replace("{","").replace("}","")
            tempTable.push(parsed_line)
        }
        else if(beginMath && beginProof){
            //add in \\[\\]

            proofTable.push(parsed_line);

        }
        prev = parsed_line;

    }
    //console.log(proofTable)
    return [tempTable,proofTable];
}

function create_sections(parsed_chapters){

    //section is list of section name 
    // get toc_ul
    var toc_ul = document.getElementById("toc-ul");

    for(let i = 0; i < parsed_chapters.length;i++) {
        let chapter = parsed_chapters[i]
        var drop_down;
        let chapterName=""
        //look for chapter name if not found return error
        for(let j = 0 ; j < chapter.length; j++ ) {
            let name = chapter[j]
            
            var span;
            var span2;
            //dectect chapter name
            if(name[0] === "@"){
                chapterName = name.slice(1,name.length)

                //create chapter name span 
                drop_down = document.createElement("div");
                drop_down.classList.add("dropdown")
            
                span = document.createElement("span")

            }

            //detect section name
            if(name[0] === "#"){

                //somehow section name cannot include &
                var sectionName = name.slice(1,name.length)

                if(span === undefined || drop_down ===undefined) {
                    console.log("chapter name not found!")
                }
                //create section name button
                var section = document.createElement("div");
                section.classList.add("dropdown-content")
                section.style.visibility = "hidden"
                section.style.display = "none"
            
                var button = document.createElement("button");
                button.innerText = sectionName;
                button.classList.add("center")
                button.classList.add("section-btn")
                section.appendChild(button)

                //append to chapter span
                span.appendChild(section)

                sub_section_index[sectionName] = String(i) + "_" + String(j)
            }
        }
        let testBtn = document.createElement("button")
        testBtn.innerText = chapterName
        testBtn.onclick = function(){
            //get css of span 

            let spanChildren = this.parentElement.children[2].children
            let icon = this.parentElement.children[0]
            for(let i = 0; i < spanChildren.length; i++){
                if(spanChildren[i].style.visibility === "hidden"){
                    spanChildren[i].style.visibility = "visible"
                    spanChildren[i].style.display = "block"
                    icon.style.transform = "rotate(-90deg)"                    
                }
                else if(spanChildren[i].style.visibility === "visible"){ 
                    spanChildren[i].style.visibility = "hidden"
                    spanChildren[i].style.display = "none"
                    icon.style.transform = "rotate(0deg)"
                }
            }
        }
        testBtn.classList.add("chapter-btn")
        var icon = document.createElement("i")
        icon.classList.add("fa")
        icon.classList.add("fa-caret-down")
        drop_down.appendChild(icon)
        drop_down.appendChild(testBtn)
        drop_down.appendChild(span)
    
        if(drop_down === undefined) {
            console.log("no chapter!")
        }
        var li = document.createElement("li")
        li.classList.add("align-left")
        li.appendChild(drop_down)
        toc_ul.appendChild(li)
    }
}

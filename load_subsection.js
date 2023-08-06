import {UL_kernel} from "./UL_kernel.js";
import {Display} from "./Display.js"

var UL = new UL_kernel();
var display;
const canvas = document.getElementById('UL_kernel');

// window.onload = function(){
//     // init()
// }

window.addEventListener('load', function () {
    init()

})

const asyn_subsection = async (path) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            //console.log(path)
            var ret = doGET(path).then(handleFileData)
            resolve(ret)
        });
    });
};

const test_asyn_subsection = async (path) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            //console.log(path)
            var ret = doGET(path).then(test_parsing)
            resolve(ret)
        });
    });
};

function test_parsing(fileData){
    
    if(!fileData){
        return;
    }
    return fileData
}


var chapterNames = [
    "Testing",
    "Rules_of_Operators",
    "Rules_of_Three_Fundamental_Relationships",
    "Theorems_of_Relationship_of_Node_Null_Comparison",
    "Theorems_of_Relationship_of_Node_Value_Comparison",
    "Theorems_of_Relationship_of_Identical_Node_Comparison",
    "Rules_of_Empty_Branch_Function",
    "Swap_Theorems_of_the_Same_Operand",
    "Theorems_of_Operators_and_Relationships",
    "Next_Order_Induction",
    "Recursive_Function_R(i)",
    "Previous_Order_Induction",
    "Recursive_Function_R_(i)",
    "Rules_of_Node_Ring",
    "Rules_of_Relationship_of_Node_Connectivity",
    "Rules_of_Relationship_of_Node_Continuity",
    "Rules_of_Relationship_of_Subnode",
    "Tree_Order_Induction",
    "Recursive_Function_Rc(i;j)",
    "Rules_of_Number_Equal_Relationship",
    "Rules_of_Number_More_Than_and_Less_Than_Relationship",
    "Rules_of_Assign_Operator_in_Temporary_Space",
    "Axioms_of_Assign_Operator",
    "Theorems_of_Insert_Node_Function_Ins(t;j)",
    "Theorems_of_Delete_Node_Function_Del(j)",
    "Theorems_of_Assign_Operator",
    "Function_Cpo(r)",
    "Recursive_Function_Rcpo(i;r)",
    "Addition",
    "Next_Order_Induction",
    "Recursive_Function_Rcpm(i;j;r)",
    "Multiplication",
    "paradox",
]

const parsedChapters = []
var sub_section_index = {}

for(let i = 0; i <= chapterNames.length-1; i++){
    parsedChapters.push(await asyn_subsection("./database/latex/" +chapterNames[i]+".tex"))
}
// console.log(parsedChapters)

// var testText = await test_asyn_subsection("./test.txt")
// var latexText = await test_asyn_subsection("./latex.tex")

create_sections(parsedChapters)

// let htmlChapterNames;

let btns = document.getElementsByTagName("button")
for (var i = 0; i < btns.length; i++)
{
        btns[i].onclick = function()
        {
            document.getElementById("section-name").innerHTML = this.innerHTML
            let parent = (this.parentElement.parentElement.parentElement)
            document.getElementById("chapterName").innerText = parent.firstChild.data
            console.log(parent.firstChild.data)
            console.log(this.innerHTML)
            
            init()         
        };
}


function init() {

    console.log("window loaded")
    // console.log(testText)
    
    //let parsed_strTable
    let htmlChapterName = document.getElementById("chapterName").firstChild.data
    // console.log(htmlChapterName)
    let btnTitle = document.getElementById("section-name").innerHTML

    //extract subsection to parsed_strTable
    let add = false

    //reset stringtable
    UL.StringTable = []
    UL.subsectionsIndex = []
    UL.subsubsectionsIndex = []
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
                // console.log(line)
                if(line.includes(btnTitle)){
                    // console.log(line)
                    UL.title = line.slice(1,line.length)
                    //detect section title
                    add = true
                    subSectionFound = true;
                    index = 0
                    continue
                }
                if(add){
                    // console.log("break")
                    //if already adding, then finished parsing section
                    break;
                }
            }
            else if(subSectionFound){
                if(line[0] === "%"){
                    // console.log(line,subsubsection)
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
                    // console.log(numSubSubSec,numSubSec)
                    numSubSec += 1
                    if(subsection.length===0){
                        //should -2 because chapter name and section name
                        subsection.push(line.slice(1,line.length))
                        subsection.push(index-(offset))
                        console.log(line, subsection)

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
                    //console.log("here")
                    // console.log(line)
                    UL.StringTable.push(line)
                }
            }
            else{
                //console.log("not found")
            }
        }
        if(subSectionFound){
            //edge cases
            if(subsection.length === 2) {
                // console.log(subsection)
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

    // console.log(UL.subsectionsIndex,UL.subsubsectionsIndex)
    // console.log(parsedChapters)
    //display title
    document.title = UL.title
    document.getElementById('title').innerHTML = UL.title

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
                    //var a = callback(xhr.responseText);                        
                } else {
                    // ***No, tell the callback the call failed***
                    //callback(null);
                }
            }
        };
        
        xhr.send();
    })
    return promise;
}


function handleFileData(fileData) {
    //console.log("handling data")

    let beginMath = false
    
    if (!fileData) {
        // Show error
        return;
    }
    const tempTable = []
    const theorems = fileData.split('\n')
    // console.log(theorems)
    for(const line of theorems) {
        // console.log(line)
        var parsed_line = ""

        if(line.includes("\\begin{math}")){
            beginMath = true
            continue
        }
        if(line.includes("\\end{math}")) {
            beginMath = false
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
        //console.log(parsed_line)

        if(parsed_line.length <= 1) {continue}
        else if((parsed_line.includes("\\[") && parsed_line.includes("\\]"))){
            tempTable.push(parsed_line)
        }
        else if(parsed_line.toLowerCase().includes("chapter")){
            parsed_line = parsed_line.replace("\\chapter","@").replace("{","").replace("}","")
            tempTable.push(parsed_line)
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
        else if(beginMath){
            //add in \\[\\]
            // parsed_line = "\\[" + parsed_line + "\\]"
            // tempTable.push(parsed_line)
        }
        else {continue}

    }
    //console.log("done")
    // console.log(tempTable)
    return tempTable;
}

function create_sections(parsed_chapters){

    //section is list of section name 
    // get toc_ul
    var toc_ul = document.getElementById("toc-ul");

    for(let i = 0; i < parsed_chapters.length;i++) {
        let chapter = parsed_chapters[i]
        var drop_down;
        //look for chapter name if not found return error
        for(let j = 0 ; j < chapter.length; j++ ) {
            let name = chapter[j]
            
            //console.log(name)
            var span;
            var span2;

            let chapterName = ""

            //dectect chapter name
            if(name[0] === "@"){
                chapterName = name.slice(1,name.length)
                //console.log(chapterName)

                //create chapter name span 
                drop_down = document.createElement("div");
                drop_down.classList.add("dropdown")
            
                span = document.createElement("span")
                span2 = document.createElement("span")
                span2.innerText = chapterName                
            }

            //detect section name
            if(name[0] === "#"){

                //somehow section name cannot include &
                var sectionName = name.slice(1,name.length)
                // console.log(sectionName)

                if(span === undefined || span2 === undefined || drop_down ===undefined) {
                    console.log("chapter name not found!")
                }
                //create section name button
                var section = document.createElement("div");
                section.classList.add("dropdown-content")
            
                var button = document.createElement("button");
                button.innerText = sectionName;
                button.classList.add("center")

                section.appendChild(button)

                //append to chapter span
                span.appendChild(section)
                span2.appendChild(span)
                drop_down.appendChild(span2)

                sub_section_index[sectionName] = String(i) + "_" + String(j)
            }
        }
    
    
        if(drop_down === undefined) {
            console.log("no chapter!")
        }
        var li = document.createElement("li")
        li.classList.add("align-left")
        li.appendChild(drop_down)
        toc_ul.appendChild(li)
    }
}

import {UL_kernel} from "./UL_kernel.js";
import {Display} from "./Display.js"

var UL = new UL_kernel();
var display;
const canvas = document.getElementById('UL_kernel');


// const subsection = document.getElementById("subsection-name")

const asyn_subsection = async (path) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(path)
            var ret = doGET(path).then(handleFileData)
            resolve(ret)
        });
    });
};


// const subsectionName = subsection.innerHTML
// console.log(subsectionName)
// var path = "./database/txt/" + subsectionName + ".txt"

// const rule_of_operator = await doGET(path).then(handleFileData)

// "Rules_of_Relationship_of_Node_Connectivity",
// "Rules_of_Continuity",
// "Rules_of_Subnode",
// "Rules_of_Three_Fundamental_Relationships",
// "Swap_Theorems_of_the_Same_Operand",
// "Theorems_of_Assign_Operator",
// "Theorems_of_Insert_Node_Function_Del(j)",
// "Theorems_of_Insert_Node_Function_Ins(t;j)",
// "Theorems_of_Operators and Relationships",
// "Theorems_of_Relationship_of_Identical_Node_Comparison",
// "Theorems_of_Relationship_of_Node_Null_Comparison",
// "Theorems_of_Relationship_of_Node_Value_Comparison",
// "Tree_Order_Induction"
// "Axioms_of_Assign_Operator",
// "Function_Cpo(r)",
// "Multiplication",
// "Next_Order_Induction",
// "paradox",
// "Previous_Order_Induction",
// "Recursive_Function_R_(i)",
// "Recursive_Function_R(i)",
// "Recursive_Function_Rc(i;j)",
// "Recursive_Function_Rcpm(i;j;r)",
// "Recursive_Function_Rcpo(i;r)",
// "Rules_of_Assign_Operator_in_emporary_Space",
// "Rules_of_Empty_Branch_Function",
// "Rules_of_Node_Ring",
// "Rules_of_Number_Equal_Relationship",
// "Rules_of_Number_More_Than_and_Less_Than_Relationship",

var chapterNames = [
    "Rules of Operators",
    "Addition",
    "Next Order Induction",
]

const parsedChapters = []
var sub_section_index = {}

for(let i = 0; i <= chapterNames.length-1; i++){
    parsedChapters.push(await asyn_subsection("./database/latex/" +chapterNames[i]+".tex"))
}
console.log(parsedChapters)
create_sections(parsedChapters)

let btns = document.getElementsByTagName("button")
    console.log(btns)
    for (var i = 0; i < btns.length; i++)
    {
        btns[i].onclick = function()
        {
            document.getElementById("section-name").innerHTML = this.innerHTML
            console.log(this.innerHTML)
            console.log(document.getElementById("section-name").innerHTML)

            init()            
        };
}


function init() {

    console.log("window loaded")
    
    //UL.StringTable = rule_of_operator
    //let parsed_strTable

    let btnTitle = document.getElementById("section-name").innerHTML

    //extract subsection to parsed_strTable
    let add = false

    UL.StringTable = []
    for(let i = 0; i < parsedChapters.length; i++){

        let chapter = parsedChapters[i]
        for(let j = 0; j < chapter.length; j ++) {
            let line = chapter[j]
            // console.log(line)
            if(line[0] === "#"){
                //console.log(line,btnTitle)
                if(line.includes(btnTitle)){
                    UL.title = line.slice(1,line.length)
                    //console.log(UL.title)
                    //detect section title
                    add = !add
                    continue
                }
                if(add){
                    console.log("break")
                    //if already adding, then finished parsing section
                    break;
                }
            }
            if(add) {
                //console.log("here")
                UL.StringTable.push(line)
            }
            // console.log(ChapterTitle,btnTitle)
            // if(line.includes(btnTitle)){
            //     //console.log(Chapter)
            //     parsed_strTable = get_title(chapter)
            // }
        }
    }
    //console.log(UL.StringTable)

    // if(parsed_strTable === undefined) {
    //     return
    // }    
    // UL.title = parsed_strTable[0]
    // UL.StringTable = parsed_strTable[1]

    // console.log(UL.title, UL.StringTable)


    //display title
    document.title = UL.title
    document.getElementById('title').innerHTML = UL.title

    UL.init()
    display = new Display(UL, canvas)

    
}

function get_title(stringTable){
    for(let i = 0; i <= stringTable.length - 1; i++){
        if(String(stringTable[i]).includes("@")){
            // console.log(stringTable[i].slice(1, stringTable[i].length))
            let retTitle = stringTable[i].slice(1, stringTable[i].length)
            retTitle = retTitle.replaceAll("_"," ")
            console.log(retTitle)
            //first is title second is sliced stringtable
            return [retTitle, stringTable.slice(i+1,stringTable.length)]
        }
    }
    return stringTable
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
    console.log("handling data")

    let beginMath = false
    
    if (!fileData) {
        // Show error
        return;
    }
    const tempTable = []
    const theorems = fileData.split('\n')
    //console.log(theorems)
    for(const line of theorems) {
        // console.log(line.length)
        var parsed_line = ""

        if(line.includes("\\begin{math}")){
            beginMath = true
            continue
        }
        if(line.includes("\\end{math}")) {
            beginMath = false
            continue
        }
        //parsed_line = line.replaceAll("\\","")

        //console.log(parsed_line.toLowerCase())
        parsed_line = line
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

        if(parsed_line.length <= 1) {continue}
        else if((parsed_line.includes("\\[") && parsed_line.includes("\\]"))){
            tempTable.push(parsed_line)
        }
        else if(parsed_line.toLowerCase().includes("chapter")){
            parsed_line = parsed_line.replace("\\chapter","@").replace("{","").replace("}","")
            tempTable.push(parsed_line)
            //console.log(parsed_line)
        }
        // else if(parsed_line.toLowerCase().includes("subsubsection")){
        //     parsed_line = parsed_line.replace("\\subsubsection","%").replace("{","").replace("}","")
        //     tempTable.push(parsed_line)
        // }
        // else if(parsed_line.toLowerCase().includes("subsection")){
        //     parsed_line = parsed_line.replace("\\subsection","$").replace("{","").replace("}","")
        //     tempTable.push(parsed_line)
        // }
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
    console.log("done")
    // for(const o of theorems) {
    //     console.log(o, o.length)
    // }
    return tempTable;
}

function create_sections(parsed_chapters){

    //section is list of section name 
    // get toc_ul
    var toc_ul = document.getElementById("toc-ul");
    //console.log(toc_ul)

    for(let i = 0; i < parsed_chapters.length;i++) {
        let chapter = parsed_chapters[i]
        //console.log(chapter)
        var chapterName = ""

        var drop_down;
        //look for chapter name if not found return error
        for(let j = 0 ; j < chapter.length; j++ ) {
            let name = chapter[j]
            
            //console.log(name)
            var span;
            var span2;

            //dectect chapter name
            if(name[0] === "@"){
                chapterName = name.slice(1,name.length)
                //console.log(chapterName)

                //create chapter name span 
                drop_down = document.createElement("div");
                drop_down.classList.add("dropdown")
            
                span = document.createElement("span")
                span2 = document.createElement("span")
                span2.innerHTML = chapterName                
            }

            //detect section name
            if(name[0] === "#"){
                var sectionName = name.slice(1,name.length)
                //console.log(sectionName)

                if(span === undefined || span2 === undefined || drop_down ===undefined) {
                    console.log("chapter name not found!")
                }
                //create section name button
                var section = document.createElement("div");
                section.classList.add("dropdown-content")
            
                var button = document.createElement("button");
                button.innerHTML = sectionName;
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
        li.appendChild(drop_down)
        toc_ul.appendChild(li)
    }
}

window.onload = init
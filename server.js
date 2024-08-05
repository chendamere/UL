import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import rules from './routes/router.js';
import logger from './middleware/logger.js';
import errorHandler from './middleware/error.js';
import notFound from './middleware/notFound.js';  

import AnalyseCode from './public/js/UL_Interpreter/lexer-analyser.js'
import ParseTokens from './public/js/UL_Interpreter/parser-analyser.js';
import {LatexChapters, Parser, LatexExps, Parse_rules_and_titles} from './public/js/UL_Interpreter/latex-chapters.js';
import ProofAssistant from './public/js/UL_Interpreter/ProofAssistant.js'
import ReadFiles from './public/js/UL_Interpreter/fileReader.js'
import {getData, getAllData, updateData, createData, deleteData, deleteAllData} from './database.js'



const port = process.env.PORT || 8000;

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//set view engine
app.set('view engine', 'ejs')


//home
app.get('/', (req,res) => { 
    res.render("index")
})

//demo
app.get('/demo', (req,res) => { 
    res.render("demo")
})

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logger middleware
app.use(logger);

// setup static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/rules', rules);
app.use('/api/theorems', rules);

// Error handler
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port ${port}`));


//set up theorem prover stuff
const parser = Parser(AnalyseCode, ParseTokens)
const fs = ReadFiles(Parse_rules_and_titles)
const allaxioms = LatexChapters(fs, './public/js/UL_Interpreter/axiom', parser)
const alltheorems_exps = LatexExps(fs, './public/js/UL_Interpreter/theorems')
// console.log(allaxioms)
// await deleteAllData()
// const database = await getAllData()
// let ret = []
// const checker = new ProofAssistant(ret, parser, alltheorems_exps)
// updateDatabase(checker, database)
// // checker.PrintAllRules()
// //

// function updateDatabase(checker, database) {

//   for(const o of database) {
//       let s = '!'+ o.contents + "\n"
//       let [p] = parser(s)
//       checker.allrules.push(p)
//   }
  
//    for(const l of allaxioms) {
//       if(!checker.isRule(l))
//       {
//           const news = checker.RuleToString(l)
//           const newr = createData(news)
//       }
      
//   }
  
// }
//server has proof assisstant that pushes to database when proof is accepted.
//user also has proof assisstant; if its database is a subset of the server database, then
//any statement user accept is also accepted by server

//everytime server starts up, add any axiom and rules that are absent in database

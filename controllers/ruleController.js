

import {getData, getAllData, updateData, createData, deleteData, deleteAllData} from '../database.js'

// Get all Rules
//  GET /api/Rules
export async function getRules(req, res, next) {
  const limit = parseInt(req.query.limit);
  if (!isNaN(limit) && limit > 0) {
    return res.status(200).json(req.slice(0, limit));
  }

  const rules = await getAllData()

  res.status(200).json(rules);
};

// Get single Rule
// GET /api/Rules/:id
export async function getRule(req, res, next) {
  const id = parseInt(req.params.id);
  const Rule = await getData(id)

  //a list
  // console.log(Rule)

  if (!Rule) {
    const error = new Error(`A Rule with the id of ${id} was not found`);
    error.status = 404;
    return next(error);
  }

  res.status(200).json(Rule);
};

//  Create new rule
//  rule /api/rules
export async function createRule(req, res, next){

  const {contents} = req.body
  
  //provide valid proof then can add rule

  const newRule = await createData(contents);

  if (!newRule) {
    const error = new Error(`Please include contents!`);
    error.status = 400;
    return next(error);
  }

  res.status(201).json(newRule);
};

// Update Rule
// PUT /api/Rules/:id
export async function updateRule(req, res, next){
  const id = parseInt(req.params.id);
  const newContents = req.params.contents
  const newRule = await updateData(id, newContents)

  if (!newRule) {
    const error = new Error(`A Rule with the id of ${id} was not found`);
    error.status = 404;
    return next(error);
  }

  res.status(200).json(newRule);
};

// Delete Rule
// DELETE /api/Rules/:id
export async function deleteRule(req, res, next){
  const id = parseInt(req.params.id);
  const Rule = await deleteData(id);

  if (!Rule) {
    const error = new Error(`A Rule with the id of ${id} was not found`);
    error.status = 404;
    return next(error);
  } 
  res.status(200).json(Rule);
};


export async function deleteAllRules(req, res, next){

  const Rule = await deleteAllData();

  res.status(200).json(Rule);
};

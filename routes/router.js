import express from 'express';
import {
  getRules,
  getRule,
  createRule,
  updateRule,
  deleteRule,
  deleteAllRules,
} from '../controllers/ruleController.js';


const router = express.Router();

// Get all rules
router.get('/', getRules);

// Get single rule
router.get('/:id', getRule);

// On getting a 

// Create new rule
router.post('/', createRule);

// Update rule
router.put('/:id', updateRule);

// Delete rule
router.delete('/:id', deleteRule);

router.delete('/', deleteAllRules)


export default router;

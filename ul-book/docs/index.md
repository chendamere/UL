# Universal Language
Universal Language (UL) is a formal programming language developed by Weili Chen, it is a theoretical language invented for machines to reason and infer properties of data-structure.


## 1. Data Struture
UL as a programming language assumes a specific kind of graph as its data-strucuture, understanding the data-strucuture will help with understanding what proofs entail.
The data-strucuture constist of non-intersecting cyclical graphs with exactly one unique null node for each cycle. Each node contains an unique-id, a value, as well as edges that points to the next, 
the previous, and the child node associate with the node. 

## 2. Syntax
To manipulate data-strucutre, UL defines a set of primitive operations, with pointers as operands. 

* Create a new operand j. j points to a child of the node pointed by i.
* Create a new operand j. i and j point to the same node.
* Create a new operand pointing to a temporary newly allocated data structure. The data value of the node pointed to is the id of the new node.
* Compare the value of the node pointed to by i with the value of the node pointed to by j. If equal code A runs, otherwise code B runs.
* Create a new operand i, pointing to a unique global data structure.
* Create a new operand, pointing to a temporary newly allocated data structure.
* Point to next node.
* Point to previous node.
* Insert a new node or delete a non-empty node.
* Logical error.

## 3. Expression and Rule

An expression is a sequence of operations, a rule is a statement consists of two expressions. The formal system part of UL consists of a set of definitions, axioms, and deduction rules. In UL, every
statement is also a rule, a rule is an equivalence relation. Intuively, every statement in Ul has the form "'code A' is equivalent to 'code B'". 


There are 3 ways to produce new statements. The first two follows from the properties of equivalence relation (commutativity and transitivity). The last one, the insertion rule, allows new statements to be formed
if all previous and subsequent subexpressions of the new expressions are the same. 

When generating statements with deduction rule, operands appearing in the statements are bounded within the statement, but treated as arbiturary when applied in the deduction steps. Meaning the statements ",1 #3 2, <>, 3 #3 4," and ",2 #3 3, <>, 4 #3 5," are the same.

## 4. Axioms 

Axioms are rules we accept in the language as truths. They are rules that reflect the basic properties of the primitive operations, and should be consistent with common programming patterns. 

The first set of axiom describe commutative properties between all primitive operation pairs. Generally, it is true when two primitive operations operates on distinct operands, the operations have no effect on one another. From this result we can assume that
if we assume distinct operands, when defining a new sequence of operations, there exist a commutative rule between the sequence and all other operators.

# Universal Language
Universal Language (UL) is a theoretical programming language developed by Weili Chen, it is defined by the formal system in the book The Way Of Machine Thinking. The UL formal system defines properties of data-strctures, and serve as a framework for 
defining mathematics using the language of data-struture. The purpose is to form mathematical concepts from a basic understanding of the UL as a programming language, so that all mathematical concepts are formed in an enviroment with complete sementic 
understanding. The goal of this project is to demonstrate that it is possible for machines to think and reason about mathematics without the need for additional interpretation. So what? Automated Theorem Provers have existed since 1950s, what is
so different between UL and the typed-lambda calculus frame-work? Firstly, expert systems are more of a tool to encode encode concepts as types, but the system have no sementic understanding of such type, in UL, every statement is reducible to contain only primitive operations on data-structures, 
so there is no need for defining additional relationships, because they can be proved just from definitions. Similar definitions becomes self evident because they only require basic rules to prove inductively. Secondly, UL does not contain propositional variables as its necessary definitions. That might sound strage, but the reason for this is to avoid the pitfalls of constructing impredicative propositions and introduce inconsistency. In this way, UL-propositions are expressed as branch operations, equivalent to if-else statement in a standard programming language. So even without propositional variables, every proposition is definable in UL, even impredicative ones. Propositions are essential for forming higher concepts like those about natural numbers.


## 1. Data Struture
UL as a programming language assumes a specific kind of graph for its data-strucuture, understanding the data-strucuture will help with understanding what proofs entail.
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


## 5.Propositions and Logical Inconsistency

We have mentioned earlier that UL does not have a tranditional propositional system, so how do we express logical inconsistency within the formal system? To do this, we designate a specific rule to represent inconsistency:
", <>, x,"
Which is equivalent to saying empty code is equivalent to error exception, and any newly introduced-definitions that is able to prove such rule with pre-existing rules are said to be incompatible with the system. One is able to 
reason to intuively if a certain rule can never produce the inconsistency just through syntax, but such theory is not defined formally within UL. 

## 6.Imrepdicative Propositions 

## 7. Induction

## 8. Limitations
Some rules are not provable, and UL can never prove that it is un-provable. This is most evident when considering between impredicative relations and predicative ones, or between terminating recursive functions and non-terminating ones.
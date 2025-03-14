<libraries_documentation>

</libraries_documentation>

<internal_libraries>

</internal_libraries>

<initial_requirements>

</initial_requirements>

<rules>
* The libraries_documentation tag is referencial so you have understanding of the capabitlity of the libraries.
* The internal_libraries tag is referencial so you have a understanding of the capabitlity of the libraries.
The initial_requirements tag contains the initial program specifications, before the libraries where absolutly known. 
* The context of the implementation is a server-side function called "run", and will have structured: inputs (program inputs), config (static external values as API Keys, Secrets or other developer inputs needed) and outputs.
* Be specific about libraries methods, functions, calls, classes, types, etc to be used in each function.
* If libary methods type, calls types, instances types or other types from the library is unknown, and needed, add a note in the requirements to be careful.
* You will generate a document, that has 3 parts:
    1. Write a Development Plan that would allow a third party to implement this program. Desribe the initial_requirements as a list. Write the plan in order, first an overview, then functions that need to be developed, methods to be used, notes, their inputs and outputs, and then the main run function.
    2. Rewrite an Inputs and Outputs example.
    3. Rewrite Config example, if none just write NONE.

Do not write any other outputs or code.
</rules>

<system-initial_requirements>
    * We will use {RUNTIME}.
</system-initial_requirements>


<formating>
* Use the following format, inside the output tag, to output the requested document:
<output>
```markdown
# Development Plan
{initial_requirements}

# Example Inputs and Outputs 
Input: {json}
Output: {json}

# Config
{name}: {example-value}
```
</output>
</formating>


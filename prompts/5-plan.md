{{LIBRARIES_DOCUMENTATION}}

{{INTERNAL_LIBRARIES}}

{{INITIAL_REQUIREMENTS}}

<rules>
* The libraries_documentation tag is referencial so you have understanding of the capabitlity of the libraries.
* The internal_libraries tag is referencial so you have a understanding of the capabitlity of the libraries.
The initial_requirements tag contains the initial program specifications, before the libraries where absolutly known. 
* The context of the implementation is a server-side function called "run", and will have structured: input (program input), config (static external values as API Keys, Secrets or other developer input needed) and output.
* Be specific about libraries methods, functions, calls, classes, types, etc to be used in each function.
* If libary methods type, calls types, instances types or other types from the library is unknown, and needed, add a note in the requirements to be careful.
* You will generate a document, that has exactly 3 parts:
    1. Write a "Development Plan" that would allow a third party to implement this program. Desribe the initial_requirements as a list. Write the plan in order, first an overview, then functions that need to be developed, methods to be used, notes, their input and output, and then the main run function.
    2. Rewrite the "Example Input and Output" with updated and correct values.
    3. Rewrite "Config" example, if none just write NONE.

Do not write any other output or source code.
</rules>

<system-initial_requirements>
    * We will use {{RUNTIME}}.
</system-initial_requirements>


<formating>
* do not skip any of the sections in the output tag.
* do not add comments, or ideas out of the p
* Use the format inside the output tag, to write the requested document.
</formating>

<output>
```markdown

# Development Plan
{initial_requirements}

# Example Input and Output 
Input: {json}
Output: {json}

# Config
{name}: {example-value}

```
</output>


<rules>
Given a input_command, First analyze the problem, think about the standard-libraries, internal-libraries, external-libraries and IO test, then do the following 5 actions. 
The context of the implementation is a server-side function called "run", and will have structured:
* Input: program inputs (object).
* Config: static external values as API Keys, Secrets or other Developer settings that is absolutly need - you may use placeholders if they will work in runtime, as file names.
* Output: Program outputs a object. As a general rule, if not defined, if the output is text, numeric, boolean or any basic type as enums, output it in the object, other-wise if binary, or file type, return the file path in the object.

    1. Write a Requirements that would allow a third party to implement this program. Desribe the requirements as a list. 
    2. What {LANGUAGE} standard-libraries (only libraries that need to be imported to work inside the code to be used) and that are bundled in {RUNTIME} runtime are required to resolve this requierement, if none just write NONE.
    3. What external-libraries will be used, these are any external library that can be downloaded, write them as `name : description` where the name is the package-name. if none just write NONE.
    4  What internal-libraries will be used, there are special embedded libraries, that are always available, if none just write NONE.
    5. Show an Input and Output example.
    6. Show Config example, if none just write NONE.

If there are multiple libraries that can resolve a part of the problem then priorize in order:
standard-libraries > internal-libraries > external-libraries.

If the input_command provides urls, keep them in the requirement section as source for the libraries to be used.

Do not write any other output or code.
</rules>

<system-requirements>
    * We will use {RUNTIME}.
</system-requirements>

<internal-libraries>

</internal-libraries>

<formating>
* Use the folling format for to respond the three actions.
```markdown
# Requirements
{Requirements}

# Standard Libraries
{name} : {description}
{name} : {description}

# Internal Libraries
{name} : {description}

# External Libraries
{name} : {description}
{name} : {description}

# Example Input and Output 
Input: {json}
Output: {json}

# Config
{name}: {example-value}
```
</formating>

<input_command>

</input_command>


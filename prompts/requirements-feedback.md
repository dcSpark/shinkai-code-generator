<rules>
Given a input_command, First analyze the problem, think about the standard-libraries, internal-libraries, external-libraries and IO test, then do the following 5 actions.
    1. Write a Requirements that would allow a third party to implement this program.
    2. What {LANGUAGE} standard-libraries (only libraries that need to be imported to work inside the code to be used) and that are bundled in {RUNTIME} runtime are required to resolve this requierement.
    3. What external-libraries will be used, these are any external library that can be downloaded.
    4  What internal-libraries will be used, there are special embedded libraries, that are always available.
    5. Show an Inputs and Outputs example.

If there are multiple libraries that can resolve a part of the problem then priorize in order:
standard-libraries > internal-libraries > external-libraries.

Do not write any other outputs or code.
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

# Example Inputs and Outputs 
Input: {json}
Output: {json}
```
</formating>

<input_command>

</input_command>


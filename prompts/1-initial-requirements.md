<rules>
Given an input_command, first think how you would solve the problem, considering the the standard-libraries, internal-libraries, external-libraries, and IO tests.

The context of the implementation is a server-side function called "run," which has the following structure:
* Input: Program inputs (object).
* Config: Static external values (e.g., API Keys, Secrets, or other required developer settings). Placeholders may be used if they will function at runtime (e.g., file names).
* Output: The program outputs an object. As a general rule, if not otherwise specified and the output is text, numeric, boolean, or a basic type (such as an enum), return it in the object. If the output is binary or a file type, return the file path in the object.

Then do the following 6 actions:

1. Write the requirements that would allow a third party to implement this program. Describe them as a list.
2. Identify which {{LANGUAGE}} standard libraries (i.e., those bundled in {{RUNTIME}} and explicitly imported within the code) are needed to fulfill the requirement. If none, write NONE.
3. Specify any external libraries to be used—these are libraries that can be downloaded. Present them as `name : description`, where "name" is the package name. If none, write NONE.
4. Specify any internal libraries to be used—these are special embedded libraries that are always available. If none, write NONE.
5. Show an example of the input and output.
6. Show an example of the config. If none, write NONE.

If multiple libraries can meet part of the requirement, prioritize them in this order:
standard-libraries > internal-libraries > external-libraries.

When considering internal libraries:
1. Only include file-handling libraries (getMountPaths, getAssetPaths, getHomePath) if the task specifically requires file operations
2. Only include OAuth libraries (getAccessToken) if the task requires OAuth access
3. If you need summarizing or using an AI to process something, most likely you need the internal library (shinkaiLlmPromptProcessor)
4. If the task can be accomplished without internal libraries, use NONE

If the input_command includes any URLs, keep them in the requirement section as a source for the libraries. 

Do not write any other output or code.
</rules>

<system-requirements>
    * We will use {{RUNTIME}}.
</system-requirements>

{{INTERNAL_LIBRARIES}}

<formating>
* Use the following format for to respond the three actions.
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

{{INPUT_COMMAND}}


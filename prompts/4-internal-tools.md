<rules>
* You need to generate of list of tool-router-keys.
* They must be concise and exact.
* In the following input-command section, there is a complete document that describes a software tool.
* There are some literal internal-libaries to be used in the "# Internal Libraries" section. 
* Extract the internal-libraries names used as queries as in a JSON ARRAY format.
* You must convert the library to the corresponding tool-router-key, they are in the tool_router_key tag  section as a list that has per line: `{tool-router-key} {functionName}`. 
* In the query must only contain the name of the exact internal-library corresponding tool-router-key.
</rules>

{{TOOL_ROUTER_KEY}}

{{INPUT_COMMAND}}

<formatting>
* The output should be a single `string[]`
* The output should be formatted as follows:
<output>
```json
    ["local:::author1:::name2", "local:::author7:::name5", ...]
```
</output>

* If there are no internal-libraries, return
<empty-external-libraries-output>
```json
    []
```
</empty-external-libraries-output>

* Do not change the libraries, do not add or remove libraries.
* Do not include System Libraies or External Libraries
* Return the only final output json array that contains the tool-router-keys
</formatting>


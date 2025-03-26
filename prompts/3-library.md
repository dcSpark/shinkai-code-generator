<rules>
* You need to generate a list of elements containing "External-Libraries" and/or "URLs".
* They must be concise and exact.
* Inside the following input-command tag, there is a complete document the used described for a software tool.
* There are some literal "external-libaries" to be used in the "# External Libraries" section, and URLs in any the entire document. 
* First extract the external-libraries exact names and add them to the json array list.
* Then extract the URLs present in the input_command tag, so add them verbatim to the json array list.
* In the final list there must be only names of the exact "external-libraries" provided and/or the "exact URLs".
</rules>

{INPUT_COMMAND}

<formatting>
* The output should be a single `string[]`
* The output should be formatted as follows in the output tag:
<output>
```json
    ["library-name-1", "library-name-2", "https://verbatim-url-1", "https://verbatim-url-2"...]
```
</output>

* If there are no "URLs" and no "external-libraries", return just an empty array.

* Do not change the libraries, do not add or remove libraries.
* Do not include System Libraies or Internal Libraries
* Return only one json
</formatting>


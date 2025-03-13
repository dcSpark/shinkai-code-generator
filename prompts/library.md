<rules>
* You need to generate queries to search on the internet.
* They must be concise, short and exact.
* The will directly searched in a search engine. 
* More words don't make it necessary better.
* In the following input-command section, there is a complete document that describes a software tool.
* There are some literal external-libaries to be used in the "# External Libraries" section. 
* Extract the external-libraries used as queries as in a JSON ARRAY format.
* In the query must only contain the name of the exact external-library name to search.
* If there are EXACT URLS in the input_command add them as well to the output json array verbatim. Do not make up URLS, only use literal values.
</rules>

<input_command>

</input_command>

<formatting>
* The output should be a single `string[]`
* The output should be formatted as follows:
<output>
```json
    ["library-name-1", "library-name-2", "exact-url-1", "exact-url-2"...]
```
</output>

* If there are no external-libraries, return
<empty-external-libraries-output>
```json
    []
```
</empty-external-libraries-output>

* Do not change the libraries, do not add or remove libraries.
* Do not include System Libraies or Internal Libraries
* Return only one json
</formatting>


<rules>
* You need to generate queries to search on the internet.
* They must be concise, short and exact.
* The will directly searched in a search engine. 
* More words don't make it necessary better.
* In the following input-command section, there is a complete document that describes a software tool.
* There are some literal external-libaries to be used in the "# External Libraries" section. 
* Extract the external-libraries used as queries as in a JSON ARRAY format.
* In the query must only contain the name of the exact external-library name to search.
</rules>

<input_command>
# Requirements
A tool that takes a URL as input and returns the complete HTML content of the website as a string.

# System Libraries
axios  : For making HTTP requests to download web pages

# Internal Libraries
downloadPages  : Converts HTML content to Markdown (not needed for this task)
readFileContents  : Reads file contents from a path (not needed for this task)

# External Libraries
axios  : HTTP client library for making GET requests to websites

# Example Inputs and Outputs  
Input: { "url": "https://example.com" }
Output: { "content": "<html>...</html>" }

</input_command>

<formatting>
* The output should be a single `string[]`
* The output should be formatted as follows:
<output>
```json
    ["library-name-1", "library-name-2", ...]
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


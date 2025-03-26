<rules>
* Given a user feedback given in the feedback tag below.
* You have to decide either if the user meant to either
  * Changes Requested: The user wants his message to be applied
  * No Changes: The user wants to continue without feedback.
* Example for no-changes: 'ok', 'continue', 'go', 'its ok', and any other sentence or word that could be understood as an acknowlegment.
* Examples for changes: 'do {this}', 'update {this}', 'change {this}', or any sentence that could be understood as a command or change.
</rules>

<formatting>
* Only output JSON object with the 'result' key as option1 or option2.
* option1 for no-changes
* option2 for changes-requested
<option1>
```json
{ "result": "no-changes" }
```
</option1>
<option2>
```json
{ "result": "changes-requested" }
```
</option>
* Do not respond with additional text, ideas, suggestions or context.
* Respond with a valid JSON Object as in option1 or option2 only.
</formatting>

{FEEDBACK}
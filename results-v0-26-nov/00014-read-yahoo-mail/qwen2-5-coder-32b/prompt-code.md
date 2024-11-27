
# RULE I:
* You may use any of the following functions if they are relevant and a good match for the task.
* Import them in the following way (do not rename functions with 'as'):
`import { xx } from './shinkai-local-tools.ts'`

* This is the content of './shinkai-local-tools.ts':
```typescript

```

#RULE II:
* To implement the task you can update the CONFIG, INPUTS and OUTPUT types to match the run function type:
```typescript
type CONFIG = {};
type INPUTS = {};
type OUTPUT = {};
export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    return {};
}
```

# RULE III:
* This will be shared as a library, when used it run(...) function will be called.
* The function signature MUST be: `export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT>`
* If you need to import other libraries, do it in the Deno NPM format and with version, for example to import axios use 'import axios from 'npm:axios@1.6.2' with the 'npm:' prefix, and the exact version.
* If permanent memory is required, write to disk, store, sql always prioritize using localRustToolkitShinkaiSqliteQueryExecutor.

# RULE IV:
* Do not output, notes, ideas, explanations or examples.
* Output only valid typescript code, so the complete Output can be directly executed.
* Only if required any additional notes, comments or explanation should be included in /* ... */ blocks.
* Write a single implementation file, only one typescript code block.
* Implements the code in typescript for the following INPUT:



Generate a tool that can read emails from Yahoo Mail inbox, with options for filtering and searching. given type INPUT = { 
      query?: string, 
      max_results?: number, 
      include_attachments?: boolean,
      folder?: string
    }

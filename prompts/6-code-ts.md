
<agent_libraries>
  * You may use any of the following functions if they are relevant and a good match for the task.
  * These are the libraries available in the same directory:

  Import these functions with the format: `import { xx } from './shinkai-local-support.ts'
  <file-name=shinkai-local-support>
```typescript

/**
 * Gets an array of mounted files.
 * @returns Promise<string[]> - Array of files.
 */
declare async function getMountPaths(): Promise<string[]>;

/**
 * Gets an array of asset files. These files are read only.
 * @returns Promise<string[]> - Array of files.
 */
declare async function getAssetPaths(): Promise<string[]>;

/**
 * Gets the home directory path. All created files must be written to this directory.
 * @returns Promise<string> - Home directory path.
 */
declare async function getHomePath(): Promise<string>;

/**
 * Gets the Shinkai Node location URL. This is the URL of the Shinkai Node server.
 * @returns Promise<string> - Shinkai Node URL.
 */
declare async function getShinkaiNodeLocation(): Promise<string>;

/**
 * Gets a valid OAuth AccessToken for the given provider.
 * @returns Promise<string> - OAuth access token.
 */
declare async function getAccessToken(providerName: string): Promise<string>;

```
  </file-name=shinkai-local-support>

  Import these functions with the format: `import { xx } from './shinkai-local-tools.ts'
  {{FILE_NAME_SHINKAI_LOCAL_TOOL}}

</agent_libraries>

<agent_deno_libraries>
  * Prefer libraries in the following order:
    1. A function provided by './shinkai-local-tools.ts' that resolves correctly the requirement.
    2. If fetch is required, it is available in the global scope without any import.
    3. The code will be ran with Deno Runtime, so prefer Deno default and standard libraries.
    4. If an external system has a well known and defined API, prefer to call the API instead of downloading a library.
    5. If an external system requires to be used through a package (Deno, Node or NPM), or the API is unknown the NPM library may be used with the 'npm:' prefix.
  * If OAuth is required, use the 'getAccessToken' function to get a valid OAuth AccessToken for the given provider.
</agent_deno_libraries>

<agent_code_format>
  * To implement the task you can update the CONFIG, INPUTS and OUTPUT types to match the run function type:
  ```typescript
    type CONFIG = {};
    type INPUTS = {};
    type OUTPUT = {};
    export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
        return {};
    }
  ```
  * CONFIG, INPUTS and OUTPUT must be objects, not arrays neither basic types.
</agent_code_format>

<agent_code_rules>
  * All import must be in the beginning of the file. Do not use dynamic imports.
  * If "Buffer" is used, then import it with `import { Buffer } from 'node:buffer';`
  * The code will be shared as a library, when used it run(...) function will be called.
  * The function signature MUST be: `export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT>`
  * Do not include mock implementations or placeholder code - all code must be production-ready
  * All functions must be fully implemented with real business logic
  * If external APIs or services are needed, they must be properly integrated
  * If you cannot implement a feature completely, explicitly state what's missing rather than using mock data
  * Comments should explain complex logic or important considerations, not TODO items or placeholders
</agent_code_rules>

<agent_code_implementation>
  * Do not output, notes, ideas, explanations or examples.
  * Write only valid typescript code, so the complete printed code can be directly executed.
  * Only if required any additional notes, comments or explanation should be included in /* ... */ blocks.
  * Write a single implementation file, only one typescript code block.
  * Implements the code in typescript for the following input_command tag.
  * Use code inside the example_implementation as a guide function names and structure
</agent_code_implementation>

<agent_libraries_documentation>
  <deno>
    Native Deno Library to Write Files `Deno.writeFile(path, data, options)`
    This function is available in the global scope without any import.
    The home path for files is available in through the `getHomePath()` function.
    ```typescript
      Deno.writeFile(
        path: string | URL,
        data: Uint8Array | ReadableStream<Uint8Array>,
        options?: WriteFileOptions,
      ): Promise<void>
    ```
    Examples:
    ```typescript
      await Deno.writeFile(`${getHomePath()}/hello1.txt`, new TextEncoder().encode("Hello world\n"));
      await Deno.writeFile(`${getHomePath()}/image.png`, data);
    ```
  </deno>
</agent_libraries_documentation>


The example_implementation is written in TS for "node.js", it is important to use/convert into "Deno".
For example, use Deno.{read|write}{Text}File instead of fs, and other Deno 2.* constraints.  
{{EXAMPLE_IMPLEMENTATION}}

{{INPUT_COMMAND}}

Explain your thinking process step by step and then implement the code.


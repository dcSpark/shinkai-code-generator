
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

```
  </file-name=shinkai-local-support>

  Import these functions with the format: `import { xx } from './shinkai-local-tools.ts'
{{FILE_SHINKAI_LOCAL_TOOLS}}

</agent_libraries>

<agent_code_rules>
  * All import must be in the beginning of the file. Do not use dynamic imports.
  * Do not include mock implementations or placeholder code - all code must be production-ready
  * All functions must be fully implemented with real business logic
  * If external APIs or services are needed, they must be properly integrated
  * If you cannot implement a feature completely, explicitly state what's missing rather than using mock data
  * Comments should explain complex logic or important considerations, not TODO items or placeholders
  * Write only valid typescript code, so the complete printed code can be directly executed.
  * Write a single implementation file, only one typescript code block.
  * Implements the code in typescript for the following input_command tag.
</agent_code_implementation>


<example_implementation>

</example_implementation>

<input_command>
{{prompt}}
</input_command>

Explain your thinking process step by step and then implement the code.


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
  <file-name=shinkai-local-tools>
```typescript
/**
 * Reads the text contents of a file from the given path.
 * @param input - {
 *   path: string - The path of the file to read.
 *
 * @returns {
 *   content: string;
 * }
 */
export async function readFileContents(input: {path: string}): Promise<{
    content: string;
}>;

/**
 * Downloads a URL and converts its HTML content to Markdown
 * @param input - {
 *   url: string - A URL of a web page to download
 *
 * @returns {
 *   markdown: string;
 * }
 */
export async function downloadPages(input: {url: string}): Promise<{
    markdown: string;
}>;


```
  </file-name=shinkai-local-tools>

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
  
</agent_code_rules>

<agent_code_implementation>
  * Do not output, notes, ideas, explanations or examples.
  * Write only valid typescript code, so the complete printed code can be directly executed.
  * Only if required any additional notes, comments or explanation should be included in /* ... */ blocks.
  * Write a single implementation file, only one typescript code block.
  * Implements the code in typescript for the following input_command tag.
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

Explain your thinking process step by step and then implement the code.


<libraries_documentation>

    <library_documentation=axios>
    # axios
    Getting Started
===============

Promise based HTTP client for the browser and node.js

What is Axios?
==============

Axios is a _[promise-based](https://javascript.info/promise-basics)
_ HTTP Client for [`node.js`](https://nodejs.org/)
 and the browser. It is _[isomorphic](https://www.lullabot.com/articles/what-is-an-isomorphic-application)
_ (= it can run in the browser and nodejs with the same codebase). On the server-side it uses the native node.js `http` module, while on the client (browser) it uses XMLHttpRequests.

Features
========

*   Make [XMLHttpRequests](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
     from the browser
*   Make [http](http://nodejs.org/api/http.html)
     requests from node.js
*   Supports the [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
     API
*   Intercept request and response
*   Transform request and response data
*   Cancel requests
*   Timeouts
*   Query parameters serialization with support for nested entries
*   Automatic request body serialization to:
    *   JSON (`application/json`)
    *   Multipart / FormData (`multipart/form-data`)
    *   URL encoded form (`application/x-www-form-urlencoded`)
*   Posting HTML forms as JSON
*   Automatic JSON data handling in response
*   Progress capturing for browsers and node.js with extra info (speed rate, remaining time)
*   Setting bandwidth limits for node.js
*   Compatible with spec-compliant FormData and Blob (including `node.js`)
*   Client side support for protecting against [XSRF](http://en.wikipedia.org/wiki/Cross-site_request_forgery)
    

Installing
==========

Using npm:

    $ npm install axios
    

Using bower:

    $ bower install axios
    

Using yarn:

    $ yarn add axios
    

Using jsDelivr CDN:

    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    

Using unpkg CDN:

    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    

Prebuilt CommonJS modules for direct importing with require (if your module bundler failed to resolve them automatically)

    const axios = require('axios/dist/browser/axios.cjs'); // browser
    const axios = require('axios/dist/node/axios.cjs'); // node
    

[#### Gold Sponsors](https://opencollective.com/axios/contribute)
[Become a sponsor](https://opencollective.com/axios/contribute)

*   [![](https://axios-http.com/assets/sponsors/opencollective/buy-instagram-followers-twicsy.png)\
    \
    Buy Instagram Followers Twicsy](https://twicsy.com/buy-instagram-followers?utm_source=axios&utm_medium=sponsorlist&utm_campaign=sponsorship)
    
*   [![](https://axios-http.com/assets/sponsors/stytch.png)\
    \
    Stytch](https://stytch.com/?utm_source=oss-sponsorship&utm_medium=paid_sponsorship&utm_content=website-link&utm_campaign=axios-http)
    
*   [![](https://axios-http.com/assets/sponsors/principal.svg)\
    \
    Principal Financial Group](https://www.principal.com/about-us?utm_source=axios&utm_medium=sponsorlist&utm_campaign=sponsorship)
    
*   [![](https://axios-http.com/assets/sponsors/descope.png)\
    \
    Descope](https://www.descope.com/?utm_source=axios&utm_medium=referral&utm_campaign=axios-oss-sponsorship)
    
*   [![](https://axios-http.com/assets/sponsors/opencollective/famety-buy-instagram-followers.png)\
    \
    Famety - Buy Instagram Followers](https://www.famety.com/?utm_source=axios&utm_medium=sponsorlist&utm_campaign=sponsorship)
    
*   [![](https://axios-http.com/assets/sponsors/opencollective/instagram-likes.png)\
    \
    Poprey - Buy Instagram Likes](https://poprey.com/?utm_source=axios&utm_medium=sponsorlist&utm_campaign=sponsorship)
    
*   [![](https://axios-http.com/assets/sponsors/opencollective/buzzoid-buy-instagram-followers.png)\
    \
    Buzzoid - Buy Instagram Followers](https://buzzoid.com/buy-instagram-followers/?utm_source=axios&utm_medium=sponsorlist&utm_campaign=sponsorship)
    
*   [![](https://axios-http.com/assets/sponsors/opencollective/youtube-subscribers-ssmarket.png)\
    \
    Buy Youtube Subscribers](https://ssmarket.net/buy-youtube-subscribers?utm_source=axios&utm_medium=sponsorlist&utm_campaign=sponsorship)
    
*   [![](https://axios-http.com/assets/sponsors/opencollective/musicza.png)\
    \
    Tubidy](https://musicza.co.za/?utm_source=axios&utm_medium=sponsorlist&utm_campaign=sponsorship)
    
*   [![](https://axios-http.com/assets/sponsors/opencollective/buy-instagram-followers-twicsy.png)\
    \
    Buy Instagram Followers Twicsy](https://twicsy.com/buy-instagram-followers?utm_source=axios&utm_medium=sponsorlist&utm_campaign=sponsorship)
    
*   [![](https://axios-http.com/assets/sponsors/stytch.png)\
    \
    Stytch](https://stytch.com/?utm_source=oss-sponsorship&utm_medium=paid_sponsorship&utm_content=website-link&utm_campaign=axios-http)
    
*   [![](https://axios-http.com/assets/sponsors/principal.svg)\
    \
    Principal Financial Group](https://www.principal.com/about-us?utm_source=axios&utm_medium=sponsorlist&utm_campaign=sponsorship)
    
*   [![](https://axios-http.com/assets/sponsors/descope.png)\
    \
    Descope](https://www.descope.com/?utm_source=axios&utm_medium=referral&utm_campaign=axios-oss-sponsorship)
    
*   [![](https://axios-http.com/assets/sponsors/opencollective/famety-buy-instagram-followers.png)\
    \
    Famety - Buy Instagram Followers](https://www.famety.com/?utm_source=axios&utm_medium=sponsorlist&utm_campaign=sponsorship)
    
*   [![](https://axios-http.com/assets/sponsors/opencollective/instagram-likes.png)\
    \
    Poprey - Buy Instagram Likes](https://poprey.com/?utm_source=axios&utm_medium=sponsorlist&utm_campaign=sponsorship)
    
*   [![](https://axios-http.com/assets/sponsors/opencollective/buzzoid-buy-instagram-followers.png)\
    \
    Buzzoid - Buy Instagram Followers](https://buzzoid.com/buy-instagram-followers/?utm_source=axios&utm_medium=sponsorlist&utm_campaign=sponsorship)
    
*   [![](https://axios-http.com/assets/sponsors/opencollective/youtube-subscribers-ssmarket.png)\
    \
    Buy Youtube Subscribers](https://ssmarket.net/buy-youtube-subscribers?utm_source=axios&utm_medium=sponsorlist&utm_campaign=sponsorship)
    
*   [![](https://axios-http.com/assets/sponsors/opencollective/musicza.png)\
    \
    Tubidy](https://musicza.co.za/?utm_source=axios&utm_medium=sponsorlist&utm_campaign=sponsorship)
    
*   [![](https://axios-http.com/assets/sponsors/opencollective/buy-instagram-followers-twicsy.png)\
    \
    Buy Instagram Followers Twicsy](https://twicsy.com/buy-instagram-followers?utm_source=axios&utm_medium=sponsorlist&utm_campaign=sponsorship)
    
*   [![](https://axios-http.com/assets/sponsors/stytch.png)\
    \
    Stytch](https://stytch.com/?utm_source=oss-sponsorship&utm_medium=paid_sponsorship&utm_content=website-link&utm_campaign=axios-http)
    
*   [![](https://axios-http.com/assets/sponsors/principal.svg)\
    \
    Principal Financial Group](https://www.principal.com/about-us?utm_source=axios&utm_medium=sponsorlist&utm_campaign=sponsorship)
    
*   [![](https://axios-http.com/assets/sponsors/descope.png)\
    \
    Descope](https://www.descope.com/?utm_source=axios&utm_medium=referral&utm_campaign=axios-oss-sponsorship)
    
*   [![](https://axios-http.com/assets/sponsors/opencollective/famety-buy-instagram-followers.png)\
    \
    Famety - Buy Instagram Followers](https://www.famety.com/?utm_source=axios&utm_medium=sponsorlist&utm_campaign=sponsorship)
    
*   [![](https://axios-http.com/assets/sponsors/opencollective/instagram-likes.png)\
    \
    Poprey - Buy Instagram Likes](https://poprey.com/?utm_source=axios&utm_medium=sponsorlist&utm_campaign=sponsorship)
    
*   [![](https://axios-http.com/assets/sponsors/opencollective/buzzoid-buy-instagram-followers.png)\
    \
    Buzzoid - Buy Instagram Followers](https://buzzoid.com/buy-instagram-followers/?utm_source=axios&utm_medium=sponsorlist&utm_campaign=sponsorship)
    
*   [![](https://axios-http.com/assets/sponsors/opencollective/youtube-subscribers-ssmarket.png)\
    \
    Buy Youtube Subscribers](https://ssmarket.net/buy-youtube-subscribers?utm_source=axios&utm_medium=sponsorlist&utm_campaign=sponsorship)
    
*   [![](https://axios-http.com/assets/sponsors/opencollective/musicza.png)\
    \
    Tubidy](https://musicza.co.za/?utm_source=axios&utm_medium=sponsorlist&utm_campaign=sponsorship)
    

[Next » Minimal Example](https://axios-http.com/docs/example)
    </library_documentation=axios>

</libraries_documentation>
        
        
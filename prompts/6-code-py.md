
<agent_libraries>
  * You may use any of the following functions if they are relevant and a good match for the task.
  * Import them with the format: `from shinkai_local_tools import xx`

  Import these functions with the format: `from shinkai_local_support import xx`
  <file-name=shinkai_local_support>
```python

async def get_mount_paths() -> List[str]:
    """Gets an array of mounted files.

    Returns:
        List[str]: Array of files
    """
    ...


async def get_asset_paths() -> List[str]:
    """Gets an array of asset files. These files are read only.

    Returns:
        List[str]: Array of files
    """
    ...


async def get_home_path() -> str:
    """Gets the home directory path. All created files must be written to this directory.

    Returns:
        str: Home directory path
    """
    ...


async def get_shinkai_node_location() -> str:
    """Gets the Shinkai Node location URL. This is the URL of the Shinkai Node server.

    Returns:
        str: Shinkai Node URL
    """
    ...


async def get_access_token(provider_name: str) -> str:
    """Gets a valid OAuth AccessToken for the given provider.

    Returns:
        str: OAuth access token
    """
    ...


```
  </file-name=shinkai_local_support>

Import these functions with the format: `from shinkai_local_tools import xx`
  <file-name=shinkai_local_tools>

  </file-name=shinkai_local_tools>


</agent_libraries>

<agent_python_libraries>
* Prefer libraries in the following order:
  1. A function provided by './shinkai_local_tools.py' that resolves correctly the requirement.
  2. If network fetch is required, use the "requests" library and import it with using `import requests`.
  3. The code will be ran with Python Runtime, so prefer Python default and standard libraries. Import all used libraries as `from <library> import <function>` for example for Lists use `from typing import List`.
  4. If an external system requires to be used through a package, or the API is unknown use "pip" libraries.
  5. If an external system has a well known and defined API, call the API endpoints.
* If OAuth is required, use the 'get_access_token' function to get a valid OAuth AccessToken for the given provider.
</agent_python_libraries>

<agent_code_format>
  * To implement the task you can update the CONFIG, INPUTS and OUTPUT types to match the run function type:
  ```python
# /// script
# dependencies = [
#   "requests",
# ]
# ///

from typing import Any, Optional, List, Dict

class CONFIG:
    pass

class INPUTS:
    pass

class OUTPUT:
    pass

async def run(config: CONFIG, inputs: INPUTS) -> OUTPUT:
    output = Output()
    return output
  ```
  * Update CONFIG, INPUTS and OUTPUT as follows but with the correct members to correcly implement the input_command tag.
```python
class CONFIG:
    arg1: str
    arg2: int
    arg3: List[str]

class INPUTS:
    sample: List[str]
    argN: Optional[str] = None

class OUTPUT:
    complex_output: List[dict]
    another_sample: str
```

</agent_code_format>

<agent_code_rules>
  * Do not implement __init__ or __new__ methods for CONFIG, INPUTS or OUTPUT.
  * The code will be shared as a library, when used it run(...) function will be called.
  * The function signature MUST be: `async def run(config: CONFIG, inputs: INPUTS) -> OUTPUT`

</agent_code_rules>

<agent_code_implementation>
  * Do not output, notes, ideas, explanations or examples.
  * Write only valid python code, so the complete printed code can be directly executed.
  * Only if required any additional notes, comments or explanation lines should be prefixed with # character.
  * Write a single implementation file, only one typescript code block.
  * Implements the code in python for the following input_command tag
</agent_code_implementation>

<agent_pip_requirements>
  * At the start of the file add a commented toml code block with the dependencies used and required to be downloaded by pip.
  * Only add the dependencies that are required to be downloaded by pip, do not add the dependencies that are already available in the Python environment.
  * This is an example of the commented script block that MUST be present before any python code or imports.

# /// script
# dependencies = [
#   "requests",
#   "ruff >=0.3.0",
#   "torch ==2.2.2",
#   "other_dependency",
#   "other_dependency_2",
# ]
# ///

  * Always add "requests" to the dependencies list.

</agent_pip_requirements>

<input_command>

</input_command>

Explain your thinking process step by step and then implement the code.


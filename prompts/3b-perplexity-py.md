
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

```
  </file-name=shinkai_local_support>

Import these functions with the format: `from shinkai_local_tools import xx`
  <file-name=shinkai_local_tools>

  </file-name=shinkai_local_tools>

</agent_libraries>

<agent_code_implementation>
  * Write only valid python code, so the complete printed code can be directly executed.
  * Write a single implementation file, only one python code block.
  * Implements the code in python for the following input_command tag
  * All functions must be fully implemented with real business logic
  * If external APIs or services are needed, they must be properly integrated
  * If you cannot implement a feature completely, explicitly state what's missing rather than using mock data
  * Comments should explain complex logic or important considerations, not TODO items or placeholders
  * At the start of the file add a commented toml code block with the dependencies used and required to be downloaded by pip.
  * Only add the dependencies that are required to be downloaded by pip, do not add the dependencies that are already available in the Python environment.
  * This is an example of the commented script block that MUST be present before any python code or imports.

Add the 'uv' format of importing packages on the start of file as follows
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

</agent_code_implementation>

<example_implementation>

</example_implementation>

<input_command>
{{prompt}}
</input_command>

Explain your thinking process step by step and then implement the code.

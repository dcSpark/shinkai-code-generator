<rules>
Given a input_command, First analyze the problem, think about the system-libraries, internal-libraries, external-libraries and IO test, then do the following 5 actions.
    1. Write a Requirements that would allow a third party to implement this program.
    2. What python system-libraries will be used, that are included in Python runtime.
    3. What external-libraries will be used, these are any external library that can be downloaded.
    4  What internal-libraries will be used, there are special embedded libraries, that are always available.
    5. Show an Inputs and Outputs example.

If there are multiple libraries that can resolve a part of the problem then priorize in order:
system-libraries > internal-libraries > external-libraries.

Do not write any other outputs or code.
</rules>

<system-requirements>
    * We will use Python.
</system-requirements>

<internal-libraries>

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


</internal-libraries>

<formating>
* Use the folling format for to respond the three actions.
```markdown
# Requirements
{Requirements}

# System Libraries
{name} : {description}
{name} : {description}

# Internal Libraries
{name} : {description}

# External Libraries
{name} : {description}
{name} : {description}

# Example Inputs and Outputs 
Input: {json}
Output: {json}
```
</formating>

<input_command>
Generate a tool that downloads a website, and return the complete HTML as { content: string }.

</input_command>


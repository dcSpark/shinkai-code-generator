# Shinkai Prompt Testing

## Requirements 
* Shinkai Node running
* Ollama running
* Firecrawl running
* Deno 2.x

## Install
```
git clone git@github.com:dcSpark/shinkai-prompt-test.git 
cd shinkai-prompt-test
ollama pull llama3.1:8b-instruct-q4_1  # for quick iterations
ollama pull deepseek-r1:32b            # for full testing 
cp .env.example .env
```
> setup BRAVE_API_KEY and other keys in .env

## Run Prompts & Execute Results
```
deno -A src/index.ts
```

## Pipeline Flow Diagram

```mermaid
graph TD
    Start[Start] --> Init[Initialize]
    Init --> ProcReq[Process Requirements & Feedback]
    ProcReq --> ProcUser[Process User Feedback]
    ProcUser --> ProcLib[Process Library Search]
    ProcLib --> ProcInt[Process Internal Tools]
    ProcInt --> GenCode[Generate Code]
    GenCode --> CheckCode[Check Generated Code]
    CheckCode -->|No Warnings| GenMeta[Generate Metadata]
    CheckCode -->|Has Warnings & Retries > 0| FixCode[Fix Code]
    FixCode --> CheckCode
    GenMeta --> LogComp[Log Completion]
    LogComp --> End[End]

    subgraph RetryUntilSuccess
        RetryStart[Start Retry] --> RunFn[Run Function]
        RunFn --> Extract[Extract Result]
        Extract -->|Success| RetryEnd[Return Result]
        Extract -->|Failure & Retries > 0| RunFn
        Extract -->|Failure & No Retries| ThrowErr[Throw Error]
    end

    %% Connect main flow with RetryUntilSuccess
    ProcReq -.->|Uses| RetryStart
    ProcUser -.->|Uses| RetryStart
    ProcLib -.->|Uses| RetryStart
    ProcInt -.->|Uses| RetryStart
    GenCode -.->|Uses| RetryStart
    CheckCode -.->|Uses| RetryStart
    GenMeta -.->|Uses| RetryStart

    %% Styling
    classDef process fill:#f9f,stroke:#333,stroke-width:2px;
    classDef retry fill:#bbf,stroke:#333,stroke-width:2px;
    class RetryStart,RunFn,Extract,RetryEnd,ThrowErr retry;
    class Init,ProcReq,ProcUser,ProcLib,ProcInt,GenCode,CheckCode,FixCode,GenMeta,LogComp process;
```

The diagram above shows the main pipeline flow of the Shinkai prompt testing system. Each major step in the pipeline utilizes the `retryUntilSuccess` mechanism (shown in the subgraph) to ensure robust execution. The retry mechanism will attempt the operation up to 3 times before failing.

Key components:
- Main Pipeline Flow: Shows the sequential processing steps from initialization to completion
- RetryUntilSuccess: Demonstrates the self-looping retry mechanism used by most pipeline steps
- Warning Handling: Illustrates the code fix loop that occurs when warnings are detected
- Integration Points: Dotted lines show where the retry mechanism is utilized in the main flow
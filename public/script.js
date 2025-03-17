document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const languageSelect = document.getElementById('language');
    const promptTextarea = document.getElementById('prompt');
    const outputDiv = document.getElementById('output');
    const statusSpan = document.getElementById('status');
    const codeBox = document.querySelector('.code-box');
    const metadataBox = document.querySelector('.metadata-box');
    const codeContent = document.getElementById('code-content');
    const metadataContent = document.getElementById('metadata-content');
    const testsContainer = document.querySelector('.tests-container');
    const testsList = document.getElementById('tests-list');
    const addTestBtn = document.getElementById('add-test-btn');

    // Configuration elements
    const configBtn = document.getElementById('config-btn');
    const configModal = document.getElementById('config-modal');
    const closeModal = document.querySelector('.close-modal');
    const saveConfigBtn = document.querySelector('.save-config');
    const resetConfigBtn = document.querySelector('.reset-config');
    const codeGeneratorUrlInput = document.getElementById('code-generator-url');
    const nodeRunnerUrlInput = document.getElementById('node-runner-url');

    // Default URLs
    const DEFAULT_CODE_GENERATOR_URL = 'http://localhost:8080';
    const DEFAULT_NODE_RUNNER_URL = 'http://localhost:9950';

    // Initialize URLs from localStorage or defaults
    let CODE_GENERATOR_URL = localStorage.getItem('CODE_GENERATOR_URL') || DEFAULT_CODE_GENERATOR_URL;
    let SHINKAI_NODE_RUNNER_URL = localStorage.getItem('SHINKAI_NODE_RUNNER_URL') || DEFAULT_NODE_RUNNER_URL;

    // Set initial values in the config form
    codeGeneratorUrlInput.value = CODE_GENERATOR_URL;
    nodeRunnerUrlInput.value = SHINKAI_NODE_RUNNER_URL;

    // Config modal event listeners
    configBtn.addEventListener('click', () => {
        configModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        configModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === configModal) {
            configModal.style.display = 'none';
        }
    });

    saveConfigBtn.addEventListener('click', () => {
        // Save the new URLs
        CODE_GENERATOR_URL = codeGeneratorUrlInput.value.trim() || DEFAULT_CODE_GENERATOR_URL;
        SHINKAI_NODE_RUNNER_URL = nodeRunnerUrlInput.value.trim() || DEFAULT_NODE_RUNNER_URL;

        // Save to localStorage
        localStorage.setItem('CODE_GENERATOR_URL', CODE_GENERATOR_URL);
        localStorage.setItem('SHINKAI_NODE_RUNNER_URL', SHINKAI_NODE_RUNNER_URL);

        // Close the modal
        configModal.style.display = 'none';

        // Show confirmation
        outputDiv.innerHTML += `<div class="progress-item">Configuration updated successfully.</div>`;
    });

    resetConfigBtn.addEventListener('click', () => {
        // Reset to defaults
        codeGeneratorUrlInput.value = DEFAULT_CODE_GENERATOR_URL;
        nodeRunnerUrlInput.value = DEFAULT_NODE_RUNNER_URL;
    });

    // Initialize empty state
    codeBox.classList.add('empty');
    metadataBox.classList.add('empty');
    testsContainer.style.display = 'none';

    let requestUuid = '';
    let generatedCode = '';
    let metadataObject = null;

    generateBtn.addEventListener('click', async () => {
        const language = languageSelect.value;
        const prompt = promptTextarea.value.trim();
        const toolType = document.querySelector('input[name="tool-type"]:checked').value;

        if (!prompt) {
            alert('Please enter a prompt');
            return;
        }

        // Clear previous output
        outputDiv.innerHTML = '';
        document.getElementById('code-content').value = '';
        document.getElementById('metadata-content').value = '';
        document.getElementById('tests-list').innerHTML = '';
        statusSpan.textContent = 'Processing...';
        generateBtn.disabled = true;

        // Reset to empty state
        codeBox.classList.add('empty');
        metadataBox.classList.add('empty');
        testsContainer.style.display = 'none';

        try {
            // Call the API with fetch using the configured URL
            const response = await fetch(`${CODE_GENERATOR_URL}/generate?language=${encodeURIComponent(language)}&prompt=${encodeURIComponent(prompt)}&tool_type=${encodeURIComponent(toolType)}`, {
                method: 'GET',
                headers: {
                    'Accept': 'text/event-stream'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            if (!response.body) {
                throw new Error('ReadableStream not supported or response body is null');
            }
            requestUuid = response.headers.get('x-shinkai-request-uuid');
            // Get the reader from the response body
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            // Process the stream
            while (true) {
                try {
                    const { done, value } = await reader.read();

                    if (done) {
                        break;
                    }

                    // Decode the chunk
                    const chunk = decoder.decode(value, { stream: true });

                    // Process the SSE events
                    processEvents(chunk);
                } catch (readError) {
                    console.error('Error reading from stream:', readError);
                    outputDiv.innerHTML += `<div class="error">Stream error: ${readError.message}</div>`;
                    break;
                }
            }

            statusSpan.textContent = 'Completed';
        } catch (error) {
            console.error('Error:', error);
            statusSpan.textContent = 'Error';
            statusSpan.className = 'status error';
            outputDiv.innerHTML += `<div class="error">Error: ${error.message}</div>`;
        } finally {
            generateBtn.disabled = false;
        }
    });

    function processEvents(chunk) {
        // Split the chunk by double newlines (SSE event delimiter)
        const events = chunk.split('\n\n');

        // Variables to track if we're expecting code or metadata in the next progress event
        let expectingCodeInNextProgress = false;
        let expectingMetadataInNextProgress = false;
        let expectingTestsInNextProgress = false;

        for (const event of events) {
            if (!event.trim()) continue;

            // Parse the event
            const lines = event.split('\n');
            const eventType = lines[0].substring(7); // Remove "event: "
            const dataLine = lines[1] || '';
            let data = {};

            if (dataLine.startsWith('data: ')) {
                try {
                    data = JSON.parse(dataLine.substring(6)); // Remove "data: "
                } catch (e) {
                    console.warn('Failed to parse event data:', dataLine);
                }
            }

            // Handle different event types
            switch (eventType) {
                case 'start':
                    console.log('Event: start', data);
                    outputDiv.innerHTML += `<div>Starting code generation...</div>`;
                    break;

                case 'progress':
                    console.log('Event: progress', data);
                    if (expectingCodeInNextProgress) {
                        // This progress event contains the code
                        console.log('Processing code in progress event');
                        expectingCodeInNextProgress = false;
                        if (data.message) {
                            try {
                                const codeObj = JSON.parse(data.message);
                                console.log('Parsed code object:', codeObj);
                                if (codeObj.code) {
                                    let codeContent = codeObj.code;
                                    document.getElementById('code-content').value = codeObj.code;
                                    generatedCode = codeObj.code; // Store the original generated code
                                    outputDiv.innerHTML += `<div class="progress-item">Code received and displayed</div>`;
                                    // Remove empty class when code is received
                                    codeBox.classList.remove('empty');
                                }
                            } catch (e) {
                                console.warn('Failed to parse code from progress message:', e);
                                console.log('Raw message:', data.message);
                                outputDiv.innerHTML += `<div class="progress-item">${data.message}</div>`;
                            }
                        }
                    } else if (expectingMetadataInNextProgress) {
                        // This progress event contains the metadata
                        console.log('Processing metadata in progress event');
                        expectingMetadataInNextProgress = false;
                        if (data.message) {
                            try {
                                const metadataObj = JSON.parse(data.message);
                                console.log('Parsed metadata object:', metadataObj);
                                if (metadataObj.metadata) {
                                    let metadataContent = metadataObj.metadata;
                                    try {
                                        const prettyMetadata = JSON.stringify(JSON.parse(metadataObj.metadata), null, 2);
                                        document.getElementById('metadata-content').value = prettyMetadata;
                                        // Store the parsed metadata for later use
                                        metadataObject = JSON.parse(metadataObj.metadata);
                                    } catch (e) {
                                        console.warn('Failed to prettify metadata:', e);
                                        document.getElementById('metadata-content').value = metadataObj.metadata;
                                    }
                                    outputDiv.innerHTML += `<div class="progress-item">Metadata received and displayed</div>`;
                                    // Remove empty class when metadata is received
                                    metadataBox.classList.remove('empty');
                                }
                            } catch (e) {
                                console.warn('Failed to parse metadata from progress message:', e);
                                console.log('Raw message:', data.message);
                                outputDiv.innerHTML += `<div class="progress-item">${data.message}</div>`;
                            }
                        }
                    } else if (expectingTestsInNextProgress) {
                        // This progress event contains the tests
                        console.log('Processing tests in progress event');
                        expectingTestsInNextProgress = false;
                        if (data.message) {
                            try {
                                const testsObj = JSON.parse(data.message);
                                console.log('Parsed tests object:', testsObj);
                                if (testsObj.tests) {
                                    try {
                                        const testsArray = JSON.parse(testsObj.tests);
                                        console.log('Parsed tests array:', testsArray);

                                        // Show the tests container
                                        testsContainer.style.display = 'block';

                                        // Create test case elements
                                        createTestCases(testsArray);

                                        outputDiv.innerHTML += `<div class="progress-item">Test cases received and displayed</div>`;
                                    } catch (e) {
                                        console.warn('Failed to parse tests array:', e);
                                        document.getElementById('tests-list').textContent = testsObj.tests;
                                    }
                                }
                            } catch (e) {
                                console.warn('Failed to parse tests from progress message:', e);
                                console.log('Raw message:', data.message);
                                outputDiv.innerHTML += `<div class="progress-item">${data.message}</div>`;
                            }
                        }
                    } else if (data.message) {
                        console.log('Processing regular progress message');
                        // Check if the message is a JSON string with a markdown key
                        try {
                            const jsonObj = JSON.parse(data.message);
                            console.log('Parsed progress JSON:', jsonObj);
                            if (jsonObj.markdown) {
                                // If it has a markdown key, display its content with a different class
                                outputDiv.innerHTML += `<div class="progress-item-markdown">${jsonObj.markdown}</div>`;
                            } else {
                                // Regular progress message
                                outputDiv.innerHTML += `<div class="progress-item">${data.message}</div>`;
                            }
                        } catch (e) {
                            console.log('Not JSON, displaying as plain text');
                            // Not a valid JSON or doesn't have markdown key, display as is
                            outputDiv.innerHTML += `<div class="progress-item">${data.message}</div>`;
                        }
                        // Auto-scroll to bottom
                        outputDiv.scrollTop = outputDiv.scrollHeight;
                    }
                    break;

                case 'request-feedback':
                    console.log('Event: request-feedback', data);
                    outputDiv.innerHTML += `<div class="progress-item">Feedback requested. Please provide your thoughts below.</div>`;

                    // Create a new feedback form each time
                    // First, remove any existing feedback form
                    const existingFeedbackContainer = document.getElementById('feedback-container');
                    if (existingFeedbackContainer) {
                        existingFeedbackContainer.remove();
                    }

                    // Create a new feedback container
                    const feedbackContainer = document.createElement('div');
                    feedbackContainer.id = 'feedback-container';
                    feedbackContainer.className = 'feedback-form';

                    // Create the heading
                    const heading = document.createElement('h3');
                    heading.textContent = 'Provide Feedback';
                    feedbackContainer.appendChild(heading);

                    // Create the textarea
                    const feedbackText = document.createElement('textarea');
                    feedbackText.id = 'feedback-text';
                    feedbackText.placeholder = 'Enter your feedback here...';
                    feedbackContainer.appendChild(feedbackText);

                    // Create the buttons container
                    const buttonsDiv = document.createElement('div');
                    buttonsDiv.className = 'feedback-actions';

                    // Create submit button
                    const submitBtn = document.createElement('button');
                    submitBtn.id = 'submit-feedback';
                    submitBtn.className = 'primary';
                    submitBtn.textContent = 'Submit Feedback';

                    // Create skip button
                    const skipBtn = document.createElement('button');
                    skipBtn.id = 'skip-feedback';
                    skipBtn.className = 'secondary';
                    skipBtn.textContent = 'Skip';

                    // Add buttons to container
                    buttonsDiv.appendChild(submitBtn);
                    buttonsDiv.appendChild(skipBtn);
                    feedbackContainer.appendChild(buttonsDiv);

                    // Add the feedback container to the output container
                    document.querySelector('.output-container').appendChild(feedbackContainer);

                    // Ensure the feedback form is visible by scrolling to it
                    feedbackContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

                    // Focus on the textarea
                    setTimeout(() => feedbackText.focus(), 300);

                    // Add event listeners for the buttons
                    submitBtn.addEventListener('click', async () => {
                        const feedback = feedbackText.value.trim();
                        submitFeedback(feedback);
                    });

                    skipBtn.addEventListener('click', () => {
                        submitFeedback('');
                    });

                    // Function to handle feedback submission
                    async function submitFeedback(feedback) {
                        try {
                            // Disable buttons while processing
                            submitBtn.disabled = true;
                            skipBtn.disabled = true;

                            // Get the current tool type
                            const toolType = document.querySelector('input[name="tool-type"]:checked').value;

                            // Send feedback to the server
                            const response = await fetch(`${CODE_GENERATOR_URL}/generate?language=${encodeURIComponent(languageSelect.value)}&prompt=${encodeURIComponent(promptTextarea.value)}&feedback=${encodeURIComponent(feedback)}&x_shinkai_request_uuid=${requestUuid}&tool_type=${encodeURIComponent(toolType)}`, {
                                method: 'GET',
                                headers: {
                                    'Accept': 'text/event-stream',
                                }
                            });

                            if (response.ok) {
                                outputDiv.innerHTML += `<div class="progress-item">${feedback ? 'Feedback submitted successfully. Thank you!' : 'Feedback skipped.'}</div>`;

                                // Remove the feedback form
                                feedbackContainer.remove();

                                // Process the stream response to continue the generation
                                if (response.body) {
                                    const reader = response.body.getReader();
                                    const decoder = new TextDecoder();

                                    // Process the stream
                                    while (true) {
                                        try {
                                            const { done, value } = await reader.read();

                                            if (done) {
                                                break;
                                            }

                                            // Decode the chunk
                                            const chunk = decoder.decode(value, { stream: true });

                                            // Process the SSE events
                                            processEvents(chunk);
                                        } catch (readError) {
                                            console.error('Error reading from stream:', readError);
                                            outputDiv.innerHTML += `<div class="error">Stream error: ${readError.message}</div>`;
                                            break;
                                        }
                                    }
                                }
                            } else {
                                outputDiv.innerHTML += `<div class="error">Failed to ${feedback ? 'submit' : 'skip'} feedback: ${response.statusText}</div>`;
                                // Remove the feedback form
                                feedbackContainer.remove();
                            }
                        } catch (error) {
                            outputDiv.innerHTML += `<div class="error">Error ${feedback ? 'submitting' : 'skipping'} feedback: ${error.message}</div>`;
                            // Remove the feedback form
                            feedbackContainer.remove();
                        }
                    }
                    break;

                case 'code':
                    console.log('Event: code', data);
                    // Mark that we expect code in the next progress event
                    expectingCodeInNextProgress = true;
                    outputDiv.innerHTML += `<div class="progress-item">Receiving code...</div>`;
                    break;

                case 'metadata':
                    console.log('Event: metadata', data);
                    // Mark that we expect metadata in the next progress event
                    expectingMetadataInNextProgress = true;
                    outputDiv.innerHTML += `<div class="progress-item">Receiving metadata...</div>`;
                    break;

                case 'tests':
                    console.log('Event: tests', data);
                    // Mark that we expect tests in the next progress event
                    expectingTestsInNextProgress = true;
                    outputDiv.innerHTML += `<div class="progress-item">Receiving test cases...</div>`;
                    break;

                case 'error':
                    console.log('Event: error', data);
                    outputDiv.innerHTML += `<div class="error">Error: ${data.message || 'Unknown error'}</div>`;
                    statusSpan.textContent = 'Error';
                    statusSpan.className = 'status error';
                    break;

                case 'complete':
                    console.log('Event: complete', data);
                    statusSpan.textContent = 'Completed';
                    break;
            }
        }
    }

    // Helper function to escape HTML
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Function to create test case elements
    function createTestCases(testsArray) {
        const testsList = document.getElementById('tests-list');
        testsList.innerHTML = ''; // Clear existing tests

        // If no tests are provided or the array is empty, create a default test case
        if (!testsArray || testsArray.length === 0) {
            testsArray = [{
                input: {},
                config: {},
                output: {}
            }];

            // Add a message to inform the user
            const noTestsMsg = document.createElement('div');
            noTestsMsg.style.padding = '8px';
            noTestsMsg.style.marginBottom = '15px';
            noTestsMsg.style.backgroundColor = 'rgba(63, 81, 181, 0.1)';
            noTestsMsg.style.borderLeft = '3px solid #3f51b5';
            noTestsMsg.style.borderRadius = '2px';
            noTestsMsg.style.fontSize = '14px';
            noTestsMsg.innerHTML = '<strong>Info:</strong> No test cases were provided. A default empty test case has been created for you.';
            testsList.appendChild(noTestsMsg);
        }

        testsArray.forEach((test, index) => {
            console.log('Test:', test);
            const testCase = document.createElement('div');
            testCase.className = 'test-case';
            testCase.id = `test-case-${index}`;

            // Create test header
            const testHeader = document.createElement('div');
            testHeader.className = 'test-header';

            const testTitle = document.createElement('div');
            testTitle.className = 'test-title';
            testTitle.textContent = `Test Case #${index + 1}`;

            const runButton = document.createElement('button');
            runButton.className = 'test-run-btn';
            runButton.textContent = 'RUN';
            runButton.dataset.testIndex = index;

            testHeader.appendChild(testTitle);
            testHeader.appendChild(runButton);
            testCase.appendChild(testHeader);

            // Add instruction message
            const instructionMsg = document.createElement('div');
            instructionMsg.style.padding = '8px';
            instructionMsg.style.marginTop = '5px';
            instructionMsg.style.marginBottom = '10px';
            instructionMsg.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
            instructionMsg.style.borderLeft = '3px solid #4CAF50';
            instructionMsg.style.borderRadius = '2px';
            instructionMsg.style.fontSize = '14px';
            instructionMsg.innerHTML = '<strong>Note:</strong> You can edit all sections below (input, config, expected output) before running the test.';
            testCase.appendChild(instructionMsg);

            // Helper function to create an edit icon
            function createEditIcon() {
                const editIcon = document.createElement('span');
                editIcon.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-left: 5px;">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                `;
                editIcon.style.color = '#90caf9';
                return editIcon;
            }

            // Create input section - always create this section
            const inputSection = document.createElement('div');
            inputSection.className = 'test-section';

            const inputTitle = document.createElement('div');
            inputTitle.className = 'test-section-title';
            inputTitle.textContent = 'Test Input:';
            inputTitle.style.color = '#4CAF50'; // Make the title more visible
            inputTitle.appendChild(createEditIcon()); // Add edit icon

            const inputContent = document.createElement('textarea');
            inputContent.className = 'test-editor';
            inputContent.id = `test-input-${index}`;
            // Use test.input if available, otherwise use an empty object
            inputContent.value = JSON.stringify(test.input || {}, null, 2);
            inputContent.style.minHeight = '120px'; // Ensure input are visible
            inputContent.placeholder = 'Edit your test input here...';

            inputSection.appendChild(inputTitle);
            inputSection.appendChild(inputContent);
            testCase.appendChild(inputSection);

            // Create config section - always create this section
            const configSection = document.createElement('div');
            configSection.className = 'test-section';

            const configTitle = document.createElement('div');
            configTitle.className = 'test-section-title';
            configTitle.textContent = 'Config:';
            configTitle.appendChild(createEditIcon()); // Add edit icon

            const configContent = document.createElement('textarea');
            configContent.className = 'test-editor';
            configContent.id = `test-config-${index}`;
            // Use test.config if available, otherwise use an empty object
            configContent.value = JSON.stringify(test.config || {}, null, 2);
            configContent.placeholder = 'Edit your test configuration here...';

            configSection.appendChild(configTitle);
            configSection.appendChild(configContent);
            testCase.appendChild(configSection);

            // Create expected output section - always create this section
            const outputection = document.createElement('div');
            outputection.className = 'test-section';

            const outputTitle = document.createElement('div');
            outputTitle.className = 'test-section-title';
            outputTitle.textContent = 'Expected Output:';
            outputTitle.appendChild(createEditIcon()); // Add edit icon

            const outputContent = document.createElement('textarea');
            outputContent.className = 'test-editor';
            outputContent.id = `test-output-${index}`;
            // Use test.output if available, otherwise use an empty object
            outputContent.value = JSON.stringify(test.output || {}, null, 2);
            outputContent.placeholder = 'Edit your expected output here...';

            outputection.appendChild(outputTitle);
            outputection.appendChild(outputContent);
            testCase.appendChild(outputection);

            // Create loader
            const loader = document.createElement('div');
            loader.className = 'test-loader';
            loader.id = `test-loader-${index}`;
            testCase.appendChild(loader);

            // Create result section (initially empty)
            const resultSection = document.createElement('div');
            resultSection.className = 'test-result';
            resultSection.id = `test-result-${index}`;
            resultSection.style.display = 'none';
            testCase.appendChild(resultSection);

            testsList.appendChild(testCase);

            // Add event listener to run button
            runButton.addEventListener('click', function () {
                executeTest(index, test);
            });
        });
    }

    // Function to execute a test
    async function executeTest(index, test) {
        const runButton = document.querySelector(`button[data-test-index="${index}"]`);
        const loader = document.getElementById(`test-loader-${index}`);
        const resultSection = document.getElementById(`test-result-${index}`);

        // Disable button and show loader
        runButton.disabled = true;
        loader.style.display = 'block';
        resultSection.style.display = 'none';

        // Function to check if data is contained in expectedOutput
        function isContained(data, expectedOutput) {
            // Handle null and undefined
            if (data === expectedOutput) {
                return true;
            }

            // Handle null or undefined in one but not the other
            if (data === null || data === undefined || expectedOutput === null || expectedOutput === undefined) {
                return false;
            }

            // Handle primitive types (string, number, boolean)
            if (typeof data !== 'object' && typeof expectedOutput !== 'object') {
                return data === expectedOutput;
            }

            // Handle arrays
            if (Array.isArray(data) && Array.isArray(expectedOutput)) {
                // Check if every item in data is contained in expectedOutput
                return data.every(dataItem => {
                    // Find at least one matching item in expectedOutput
                    return expectedOutput.some(expectedItem => isContained(dataItem, expectedItem));
                });
            }

            // Handle objects
            if (typeof data === 'object' && typeof expectedOutput === 'object') {
                // Check if every key-value pair in data is contained in expectedOutput
                return Object.keys(data).every(key => {
                    // If the key doesn't exist in expectedOutput, it's not contained
                    if (!(key in expectedOutput)) {
                        return false;
                    }
                    // Recursively check if the value is contained
                    return isContained(data[key], expectedOutput[key]);
                });
            }

            // Default case: not contained
            return false;
        }

        try {
            // Get the current values from the editable textareas
            let input = {};
            let config = {};

            const inputTextarea = document.getElementById(`test-input-${index}`);
            if (inputTextarea) {
                try {
                    input = JSON.parse(inputTextarea.value);
                    // Highlight the input textarea to show it's being used
                    inputTextarea.style.borderColor = '#4CAF50';
                    setTimeout(() => {
                        inputTextarea.style.borderColor = '#555';
                    }, 2000);
                } catch (e) {
                    throw new Error(`Invalid JSON in input: ${e.message}`);
                }
            }

            const configTextarea = document.getElementById(`test-config-${index}`);
            if (configTextarea) {
                try {
                    config = JSON.parse(configTextarea.value);
                    // Highlight the config textarea to show it's being used
                    configTextarea.style.borderColor = '#4CAF50';
                    setTimeout(() => {
                        configTextarea.style.borderColor = '#555';
                    }, 2000);
                } catch (e) {
                    throw new Error(`Invalid JSON in config: ${e.message}`);
                }
            }

            // Extract tools from metadata if available
            let tools = [""]; // Default fallback

            if (metadataObject && metadataObject.tools) {
                // If metadata.tools is an array, use it directly
                if (Array.isArray(metadataObject.tools)) {
                    tools = metadataObject.tools;
                }
                // If metadata.tools is an object with a list property, use that
                else if (metadataObject.tools.list && Array.isArray(metadataObject.tools.list)) {
                    tools = metadataObject.tools.list;
                }
                console.log('Using tools from metadata:', tools);
            } else {
                console.log('No tools found in metadata, using default');
            }

            // Log the input being used
            console.log('Running test with input:', input);
            console.log('Running test with config:', config);

            // Prepare the request payload
            const payload = {
                code: document.getElementById('code-content').value,
                tools: tools,
                tool_type: "denodynamic",
                llm_provider: "GET_FROM_CODE",
                extra_config: config,
                parameters: input
            };

            // Make the API call using the configured URL
            const response = await fetch(`${SHINKAI_NODE_RUNNER_URL}/v2/code_execution`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer debug',
                    'x-shinkai-tool-id': 'no-name',
                    'x-shinkai-app-id': 'asset-test',
                    'x-shinkai-llm-provider': 'batata',
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(payload)
            });

            // Parse the response
            const data = await response.json();

            // Display the result
            resultSection.innerHTML = '';

            // Add a section showing what input were used
            const inputUsedTitle = document.createElement('div');
            inputUsedTitle.className = 'test-section-title';
            inputUsedTitle.textContent = 'Input Used:';

            const inputUsedContent = document.createElement('pre');
            inputUsedContent.className = 'wrapped-pre';
            inputUsedContent.style.backgroundColor = '#2a2a2a';
            inputUsedContent.style.padding = '10px';
            inputUsedContent.style.borderRadius = '4px';
            inputUsedContent.style.marginBottom = '15px';
            inputUsedContent.textContent = JSON.stringify(input, null, 2);

            resultSection.appendChild(inputUsedTitle);
            resultSection.appendChild(inputUsedContent);

            // Add a section showing what config was used
            const configUsedTitle = document.createElement('div');
            configUsedTitle.className = 'test-section-title';
            configUsedTitle.textContent = 'Config Used:';

            const configUsedContent = document.createElement('pre');
            configUsedContent.className = 'wrapped-pre';
            configUsedContent.style.backgroundColor = '#2a2a2a';
            configUsedContent.style.padding = '10px';
            configUsedContent.style.borderRadius = '4px';
            configUsedContent.style.marginBottom = '15px';
            configUsedContent.textContent = JSON.stringify(config, null, 2);

            resultSection.appendChild(configUsedTitle);
            resultSection.appendChild(configUsedContent);

            const resultTitle = document.createElement('div');
            resultTitle.className = 'test-section-title';
            resultTitle.textContent = 'Actual Result:';

            const resultContent = document.createElement('pre');
            resultContent.className = 'wrapped-pre';
            resultContent.textContent = JSON.stringify(data, null, 2);

            resultSection.appendChild(resultTitle);
            resultSection.appendChild(resultContent);
            resultSection.style.display = 'block';

            // Check if there's an expected output to compare with
            const outputTextarea = document.getElementById(`test-output-${index}`);
            if (outputTextarea && outputTextarea.value.trim() !== '{}') {
                try {
                    const expectedOutput = JSON.parse(outputTextarea.value);

                    // Add a comparison section
                    const comparisonTitle = document.createElement('div');
                    comparisonTitle.className = 'test-section-title';
                    comparisonTitle.textContent = 'Comparison with Expected Output:';

                    const comparisonContent = document.createElement('div');
                    comparisonContent.style.padding = '10px';
                    comparisonContent.style.backgroundColor = '#2a2a2a';
                    comparisonContent.style.borderRadius = '4px';

                    // Check if data is contained in expectedOutput
                    if (isContained(data, expectedOutput)) {
                        comparisonContent.innerHTML = '<div style="color: #4CAF50; font-weight: bold;">✓ Output contains all expected values</div>' +
                            '<div style="margin-top: 10px;">The actual output contains all the key-value pairs specified in the expected output. ' +
                            'Note that the actual output may contain additional properties not specified in the expected output.</div>';
                    } else {
                        comparisonContent.innerHTML = '<div style="color: #f44336; font-weight: bold;">✗ Output does not contain all expected values</div>' +
                            '<div style="margin-top: 10px;">The actual output is missing some key-value pairs specified in the expected output, ' +
                            'or some values do not match the expected values.</div>';
                    }

                    resultSection.appendChild(comparisonTitle);
                    resultSection.appendChild(comparisonContent);
                } catch (e) {
                    console.warn('Failed to parse expected output for comparison:', e);
                }
            }

        } catch (error) {
            // Display error
            resultSection.innerHTML = '';

            const resultTitle = document.createElement('div');
            resultTitle.className = 'test-section-title';
            resultTitle.textContent = 'Error:';

            const resultContent = document.createElement('pre');
            resultContent.className = 'wrapped-pre';
            resultContent.textContent = error.message;
            resultContent.style.color = '#f44336';

            resultSection.appendChild(resultTitle);
            resultSection.appendChild(resultContent);
            resultSection.style.display = 'block';

        } finally {
            // Hide loader and re-enable button
            loader.style.display = 'none';
            runButton.disabled = false;
        }
    }

    // Add event listener for the add test button
    addTestBtn.addEventListener('click', function () {
        // Get the current number of test cases
        const currentTestCount = document.querySelectorAll('.test-case').length;

        // Create a new empty test case
        const newTest = {
            input: {},
            config: {},
            output: {}
        };

        // Create a temporary array with just this test
        const tempArray = [newTest];

        // Get the current HTML of the tests list
        const currentHTML = testsList.innerHTML;

        // Create a temporary div to hold the new test case
        const tempDiv = document.createElement('div');

        // Use the createTestCases function to create the new test case
        // But we need to modify it slightly to work with a single test
        const testCase = document.createElement('div');
        testCase.className = 'test-case';
        testCase.id = `test-case-${currentTestCount}`;

        // Create test header
        const testHeader = document.createElement('div');
        testHeader.className = 'test-header';

        const testTitle = document.createElement('div');
        testTitle.className = 'test-title';
        testTitle.textContent = `Test Case #${currentTestCount + 1}`;

        const runButton = document.createElement('button');
        runButton.className = 'test-run-btn';
        runButton.textContent = 'RUN';
        runButton.dataset.testIndex = currentTestCount;

        testHeader.appendChild(testTitle);
        testHeader.appendChild(runButton);
        testCase.appendChild(testHeader);

        // Add instruction message
        const instructionMsg = document.createElement('div');
        instructionMsg.style.padding = '8px';
        instructionMsg.style.marginTop = '5px';
        instructionMsg.style.marginBottom = '10px';
        instructionMsg.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
        instructionMsg.style.borderLeft = '3px solid #4CAF50';
        instructionMsg.style.borderRadius = '2px';
        instructionMsg.style.fontSize = '14px';
        instructionMsg.innerHTML = '<strong>Note:</strong> You can edit all sections below (input, config, expected output) before running the test.';
        testCase.appendChild(instructionMsg);

        // Helper function to create an edit icon
        function createEditIcon() {
            const editIcon = document.createElement('span');
            editIcon.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-left: 5px;">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
            `;
            editIcon.style.color = '#90caf9';
            return editIcon;
        }

        // Create input section
        const inputSection = document.createElement('div');
        inputSection.className = 'test-section';

        const inputTitle = document.createElement('div');
        inputTitle.className = 'test-section-title';
        inputTitle.textContent = 'Test Input:';
        inputTitle.style.color = '#4CAF50';
        inputTitle.appendChild(createEditIcon());

        const inputContent = document.createElement('textarea');
        inputContent.className = 'test-editor';
        inputContent.id = `test-input-${currentTestCount}`;
        inputContent.value = '{}';
        inputContent.style.minHeight = '120px';
        inputContent.placeholder = 'Edit your test input here...';

        inputSection.appendChild(inputTitle);
        inputSection.appendChild(inputContent);
        testCase.appendChild(inputSection);

        // Create config section
        const configSection = document.createElement('div');
        configSection.className = 'test-section';

        const configTitle = document.createElement('div');
        configTitle.className = 'test-section-title';
        configTitle.textContent = 'Config:';
        configTitle.appendChild(createEditIcon());

        const configContent = document.createElement('textarea');
        configContent.className = 'test-editor';
        configContent.id = `test-config-${currentTestCount}`;
        configContent.value = '{}';
        configContent.placeholder = 'Edit your test configuration here...';

        configSection.appendChild(configTitle);
        configSection.appendChild(configContent);
        testCase.appendChild(configSection);

        // Create expected output section
        const outputection = document.createElement('div');
        outputection.className = 'test-section';

        const outputTitle = document.createElement('div');
        outputTitle.className = 'test-section-title';
        outputTitle.textContent = 'Expected Output:';
        outputTitle.appendChild(createEditIcon());

        const outputContent = document.createElement('textarea');
        outputContent.className = 'test-editor';
        outputContent.id = `test-output-${currentTestCount}`;
        outputContent.value = '{}';
        outputContent.placeholder = 'Edit your expected output here...';

        outputection.appendChild(outputTitle);
        outputection.appendChild(outputContent);
        testCase.appendChild(outputection);

        // Create loader
        const loader = document.createElement('div');
        loader.className = 'test-loader';
        loader.id = `test-loader-${currentTestCount}`;
        testCase.appendChild(loader);

        // Create result section
        const resultSection = document.createElement('div');
        resultSection.className = 'test-result';
        resultSection.id = `test-result-${currentTestCount}`;
        resultSection.style.display = 'none';
        testCase.appendChild(resultSection);

        // Append the new test case to the tests list
        testsList.appendChild(testCase);

        // Add event listener to run button
        runButton.addEventListener('click', function () {
            executeTest(currentTestCount, newTest);
        });

        // Scroll to the new test case
        testCase.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});
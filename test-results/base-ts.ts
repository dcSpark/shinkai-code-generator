type CONFIG = {};
type INPUTS = { a: number; b: number };
type OUTPUT = number | string;

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { a, b } = inputs;

    // Validate that both 'a' and 'b' are numbers
    if (typeof a !== 'number' || typeof b !== 'number') {
        return 'Invalid inputs: both "a" and "b" must be numbers.';
    }
    
    // Return the sum of 'a' and 'b'
    return a + b;
}
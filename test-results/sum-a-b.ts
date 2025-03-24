type CONFIG = {};
type INPUTS = { a: number; b: number };
type OUTPUT = { result: number };

function add_numbers(a: number, b: number): number {
  return a + b;
}

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
  const result = add_numbers(inputs.a, inputs.b);
  return { result };
}
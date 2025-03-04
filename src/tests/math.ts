import { TestData } from "../support/types.ts";

export const mathTests: TestData[] = [
  {
    code: `math-equation-parser`,
    prompt:
      `Generate a tool that can parse and evaluate mathematical expressions. The tool should:
1. Support basic arithmetic operations (+, -, *, /, ^)
2. Handle parentheses for operation precedence
3. Support mathematical functions (sin, cos, sqrt, etc.)
4. Provide step-by-step solution explanation`,
    prompt_type:
      "type INPUT = { expression: string }",
    inputs: {
      expression: "2 * ( 3 + 4 ) ^ 2",
    },
    tools: [],
    config: {},
  },
];

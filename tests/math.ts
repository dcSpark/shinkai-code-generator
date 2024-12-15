import { TestData } from "../types.ts";

export const mathTests: TestData[] = [
  {
    code: `math-equation-parser`,
    prompt:
      `Generate a tool that can parse and evaluate mathematical expressions. The tool should:
1. Support basic arithmetic operations (+, -, *, /, ^)
2. Handle parentheses for operation precedence
3. Support mathematical functions (sin, cos, sqrt, etc.)
4. Provide step-by-step solution explanation
5. Handle variables and their substitutions`,
    prompt_type:
      "type INPUT = { expression: string, variables?: Record<string, number> }",
    inputs: {
      expression: "2 * (3 + 4) ^ 2 + sin(45)",
      variables: {
        "x": 5,
        "y": 3
      },
    },
    tools: [
      "local:::rust_toolkit:::shinkai_llm_prompt_processor",
      "local:::rust_toolkit:::shinkai_math_expression_evaluator",
    ],
    config: {},
  },
  {
    code: `equation-solver`,
    prompt:
      `Generate a tool that can solve mathematical equations and systems of equations. The tool should:
1. Support linear and quadratic equations
2. Handle systems of equations
3. Provide step-by-step solution process
4. Show all possible solutions
5. Validate input equations format`,
    prompt_type:
      "type INPUT = { equations: string[], variables?: string[] }",
    inputs: {
      equations: ["2x + 3y = 12", "4x - y = 5"],
      variables: ["x", "y"],
    },
    tools: [
      "local:::rust_toolkit:::shinkai_llm_prompt_processor",
      "local:::rust_toolkit:::shinkai_equation_solver",
    ],
    config: {},
  },
];

export type Event =
  // logs
  | {
      type: "info-message";
      payload: {
        message: string;
      };
    }
  | {
      type: "warning-message";
      payload: {
        message: string;
      };
    }
  | {
      type: "debug-message";
      payload: {
        message: string;
        filePath?: string;
        trks?: string;
      };
    }
  | {
      type: "error-message";
      payload: {
        message: string;
      };
    }
  | {
      type: "request-feedback";
      payload: {
        markdown: string;
      };
    }

  // Outputs
  | {
      type: "code";
      payload: {
        code: string;
      };
    }
  | {
      type: "metadata";
      payload: {
        metadata: string;
      };
    }
  | {
      type: "tests";
      payload: {
        tests: string[];
      };
    }

  // Process
  | {
      type: "start";
      payload: never;
    }
  | {
      type: "complete";
      payload: never;
    }
  | {
      type: "progress";
      payload: {
        step: number;
        name: string;
        message: string;
      };
    };

export const sendEvent = (event: Event) => {
  console.log(`STREAMEABLE_EVENT:::${JSON.stringify(event)}`);
};

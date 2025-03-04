import { TestData } from "../support/types.ts";

const oauthProviders = [
    "Asana",
    "Atlassian",
    "Discord",
    "DocuSign",
    "Dropbox",
    "Facebook",
    "Figma",
    "Github",
    "Gmail",
    "Google Calendar",
    "Google Docs",
    "Google Drive",
    "Google Maps",
    "Google Meet",
    "Google Sheets",
    "Hubspot",
    "Instagram",
    "Jira",
    "Linkedin",
    "Mailchimp",
    "Monday",
    "MS Teams",
    "Notion",
    "Reddit",
    "Salesforce",
    "Send Grid",
    "Shopify",
    "Slack",
    "Spotify",
    "Stripe",
    "Trello",
    "Twitter",
    "Youtube",
];

export const oauthTests: TestData[] = oauthProviders.map((provider) => (
    {
    code: `oauth-${provider.toLowerCase().replace(" ", "-")}`,
    prompt: `
        Create a tool that allows in interact with ${provider}.
        1. The required inputs are URL and Method.
        2. The optional inputs are Body, Query Params, and Headers.
        3. Fetch the access token for the user using '${provider}'.
        4. Finally do the request and return the response
    `,
    prompt_type: "type INPUT = { url: string, method: string, body?: string, query_params?: string, headers?: string }",
    inputs: { url: "", method: "" },
    tools: [],
    config: {},
  }));
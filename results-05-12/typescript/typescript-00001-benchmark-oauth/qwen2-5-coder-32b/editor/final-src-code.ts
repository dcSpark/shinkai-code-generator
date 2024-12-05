
  // These environment variables are required, before any import.
  // Do not remove them, as they set environment variables for the Shinkai Tools.
  Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  Deno.env.set('BEARER', "debug");
  Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  Deno.env.set('HOME', "results/typescript/typescript-00001-benchmark-oauth/qwen2-5-coder-32b/editor/home");
  Deno.env.set('MOUNT', "results/typescript/typescript-00001-benchmark-oauth/qwen2-5-coder-32b/editor/mount");
  Deno.env.set('ASSETS', "results/typescript/typescript-00001-benchmark-oauth/qwen2-5-coder-32b/editor/assets");
  
import { getHomePath } from './shinkai-local-support.ts';

type CONFIG = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  refreshToken: string;
};

type INPUTS = {
  event: string;
  description: string;
  start_iso: string;
  end_iso: string;
};

type OUTPUT = {
  eventId: string | null;
  error: string | null;
};

async function getAccessToken(clientId: string, clientSecret: string, refreshToken: string): Promise<string | null> {
  const tokenUrl = 'https://oauth2.googleapis.com/token';
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (response.ok) {
    const data = await response.json();
    return data.access_token;
  } else {
    console.error('Failed to fetch access token:', await response.text());
    return null;
  }
}

async function createCalendarEvent(accessToken: string, calendarId: string, eventDetails: any): Promise<string | null> {
  const eventUrl = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`;
  const response = await fetch(eventUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(eventDetails),
  });

  if (response.ok) {
    const data = await response.json();
    return data.id;
  } else {
    console.error('Failed to create event:', await response.text());
    return null;
  }
}

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
  const accessToken = await getAccessToken(config.clientId, config.clientSecret, config.refreshToken);

  if (!accessToken) {
    return { eventId: null, error: 'Failed to obtain access token' };
  }

  const eventDetails = {
    summary: inputs.event,
    description: inputs.description,
    start: {
      dateTime: inputs.start_iso,
      timeZone: 'UTC',
    },
    end: {
      dateTime: inputs.end_iso,
      timeZone: 'UTC',
    },
  };

  const eventId = await createCalendarEvent(accessToken, 'primary', eventDetails);

  if (eventId) {
    return { eventId, error: null };
  } else {
    return { eventId: null, error: 'Failed to create calendar event' };
  }
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"event":"Test Event","description":"Test Description","start_iso":"2024-12-05T10:00:00","end_iso":"2024-12-05T11:00:00"}')
  
  try {
    const program_result = await run({}, {"event":"Test Event","description":"Test Description","start_iso":"2024-12-05T10:00:00","end_iso":"2024-12-05T11:00:00"});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }


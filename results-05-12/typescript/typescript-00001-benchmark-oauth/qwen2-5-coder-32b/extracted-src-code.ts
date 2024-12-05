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
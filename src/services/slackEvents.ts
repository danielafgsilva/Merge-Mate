import { WebClient } from '@slack/web-api';

interface SlackEvent {
  type: string;
  event_ts: string;
  user: string;
  reaction?: string;
  item?: {
    type: string;
    channel: string;
    ts: string;
  };
  channel?: string;
  text?: string;
}

interface SlackEventPayload {
  token: string;
  challenge?: string;
  type: string;
  event?: SlackEvent;
  team_id: string;
  event_id: string;
  event_time: number;
}

const slackToken = import.meta.env.VITE_SLACK_BOT_TOKEN;
const slack = new WebClient(slackToken);

export async function handleSlackEvent(payload: SlackEventPayload) {
  // URL Verification
  if (payload.type === 'url_verification') {
    return { challenge: payload.challenge };
  }

  // Event Handling
  if (payload.event) {
    const event = payload.event;

    switch (event.type) {
      case 'reaction_added':
        await handleReactionEvent(event);
        break;
      case 'message':
        await handleMessageEvent(event);
        break;
      // Add more event handlers as needed
    }
  }

  return { ok: true };
}

async function handleReactionEvent(event: SlackEvent) {
  if (event.reaction && event.item?.channel) {
    try {
      await slack.chat.postMessage({
        channel: event.item.channel,
        text: `Reaction ${event.reaction} was added by <@${event.user}>`,
        thread_ts: event.item.ts
      });
    } catch (error) {
      console.error('Error handling reaction event:', error);
    }
  }
}

async function handleMessageEvent(event: SlackEvent) {
  if (event.channel && event.text) {
    try {
      // Example: Echo the message back
      await slack.chat.postMessage({
        channel: event.channel,
        text: `Received: ${event.text}`,
        thread_ts: event.event_ts
      });
    } catch (error) {
      console.error('Error handling message event:', error);
    }
  }
}
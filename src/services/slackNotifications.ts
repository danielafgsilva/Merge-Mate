import { WebClient } from '@slack/web-api';

// Check if token exists before initializing
const slackToken = import.meta.env.VITE_SLACK_BOT_TOKEN;
if (!slackToken) {
  console.error('Slack bot token is not defined in environment variables');
  throw new Error('Slack bot token is required');
}

// Initialize the Slack Web API client with the token
const slack = new WebClient(slackToken);

interface NotificationOptions {
  channel?: string;
  userIds?: string[];
}

export async function sendPRNotification(
  prTitle: string,
  prUrl: string,
  author: string,
  reviewers: string[],
  options: NotificationOptions = {}
) {
  try {
    const message = {
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "🔍 New Pull Request Ready for Review",
            emoji: true
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Title:*\n${prTitle}`
            },
            {
              type: "mrkdwn",
              text: `*Author:*\n${author}`
            }
          ]
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Reviewers:*\n${reviewers.join(', ')}`
            }
          ]
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "View Pull Request",
                emoji: true
              },
              url: prUrl,
              style: "primary"
            }
          ]
        }
      ]
    };

    // Send to channel if specified
    if (options.channel) {
      await slack.chat.postMessage({
        channel: options.channel,
        blocks: message.blocks,
        text: `New PR: ${prTitle}` // Fallback text
      });
    }

    // Send DMs to specific users if specified
    if (options.userIds) {
      for (const userId of options.userIds) {
        await slack.chat.postMessage({
          channel: userId,
          blocks: message.blocks,
          text: `New PR: ${prTitle}` // Fallback text
        });
      }
    }
  } catch (error) {
    console.error('Failed to send Slack notification:', error);
    throw error;
  }
}
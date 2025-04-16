# Merge-Mate

A modern pull request management interface with Slack notifications integration.

## Features

- Clean, modern UI for managing pull requests
- Real-time Slack notifications for PR reviews
- Filter PRs by status (All, Pending, Approved)
- Search functionality for PRs
- Reviewer management
- Status indicators

## Prerequisites

Before you begin, ensure you have:
- Node.js (v16 or higher)
- A Slack workspace with bot token
- npm or yarn package manager

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/merge-mate.git
   cd merge-mate
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Slack bot token:
   ```
   VITE_SLACK_BOT_TOKEN=your-slack-bot-token
   ```

## Development

To start the development server:

```bash
npm run dev
```

## Building for Production

To create a production build:

```bash
npm run build
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
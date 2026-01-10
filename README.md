<div align="center">
  <img src="assets/datadog-logo.svg" alt="Datadog Logo" width="200"/>
</div>

# Datadog MCP Server

A Model Context Protocol (MCP) server for interacting with the Datadog API.

## Features

- **Monitoring**: Access monitor data and configurations
- **Dashboards**: Retrieve and view dashboard definitions
- **Metrics**: Query available metrics and their metadata
- **Events**: Search and retrieve events within timeframes
- **Logs**: Search logs with advanced filtering and sorting options
- **Incidents**: Access incident management data
- **API Integration**: Direct integration with Datadog's v1 and v2 APIs
- **Comprehensive Error Handling**: Clear error messages for API and authentication issues

## Prerequisites

1. Node.js (version 16 or higher)
2. Datadog account with:
   - API key - Found in Organization Settings > API Keys
   - Application key - Found in Organization Settings > Application Keys

## Installation

### Via npm (recommended)

```bash
npm install -g datadog-mcp-server
```

### From Source

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```

## Configuration

You can configure the Datadog MCP server using either environment variables or command-line arguments.

<details>
<summary>Environment Variables</summary>

Create a `.env` file with your Datadog credentials:

```
DD_API_KEY=your_api_key_here
DD_APP_KEY=your_app_key_here
DD_SITE=datadoghq.com
```

</details>

<details>
<summary>Command-line Arguments</summary>

```bash
datadog-mcp-server --apiKey=your_api_key --appKey=your_app_key --site=datadoghq.eu
```

Note: The site argument doesn't need `https://` - it will be added automatically.

</details>

<details>
<summary>Usage with Claude Desktop</summary>

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "datadog": {
      "command": "npx",
      "args": [
        "datadog-mcp-server",
        "--apiKey",
        "<YOUR_API_KEY>",
        "--appKey",
        "<YOUR_APP_KEY>",
        "--site",
        "<YOUR_DD_SITE>(e.g us5.datadoghq.com)"
      ]
    }
  }
}
```

Locations for the Claude Desktop config file:

- MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%/Claude/claude_desktop_config.json`

</details>

<details>
<summary>Usage with Cursor</summary>

Add this to your Cursor MCP settings (Settings → Features → Model Context Protocol):

```json
{
  "mcpServers": {
    "datadog": {
      "command": "npx",
      "args": [
        "datadog-mcp-server",
        "--apiKey",
        "<YOUR_API_KEY>",
        "--appKey",
        "<YOUR_APP_KEY>",
        "--site",
        "<YOUR_DD_SITE>(e.g us5.datadoghq.com)"
      ]
    }
  }
}
```

Alternatively, you can configure it via environment variables by creating a `.env` file in your project root.

</details>

## Available Tools

The server provides these MCP tools:

- **get-monitors**: Fetch monitors with optional filtering
- **get-monitor**: Get details of a specific monitor by ID
- **get-dashboards**: List all dashboards
- **get-dashboard**: Get a specific dashboard by ID
- **get-metrics**: List available metrics
- **get-metric-metadata**: Get metadata for a specific metric
- **get-events**: Fetch events within a time range
- **get-incidents**: List incidents with optional filtering
- **search-logs**: Search logs with advanced query filtering
- **aggregate-logs**: Perform analytics and aggregations on log data

## Troubleshooting

If you encounter a 403 Forbidden error, verify that:

1. Your API key and Application key are correct
2. The keys have the necessary permissions to access the requested resources
3. Your account has access to the requested data

Common issues:

- 403 Forbidden: Authentication issue with Datadog API keys
- API key or App key format invalid: Ensure you're using the full key strings
- Site configuration errors: Make sure you're using the correct Datadog domain

## License

MIT

---

This MCP server is for research purposes only. Any data collection or monitoring will be conducted solely for security research purposes.

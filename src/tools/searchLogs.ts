import { client, v2 } from "@datadog/datadog-api-client";

type SearchLogsParams = {
  filter?: {
    query?: string;
    from?: string;
    to?: string;
    indexes?: string[];
  };
  sort?: string;
  page?: {
    limit?: number;
    cursor?: string;
  };
  limit?: number;
};

let configuration: client.Configuration;

export const searchLogs = {
  initialize: () => {
    const configOpts = {
      authMethods: {
        apiKeyAuth: process.env.DD_API_KEY,
        appKeyAuth: process.env.DD_APP_KEY
      }
    };

    configuration = client.createConfiguration(configOpts);

    if (process.env.DD_SITE) {
      configuration.setServerVariables({
        site: process.env.DD_SITE
      });
    }

    // Enable any unstable operations
    configuration.unstableOperations["v2.listLogsGet"] = true;
  },

  execute: async (params: SearchLogsParams) => {
    try {
      const { filter, sort, page, limit } = params;

      const apiInstance = new v2.LogsApi(configuration);

      // Use a more flexible approach with POST
      // Create the search request based on API docs
      const body = {
        filter: filter,
        sort: sort,
        page: page
      };

      // Directly call with fetch to use the documented POST endpoint
      const apiUrl = `https://${
        process.env.DD_SITE || "datadoghq.com"
      }/api/v2/logs/events/search`;

      const headers = {
        "Content-Type": "application/json",
        "DD-API-KEY": process.env.DD_API_KEY || "",
        "DD-APPLICATION-KEY": process.env.DD_APP_KEY || ""
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw {
          status: response.status,
          message: await response.text()
        };
      }

      const data = await response.json();

      // Apply client-side limit if specified
      if (limit && data.data && data.data.length > limit) {
        data.data = data.data.slice(0, limit);
      }

      return data;
    } catch (error: any) {
      if (error.status === 403) {
        console.error(
          "Authorization failed (403 Forbidden): Check that your API key and Application key are valid and have sufficient permissions to access logs."
        );
        throw new Error(
          "Datadog API authorization failed. Please verify your API and Application keys have the correct permissions."
        );
      } else {
        console.error("Error searching logs:", error);
        throw error;
      }
    }
  }
};

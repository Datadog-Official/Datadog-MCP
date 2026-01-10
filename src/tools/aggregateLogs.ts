import { client } from "@datadog/datadog-api-client";

type AggregateLogsParams = {
  filter?: {
    query?: string;
    from?: string;
    to?: string;
    indexes?: string[];
  };
  compute?: Array<{
    aggregation: string;
    metric?: string;
    type?: string;
  }>;
  groupBy?: Array<{
    facet: string;
    limit?: number;
    sort?: {
      aggregation: string;
      order: string;
    };
  }>;
  options?: {
    timezone?: string;
  };
};

let configuration: client.Configuration;

export const aggregateLogs = {
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
    configuration.unstableOperations["v2.aggregateLogs"] = true;
  },

  execute: async (params: AggregateLogsParams) => {
    try {
      const { filter, compute, groupBy, options } = params;

      // Directly call with fetch to use the documented aggregation endpoint
      const apiUrl = `https://${
        process.env.DD_SITE || "datadoghq.com"
      }/api/v2/logs/analytics/aggregate`;

      const headers = {
        "Content-Type": "application/json",
        "DD-API-KEY": process.env.DD_API_KEY || "",
        "DD-APPLICATION-KEY": process.env.DD_APP_KEY || ""
      };

      const body = {
        filter: filter,
        compute: compute,
        group_by: groupBy,
        options: options
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
      return data;
    } catch (error: any) {
      if (error.status === 403) {
        console.error(
          "Authorization failed (403 Forbidden): Check that your API key and Application key are valid and have sufficient permissions to access log analytics."
        );
        throw new Error(
          "Datadog API authorization failed. Please verify your API and Application keys have the correct permissions."
        );
      } else {
        console.error("Error aggregating logs:", error);
        throw error;
      }
    }
  }
};

import { client, v2 } from "@datadog/datadog-api-client";

type GetIncidentsParams = {
  includeArchived?: boolean;
  pageSize?: number;
  pageOffset?: number;
  query?: string;
  limit?: number;
};

let configuration: client.Configuration;

export const getIncidents = {
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

    // Enable the unstable operation
    configuration.unstableOperations["v2.listIncidents"] = true;
  },

  execute: async (params: GetIncidentsParams) => {
    try {
      const { includeArchived, pageSize, pageOffset, query, limit } = params;

      const apiInstance = new v2.IncidentsApi(configuration);

      const apiParams: any = {};

      if (includeArchived !== undefined) {
        apiParams.include_archived = includeArchived;
      }

      if (pageSize !== undefined) {
        apiParams.page_size = pageSize;
      }

      if (pageOffset !== undefined) {
        apiParams.page_offset = pageOffset;
      }

      if (query !== undefined) {
        apiParams.query = query;
      }

      const response = await apiInstance.listIncidents(apiParams);

      // Apply client-side limit if specified
      if (limit && response.data && response.data.length > limit) {
        response.data = response.data.slice(0, limit);
      }

      return response;
    } catch (error: any) {
      if (error.status === 403) {
        console.error(
          "Authorization failed (403 Forbidden): Check that your API key and Application key are valid and have sufficient permissions to access incidents."
        );
        throw new Error(
          "Datadog API authorization failed. Please verify your API and Application keys have the correct permissions."
        );
      } else {
        console.error("Error fetching incidents:", error);
        throw error;
      }
    }
  }
};

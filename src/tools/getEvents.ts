import { client, v1 } from "@datadog/datadog-api-client";

type GetEventsParams = {
  start: number;
  end: number;
  priority?: "normal" | "low";
  sources?: string;
  tags?: string;
  unaggregated?: boolean;
  excludeAggregation?: boolean;
  limit?: number;
};

let configuration: client.Configuration;

export const getEvents = {
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
  },

  execute: async (params: GetEventsParams) => {
    try {
      const {
        start,
        end,
        priority,
        sources,
        tags,
        unaggregated,
        excludeAggregation,
        limit
      } = params;

      const apiInstance = new v1.EventsApi(configuration);

      const apiParams: v1.EventsApiListEventsRequest = {
        start: start,
        end: end,
        priority: priority,
        sources: sources,
        tags: tags,
        unaggregated: unaggregated,
        excludeAggregate: excludeAggregation
      };

      const response = await apiInstance.listEvents(apiParams);

      // Apply client-side limit if specified
      if (limit && response.events && response.events.length > limit) {
        response.events = response.events.slice(0, limit);
      }

      return response;
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  }
};

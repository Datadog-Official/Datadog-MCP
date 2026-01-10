import { client, v1 } from "@datadog/datadog-api-client";

type GetMonitorsParams = {
  groupStates?: string[];
  tags?: string;
  monitorTags?: string;
  limit?: number;
};

let configuration: client.Configuration;

export const getMonitors = {
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

  execute: async (params: GetMonitorsParams) => {
    try {
      const { groupStates, tags, monitorTags, limit } = params;

      const apiInstance = new v1.MonitorsApi(configuration);

      const groupStatesStr = groupStates ? groupStates.join(",") : undefined;

      const apiParams: v1.MonitorsApiListMonitorsRequest = {
        groupStates: groupStatesStr,
        tags: tags,
        monitorTags: monitorTags
      };

      const response = await apiInstance.listMonitors(apiParams);

      if (limit && response.length > limit) {
        return response.slice(0, limit);
      }

      return response;
    } catch (error: any) {
      if (error.status === 403) {
        console.error(
          "Authorization failed (403 Forbidden): Check that your API key and Application key are valid and have sufficient permissions to access monitors."
        );
        throw new Error(
          "Datadog API authorization failed. Please verify your API and Application keys have the correct permissions."
        );
      } else {
        console.error("Error fetching monitors:", error);
        throw error;
      }
    }
  }
};

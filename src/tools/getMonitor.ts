import { client, v1 } from "@datadog/datadog-api-client";

type GetMonitorParams = {
  monitorId: number;
};

let configuration: client.Configuration;

export const getMonitor = {
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

  execute: async (params: GetMonitorParams) => {
    try {
      const { monitorId } = params;

      const apiInstance = new v1.MonitorsApi(configuration);

      const apiParams: v1.MonitorsApiGetMonitorRequest = {
        monitorId: monitorId
      };

      const response = await apiInstance.getMonitor(apiParams);
      return response;
    } catch (error) {
      console.error(`Error fetching monitor ${params.monitorId}:`, error);
      throw error;
    }
  }
};

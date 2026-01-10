import { client, v1 } from "@datadog/datadog-api-client";

type GetDashboardParams = {
  dashboardId: string;
};

let configuration: client.Configuration;

export const getDashboard = {
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

  execute: async (params: GetDashboardParams) => {
    try {
      const { dashboardId } = params;

      const apiInstance = new v1.DashboardsApi(configuration);

      const apiParams: v1.DashboardsApiGetDashboardRequest = {
        dashboardId: dashboardId
      };

      const response = await apiInstance.getDashboard(apiParams);
      return response;
    } catch (error) {
      console.error(`Error fetching dashboard ${params.dashboardId}:`, error);
      throw error;
    }
  }
};

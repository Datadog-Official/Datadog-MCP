import { client, v1 } from "@datadog/datadog-api-client";

type GetMetricMetadataParams = {
  metricName: string;
};

let configuration: client.Configuration;

export const getMetricMetadata = {
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

  execute: async (params: GetMetricMetadataParams) => {
    try {
      const { metricName } = params;

      const apiInstance = new v1.MetricsApi(configuration);

      const apiParams: v1.MetricsApiGetMetricMetadataRequest = {
        metricName: metricName
      };

      const response = await apiInstance.getMetricMetadata(apiParams);
      return response;
    } catch (error) {
      console.error(
        `Error fetching metadata for metric ${params.metricName}:`,
        error
      );
      throw error;
    }
  }
};

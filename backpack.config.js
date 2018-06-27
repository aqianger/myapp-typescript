const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  webpack: (config, options, webpack) => {
    config.entry.main = ['./server/index.ts'];

    config.resolve = {
      extensions: ['.ts', '.js', '.json'],
    };

    config.plugins.push(
      new CopyWebpackPlugin(
        [
          {
            from: 'server/common/swagger/Api.yaml',
            to: 'server/common/swagger/Api.yaml',
          },
          {
            from: 'server/common/swagger/travel-ticket-request-api.yaml',
            to: 'server/common/swagger/travel-ticket-request-api.yaml',
          },
        ],
        options
      )
    );

    config.module.rules.push({
      test: /\.ts$/,
      loader: 'awesome-typescript-loader',
    });

    return config;
  },
};

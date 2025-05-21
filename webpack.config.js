// /* eslint-disable no-unused-expressions */
// const createExpoWebpackConfigAsync = require('@expo/webpack-config');

// module.exports = async function (env, argv) {
//   // Create the default Expo Webpack configuration
//     const config = await createExpoWebpackConfigAsync(env, argv);
//     config.mode= 'development',
//   // Add customizations to the Webpack configuration here if needed
//   config.devServer = {
//     ...config.devServer,
//     historyApiFallback: true, // Ensures SPA routing works correctly
//   };



//   // Return the modified config
//   return config;
// };

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  mode: 'development',
  devServer: {
    hot: true,
  },
  plugins: [
    new ReactRefreshWebpackPlugin(),
  ],
};

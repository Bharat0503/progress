const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  // Update transformer to include SVG support
  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
  };

  // Update resolver to handle SVG extensions
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"],
  };

  // Limit watch folders to reduce file watchers
  config.watchFolders = [
    // Restrict watching to the current project directory
    __dirname,
  ];

  // Add a custom health check route
  config.server = {
    enhanceMiddleware: (middleware) => {
      return (req, res, next) => {
        if (req.url === "/health") {
          res.writeHead(200, { "Content-Type": "text/plain" });
          res.end("OK");
        } else {
          return middleware(req, res, next);
        }
      };
    },
  };

  return config;
})();
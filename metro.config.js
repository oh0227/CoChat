const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  // Firebase 및 CommonJS 호환
  resolver.sourceExts.push("cjs");

  // SVG 지원
  transformer.babelTransformerPath = require.resolve(
    "react-native-svg-transformer"
  );
  resolver.assetExts = resolver.assetExts.filter((ext) => ext !== "svg");
  resolver.sourceExts.push("svg");

  // Package Exports 사용 비활성화 (일부 라이브러리 충돌 방지)
  resolver.unstable_enablePackageExports = false;

  return config;
})();

import path from "path";
import { fileURLToPath } from "url";
import webpack from "webpack";
import TerserPlugin from "terser-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: "./dist/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new webpack.IgnorePlugin({
      checkResource(resource) {
        return /.*\/wordlists\/(?!english).*\.json/.test(resource);
      }
    }),
    new TerserPlugin({
      terserOptions: {
        mangle: {
          reserved: [
            "generateKeypair",
            "generateMnemonic",
            "getPairFromPrivate",
            "Key"
          ]
        }
      }
    })
  ],
  mode: "production"
};

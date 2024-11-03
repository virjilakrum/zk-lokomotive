import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: "./dist/index.js",
  output: {
    filename: "./bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  experiments: {
    syncWebAssembly: true,
  },
  mode: "production",
};

/** @type {import('@remix-run/dev').AppConfig} */
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

export default {
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
};

import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root to this project (a package-lock.json in $HOME would
  // otherwise be inferred as the root and skew serverless file tracing).
  turbopack: { root: dirname(fileURLToPath(import.meta.url)) },
};

export default nextConfig;

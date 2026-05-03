import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@edutrack/shared", "@edutrack/ui"],
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

// Safely apply the compiler config dynamically only for production builds
if (process.env.NODE_ENV === "production") {
  nextConfig.compiler = {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  };
}

export default nextConfig;

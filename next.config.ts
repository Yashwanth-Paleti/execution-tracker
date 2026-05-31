import type { NextConfig } from "next";
import withPWA from "next-pwa";

const pwa = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  turbopack: {},
  /* config options here */
};

export default pwa(nextConfig);

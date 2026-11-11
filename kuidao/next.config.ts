import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  devIndicators: false,
  async redirects() {
    return [{ source: "/signup/caregiver", destination: "/caregivers/signup", permanent: true }];
  },
};

export default nextConfig;

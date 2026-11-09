import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [{ source: "/signup/caregiver", destination: "/caregivers/signup", permanent: true }];
  },
};

export default nextConfig;

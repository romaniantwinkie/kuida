import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/signup/caregiver", destination: "/caregivers/signup", permanent: true }];
  },
};

export default nextConfig;

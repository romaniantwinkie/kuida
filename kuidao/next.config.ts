import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  devIndicators: false,
  // Vault uploads go through server actions (10 MB files).
  experimental: { serverActions: { bodySizeLimit: "11mb" } },
  async redirects() {
    return [{ source: "/signup/caregiver", destination: "/caregivers/signup", permanent: true }];
  },
};

export default nextConfig;

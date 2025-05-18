import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{
      protocol: "https",
      hostname: "avatar.iran.liara.run",
      pathname: "/public/**"
    }]
  },
};

export default nextConfig;

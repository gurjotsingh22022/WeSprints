import type { NextConfig } from "next";

const nextConfig: NextConfig ={
  images: {
    domains: ['img.clerk.com'], // Add 'img.clerk.com' to the list of allowed domains
  },
}

export default nextConfig;

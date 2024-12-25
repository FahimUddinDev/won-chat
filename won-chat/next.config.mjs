/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  env: {
    BASE_URL: "http://localhost:3002/api",
  },
};

export default nextConfig;

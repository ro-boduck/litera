/** @type {import('next').NextConfig} */
const nextConfig = {
  // better-sqlite3 is a native Node module; must be external
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;

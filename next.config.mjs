/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        optimizePackageImports: [
            "@mantine/*",
            "@tanstack/react-query",
        ]
    }
};

export default nextConfig;

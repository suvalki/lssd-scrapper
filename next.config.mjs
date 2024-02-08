/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        optimizePackageImports: [
            "@mantine/core",
            "@tanstack/react-query",
        ]
    }
};

export default nextConfig;

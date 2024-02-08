/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        optimizePackageImports: [
            "@mantine/core",
            "@mantine/hooks",
            "@tanstack/react-query",
        ]
    }
};

export default nextConfig;

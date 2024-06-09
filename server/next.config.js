/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    skipTrailingSlashRedirect: true,
}

module.exports = nextConfig
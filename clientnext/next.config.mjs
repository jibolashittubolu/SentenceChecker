/** @type {import('next').NextConfig} */
const nextConfig = {
    env:{
        APP_VERSION: process?.env?.npm_package_version || "unknown"
    },
    serverRuntimeConfig: {
        // MY_SECRET: 
    },
    publicRuntimeConfig: {
        // API_ENDPOINT: 
    },
    async rewrites() {
        return [
            //Rewrites all API requests to your Express Server
            {
                source: "/api/v1/:path*",
                destination: "http://localhost:8001/api/v1/:path*"
            }
        ]
    }
};

export default nextConfig;

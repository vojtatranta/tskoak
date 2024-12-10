import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = withNextIntl({
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "koreanconcept.cz",
        port: "",
      },
    ],
  },
});

export default nextConfig;

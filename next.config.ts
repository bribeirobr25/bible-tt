import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/infrastructure/i18n/request.ts");

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/*": ["./content/en/**/*.md", "./content/pt-br/**/*.md", "./content/de/**/*.md", "./content/es/**/*.md"],
  },
  allowedDevOrigins: ["host.docker.internal"],
  async redirects() {
    return [
      {
        source: "/:locale/:book/:chapter(\\d+)",
        destination: "/:locale/:book/chapter/:chapter",
        permanent: true,
      },
      {
        // Phase 3: "Context" book page renamed to "Background".
        source: "/:locale/:book/context",
        destination: "/:locale/:book/background",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);

// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    domains: ["images.unsplash.com", "lh3.googleusercontent.com", "deflux-test.s3.amazonaws.com", "deflux-qa.s3.amazonaws.com", "deflux.io", "s3.us-east-1.amazonaws.com"],
  },
};
export default config;

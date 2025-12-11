await import("./node_env.js");

// Next.js 16 configuration
const nextJsConfig = {
  images: {
    qualities: [50, 75, 100],
  },

  redirects: async () => {
    return [
      {
        source: "/enroll-account",
        destination: "/reset-password",
        permanent: true,
      }
    ]
  },

  i18n: {
    locales: ["en", "de"],
    defaultLocale: "en",
  },
};

export default nextJsConfig;

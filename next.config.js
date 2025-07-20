await import("./node_env.js");

const {
  GRAPHQL_ENDPOINT,
  NODE_ENV,
  SKIP_INVALID_REMOTES,
  UNCHAINED_ENDPOINT,
  DISABLE_EMAIL_PROCESSES,
} = process.env;

// Simple Next.js configuration without theme parsing
const nextJsConfig = {
  serverRuntimeConfig: {},
  publicRuntimeConfig: {
    GRAPHQL_ENDPOINT,
    NODE_ENV,
    SKIP_INVALID_REMOTES: JSON.parse(SKIP_INVALID_REMOTES || "false"),
    UNCHAINED_ENDPOINT,
    disableEmailSupport: !!DISABLE_EMAIL_PROCESSES,
  },
  i18n: {
    locales: ["en", "de"],
    defaultLocale: "en",
  },
};

export default nextJsConfig;

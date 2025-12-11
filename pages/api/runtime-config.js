const handler = (_, res) => {
  res.status(200).json({
    GRAPHQL_ENDPOINT: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
    NODE_ENV: process.env.NODE_ENV,
    SKIP_INVALID_REMOTES: process.env.NEXT_PUBLIC_SKIP_INVALID_REMOTES === 'true',
    UNCHAINED_ENDPOINT: process.env.NEXT_PUBLIC_UNCHAINED_ENDPOINT,
    disableEmailSupport: process.env.NEXT_PUBLIC_DISABLE_EMAIL_PROCESSES === 'true',
  });
};
export default handler;

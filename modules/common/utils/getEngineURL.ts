const getEngineURL = (forcePublic = false) => {
  if (typeof window === 'undefined' && !forcePublic) {
    return new URL(
      process.env.UNCHAINED_ENDPOINT ||
        process.env.NEXT_PUBLIC_UNCHAINED_ENDPOINT,
    );
  }
  return new URL(
    process.env.NEXT_PUBLIC_UNCHAINED_ENDPOINT ||
      process.env.UNCHAINED_ENDPOINT,
  );
};

export default getEngineURL;

const withoutTypename = <T extends Record<string, any>>(value: T | null | undefined) => {
  if (!value) return null;
  const { __typename, ...rest } = value;
  return rest as Omit<T, '__typename'>;
};

export default withoutTypename;

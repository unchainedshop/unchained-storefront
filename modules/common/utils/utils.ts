// DEPRECATED: Use FormattedPrice component instead
// This function has been removed to prevent formatting inconsistencies
// All price formatting should use the FormattedPrice component

const getInterfaceLabel = (obj: { label?: string; version?: string }) => {
  return obj?.label && obj?.version ? `${obj.label} ${obj.version}` : '';
};

const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

const normalizeCountryISOCode = (locale, isoCode, showIso = true) => {
  if (!isoCode) return '';

  try {
    return `${new Intl.DisplayNames([locale], { type: 'region' }).of(
      isoCode,
    )} ${showIso ? `(${isoCode})` : ''}`;
  } catch {
    return isoCode;
  }
};

const normalizeLanguageISOCode = (locale, isoCode, showIso = true) => {
  if (!isoCode) return '';
  try {
    return `${new Intl.DisplayNames([locale], { type: 'language' }).of(
      isoCode,
    )} ${showIso ? `(${isoCode})` : ''}`;
  } catch {
    return isoCode;
  }
};

const normalizeCurrencyISOCode = (locale, isoCode, showIso = true) => {
  if (!isoCode) return '';
  try {
    return `${new Intl.DisplayNames([locale], { type: 'currency' }).of(
      isoCode,
    )} ${showIso ? `(${isoCode})` : ''}`;
  } catch {
    return isoCode;
  }
};

const getSortKeys = (sort) => {
  return (
    (sort &&
      sort.split(',').reduce((acc, curr) => {
        const [key = null, value = null] = (curr || '').split('_');
        return {
          ...acc,
          [key]: value,
        };
      }, null)) ||
    {}
  );
};
export const convertSortFieldsToQueryFormat = (sort) => {
  return Object.entries(getSortKeys(sort)).map(([key, value]) => ({
    key,
    value,
  }));
};

const reducerToObject = (array) => {
  return array.reduce(
    (acc, curr) => ({ ...acc, [curr.field]: curr.direction }),
    {},
  );
};

const normalizeObjectToString = (object: Object) => {
  return Object.keys(object)
    .map((key) => [key, object[key]].join('='))
    .join('&');
};

const normalizeQuery = (
  oldQuery: Object,
  newState?: boolean,
  keyLabel?: string,
) => {
  const newQuery = keyLabel ? { ...oldQuery, [keyLabel]: newState } : oldQuery;
  return normalizeObjectToString(newQuery);
};

export const setEndpoint = (endpoint: string): string | null => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('selectedUnchainedEndpoint', endpoint);
  }
  return endpoint;
};

export const getEndpoint = (): string => {
  const endpointInSession = sessionStorage.getItem('selectedUnchainedEndpoint');
  return endpointInSession;
};

const getContent = (content) => {
  const span = document.createElement('span');
  span.innerHTML = content;
  return span.textContent || span.innerText;
};

export {
  getInterfaceLabel,
  classNames,
  normalizeCurrencyISOCode,
  normalizeCountryISOCode,
  normalizeLanguageISOCode,
  getSortKeys,
  reducerToObject,
  normalizeObjectToString,
  normalizeQuery,
  getContent,
};

export const isObject = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Object]';
};

export const isTruthy = (val) => {
  if (!val || val === undefined || val === null) return false;
  if (isObject(val) && !Object.keys(val).length) return false;
  if (Array.isArray(val) && !val.length) return false;

  return true;
};

export const arrayToBooleanObject = (key, val) => ({ ...key, [val]: true });

export const extractQuery = (query) => {
  return decodeURIComponent(query || [])
    .split(',')
    .filter(Boolean);
};

const normalizeFilterKeys = (rawFilter) => {
  return Object.keys(rawFilter)
    .filter((key) => isTruthy(rawFilter[key]))
    .map((key) => {
      const valueIsArray = Array.isArray(rawFilter[key])
        ? rawFilter[key].join(',')
        : rawFilter[key];
      return `${encodeURIComponent(key)}=${valueIsArray}`;
    })
    .join('&');
};

export default normalizeFilterKeys;

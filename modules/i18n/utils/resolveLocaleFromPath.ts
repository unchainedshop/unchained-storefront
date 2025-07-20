import supportedLanguages from './supportedLanguages';

const resolveLocaleFromPath = (path) => {
  const [, lang] = path?.split('/') || [];
  const supported = supportedLanguages();
  const normalizedLang = supported.indexOf(lang) !== -1 ? lang : supported[0];
  return `${normalizedLang}-CH`;
};

export default resolveLocaleFromPath;

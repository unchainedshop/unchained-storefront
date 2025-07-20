import translations from '../../../i18n';

const getMessages = (locale) => {
  const language = locale.split('-').shift();
  return translations[language];
};

export default getMessages;

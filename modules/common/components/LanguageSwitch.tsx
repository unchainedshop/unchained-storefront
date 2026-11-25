import React, { useId } from 'react';
import { useIntl } from 'react-intl';
import changeLanguage from '../utils/changeLanguage';

const LanguageSwitch = () => {
  const intl = useIntl();
  const id = useId();
  const currentLang = intl.locale.split('-')[0];
  const supportedLanguages = [
    {
      id: 'en',
      label: intl.formatMessage({
        id: 'language_en',
        defaultMessage: 'English',
      }),
    },
    {
      id: 'de',
      label: intl.formatMessage({ id: 'language_de', defaultMessage: 'Deutsch' }),
    },
  ];
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {intl.formatMessage({
          id: 'choose_language',
          defaultMessage: 'Choose language',
        })}
      </label>
      <select
        className="input w-auto py-1.5 pr-8 text-sm"
        value={currentLang}
        onChange={(e) => changeLanguage(e.target.value)}
        id={id}
      >
        {supportedLanguages.map((lang) => (
          <option key={lang.id} value={lang.id}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitch;

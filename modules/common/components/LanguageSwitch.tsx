import React from 'react';
import { useIntl } from 'react-intl';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import changeLanguage from '../utils/changeLanguage';

const LanguageSwitch = () => {
  const intl = useIntl();
  const currentLang = intl.locale.split('-')[0];
  intl.formatMessage({ id: 'language_en', defaultMessage: 'English' });

  return (
    <div className="relative">
      <label htmlFor="language-switcher" className="sr-only">
        {intl.formatMessage({
          id: 'choose_language',
          defaultMessage: 'Choose language',
        })}
      </label>
      <select
        className="relative border-2 border-transparent block w-full dark:focus:autofill dark:hover:autofill dark:autofill dark:placeholder:text-white dark:bg-slate-900 dark:text-slate-200 appearance-none rounded-md px-4 py-2.5 pr-10 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
        value={currentLang}
        onChange={(e) => changeLanguage(e.target.value)}
        id="language-switcher"
      >
        {['en', 'de'].map((lang) => (
          <option key={lang} value={lang}>
            {intl.formatMessage({
              id: `language_${lang}`,
              defaultMessage: 'Language X',
            })}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
    </div>
  );
};

export default LanguageSwitch;

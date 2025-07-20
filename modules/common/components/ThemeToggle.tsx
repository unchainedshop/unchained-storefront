import { MoonIcon, SunIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import Button from './Button';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.getElementsByTagName('html')[0].classList.add('dark');
      setIsDark(true);
    } else {
      document.getElementsByTagName('html')[0].classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.getElementsByTagName('html')[0].classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.getElementsByTagName('html')[0].classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [theme]);

  const handleToggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
      setIsDark(false);
    } else {
      setTheme('dark');
      setIsDark(true);
    }
  };

  return (
    <div className="absolute right-0 top-2 mx-2 flex items-center sm:top-5">
      <Button
        type="button"
        variant="link"
        onClick={handleToggleTheme}
        aria-label="Toggle theme"
        className="hover:cursor-pointer p-0"
        fullWidth={false}
      >
        <SunIcon
          className={classNames(
            'h-8 w-8 text-black transition-all delay-1000 ease-out',
            {
              hidden: isDark,
              block: !isDark,
            },
          )}
        />
        <MoonIcon
          className={classNames(
            'h-8 w-8 text-white transition-all delay-1000 ease-out',
            {
              hidden: !isDark,
              block: isDark,
            },
          )}
        />
      </Button>
    </div>
  );
};

export default ThemeToggle;

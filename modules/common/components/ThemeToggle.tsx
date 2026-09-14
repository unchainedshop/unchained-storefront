import { MoonIcon, SunIcon } from '@heroicons/react/20/solid';
import { useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import Button from './Button';

const ThemeToggle = () => {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  // Honour a persisted theme, else the system preference, on first mount.
  useEffect(() => {
    const dark =
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  // Reflect explicit user toggles (persistence handled by useLocalStorage).
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="absolute right-0 top-2 mx-2 flex items-center sm:top-5">
      <Button
        type="button"
        variant="link"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label="Toggle theme"
        className="hover:cursor-pointer p-0"
        fullWidth={false}
      >
        {/* Icon visibility is driven by the `.dark` class on <html> — no JS state. */}
        <SunIcon className="block h-8 w-8 text-black transition-all ease-out dark:hidden" />
        <MoonIcon className="hidden h-8 w-8 text-white transition-all ease-out dark:block" />
      </Button>
    </div>
  );
};

export default ThemeToggle;

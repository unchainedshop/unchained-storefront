import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useIntl } from 'react-intl';

// The initial class is set before paint by the inline script in _document.
const ThemeToggle = () => {
  const { formatMessage } = useIntl();

  const toggle = () => {
    const dark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', JSON.stringify(dark ? 'dark' : 'light'));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="btn-icon"
      aria-label={formatMessage({
        id: 'toggle_theme',
        defaultMessage: 'Toggle dark mode',
      })}
    >
      <SunIcon className="size-5 dark:hidden" />
      <MoonIcon className="hidden size-5 dark:block" />
    </button>
  );
};

export default ThemeToggle;

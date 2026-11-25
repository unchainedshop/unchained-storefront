import { useIntl } from 'react-intl';

const useFormatDateTime = () => {
  const { locale } = useIntl();

  const formatDateTime = (date, options: Intl.DateTimeFormatOptions = {}) => {
    if (!date) return 'n/a';
    const time = new Date(date).getTime();
    if (!Number.isFinite(time)) return 'n/a';
    return new Intl.DateTimeFormat(locale, options).format(time);
  };

  return { formatDateTime };
};

export default useFormatDateTime;

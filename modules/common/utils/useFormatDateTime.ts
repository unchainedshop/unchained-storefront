const useFormatDateTime = () => {
  const formatDateTime = (date, options: Intl.DateTimeFormatOptions = {}) => {
    if (!date) return 'n/a';
    try {
      return Intl.DateTimeFormat(navigator.language || 'de-ch', options).format(
        new Date(date).getTime(),
      );
    } catch {
      return Intl.DateTimeFormat('default', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(new Date(date).getTime());
    }
  };

  return { formatDateTime };
};

export default useFormatDateTime;

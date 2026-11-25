import { useIntl } from 'react-intl';

const Loading = ({ children }: any) => {
  const { formatMessage } = useIntl();
  return (
    <div role="status" className="flex w-full items-center justify-center py-16">
      <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground">
        <svg
          fill="none"
          className="size-5 animate-spin"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            d="M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z"
            fill="currentColor"
            fillRule="evenodd"
          />
        </svg>

        <div>
          {' '}
          {children ||
            formatMessage({ id: 'loading', defaultMessage: 'Loading...' })}
        </div>
      </div>
    </div>
  );
};

export default Loading;

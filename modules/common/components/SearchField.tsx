import { useIntl } from 'react-intl';

const SearchField = ({ inputText = '', onInputChange, defaultValue }) => {
  const { formatMessage } = useIntl();
  return (
    <div className="md:max-w-3xl lg:max-w-none">
      <div className="w-full">
        <label htmlFor="search" className="sr-only">
          {inputText ||
            formatMessage({ id: 'search', defaultMessage: 'Search' })}
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-slate-400 dark:text-slate-200"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            onChange={(e) => onInputChange(e.target.value)}
            id="search"
            defaultValue={defaultValue}
            name="search"
            className="block w-full max-w-lg rounded-md border-2 border-slate-300 bg-white py-2 pl-10 pr-3 text-sm shadow-xs dark:bg-slate-950 dark:shadow-white dark:placeholder:text-slate-200"
            placeholder={formatMessage({
              id: 'search',
              defaultMessage: 'Search',
            })}
            type="search"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchField;

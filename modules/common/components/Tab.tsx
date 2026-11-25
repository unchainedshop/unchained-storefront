import classNames from 'classnames';
import { useRouter } from 'next/router';
import React from 'react';
import { useIntl } from 'react-intl';

const TabComponent = ({ children, tabItems, defaultTab }) => {
  const router = useRouter();

  const { tab = defaultTab } = router?.query || {};
  const { formatMessage } = useIntl();
  const onTabSelected = (selectedTab) => {
    router.push(
      {
        query: { ...router?.query, tab: selectedTab },
      },
      undefined,
      {
        shallow: true,
      },
    );
  };

  return (
    <div className="py-6">
      <div className="lg:hidden">
        <label htmlFor="selected-tab" className="sr-only">
          {formatMessage({
            id: 'select_tab',
            defaultMessage: 'Select a tab',
          })}
        </label>

        <select
          onChange={(e) => onTabSelected(e.target.value)}
          id="selected-tab"
          name="selected-tab"
          className="mt-1 block w-full rounded-md border-input py-2 pl-3 pr-10 text-base capitalize focus:border-input focus:outline-none focus:ring-ring sm:text-sm"
          value={tab}
        >
          {tabItems.map((value) => (
            <option
              key={value.id}
              value={value.id}
              className=""
            >
              {value?.title || value?.id}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-5 hidden lg:block">
        <div className="al border-b border-border">
          <nav className="-mb-px flex flex-wrap gap-6">
            {tabItems.map((option) => (
              <a
                key={option.id}
                onClick={() => onTabSelected(option.id)}
                className={classNames(
                  {
                    'cursor-pointer rounded-t-lg border border-border border-b-input bg-muted text-foreground ':
                      tab === option.id,
                  },
                  'relative flex-auto cursor-pointer whitespace-nowrap border border-b-2 border-transparent py-4 px-1 pr-3 pl-2 text-sm font-medium hover:rounded-t-lg hover:border-b-input ',
                )}
              >
                <div className="flex items-center justify-center space-x-1">
                  <div>{option.Icon}</div>
                  <div className="capitalize">
                    {option?.title || option?.id}
                  </div>
                  {option?.length ? (
                    <span className="absolute top-0 right-0 inline-flex translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full bg-muted-strong px-1 py-0.5 text-sm leading-none text-foreground">
                      {option?.length}
                    </span>
                  ) : null}
                </div>
              </a>
            ))}
          </nav>
        </div>
      </div>
      <div className="text-white">
        {React.cloneElement(children, { selectedView: tab })}
      </div>
    </div>
  );
};

export default TabComponent;

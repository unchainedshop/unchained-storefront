import { useIntl } from 'react-intl';
import { CheckIcon } from '@heroicons/react/24/solid';
import classNames from 'classnames';
import useFormatDateTime from '../common/utils/useFormatDateTime';

const StatusProgress = ({ data, statusTypes, timeline }) => {
  const { formatMessage } = useIntl();
  const { formatDateTime } = useFormatDateTime();

  const { content = {}, id: currentId } = timeline[data?.status];

  const status = statusTypes.filter(({ value }) => timeline[value]?.visible);

  return (
    <>
      <div className="flow-root sm:hidden">
        <ul className="my-4">
          {status.map(({ value, label }, index) => (
            <li key={`${value}${label}`}>
              <div className="relative pb-8">
                {index !== status.length - 1 ? (
                  <span
                    className={classNames(
                      currentId > index + 1 ? 'bg-slate-500' : 'bg-slate-200',
                      'absolute top-2.5 left-2.5 -ml-px h-full w-0.5',
                    )}
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex items-center space-x-3">
                  <div>
                    <span
                      className={classNames(
                        currentId > index ? 'bg-slate-500' : 'bg-slate-600',
                        'flex h-5 w-5 items-center justify-center rounded-full',
                      )}
                    >
                      {currentId > index ? (
                        <CheckIcon
                          className="h-5 w-5 text-white"
                          aria-hidden="true"
                        />
                      ) : null}
                    </span>
                  </div>
                  <div className="ml-4 flex min-w-0 flex-1 items-center justify-between">
                    <div className="flex-auto">
                      <p className="text-sm text-slate-500">
                        <span className="flex w-full items-center justify-between font-medium capitalize text-slate-900 dark:text-slate-200">
                          {value}
                          {timeline[value]?.Component &&
                            timeline[value].Component}
                        </span>
                      </p>
                    </div>
                    {currentId >= timeline[value].id ? (
                      <div className="whitespace-nowrap text-right text-sm text-slate-500 dark:text-slate-200 ml-4">
                        {data[timeline[value].content]
                          ? formatDateTime(data[timeline[value].content], {
                              dateStyle: 'short',

                              timeStyle: 'short',
                            })
                          : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="hidden py-2 px-2 sm:block sm:px-2 lg:p-2">
        <h4 className="sr-only">
          {formatMessage({
            id: 'status',
            defaultMessage: 'Status',
          })}
        </h4>
        <p className="font-medium flex items-center justify-between">
          <span className="text-xl capitalize">
            {data?.status?.toLowerCase()}
          </span>
          <span>
            &nbsp;on&nbsp;
            {data[content]
              ? formatDateTime(data[content], {
                  dateStyle: 'full',
                  timeStyle: 'medium',
                })
              : formatMessage({ id: 'in_cart', defaultMessage: 'In cart' })}
          </span>
        </p>
        <div className="mt-2 print:hidden" aria-hidden="true">
          <div className="mt-2 hidden text-sm font-medium text-slate-600 sm:flex">
            {status.map(({ value, label }) => (
              <div key={`${value}${label}`} className="sm:flex-auto">
                <div className="relative mb-4 mr-1">
                  <span
                    className={classNames(
                      currentId >= timeline[value].id
                        ? 'bg-slate-400'
                        : 'bg-slate-200',
                      'absolute top-0 left-0 -ml-px h-2 w-full',
                    )}
                    aria-hidden="true"
                  />
                </div>
                <div
                  className={classNames(
                    currentId >= timeline[value].id
                      ? 'text-slate-600'
                      : 'text-slate-600',
                    'text-center',
                  )}
                >
                  <span className="flex flex-col gap-1 items-center justify-center capitalize">
                    {timeline[value]?.Component
                      ? timeline[value].Component
                      : value}
                  </span>
                  <span className="block text-slate-900 dark:text-slate-200">
                    {currentId >= timeline[value].id
                      ? formatDateTime(data[timeline[value].content], {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })
                      : null}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default StatusProgress;

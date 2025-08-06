import { useIntl } from 'react-intl';
import { PrinterIcon } from '@heroicons/react/20/solid';
import OrderDetailItem from './OrderDetailItem';

import OrderDetailBilling from './OrderDetailBilling';
import OrderDetailPayment from './OrderDetailPayment';
import OrderDetailDelivery from './OrderDetailDelivery';

import OrderDetailHeader from './OrderDetailHeader';
import useOrderStatusTypes from '../orders/hooks/useOrderStatusTypes';
import StatusProgress from './StatusProgress';
import Button from '../common/components/Button';
import FadeInSection from '../common/components/FadeInSection';

const OrderDetail = ({ order }) => {
  const { orderStatusType } = useOrderStatusTypes();
  const { formatMessage } = useIntl();

  const timeline = {
    REJECTED: {
      id: 1,
      content: 'rejected',
      visible: order?.status === 'REJECTED',
    },
    CONFIRMED: {
      id: 2,
      content: 'confirmed',
      visible: order?.status !== 'REJECTED',
    },
    FULLFILLED: {
      id: 3,
      content: 'fullfilled',
      visible: order?.status !== 'REJECTED',
    },
  };

  const onPrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto mt-12">
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Order Info & Items */}
        <div className="lg:col-span-8 space-y-8">
          {/* Order Header */}
          <FadeInSection delay={100}>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-0 p-8">
              <OrderDetailHeader order={order} />
            </div>
          </FadeInSection>

          {/* Order Items */}
          <FadeInSection delay={200}>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-0 p-8">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-6">
                {formatMessage({
                  id: 'order_items',
                  defaultMessage: 'Order Items',
                })}
              </h3>
              <div className="space-y-4">
                {order?.items.map((item, index) => (
                  <FadeInSection key={item._id} delay={300 + index * 50}>
                    <OrderDetailItem item={item} />
                  </FadeInSection>
                ))}
              </div>
            </div>
          </FadeInSection>

          {/* Status Progress */}
          <FadeInSection delay={400}>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-0 p-8">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-6">
                {formatMessage({
                  id: 'order_status',
                  defaultMessage: 'Order Status',
                })}
              </h3>
              <StatusProgress
                data={order}
                statusTypes={orderStatusType}
                timeline={timeline}
              />
            </div>
          </FadeInSection>
        </div>

        {/* Right Column - Summary & Details */}
        <div className="lg:col-span-4 space-y-8">
          {/* Print Button */}
          <FadeInSection className="print:hidden">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-0 p-6 text-center">
              <Button
                text={formatMessage({
                  id: 'print',
                  defaultMessage: 'Print Order',
                })}
                variant="secondary"
                type="button"
                onClick={onPrint}
                icon={<PrinterIcon className="h-4 w-4" />}
                className="inline-flex items-center gap-2 px-6 py-2"
              />
            </div>
          </FadeInSection>

          {/* Order Summary */}
          <FadeInSection delay={300}>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-0 p-8">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-6">
                {formatMessage({
                  id: 'order_summary',
                  defaultMessage: 'Order Summary',
                })}
              </h3>
              <OrderDetailBilling order={order} />
            </div>
          </FadeInSection>

          {/* Delivery Information */}
          <FadeInSection delay={400}>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-0 p-8">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-6">
                {formatMessage({
                  id: 'delivery',
                  defaultMessage: 'Delivery',
                })}
              </h3>
              <OrderDetailDelivery order={order} />
            </div>
          </FadeInSection>

          {/* Payment Information */}
          <FadeInSection delay={500}>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-0 p-8">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-6">
                {formatMessage({
                  id: 'payment',
                  defaultMessage: 'Payment',
                })}
              </h3>
              <OrderDetailPayment order={order} />
            </div>
          </FadeInSection>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

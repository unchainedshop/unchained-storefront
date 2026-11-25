export const LOW_STOCK_THRESHOLD = 5;

type StockLike = { quantity?: number | null };
type DispatchLike = { shipping?: string | null; earliestDelivery?: string | null };

// A provider without a quantity does not track stock and counts as unlimited.
const getProductAvailability = ({
  simulatedStocks,
  simulatedDispatches,
}: {
  simulatedStocks?: StockLike[] | null;
  simulatedDispatches?: DispatchLike[] | null;
}) => {
  const stocks = simulatedStocks || [];
  const unlimited = stocks.some((stock) => stock.quantity === null || stock.quantity === undefined);
  const quantity = stocks.reduce((acc, stock) => acc + (stock.quantity || 0), 0);

  let status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | null = null;
  if (stocks.length) {
    if (unlimited || quantity > LOW_STOCK_THRESHOLD) status = 'IN_STOCK';
    else if (quantity > 0) status = 'LOW_STOCK';
    else status = 'OUT_OF_STOCK';
  }

  const toTime = (value) => (value ? new Date(value).getTime() : null);
  const deliveryTimes = (simulatedDispatches || [])
    .map((dispatch) => toTime(dispatch.earliestDelivery) ?? toTime(dispatch.shipping))
    .filter((time) => Number.isFinite(time));
  const earliestDelivery = deliveryTimes.length ? new Date(Math.min(...deliveryTimes)) : null;

  return { status, quantity: unlimited ? null : quantity, earliestDelivery };
};

export default getProductAvailability;

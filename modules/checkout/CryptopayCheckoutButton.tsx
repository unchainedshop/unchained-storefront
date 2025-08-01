import { useState, useEffect } from 'react';
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import useQRCodeGenerator from 'react-hook-qrcode-svg';
import { useRouter } from 'next/router';
import Portal from '../common/components/Portal';
import formatPrice from '../common/utils/formatPrice';
import Loading from '../common/components/Loading';

const QRCODE_SIZE = 256;
const QRCODE_LEVEL = 'Q';
const QRCODE_BORDER = 4;

export const SIGN_CRYPTOPAY_MUTATION = gql`
  mutation SignPaymentProviderForCheckout($orderPaymentId: ID!) {
    signPaymentProviderForCheckout(orderPaymentId: $orderPaymentId)
  }
`;

export const CHECK_ORDER_STATUS_QUERY = gql`
  query CheckOrderStatus($orderId: ID!) {
    order(orderId: $orderId) {
      _id
      status
    }
  }
`;

const QRCodeButton = ({ address, value }) => {
  const payload = `ethereum:${address}?value=${value}`;
  const { path, viewBox } = useQRCodeGenerator(
    payload,
    QRCODE_LEVEL,
    QRCODE_BORDER,
  );

  const copyToClipboard = () => {
    try {
      if ('clipboard' in navigator) {
        navigator.clipboard.writeText(payload);
      }
      document.execCommand('copy', true, payload);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div
      onClick={copyToClipboard}
      className="mx-auto relative w-fit after:invisible after:absolute after:left-2 after:top-0 after:z-10 after:h-fit after:rounded after:bg-slate-900 after:px-2 after:py-1 after:text-white after:opacity-0 after:transition after:content-['Click_to_copy'] hover:cursor-pointer hover:after:visible hover:after:opacity-100"
    >
      <div className="sm:flex sm:items-center sm:justify-center flex-col">
        <svg
          width={QRCODE_SIZE}
          height={QRCODE_SIZE}
          viewBox={viewBox}
          stroke="none"
        >
          <rect width="100%" height="100%" fill="#ffffff" />
          <path d={path} fill="#000000" />
        </svg>
      </div>
    </div>
  );
};

const MetamaskButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{ backgroundColor: '#f6851a' }}
    className="inline-flex items-center rounded-md border border-transparent px-3 py-2 text-sm font-medium leading-4 text-white shadow-xs focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
  >
    <span className="mr-2 rounded-full p-1.5 bg-white d-flex items-center justify-center">
      <svg
        className="h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="22.5"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 256 240"
      >
        <path fill="#E17726" d="M250.066 0L140.219 81.279l20.427-47.9z" />
        <path
          fill="#E27625"
          d="m6.191.096l89.181 33.289l19.396 48.528zM205.86 172.858l48.551.924l-16.968 57.642l-59.243-16.311zm-155.721 0l27.557 42.255l-59.143 16.312l-16.865-57.643z"
        />
        <path
          fill="#E27625"
          d="m112.131 69.552l1.984 64.083l-59.371-2.701l16.888-25.478l.214-.245zm31.123-.715l40.9 36.376l.212.244l16.888 25.478l-59.358 2.7zM79.435 173.044l32.418 25.259l-37.658 18.181zm97.136-.004l5.131 43.445l-37.553-18.184z"
        />
        <path
          fill="#D5BFB2"
          d="m144.978 195.922l38.107 18.452l-35.447 16.846l.368-11.134zm-33.967.008l-2.909 23.974l.239 11.303l-35.53-16.833z"
        />
        <path
          fill="#233447"
          d="m100.007 141.999l9.958 20.928l-33.903-9.932zm55.985.002l24.058 10.994l-34.014 9.929z"
        />
        <path
          fill="#CC6228"
          d="m82.026 172.83l-5.48 45.04l-29.373-44.055zm91.95.001l34.854.984l-29.483 44.057zm28.136-44.444l-25.365 25.851l-19.557-8.937l-9.363 19.684l-6.138-33.849zm-148.237 0l60.435 2.749l-6.139 33.849l-9.365-19.681l-19.453 8.935z"
        />
        <path
          fill="#E27525"
          d="m52.166 123.082l28.698 29.121l.994 28.749zm151.697-.052l-29.746 57.973l1.12-28.8zm-90.956 1.826l1.155 7.27l2.854 18.111l-1.835 55.625l-8.675-44.685l-.003-.462zm30.171-.101l6.521 35.96l-.003.462l-8.697 44.797l-.344-11.205l-1.357-44.862z"
        />
        <path
          fill="#F5841F"
          d="m177.788 151.046l-.971 24.978l-30.274 23.587l-6.12-4.324l6.86-35.335zm-99.471 0l30.399 8.906l6.86 35.335l-6.12 4.324l-30.275-23.589z"
        />
        <path
          fill="#C0AC9D"
          d="m67.018 208.858l38.732 18.352l-.164-7.837l3.241-2.845h38.334l3.358 2.835l-.248 7.831l38.487-18.29l-18.728 15.476l-22.645 15.553h-38.869l-22.63-15.617z"
        />
        <path
          fill="#161616"
          d="m142.204 193.479l5.476 3.869l3.209 25.604l-4.644-3.921h-36.476l-4.556 4l3.104-25.681l5.478-3.871z"
        />
        <path
          fill="#763E1A"
          d="M242.814 2.25L256 41.807l-8.235 39.997l5.864 4.523l-7.935 6.054l5.964 4.606l-7.897 7.191l4.848 3.511l-12.866 15.026l-52.77-15.365l-.457-.245l-38.027-32.078zm-229.628 0l98.326 72.777l-38.028 32.078l-.457.245l-52.77 15.365l-12.866-15.026l4.844-3.508l-7.892-7.194l5.952-4.601l-8.054-6.071l6.085-4.526L0 41.809z"
        />
        <path
          fill="#F5841F"
          d="m180.392 103.99l55.913 16.279l18.165 55.986h-47.924l-33.02.416l24.014-46.808zm-104.784 0l-17.151 25.873l24.017 46.808l-33.005-.416H1.631l18.063-55.985zm87.776-70.878l-15.639 42.239l-3.319 57.06l-1.27 17.885l-.101 45.688h-30.111l-.098-45.602l-1.274-17.986l-3.32-57.045l-15.637-42.239z"
        />
      </svg>
    </span>
    Mit Metamask bezahlen
  </button>
);

const PayWithCryptoButton = ({ sign }) => (
  <button
    type="button"
    onClick={sign}
    className="mt-6 w-full rounded-md border border-transparent bg-red-600 py-3 px-4 text-base font-medium text-white shadow-xs hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-800 focus:ring-offset-2 focus:ring-offset-slate-50"
  >
    Pay with Crypto
  </button>
);

const CryptopayCheckoutButton = ({ order }) => {
  const router = useRouter();
  const [showPaymentInformation, setShowPaymentInformation] = useState(false);
  const [signCryptopayMutation, { data }] = useMutation(
    SIGN_CRYPTOPAY_MUTATION,
  );

  const [pollOrder, { data: orderData, stopPolling }] = useLazyQuery(
    CHECK_ORDER_STATUS_QUERY,
    {
      pollInterval: 2000,
    },
  );
  useEffect(() => {
    if (
      orderData?.order?.status === 'CONFIRMED' ||
      orderData?.order?.status === 'FULLFILLED'
    ) {
      router.replace(`/order/${order._id}/success`);
    }
  }, [orderData]);

  const { amount } = order.total || {};

  const sign = async () => {
    try {
      await signCryptopayMutation({
        variables: { orderPaymentId: order.payment._id },
      });
      setShowPaymentInformation(true);
      await pollOrder({ variables: { orderId: order._id } });
    } catch (e) {
      console.error(e);
    }
  };

  const cancel = () => {
    stopPolling();
    setShowPaymentInformation(false);
  };

  const pairs = JSON.parse(data?.signPaymentProviderForCheckout || '[]');
  const signedETHDeal = pairs.find((pair) => pair.currency === 'ETH');

  if (!signedETHDeal) return <PayWithCryptoButton sign={sign} />;

  const contractAddress = signedETHDeal.address;
  const expiryDate = new Date(signedETHDeal.currencyConversionExpiryDate);
  const priceInGwei = amount * signedETHDeal.currencyConversionRate;

  // We are loosing the comma stuff for wei... okay for now
  const priceInWei = Number.isNaN(priceInGwei)
    ? 0
    : BigInt(Math.round(priceInGwei)) * BigInt(10 ** (18 - 9));

  const formattedPrice = signedETHDeal.currency
    ? formatPrice({
        amount: priceInGwei,
        currency: signedETHDeal.currency,
        decimals: 18,
        hack: true,
      })
    : '';

  const payWithMetaMask = async (orderId, price) => {
    // TODO: DO THIS!
  };
  const isMetamaskAvailable = false;

  return (
    <>
      {showPaymentInformation && (
        <Portal>
          <div
            className="relative z-30"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" />
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-fit">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-10 sm:pb-4">
                    <div className="flex items-center justify-center flex-col">
                      {isMetamaskAvailable && (
                        <>
                          <div>
                            <MetamaskButton
                              onClick={async () => {
                                await payWithMetaMask(
                                  { orderAddress: contractAddress },
                                  priceInWei,
                                );
                              }}
                            />
                          </div>
                          <div className="relative w-full mt-3">
                            <div
                              className="absolute inset-0 flex items-center"
                              aria-hidden="true"
                            >
                              <div className="w-full border-t border-slate-300" />
                            </div>
                            <div className="relative flex justify-center">
                              <span className="bg-white px-2 text-sm text-slate-500">
                                or
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                      <div className="text-center pt-3">
                        <span>Send exactly</span>
                        <span className="font-semibold sm:font-normal sm:text-2xl mx-3">
                          {formattedPrice}
                        </span>
                        <span className="my-3">to</span>
                        <div className="font-semibold sm:font-normal sm:text-2xl mt-2 break-all px-5">
                          {contractAddress}
                        </div>
                      </div>
                      <div className="relative w-full mt-3">
                        <div
                          className="absolute inset-0 flex items-center"
                          aria-hidden="true"
                        >
                          <div className="w-full border-t border-slate-300" />
                        </div>
                        <div className="relative flex justify-center">
                          <span className="bg-white px-2 text-sm text-slate-500">
                            or
                          </span>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="mt-3">Scan this QR code</p>
                        <QRCodeButton
                          address={contractAddress}
                          value={priceInWei.toString()}
                        />
                        <div className="mb-5 pt-2">
                          <p className="max-w-xs text-xs">
                            The above price expires{' '}
                            {expiryDate.toLocaleString()}
                          </p>

                          <p className="max-w-xs text-m pt-5">
                            <b>
                              This message will automatically disappear when we
                              have seen a block confirming the payment.
                            </b>
                          </p>

                          <Loading>Awaiting payment...</Loading>
                        </div>
                      </div>
                      <button
                        onClick={cancel}
                        type="button"
                        className="inline-flex items-center rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-brown-600 shadow-xs hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-800 focus:ring-offset-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}

      <PayWithCryptoButton sign={sign} />
    </>
  );
};

export default CryptopayCheckoutButton;

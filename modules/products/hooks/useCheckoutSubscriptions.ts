import useCart from '../../orders/hooks/useCart';
import useActivateEnrollment from './useActivateEnrollment';
import { useCreateEnrollment } from './useCreateEnrollment';

const useCheckoutSubscriptions = () => {
  const { createEnrollment } = useCreateEnrollment();
  const { activateEnrollment } = useActivateEnrollment();
  const { cart } = useCart();

  const subscriptionProducts = cart?.items?.filter(
    (item) => item.product.__typename === 'PlanProduct',
  );

  const checkoutSubscriptions = async () => {
    const { contact, billingAddress, delivery, payment } = cart;
    for (const { product, quantity } of subscriptionProducts) {
      try {
        const { data } = await createEnrollment({
          plan: {
            productId: product._id,
            quantity,
          },
          contact: {
            emailAddress: contact?.emailAddress,
            telNumber: contact?.telNumber,
          },
          billingAddress: {
            firstName: billingAddress?.firstName,
            lastName: billingAddress?.lastName,
            addressLine: billingAddress?.addressLine,
            addressLine2: billingAddress?.addressLine2,
            city: billingAddress?.city,
            postalCode: billingAddress?.postalCode,
            countryCode: billingAddress?.countryCode,
            regionCode: billingAddress?.regionCode,
          },
          payment: {
            paymentProviderId: payment?.provider?._id,
          },
          delivery: {
            deliveryProviderId: delivery?.provider?._id,
          },
          meta: { source: 'checkout-process' },
        });
        await activateEnrollment({ enrollmentId: data?.createEnrollment?._id });
      } catch (err) {
        console.error('Error creating enrollment', err);
      }
    }
  };

  return {
    checkoutSubscriptions,
  };
};

export default useCheckoutSubscriptions;

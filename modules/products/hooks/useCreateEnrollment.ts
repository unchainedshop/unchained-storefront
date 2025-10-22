import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

export const CREATE_ENROLLMENT_MUTATION = gql`
  mutation CreateEnrollment(
    $plan: EnrollmentPlanInput!
    $billingAddress: AddressInput
    $contact: ContactInput
    $payment: EnrollmentPaymentInput
    $delivery: EnrollmentDeliveryInput
    $meta: JSON
  ) {
    createEnrollment(
      plan: $plan
      billingAddress: $billingAddress
      contact: $contact
      payment: $payment
      delivery: $delivery
      meta: $meta
    ) {
      _id
    }
  }
`;

export const useCreateEnrollment = () => {
  const [createEnrollmentMutation, { data, loading, error }] = useMutation<any>(
    CREATE_ENROLLMENT_MUTATION,
  );

  const createEnrollment = async ({
    plan,
    billingAddress,
    contact,
    payment,
    delivery,
    meta,
  }: {
    plan: any;
    billingAddress?: any;
    contact?: any;
    payment?: any;
    delivery?: any;
    meta?: any;
  }) => {
    return createEnrollmentMutation({
      variables: {
        plan,
        billingAddress,
        contact,
        payment,
        delivery,
        meta,
      },
    });
  };

  return {
    createEnrollment,
    data,
    loading,
    error,
  };
};

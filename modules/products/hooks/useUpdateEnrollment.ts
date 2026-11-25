import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import type * as GQL from '../../apollo/generated';

const UpdateEnrollmentMutation = gql`
  mutation UpdateEnrollment($enrollmentId: ID!, $plan: EnrollmentPlanInput, $billingAddress: AddressInput) {
    updateEnrollment(enrollmentId: $enrollmentId, plan: $plan, billingAddress: $billingAddress) {
      _id
    }
  }
`;

const useUpdateEnrollment = () => {
  const [updateEnrollmentMutation, { loading }] = useMutation<
    GQL.UpdateEnrollmentMutation,
    GQL.UpdateEnrollmentMutationVariables
  >(UpdateEnrollmentMutation, { refetchQueries: ['Enrollment', 'UserSubscriptions'] });

  // Keeps the current product and configuration when only the quantity changes.
  const updateQuantity = (enrollment, quantity: number) =>
    updateEnrollmentMutation({
      variables: {
        enrollmentId: enrollment._id,
        plan: {
          productId: enrollment.plan.product._id,
          quantity,
          configuration: (enrollment.plan.configuration || []).map(({ key, value }) => ({ key, value })),
        },
      },
    });

  const updateBillingAddress = (enrollmentId: string, { __typename = null, ...billingAddress }) =>
    updateEnrollmentMutation({ variables: { enrollmentId, billingAddress } });

  return { updateQuantity, updateBillingAddress, loading };
};

export default useUpdateEnrollment;

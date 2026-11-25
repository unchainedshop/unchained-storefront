import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import type * as GQL from '../../apollo/generated';

export const ACTIVATE_ENROLLMENT_MUTATION = gql`
  mutation ActivateEnrollment($enrollmentId: ID!) {
    activateEnrollment(enrollmentId: $enrollmentId) {
      _id
    }
  }
`;

export const useActivateEnrollment = () => {
  const [activateEnrollmentMutation, { data, loading, error }] = useMutation<GQL.ActivateEnrollmentMutation, GQL.ActivateEnrollmentMutationVariables>(ACTIVATE_ENROLLMENT_MUTATION,
  );

  const activateEnrollment = async ({
    enrollmentId,
  }: {
    enrollmentId: string;
  }) => {
    return activateEnrollmentMutation({
      variables: {
        enrollmentId,
      },
      refetchQueries: ['Enrollment'],
    });
  };

  return {
    activateEnrollment,
    data,
    loading,
    error,
  };
};

export default useActivateEnrollment;

import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

export const ACTIVATE_ENROLLMENT_MUTATION = gql`
  mutation ActivateEnrollment($enrollmentId: ID!) {
    activateEnrollment(enrollmentId: $enrollmentId) {
      _id
    }
  }
`;

export const useActivateEnrollment = () => {
  const [activateEnrollmentMutation, { data, loading, error }] = useMutation(
    ACTIVATE_ENROLLMENT_MUTATION,
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

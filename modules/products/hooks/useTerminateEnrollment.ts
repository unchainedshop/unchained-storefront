import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

const TerminateEnrollmentMutation = gql`
  mutation TerminateEnrollment($enrollmentId: ID!) {
    terminateEnrollment(enrollmentId: $enrollmentId) {
      _id
    }
  }
`;

const useTerminateEnrollment = () => {
  const [terminateEnrollmentMutation] = useMutation(
    TerminateEnrollmentMutation,
  );

  const terminateEnrollment = async ({ enrollmentId }) => {
    return terminateEnrollmentMutation({
      variables: { enrollmentId },
      refetchQueries: ['Enrollment'],
    });
  };

  return {
    terminateEnrollment,
  };
};

export default useTerminateEnrollment;

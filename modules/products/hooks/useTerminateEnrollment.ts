import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

const TerminateEnrollmentMutation = gql`
  mutation TerminateEnrollment(
    $enrollmentId: ID!
    $reason: EnrollmentTerminationReason
    $comment: String
  ) {
    terminateEnrollment(
      enrollmentId: $enrollmentId
      reason: $reason
      comment: $comment
    ) {
      _id
      status
      expires
      cancellationReason
    }
  }
`;

const useTerminateEnrollment = () => {
  const [terminateEnrollmentMutation, { loading }] = useMutation(
    TerminateEnrollmentMutation,
  );

  const terminateEnrollment = async ({
    enrollmentId,
    comment,
  }: {
    enrollmentId: string;
    comment?: string;
  }) => {
    return terminateEnrollmentMutation({
      variables: {
        enrollmentId,
        reason: 'USER_REQUESTED',
        comment: comment?.trim() || null,
      },
      refetchQueries: ['Enrollment', 'UserSubscriptions'],
    });
  };

  return {
    terminateEnrollment,
    loading,
  };
};

export default useTerminateEnrollment;

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

import EnrollmentDetailFragment from '../fragments/EnrollmentDetailFragment';

const EnrollmentQuery = gql`
  query Enrollment($enrollmentId: ID!) {
    enrollment(enrollmentId: $enrollmentId) {
      ...EnrollmentDetailFragment
    }
  }
  ${EnrollmentDetailFragment}
`;

const useEnrollment = ({ enrollmentId = null }) => {
  const { data, loading, error } = useQuery<any>(EnrollmentQuery, {
    variables: { enrollmentId },
  });
  const enrollment = data?.enrollment;

  return {
    enrollment,
    loading,
    error,
  };
};

export default useEnrollment;

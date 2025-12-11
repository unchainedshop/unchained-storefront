import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

import EnrollmentDetailFragment from '../fragments/EnrollmentDetailFragment';
import { useAppContext } from '../../common/components/AppContextWrapper';

const EnrollmentQuery = gql`
  query Enrollment($enrollmentId: ID!, $currency: String) {
    enrollment(enrollmentId: $enrollmentId) {
      ...EnrollmentDetailFragment
    }
  }
  ${EnrollmentDetailFragment}
`;

const useEnrollment = ({ enrollmentId = null }) => {
  const { selectedCurrency } = useAppContext();
  const { data, loading, error } = useQuery<any>(EnrollmentQuery, {
    variables: { enrollmentId, currency: selectedCurrency },
  });
  const enrollment = data?.enrollment;

  return {
    enrollment,
    loading,
    error,
  };
};

export default useEnrollment;

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

import EnrollmentDetailFragment from '../fragments/EnrollmentDetailFragment';
import { useIntl } from 'react-intl';
import { useAppContext } from '../../common/components/AppContextWrapper';

const EnrollmentQuery = gql`
  query Enrollment($enrollmentId: ID!, $locale: Locale, $currency: String) {
    enrollment(enrollmentId: $enrollmentId) {
      ...EnrollmentDetailFragment
    }
  }
  ${EnrollmentDetailFragment}
`;

const useEnrollment = ({ enrollmentId = null }) => {
  const { locale } = useIntl();
  const { selectedCurrency } = useAppContext();
  const { data, loading, error } = useQuery<any>(EnrollmentQuery, {
    variables: { enrollmentId, locale, currency: selectedCurrency },
  });
  const enrollment = data?.enrollment;

  return {
    enrollment,
    loading,
    error,
  };
};

export default useEnrollment;

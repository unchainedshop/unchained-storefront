import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import type * as GQL from '../../apollo/generated';

const ValidateResetPasswordTokenQuery = gql`
  query ValidateResetPasswordToken($token: String!) {
    validateResetPasswordToken(token: $token)
  }
`;

const useValidateResetPasswordToken = (token?: string) => {
  const { data, loading } = useQuery<
    GQL.ValidateResetPasswordTokenQuery,
    GQL.ValidateResetPasswordTokenQueryVariables
  >(ValidateResetPasswordTokenQuery, { variables: { token }, skip: !token, fetchPolicy: 'network-only' });

  return {
    loading: Boolean(token) && loading,
    isValid: Boolean(token) && data?.validateResetPasswordToken === true,
  };
};

export default useValidateResetPasswordToken;

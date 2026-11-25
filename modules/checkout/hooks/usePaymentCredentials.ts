import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import PaymentCredentialsFragment from '../fragments/PaymentCredentialsFragment';
import type * as GQL from '../../apollo/generated';

export const USER_PAYMENT_CREDENTIALS_QUERY = gql`
  query UserPaymentCredentials {
    me {
      _id
      paymentCredentials {
        ...PaymentCredentialsFragment
      }
    }
  }
  ${PaymentCredentialsFragment}
`;

const MarkPaymentCredentialsPreferredMutation = gql`
  mutation MarkPaymentCredentialsPreferred($paymentCredentialsId: ID!) {
    markPaymentCredentialsPreferred(paymentCredentialsId: $paymentCredentialsId) {
      ...PaymentCredentialsFragment
    }
  }
  ${PaymentCredentialsFragment}
`;

const RemovePaymentCredentialsMutation = gql`
  mutation RemovePaymentCredentials($paymentCredentialsId: ID!) {
    removePaymentCredentials(paymentCredentialsId: $paymentCredentialsId) {
      _id
    }
  }
`;

const SignPaymentProviderForCredentialRegistrationMutation = gql`
  mutation SignPaymentProviderForCredentialRegistration($paymentProviderId: ID!, $transactionContext: JSON) {
    signPaymentProviderForCredentialRegistration(
      paymentProviderId: $paymentProviderId
      transactionContext: $transactionContext
    )
  }
`;

const RegisterPaymentCredentialsMutation = gql`
  mutation RegisterPaymentCredentials($paymentProviderId: ID!, $transactionContext: JSON!) {
    registerPaymentCredentials(paymentProviderId: $paymentProviderId, transactionContext: $transactionContext) {
      ...PaymentCredentialsFragment
    }
  }
  ${PaymentCredentialsFragment}
`;

const refetchQueries = ['UserPaymentCredentials'];

const usePaymentCredentials = () => {
  const { data, loading } = useQuery<GQL.UserPaymentCredentialsQuery, GQL.UserPaymentCredentialsQueryVariables>(
    USER_PAYMENT_CREDENTIALS_QUERY,
  );
  const [markPreferredMutation] = useMutation<
    GQL.MarkPaymentCredentialsPreferredMutation,
    GQL.MarkPaymentCredentialsPreferredMutationVariables
  >(MarkPaymentCredentialsPreferredMutation, { refetchQueries });
  const [removeMutation] = useMutation<GQL.RemovePaymentCredentialsMutation, GQL.RemovePaymentCredentialsMutationVariables>(
    RemovePaymentCredentialsMutation,
    { refetchQueries },
  );
  const [signMutation] = useMutation<
    GQL.SignPaymentProviderForCredentialRegistrationMutation,
    GQL.SignPaymentProviderForCredentialRegistrationMutationVariables
  >(SignPaymentProviderForCredentialRegistrationMutation);
  const [registerMutation] = useMutation<
    GQL.RegisterPaymentCredentialsMutation,
    GQL.RegisterPaymentCredentialsMutationVariables
  >(RegisterPaymentCredentialsMutation, { refetchQueries });

  const paymentCredentials = data?.me?.paymentCredentials || [];

  return {
    paymentCredentials,
    loading,
    preferredCredentialsFor: (paymentProviderId: string) =>
      paymentCredentials.find(
        (credentials) =>
          credentials.isPreferred && credentials.isValid && credentials.paymentProvider?._id === paymentProviderId,
      ),
    markPreferred: (paymentCredentialsId: string) => markPreferredMutation({ variables: { paymentCredentialsId } }),
    remove: (paymentCredentialsId: string) => removeMutation({ variables: { paymentCredentialsId } }),
    signRegistration: async (paymentProviderId: string, transactionContext = {}) => {
      const { data: signed } = await signMutation({ variables: { paymentProviderId, transactionContext } });
      return signed?.signPaymentProviderForCredentialRegistration;
    },
    register: (paymentProviderId: string, transactionContext: Record<string, unknown>) =>
      registerMutation({ variables: { paymentProviderId, transactionContext } }),
  };
};

export default usePaymentCredentials;

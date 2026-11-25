import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import useGenerateWebAuthCredentials from './useGenerateWebAuthCredentials';
import type * as GQL from '../../apollo/generated';

const UserWebAuthnCredentialsQuery = gql`
  query UserWebAuthnCredentials {
    me {
      _id
      username
      webAuthnCredentials {
        _id
        created
        mdsMetadata {
          description
        }
      }
    }
  }
`;

const AddWebAuthnCredentialsMutation = gql`
  mutation AddWebAuthnCredentials($credentials: JSON!) {
    addWebAuthnCredentials(credentials: $credentials) {
      _id
    }
  }
`;

const RemoveWebAuthnCredentialsMutation = gql`
  mutation RemoveWebAuthnCredentials($credentialsId: ID!) {
    removeWebAuthnCredentials(credentialsId: $credentialsId) {
      _id
    }
  }
`;

const LogoutAllSessionsMutation = gql`
  mutation LogoutAllSessions {
    logoutAllSessions {
      success
    }
  }
`;

const refetchQueries = ['UserWebAuthnCredentials'];

const useAccountSecurity = () => {
  const { data, loading } = useQuery<GQL.UserWebAuthnCredentialsQuery, GQL.UserWebAuthnCredentialsQueryVariables>(
    UserWebAuthnCredentialsQuery,
  );
  const { generateWebAuthCredentials } = useGenerateWebAuthCredentials();
  const [addMutation] = useMutation<GQL.AddWebAuthnCredentialsMutation, GQL.AddWebAuthnCredentialsMutationVariables>(
    AddWebAuthnCredentialsMutation,
    { refetchQueries },
  );
  const [removeMutation] = useMutation<
    GQL.RemoveWebAuthnCredentialsMutation,
    GQL.RemoveWebAuthnCredentialsMutationVariables
  >(RemoveWebAuthnCredentialsMutation, { refetchQueries });
  const [logoutAllSessionsMutation, { client }] = useMutation<
    GQL.LogoutAllSessionsMutation,
    GQL.LogoutAllSessionsMutationVariables
  >(LogoutAllSessionsMutation);

  return {
    passkeys: data?.me?.webAuthnCredentials || [],
    loading,
    addPasskey: async () => {
      const credentials = await generateWebAuthCredentials({ username: data?.me?.username });
      return addMutation({ variables: { credentials } });
    },
    removePasskey: (credentialsId: string) => removeMutation({ variables: { credentialsId } }),
    logoutAllSessions: async () => {
      await logoutAllSessionsMutation();
      await client.resetStore();
    },
  };
};

export default useAccountSecurity;

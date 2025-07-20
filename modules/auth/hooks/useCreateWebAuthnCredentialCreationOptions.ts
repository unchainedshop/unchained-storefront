import { useMutation, gql } from '@apollo/client';

export const CREATE_WEB_AUTHN_CREDENTIAL_CREATION_OPTIONS_MUTATION = gql`
  mutation CreateWebAuthnCredentialCreationOptions($username: String!) {
    createWebAuthnCredentialCreationOptions(username: $username)
  }
`;

const useCreateWebAuthnCredentialCreationOptions = () => {
  const [createWebAuthnCredentialCreationOptionsMutation] = useMutation(
    CREATE_WEB_AUTHN_CREDENTIAL_CREATION_OPTIONS_MUTATION,
  );

  const createWebAuthnCredentialCreationOptions = async ({ username }) => {
    return createWebAuthnCredentialCreationOptionsMutation({
      variables: { username },
    });
  };

  return { createWebAuthnCredentialCreationOptions };
};

export default useCreateWebAuthnCredentialCreationOptions;

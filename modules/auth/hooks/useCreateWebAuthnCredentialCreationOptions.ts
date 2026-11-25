import { gql } from '@apollo/client';

import { useMutation } from '@apollo/client/react';
import type * as GQL from '../../apollo/generated';

export const CREATE_WEB_AUTHN_CREDENTIAL_CREATION_OPTIONS_MUTATION = gql`
  mutation CreateWebAuthnCredentialCreationOptions($username: String!) {
    createWebAuthnCredentialCreationOptions(username: $username)
  }
`;

const useCreateWebAuthnCredentialCreationOptions = () => {
  const [createWebAuthnCredentialCreationOptionsMutation] = useMutation<GQL.CreateWebAuthnCredentialCreationOptionsMutation, GQL.CreateWebAuthnCredentialCreationOptionsMutationVariables>(CREATE_WEB_AUTHN_CREDENTIAL_CREATION_OPTIONS_MUTATION,
  );

  const createWebAuthnCredentialCreationOptions = async ({ username }) => {
    return createWebAuthnCredentialCreationOptionsMutation({
      variables: { username },
    });
  };

  return { createWebAuthnCredentialCreationOptions };
};

export default useCreateWebAuthnCredentialCreationOptions;

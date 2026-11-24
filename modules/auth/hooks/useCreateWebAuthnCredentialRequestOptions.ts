import { gql } from '@apollo/client';

import { useMutation } from '@apollo/client/react';
import type * as GQL from '../../apollo/generated';

export const CREATE_WEB_AUTHN_CREDENTIAL_REQUEST_OPTIONS_MUTATION = gql`
  mutation CreateWebAuthnCredentialRequestOptions($username: String) {
    createWebAuthnCredentialRequestOptions(username: $username)
  }
`;

const useCreateWebAuthnCredentialRequestOptions = () => {
  const [createWebAuthnCredentialRequestOptionsMutation] = useMutation<GQL.CreateWebAuthnCredentialRequestOptionsMutation, GQL.CreateWebAuthnCredentialRequestOptionsMutationVariables>(CREATE_WEB_AUTHN_CREDENTIAL_REQUEST_OPTIONS_MUTATION,
  );

  const createWebAuthnCredentialRequestOptions = async ({ username }) => {
    return createWebAuthnCredentialRequestOptionsMutation({
      variables: { username },
    });
  };
  return { createWebAuthnCredentialRequestOptions };
};

export default useCreateWebAuthnCredentialRequestOptions;

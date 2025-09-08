import { gql } from '@apollo/client';

import { useMutation } from '@apollo/client/react';

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser(
    $username: String
    $email: String
    $plainPassword: String
    $profile: UserProfileInput
    $webAuthnPublicKeyCredentials: JSON
  ) {
    createUser(
      username: $username
      email: $email
      password: $plainPassword
      profile: $profile
      webAuthnPublicKeyCredentials: $webAuthnPublicKeyCredentials
    ) {
      _id
      tokenExpires
    }
  }
`;

const useCreateUser = () => {
  const [createUserMutation, { data, error, loading }] =
    useMutation<any>(CREATE_USER_MUTATION);

  const createUser = async ({
    username,
    email,
    password,
    profile,
    webAuthnPublicKeyCredentials,
  }) => {
    const variables = {
      username: null,
      email: null,
      profile,
      plainPassword: null,
      webAuthnPublicKeyCredentials,
    };
    if (email) {
      variables.email = email;
    }
    if (username) {
      variables.username = username;
    }
    variables.plainPassword = password;
    return createUserMutation({
      variables,
      awaitRefetchQueries: true,
    });
  };
  const newUser = data?.createUser;

  return {
    createUser,
    newUser,
    error,
    loading,
  };
};

export default useCreateUser;

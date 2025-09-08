import { gql } from '@apollo/client';

import { useMutation } from '@apollo/client/react';

export const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword(
    $newPlainPassword: String!
    $oldPlainPassword: String!
  ) {
    changePassword(
      newPassword: $newPlainPassword
      oldPassword: $oldPlainPassword
    ) {
      success
    }
  }
`;

const useChangePassword = () => {
  const [changePasswordMutation, { loading, error }] = useMutation<any>(
    CHANGE_PASSWORD_MUTATION,
  );

  const changePassword = async ({ oldPassword, newPassword }) => {
    const { data } = await changePasswordMutation({
      variables: {
        oldPlainPassword: oldPassword,
        newPlainPassword: newPassword,
      },
    });
    return data?.changePassword;
  };

  return {
    changePassword,
    error,
    loading,
  };
};

export default useChangePassword;

import { useMutation, gql } from '@apollo/client';

export const SET_PASSWORD_MUTATION = gql`
  mutation SetPassword($newPlainPassword: String!, $userId: ID!) {
    setPassword(newPassword: $newPlainPassword, userId: $userId) {
      _id
    }
  }
`;

const useSetPassword = () => {
  const [setPasswordMutation] = useMutation(SET_PASSWORD_MUTATION);

  const setPassword = async ({ newPassword = undefined, userId }) => {
    const variables = { newPlainPassword: null, userId };

    variables.newPlainPassword = newPassword;

    return setPasswordMutation({ variables });
  };

  return {
    setPassword,
  };
};

export default useSetPassword;

import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { useAppContext } from '../../common/components/AppContextWrapper';
import isEmail from '../../common/utils/isEmail';

const LOG_IN_WITH_PASSWORD_MUTATION = gql`
  mutation LoginWithPassword(
    $username: String
    $email: String
    $plainPassword: String!
  ) {
    loginWithPassword(
      username: $username
      email: $email
      password: $plainPassword
    ) {
      _id

      tokenExpires
      user {
        _id
        allowedActions
        roles
      }
    }
  }
`;

const useLoginWithPassword = () => {
  const { emailSupportDisabled } = useAppContext();
  const [logInWithPasswordMutation, { client }] = useMutation<any>(
    LOG_IN_WITH_PASSWORD_MUTATION,
    {
      errorPolicy: 'all',
    },
  );

  const logInWithPassword = async ({ usernameOrEmail, password }) => {
    const variables: any = {
      username: null,
      plainPassword: null,
    };

    if (!emailSupportDisabled && isEmail(usernameOrEmail)) {
      const normalizedEmail = usernameOrEmail?.trim();
      variables.email = normalizedEmail;
    } else {
      variables.username = usernameOrEmail;
    }

    variables.plainPassword = password;

    const result = await logInWithPasswordMutation({
      variables,
      awaitRefetchQueries: true,
    });

    await client.resetStore();
    return result;
  };

  return {
    logInWithPassword,
  };
};

export default useLoginWithPassword;

import { useMutation, gql } from '@apollo/client';

export const ADD_EMAIL_MUTATION = gql`
  mutation AddEmail($email: String!) {
    addEmail(email: $email) {
      _id
      emails {
        address
        verified
      }
    }
  }
`;

const useAddEmail = () => {
  const [addEmailMutation, { error }] = useMutation(ADD_EMAIL_MUTATION);

  const addEmail = async (email) => {
    return addEmailMutation({
      variables: { email },
    });
  };

  return {
    addEmail,
    error,
  };
};

export default useAddEmail;

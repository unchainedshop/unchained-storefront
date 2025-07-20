import { useMutation, gql } from '@apollo/client';

const UPDATE_CART_CONTACT_MUTATION = gql`
  mutation UpdateCartContact($contact: ContactInput) {
    updateCart(contact: $contact) {
      _id
      contact {
        emailAddress
        telNumber
      }
    }
  }
`;

const useUpdateCartContact = () => {
  const [updateCartContactMutation] = useMutation(UPDATE_CART_CONTACT_MUTATION);

  const updateCartContact = async ({ contact }) => {
    await updateCartContactMutation({ variables: { contact } });
  };

  return {
    updateCartContact,
  };
};

export default useUpdateCartContact;

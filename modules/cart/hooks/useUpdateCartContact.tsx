import { gql } from '@apollo/client';

import { useMutation } from '@apollo/client/react';

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
  const [updateCartContactMutation] = useMutation<any>(
    UPDATE_CART_CONTACT_MUTATION,
  );

  const updateCartContact = async ({ contact }) => {
    await updateCartContactMutation({ variables: { contact } });
  };

  return {
    updateCartContact,
  };
};

export default useUpdateCartContact;

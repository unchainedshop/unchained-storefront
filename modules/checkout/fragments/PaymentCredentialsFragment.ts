import { gql } from '@apollo/client';

const PaymentCredentialsFragment = gql`
  fragment PaymentCredentialsFragment on PaymentCredentials {
    _id
    isValid
    isPreferred
    paymentProvider {
      _id
      type
      interface {
        _id
        label
      }
    }
  }
`;

export default PaymentCredentialsFragment;

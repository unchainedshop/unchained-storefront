import { gql } from "@apollo/client";

const SimpleProductPrice = gql`
  fragment SimpleProductPrice on SimpleProduct {
    simulatedPrice {
      isTaxable
      isNetPrice
      amount
      currencyCode
    }
  }
`;

export default SimpleProductPrice;

import { useMutation, gql } from '@apollo/client';

const STORE_SUBSCRIPTION_MUTATION = gql`
  mutation StorePushSubscription($subscription: JSON!) {
    addPushSubscription(subscription: $subscription) {
      _id
      pushSubscriptions {
        _id
        endpoint
        expirationTime
        userAgent
      }
    }
  }
`;

const useStorePushSubscription = () => {
  const [storeSubscriptionMutation] = useMutation(STORE_SUBSCRIPTION_MUTATION);

  const storeSubscription = async ({ subscription }) => {
    return storeSubscriptionMutation({ variables: { subscription } });
  };

  return {
    storeSubscription,
  };
};

export default useStorePushSubscription;

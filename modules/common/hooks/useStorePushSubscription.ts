import { gql } from '@apollo/client';

import { useMutation } from '@apollo/client/react';
import type * as GQL from '../../apollo/generated';

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
  const [storeSubscriptionMutation] = useMutation<GQL.StorePushSubscriptionMutation, GQL.StorePushSubscriptionMutationVariables>(STORE_SUBSCRIPTION_MUTATION,
  );

  const storeSubscription = async ({ subscription }) => {
    return storeSubscriptionMutation({ variables: { subscription } });
  };

  return {
    storeSubscription,
  };
};

export default useStorePushSubscription;

import { gql } from '@apollo/client';

import { useMutation } from '@apollo/client/react';

const REMOVE_SUBSCRIPTION_MUTATION = gql`
  mutation RemovePushNotificationSubscription($p256dh: String!) {
    removePushSubscription(p256dh: $p256dh) {
      _id
    }
  }
`;

const useRemovePushNotificationSubscription = () => {
  const [removePushNotificationSubscriptionMutation] = useMutation<any>(
    REMOVE_SUBSCRIPTION_MUTATION,
  );

  const removePushNotificationSubscription = async ({ p256dh }) => {
    return removePushNotificationSubscriptionMutation({
      variables: { p256dh },
    });
  };

  return {
    removePushNotificationSubscription,
  };
};

export default useRemovePushNotificationSubscription;

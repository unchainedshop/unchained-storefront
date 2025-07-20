import React from 'react';

const PushNotificationContext = React.createContext<{
  isSubscribed: boolean;
  disabledForCurrentBrowser: boolean;
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
}>({
  subscribe: async () => false,
  unsubscribe: async () => false,
  isSubscribed: false,
  disabledForCurrentBrowser: false,
});

export default PushNotificationContext;

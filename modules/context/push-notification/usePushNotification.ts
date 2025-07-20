import { useContext } from 'react';
import PushNotificationContext from './PushNotificationContext';

const usePushNotification = () => {
  return useContext(PushNotificationContext);
};

export default usePushNotification;

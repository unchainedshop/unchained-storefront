 
import React, {
  useEffect,
  useMemo,
  useRef,
  useCallback,
  useState,
} from "react";
import useUser from "../../auth/hooks/useUser";
import useRemovePushNotificationSubscription from "../../common/hooks/useRemovePushNotificationSubscription";
import useShopInfo from "../../common/hooks/useShopInfo";
import useStorePushSubscription from "../../common/hooks/useStorePushSubscription";

import PushNotificationContext from "./PushNotificationContext";

const getRegistrationAndSubscription = async () => {
  if (typeof window === "undefined") return undefined;
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) return { registration: null, subscription: null };

  const subscription = await registration.pushManager.getSubscription();
  return { registration, subscription };
};

const getP256dh = async () => {
  const { subscription } = await getRegistrationAndSubscription();
  if (!subscription) return null;
  const subscriptionJSON = subscription.toJSON();
  return subscriptionJSON?.keys?.p256dh;
};

const PushNotificationWrapper = ({ children }) => {
  const [subscribed, setSubscribed] = useState(false);
  const { shopInfo } = useShopInfo();
  const { user } = useUser();
  const [disabledForCurrentBrowser, setDisabledForCurrentBrowser] = useState();

  const urlBase64ToUint8ArrayCache = useRef(null);
  const { storeSubscription } = useStorePushSubscription();
  const { removePushNotificationSubscription } =
    useRemovePushNotificationSubscription();

  const urlBase64ToUint8Array = useMemo(() => {
    return (base64String) => {
      if (
        urlBase64ToUint8ArrayCache.current &&
        urlBase64ToUint8ArrayCache.current[base64String]
      ) {
        return urlBase64ToUint8ArrayCache.current[base64String];
      }

      const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; i += 1) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      urlBase64ToUint8ArrayCache.current = {
        ...urlBase64ToUint8ArrayCache.current,
        [base64String]: outputArray,
      };
      return outputArray;
    };
  }, []);

  const requestPermission = async () => {
    if (typeof window === "undefined") return undefined;
    return Notification.requestPermission();
  };

  async function registerSubscription(vapidPublicKey) {
    const { registration } = await getRegistrationAndSubscription();
    if (!registration) return undefined;
    const subscriptionOptions = {
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    };
    return registration.pushManager.subscribe(subscriptionOptions);
  }

  useEffect(() => {
    if (user) setSubscribed(!!localStorage.getItem(`p256dh`));
  }, [user]);

  useEffect(() => {
    if (navigator && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.info("Service worker registered:", registration);
           
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            installingWorker.onstatechange = () => {
              if (installingWorker.state === "installed") {
                if (navigator.serviceWorker.controller) {
                  window.location.reload();
                }
              }
            };
          };
        })
        .catch((error) => {
          console.info("Service worker registration failed:", error);
        });
    }
  }, []);

  const subscribe = async () => {
    if (!shopInfo?.vapidPublicKey) {
      console.info("Push Notification is not configured on the server");
      return;
    }
    if (subscribed) {
      console.info("User is already subscribed to push notifications.");
      return;
    }

    const permission = await requestPermission();
    if (permission !== "granted") {
      console.info("Permission to send push notifications was denied.");
      return;
    }
    const subscription = await registerSubscription(shopInfo?.vapidPublicKey);
    await storeSubscription({ subscription });
    localStorage.setItem(`p256dh`, await getP256dh());

    console.info("User is subscribed to push notifications:");
    setSubscribed(true);
  };

  useEffect(() => {
    if (!user?._id) return;
    const checkSubscription = async () => {
      const currentPublicKey = await getP256dh();
      const isCurrentlySubscribed = user.pushSubscriptions?.some(
        ({ _id }) => _id === currentPublicKey,
      );

      const lastPublicKey = localStorage.getItem(`p256dh`);

      if (!isCurrentlySubscribed && lastPublicKey) {
        await removePushNotificationSubscription({
          p256dh: lastPublicKey,
        });
        localStorage.removeItem(`p256dh`);
      }
      setSubscribed(isCurrentlySubscribed);
    };
    checkSubscription();
  }, [user]);

  useEffect(() => {
    const isPreviouslyDisabled = async () => {
      const permission = await requestPermission();
      setDisabledForCurrentBrowser(permission !== "granted");
    };
    isPreviouslyDisabled();
  }, [user]);

  const unsubscribe = useCallback(async () => {
    const { subscription } = await getRegistrationAndSubscription();
    const lastPublicKey = localStorage.getItem(`p256dh`);
    if (!subscription) return;
    await removePushNotificationSubscription({
      p256dh: lastPublicKey,
    });
    await subscription.unsubscribe();
    localStorage.setItem(`p256dh`, "");
    setSubscribed(false);
  }, [user]);

  const ctx = useMemo(() => {
    return {
      subscribe,
      isSubscribed: subscribed,
      unsubscribe,
      disabledForCurrentBrowser,
    };
  }, [subscribed, shopInfo]);

  return (
    <PushNotificationContext.Provider value={ctx}>
      {children}
    </PushNotificationContext.Provider>
  );
};

export default PushNotificationWrapper;

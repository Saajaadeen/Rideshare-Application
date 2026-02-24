import { useEffect, useRef } from "react";

interface UsePushNotificationsOptions {
  isDriver: boolean | undefined;
  vapidPublicKey: string | undefined;
}

export function usePushNotifications({ isDriver, vapidPublicKey }: UsePushNotificationsOptions) {
  const endpointRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isDriver) return;
    if (!vapidPublicKey) return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    let registration: ServiceWorkerRegistration;

    async function setup() {
      registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      const existing = await registration.pushManager.getSubscription();
      const subscription =
        existing ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: vapidPublicKey,
        }));

      const json = subscription.toJSON();
      endpointRef.current = json.endpoint ?? null;

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          endpoint: json.endpoint,
          keys: {
            p256dh: json.keys?.p256dh,
            auth: json.keys?.auth,
          },
        }),
      });
    }

    setup().catch(() => {});

    return () => {
      if (endpointRef.current) {
        fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ endpoint: endpointRef.current }),
          keepalive: true,
        }).catch(() => {});
      }
    };
  }, [isDriver, vapidPublicKey]);
}

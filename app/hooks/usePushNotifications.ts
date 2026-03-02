import { useEffect, useRef, useCallback, useMemo } from "react";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications(vapidPublicKey: string | undefined) {
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);

  // iOS only supports push in standalone (Home Screen) mode
  const needsInstall = useMemo(() => {
    if (typeof window === "undefined") return false;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true;
    return isIOS && !isStandalone;
  }, []);

  // Register the service worker once on mount — always needed regardless of mode
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").then((reg) => {
      registrationRef.current = reg;
    }).catch(() => {});
  }, []);

  const subscribe = useCallback(async () => {
    if (!vapidPublicKey || !("PushManager" in window)) return;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    await navigator.serviceWorker.ready;
    const reg = registrationRef.current ?? await navigator.serviceWorker.ready;
    registrationRef.current = reg;

    const existing = await reg.pushManager.getSubscription();
    const subscription = existing ?? await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    const json = subscription.toJSON();
    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        endpoint: json.endpoint,
        keys: { p256dh: json.keys?.p256dh, auth: json.keys?.auth },
      }),
    }).catch(() => {});
  }, [vapidPublicKey]);

  const unsubscribe = useCallback(async () => {
    const reg = registrationRef.current;
    if (!reg) return;

    const subscription = await reg.pushManager.getSubscription();
    if (!subscription) return;

    const endpoint = subscription.endpoint;
    await subscription.unsubscribe();

    await fetch("/api/push/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ endpoint }),
      keepalive: true,
    }).catch(() => {});
  }, []);

  return { subscribe, unsubscribe, needsInstall };
}

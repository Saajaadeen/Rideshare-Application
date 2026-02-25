import 'dotenv/config';
import webpush from 'web-push';
import { prisma } from './db.server';

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidEmail = process.env.VAPID_EMAIL;

if (!vapidPublicKey || !vapidPrivateKey || !vapidEmail) {
  throw new Error('VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, and VAPID_EMAIL must be set');
}

webpush.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey);

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
}

export async function sendPushNotification(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payload: PushPayload
): Promise<void> {
  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth,
        },
      },
      JSON.stringify(payload)
    );
  } catch (error: unknown) {
    const statusCode = (error as { statusCode?: number }).statusCode;
    if (statusCode === 410 || statusCode === 404) {
      // Subscription is expired or invalid — remove it
      await prisma.pushSubscription.deleteMany({
        where: { endpoint: subscription.endpoint },
      });
    }
  }
}

export async function sendPushToDriversAtBase(
  baseId: string,
  payload: PushPayload
): Promise<void> {
  const subscriptions = await prisma.pushSubscription.findMany({
    where: {
      user: {
        baseId,
        isDriver: true,
      },
    },
    select: {
      endpoint: true,
      p256dh: true,
      auth: true,
    },
  });

  await Promise.allSettled(
    subscriptions.map((sub) => sendPushNotification(sub, payload))
  );
}

export async function getActiveDrivers(userId: string){
  const available = await prisma.pushSubscription.findFirst({
    where: {
      userId
    },
    select:{
      id: true,
    }
  });

  const driverCount = await prisma.pushSubscription.count({});
  
  return {
    isAvailable: !!available,
    driverCount
  }
}

// routes/broadcast/sse.ts
import type { LoaderFunctionArgs } from "react-router";
import { eventStream } from "remix-utils/sse/server";
import { requireSameOrigin, requireUserId } from "server/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  requireSameOrigin(request);
  const userId = await requireUserId(request);

  return eventStream(request.signal, (send) => {
    send({
      event: "connected",
      data: JSON.stringify({ 
        userId, 
        timestamp: Date.now(),
        message: "SSE connection established"
      })
    });

    const heartbeatInterval = setInterval(() => {
      send({ 
        event: "heartbeat", 
        data: JSON.stringify({ timestamp: Date.now() })
      });
    }, 30000);

    return () => {
      clearInterval(heartbeatInterval);
      console.log(`[SSE] User ${userId} disconnected`);
    };
  });
}
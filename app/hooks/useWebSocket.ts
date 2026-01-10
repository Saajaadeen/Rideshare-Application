import { useEffect, useRef, useState } from "react";

export interface RideMessage {
  rideId: string;
  type: string;
  status?: string;
  userId?: string;
  driverId?: string;
  pickupLocation?: string;
  [key: string]: any;
}

export function useWebSocket(userId: string | null) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<RideMessage[]>([]);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!userId) return;

    const connect = () => {
      // Build WebSocket URL based on environment
      const getWsUrl = () => {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host; // includes port if present
        const wsPath = import.meta.env.VITE_WS_PATH || '';
        
        // In production behind Traefik, use the /ws path
        // In development, connect directly to the WebSocket port
        if (import.meta.env.VITE_WS_PATH) {
          return `${protocol}//${host}${wsPath}`;
        } else {
          // Development mode - connect directly to WebSocket port
          const wsPort = import.meta.env.VITE_WS_PORT || "3001";
          const wsHost = window.location.hostname;
          return `ws://${wsHost}:${wsPort}`;
        }
      };

      const wsUrl = getWsUrl();
      console.log("🔌 Connecting to WebSocket:", wsUrl);
      
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log("✅ WebSocket connected");
        setIsConnected(true);
        ws.current?.send(JSON.stringify({ type: "auth", userId }));
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Ignore auth and ping/pong messages
          if (data.type === "auth" || data.type === "pong") {
            console.log("📨 Received:", data.type);
            return;
          }

          console.log("📬 Received message:", data);

          setMessages((prev) => {
            const existingIndex = prev.findIndex(m => m.rideId === data.rideId);
            
            // Map message types to statuses
            let status = data.status;
            if (data.type === "new_ride_request") status = "requested";
            if (data.type === "accept_ride_request") status = "accepted_for_user";
            if (data.type === "ride_accepted") status = "accepted_for_driver";
            if (data.type === "user_cancelled_request") status = "cancelled";
            if (data.type === "user_cancelled_request_no_notification") status = "cancelled_no_notification";
            if (data.type === "driver_cancelled_ride") status = "requested"; // Reset to requested
            if (data.type === "user_picked_up") status = "picked_up";
            if (data.type === "user_dropped_off") status = "completed";

            const updatedMessage = {
              ...data,
              status,
              timestamp: Date.now(),
            };

            if (existingIndex !== -1) {
              const updated = [...prev];
              updated[existingIndex] = {
                ...updated[existingIndex],
                ...updatedMessage,
              };
              
              // Remove completed or cancelled rides after a delay
              if (status === "completed" || status === "cancelled") {
                setTimeout(() => {
                  setMessages(current => current.filter(m => m.rideId !== data.rideId));
                }, 2000); // Give 2 seconds for UI to show final state
              }
              
              return updated;
            } else {
              return [...prev, updatedMessage];
            }
          });
        } catch (error) {
          console.error("❌ Parse error:", error);
        }
      };

      ws.current.onclose = () => {
        console.log("🔌 WebSocket disconnected");
        setIsConnected(false);
        
        reconnectTimeout.current = setTimeout(() => {
          console.log("🔄 Reconnecting...");
          connect();
        }, 3000);
      };

      ws.current.onerror = (error) => {
        console.error("❌ WebSocket error:", error);
      };
    };

    connect();

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      ws.current?.close();
    };
  }, [userId]);

  const sendMessage = (data: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    } else {
      console.warn("⚠️ WebSocket is not connected");
    }
  };

  return { isConnected, messages, sendMessage };
}

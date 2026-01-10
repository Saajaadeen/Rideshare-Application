import axios from "axios";

const WS_PROTOCOL = process.env.VITE_WS_PROTOCOL || 'http';
const WS_DOMAIN = process.env.VITE_WS_DOMAIN || 'localhost';
const WS_PORT = process.env.VITE_WS_PORT;
const WS_PATH = process.env.VITE_WS_PATH || '';

// Build the WebSocket API URL
const getWsApiUrl = () => {
  if (WS_PORT && (WS_PORT !== '80' && WS_PORT !== '443')) {
    return `${WS_PROTOCOL}://${WS_DOMAIN}:${WS_PORT}${WS_PATH}`;
  }
  return `${WS_PROTOCOL}://${WS_DOMAIN}${WS_PATH}`;
};

const WS_API_URL = getWsApiUrl();

export async function notifyDriversOfNewRide(rideId: string, pickupLocation: string) {
  try {
    await axios.post(`${WS_API_URL}/broadcast`, {
      type: "new_ride_request",
      rideId: rideId,
      pickupLocation: pickupLocation
    });
  } catch (error) {
    console.error("Failed to notify drivers:", error);
  }
}

export async function notifyRiderOfConfirmation(rideId: string, userId: string) {
  try {
    await axios.post(`${WS_API_URL}/notify/${userId}`, {
      rideId: rideId,
      confirm: true,
      type: "accept_ride_request",
    });

    await axios.post(`${WS_API_URL}/broadcast`, {
      type: "ride_accepted",
      rideId: rideId
    });
  } catch (error) {
    console.error("Failed to notify rider:", error);
  }
}

export async function notifyRiderOfCancellation(rideId: string, userId: string) {
  try {
    await axios.post(`${WS_API_URL}/notify/${userId}`, {
      rideId: rideId,
      confirm: true,
      type: "driver_cancelled_ride"
    });
    
    await axios.post(`${WS_API_URL}/broadcast`, {
      type: "new_ride_request",
      rideId: rideId
    });
  } catch (error) {
    console.error("Failed to notify rider:", error);
  }
}

export async function notifyDriverOfCancelation(rideId: string, userId?: string) {
  try {
    if(userId){
      await axios.post(`${WS_API_URL}/notify/${userId}`, {
        type: "user_cancelled_request",
        rideId: rideId,
      });
    } else {
      await axios.post(`${WS_API_URL}/broadcast`, {
        type: "user_cancelled_request_no_notification",
        rideId,
      })
    }
  } catch (error) {
    console.error("Failed to notify driver:", error);
  }
}

export async function notifyPassengerOfPickup(requestId: string, userId: string) {
  try {
    await axios.post(`${WS_API_URL}/notify/${userId}`, {
      type: "user_picked_up",
      rideId: requestId
    });
  } catch (error) {
    console.error("Failed to notify passenger:", error);
  }
}

export async function notifyPassengerOfDropoff(requestId: string, userId: string) {
  try {
    await axios.post(`${WS_API_URL}/notify/${userId}`, {
      type: "user_dropped_off",
      rideId: requestId
    });
  } catch (error) {
    console.error("Failed to notify passenger:", error);
  }
}

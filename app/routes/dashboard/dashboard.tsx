import { useEffect, useRef } from "react";
import {
  useLoaderData,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  useRevalidator,
} from "react-router";
import { toast } from "react-toastify";
// import { notifyDriversOfNewRide } from "server";
import {
  cancelRequest,
  createRequest,
  getPassengerRequest,
  getDriverRequest,
  getActiveRequest,
  acceptRequest,
  pickupRequest,
  dropOffRequest,
  cancelAcceptedRide,
} from "server/queries/request.queries.server";
import { getStop } from "server/queries/station.queries.server";
import { getUserInfo } from "server/queries/user.queries.server";
import { requireUserId } from "server/session.server";
import DashboardForm from "~/components/Forms/DashboardForm";
import MapDisplay from "~/components/Maps/MapDisplay";
import { useRideNotifications } from "~/hooks/useRideNotifications";
import { useWebSocket } from "~/hooks/useWebSocket";
import type { Route } from "../../+types/root";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const user = await getUserInfo("dashboard", userId);
  const station = await getStop(user?.base?.id);
  const passenger = await getPassengerRequest(userId);
  const accepted = await getDriverRequest(userId);
  const activeRequests = await getActiveRequest(user?.base?.id);

  return { user, station, accepted, activeRequests, requestInfo: passenger };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent") as string;
  const requestId = (formData.get("requestId") as string) || undefined;
  const driverId = (formData.get("driverId") as string) || undefined;
  const userId = (formData.get("userId") as string) || undefined;
  const baseId = (formData.get("baseId") as string) || undefined;
  const pickupId = (formData.get("pickupId") as string) || undefined;
  const dropoffId = (formData.get("dropoffId") as string) || undefined;
  const rideConfirmOrCancel = (formData.get("submit") as string) || undefined

  if (intent === "createRequest") {
    createRequest(userId!, baseId!, pickupId!, dropoffId!);
    return { success: true, message: "Ride Requested!"}
  }
  if (intent === "cancelRequest") {
    cancelRequest(requestId!, driverId!);
    return { success: false, message: "Ride Cancelled!"}
  }
  if (intent === "acceptRequest") {
    acceptRequest(requestId!, driverId! , userId!);
  }
  if (intent === "pickupRequest") {
    if(rideConfirmOrCancel === "confirm")   
      pickupRequest(requestId!, userId!);
    else
      cancelAcceptedRide(requestId!, userId!, pickupId!);
  }
  if (intent === "dropOffRequest") {
    dropOffRequest(requestId!, userId!);
  }
}

export default function Dashboard({ loaderData, actionData }: Route.ComponentProps) {
  const { user, station, accepted, activeRequests, requestInfo } = loaderData;

  const revalidate = useRevalidator();
  const { isConnected, messages, sendMessage } = useWebSocket(user?.id);
  const { rideData } = useRideNotifications(user?.id);
  
  // Track which messages we've already processed
  const lastProcessedIndex = useRef(0);
  const processedAcceptedRides = useRef(new Set<string>());

  useEffect(() => {
    if (!messages || messages.length === 0) return;
    
    // Only look at NEW messages since last check
    const newMessages = messages.slice(lastProcessedIndex.current);
    
    if (newMessages.length === 0) return;
    
    console.log(`Processing ${newMessages.length} new messages`);
    
    // Update the index BEFORE processing to avoid reprocessing
    lastProcessedIndex.current = messages.length;

    let shouldRevalidate = false;

    // Process each new message
    newMessages.forEach(message => {
      console.log('Processing message:', message);
      
      switch (message.type) {
        case "new_ride_request":
          console.log('New ride request:', message.rideId);
          shouldRevalidate = true;
          break;
          
        case "accept_ride_request":
          if (!processedAcceptedRides.current.has(message.rideId)) {
            console.log('Ride accepted:', message.rideId);
            processedAcceptedRides.current.add(message.rideId);
            shouldRevalidate = true;
          }
          break;
          
        case "user_cancelled_request":
          console.log('User cancelled request:', message.rideId);
          shouldRevalidate = true;
          break;
          
        case "driver_cancelled_ride":
          console.log('Driver cancelled ride:', message.rideId);
          // CRITICAL: Remove from processed so it can be re-accepted
          processedAcceptedRides.current.delete(message.rideId);
          shouldRevalidate = true;
          break;
          
        case "user_picked_up":
          console.log('User picked up:', message.rideId);
          shouldRevalidate = true;
          break;
          
        case "user_dropped_off":
          console.log('User dropped off:', message.rideId);
          shouldRevalidate = true;
          break;
          
        case "ride_accepted":
          console.log('Ride accepted (broadcast):', message.rideId);
          shouldRevalidate = true;
          break;
      }
    });

    if (shouldRevalidate) {
      console.log('Revalidating...');
      revalidate.revalidate();
    }
  }, [messages, revalidate]);

  useEffect(() => {
    if (actionData?.success) {
      toast.success(actionData.message);
    }
    if (actionData && !actionData?.success) {
      toast.error(actionData.message);
    }
  }, [actionData]);

  return (
    <div>
      <MapDisplay user={user} station={station} />
      <DashboardForm
        user={user}
        station={station}
        accepted={accepted}
        activeRequests={activeRequests}
        requestInfo={requestInfo}
      />
    </div>
  );
}
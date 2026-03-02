import { useEffect, useState } from "react";
import { Form } from "react-router";
import { MapPinIcon } from "../Icons/MapPinIcon";
import { NavigationIcon } from "../Icons/NavigationIcon";
import { AuthenticityTokenInput } from "remix-utils/csrf/react";
import SearchableCombobox from "../Input/SearchableCombobox";

export default function LeftSidePassengerForm({ user, station, params, actionData, activePassengerRequests, driverCount }: any) {
  const [fromLocation, setFromLocation] = useState(params?.pickupId ?? "");
  const [toLocation, setToLocation] = useState(params?.dropoffId ?? "");
  const [drivers, setDrivers] = useState(driverCount)

  // Reset states when form is successfully submitted
  useEffect(() => {
    if (actionData?.success) {
      setFromLocation("");
      setToLocation("");
    }
  }, [actionData]);

  // Clear dropoff if it matches the new pickup
  useEffect(() => {
    if (fromLocation && toLocation && fromLocation === toLocation) {
      setToLocation("");
    }
  }, [fromLocation]);

  useEffect(() => {
    setDrivers(driverCount)
  },[driverCount])

  const hasActiveRequest = activePassengerRequests.some(r => r.user.id === user.id && (r.status === "Pending" || r.status === "Accepted" || r.status === "In-Progress"))

  const isButtonEnabled =
    !user?.isReset &&
    !!user?.base?.id &&
    fromLocation &&
    toLocation &&
    fromLocation !== toLocation &&
    !hasActiveRequest;

  return (
    <Form method="post" >
      <AuthenticityTokenInput />
      <input type="hidden" name="intent" value="createRequest" />
      <input type="hidden" name="userId" value={user?.id} />
      <input type="hidden" name="baseId" value={user?.base?.id} />
      <div className="flex w-full justify-end mb-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-md border border-blue-100">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${drivers > 0 ? 'bg-green-400': 'bg-red-400'}  opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${drivers > 0 ? 'bg-green-500': 'bg-red-500'} `}></span>
          </span>
          <span className="text-xs font-semibold text-gray-700">
            {drivers} Active {drivers === 1 ? "Driver" : "Drivers"}
          </span>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <SearchableCombobox
          label="Pickup Location"
          name="pickupId"
          value={fromLocation}
          onChange={setFromLocation}
          options={station}
          icon={MapPinIcon}
        />
        <SearchableCombobox
          label="Dropoff Location"
          name="dropoffId"
          value={toLocation}
          onChange={setToLocation}
          options={station}
          excludeId={fromLocation}
          icon={NavigationIcon}
        />
      </div>

      <button
        type="submit"
        disabled={!isButtonEnabled}
        className={`w-full py-2 rounded font-semibold text-white ${
          isButtonEnabled
            ? "bg-blue-700 hover:bg-blue-800"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Request Ride
      </button>

      {!isButtonEnabled && (
        <div className="text-sm text-gray-800 text-center">
        </div>
      )}
    </Form>
  );
}

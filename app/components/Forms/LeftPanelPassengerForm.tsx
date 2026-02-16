import { useEffect, useState } from "react";
import { Form } from "react-router";
import { MapPinIcon } from "../Icons/MapPinIcon";
import { NavigationIcon } from "../Icons/NavigationIcon";
import { AuthenticityTokenInput } from "remix-utils/csrf/react";
import SearchableCombobox from "../Input/SearchableCombobox";

export default function LeftSidePassengerForm({ user, station, params, actionData, activePassengerRequests }: any) {
  const [fromLocation, setFromLocation] = useState(params?.pickupId ?? "");
  const [toLocation, setToLocation] = useState(params?.dropoffId ?? "");

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

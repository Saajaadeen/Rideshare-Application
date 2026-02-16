import { useEffect, useState } from "react";
import { BaseBoundIcon } from "../Icons/BaseBoundIcon";
import { MapPinIcon } from "../Icons/MapPinIcon";
import { NavigationIcon } from "../Icons/NavigationIcon";
import LeftPanelRequestsForm from "./LeftPanelRequestsForm";
import { Form } from "react-router";
import { AuthenticityTokenInput } from "remix-utils/csrf/react";
import SearchableCombobox from "../Input/SearchableCombobox";

export default function LeftSideRidePanelForm({ user, station, requestInfo, activeRequests }: any) {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const haveActiveRequests = activeRequests.filter(r => r.user.id === user.id && (r.status === "Pending" || r.status === "Accepted"))

  // Clear dropoff if it matches the new pickup
  useEffect(() => {
    if (fromLocation && toLocation && fromLocation === toLocation) {
      setToLocation("");
    }
  }, [fromLocation]);

  const isButtonEnabled =
    !user?.isReset &&
    !!user?.base?.id &&
    fromLocation &&
    toLocation &&
    fromLocation !== toLocation &&
    !haveActiveRequests;

  const getDisabledReason = () => {
    if (user?.isReset) return "Please create a new password to continue.";
    if (!user?.base?.id) return "Please choose a base to continue.";
    if (!fromLocation || !toLocation)
      return "Select both pickup and dropoff locations.";
    if (fromLocation === toLocation)
      return "Pickup and dropoff cannot be the same.";
    return "";
  };

  const [showMain, setShowMain] = useState(true)

  return (
    <>
    {!showMain &&
      <div className="absolute top-7 left-6 rounded-xl">
        <div className="bg-linear-to-br from-blue-600 to-indigo-700 text-white flex rounded-xl items-center gap-3">
          <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl" onClick={() => setShowMain(true)}>
            <BaseBoundIcon className="w-6 h-6"/>
          </div>
        </div>
      </div>
    }
      {showMain && <><div className="absolute top-0 left-0 md:top-8 md:left-8 z-50 w-screen md:w-96 h-screen md:h-fit bg-white md:rounded-2xl shadow-2xl md:border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white flex items-center gap-3">
          <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
            <BaseBoundIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Base Bound</h1>
            <p className="text-blue-100 text-sm">Request Your Ride</p>
          </div>
        </div>

        <div className="p-6">
          <Form method="post" action="/dashboard">
            <AuthenticityTokenInput />
            <input type="hidden" name="intent" value="createRequest" />
            <input type="hidden" name="userId" value={user?.id} />

            <div className="space-y-4 mb-6 text-gray-700">
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
              className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-200 ${
                isButtonEnabled
                  ? "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98] cursor-pointer"
                  : "bg-gray-300 cursor-not-allowed opacity-60"
              }`}
              title={getDisabledReason()}
            >
              Request Ride
            </button>

            {!isButtonEnabled && (
              <p className="text-center text-sm text-gray-500 mt-3">
                {getDisabledReason()}
              </p>
            )}
          </Form>
        </div>
      </div>

      <LeftPanelRequestsForm requestInfo={requestInfo}/></>}
    </>
  );
}

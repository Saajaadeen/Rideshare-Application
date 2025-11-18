import { useEffect, useState } from "react";
import LocationSelect from "../Input/LocationSelect";
import { MapPinIcon } from "../Icons/MapPinIcon";
import { NavigationIcon } from "../Icons/NavigationIcon";
import { useSearchParams } from "react-router";

export default function LeftSidePassengerForm({ user, station, params}: any) {
  const from = params.get('pickupId') ?? ''
  const to = params.get('dropoffId') ?? ''
  const [fromLocation, setFromLocation] = useState(from);
  const [toLocation, setToLocation] = useState(to);
  const [searchParams, setSearchParams] = useSearchParams();

  const isButtonEnabled =
    !user?.isReset &&
    !!user?.baseId &&
    fromLocation &&
    toLocation &&
    fromLocation !== toLocation;

  const getDisabledReason = () => {
    if (user?.isReset) return "Please create a new password to continue.";
    if (!user?.baseId) return "Please choose a base to continue.";
    if (!fromLocation || !toLocation)
      return "Select both pickup and dropoff locations.";
    if (fromLocation === toLocation)
      return "Pickup and dropoff cannot be the same.";
    return "";
  };
  useEffect(() => {
    if(!from){
      setFromLocation('')
    }
    if(!to){
      setToLocation('')
    }
  }, [params])

  return (
    <>
      <form method="post" action="/dashboard?mode=passenger">
        <input type="hidden" name="intent" value="requestPickup" />
        <input type="hidden" name="userId" value={user?.id} />
        <input type="hidden" name="baseId" value={user?.baseId} />

        <div className="space-y-4 mb-6 text-gray-700">
          <LocationSelect
            label="Pickup Location"
            value={fromLocation}
            onChange={(e) => {
              setSearchParams((prev) => {
                const params = new URLSearchParams(prev);
                params.set("pickupId", e.currentTarget.value);
                return params
              })
              setFromLocation(e.target.value)}}
            options={station}
            excludeId=""
            icon={MapPinIcon}
            name="pickupId"
          />

          <LocationSelect
            label="Dropoff Location"
            value={toLocation}
            onChange={(e) => {
              setSearchParams((prev) => {
                const params = new URLSearchParams(prev);
                params.set("dropoffId", e.currentTarget.value);
                return params
              })
              setToLocation(e.target.value)}}
            options={station}
            excludeId={fromLocation}
            icon={NavigationIcon}
            name="dropoffId"
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
      </form>
    </>
  );
}

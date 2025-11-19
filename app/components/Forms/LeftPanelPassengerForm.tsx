import { useState } from "react";
import { Form } from "react-router";

export default function LeftSidePassengerForm({ user, station, params }: any) {
  const [fromLocation, setFromLocation] = useState(params?.pickupId ?? "");
  const [toLocation, setToLocation] = useState(params?.dropoffId ?? "");

  const isButtonEnabled =
    !user?.isReset &&
    !!user?.base?.id &&
    fromLocation &&
    toLocation &&
    fromLocation !== toLocation;

  const getDisabledReason = () => {
    if (user?.isReset) return <p className="rounded-full border border-1 border-red-500 bg-red-200 hover:bg-red-300 select-none py-1.5 px-2 transition duration-300 ease-in-out">Please create a new password to continue.</p>;
    if (!user?.base?.id) return <p className="rounded-full border border-1 border-red-500 bg-red-200 hover:bg-red-300 select-none py-1.5 px-2 transition duration-300 ease-in-out">Please choose a base to continue.</p>;
    if (!fromLocation || !toLocation) return <p className="rounded-full border border-1 border-yellow-500 bg-yellow-200 hover:bg-yellow-300 select-none py-1.5 px-2 transition duration-300 ease-in-out">Select both pickup and dropoff locations.</p>;
    if (fromLocation === toLocation) return <p className="rounded-full border border-1 border-red-500 bg-red-200 hover:bg-red-300 select-none py-1.5 px-2 transition duration-300 ease-in-out">Pickup and dropoff cannot be the same.</p>;
    return "";
  };

  return (
    <Form method="post" action="/dashboard?mode=passenger">
      <input type="hidden" name="intent" value="requestPickup" />
      <input type="hidden" name="userId" value={user?.id} />
      <input type="hidden" name="baseId" value={user?.base?.id} />

      <div className="space-y-4 mb-6">
        <div>
          <label className="block mb-1 text-gray-600 font-medium">Pickup Location</label>
          <select
            name="pickupId"
            value={fromLocation}
            onChange={(e) => setFromLocation(e.target.value)}
            className="w-full p-2 border-1 border-gray-600 rounded text-gray-600 bg-white"
          >
            <option value="">Select pickup...</option>
            {station.map((s: any) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-gray-600 font-medium">Dropoff Location</label>
          <select
            name="dropoffId"
            value={toLocation}
            onChange={(e) => setToLocation(e.target.value)}
            className="w-full p-2 border-1 border-gray-600 rounded text-gray-600 bg-white"
          >
            <option value="">Select dropoff...</option>
            {station
              .filter((s: any) => s.id !== fromLocation)
              .map((s: any) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={!isButtonEnabled}
        className={`w-full py-2 rounded font-semibold text-white ${
          isButtonEnabled ? "bg-blue-700 hover:bg-blue-800" : "bg-gray-400 cursor-not-allowed"
        }`}
        title={getDisabledReason()}
      >
        Request Ride
      </button>

      {!isButtonEnabled && (
        <p className="text-sm text-gray-800 mt-5 text-center">{getDisabledReason()}</p>
      )}
    </Form>
  );
}

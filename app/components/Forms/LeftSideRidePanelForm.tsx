import { useState, useEffect } from "react";
import { ClockIcon } from "../Icons/ClockIcon";
import { BaseBoundIcon } from "../Icons/BaseBoundIcon";
import { MapPinIcon } from "../Icons/MapPinIcon";
import { NavigationIcon } from "../Icons/NavigationIcon";
import { UserIcon } from "../Icons/UserIcon";

export default function LeftSideRidePanel({ user, station, requestInfo }: any) {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");

  const isButtonEnabled =
    !user.isReset &&
    !!user.baseId &&
    fromLocation &&
    toLocation &&
    fromLocation !== toLocation;

  const getDisabledReason = () => {
    if (user.isReset) return "Please create a new password to continue.";
    if (!user.baseId) return "Please choose a base to continue.";
    if (!fromLocation || !toLocation)
      return "Select both pickup and dropoff locations.";
    if (fromLocation === toLocation)
      return "Pickup and dropoff cannot be the same.";
    return "";
  };

  const formatTime = (date: Date) => {
    const diffMins = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / 60000
    );
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    return `${Math.floor(diffMins / 60)}h ago`;
  };

  const LocationSelect = ({
    label,
    value,
    onChange,
    excludeId,
    icon: Icon,
    name,
  }: any) => (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon className="w-5 h-5" />
        </div>
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer hover:bg-gray-100"
        >
          <option value="">Select {label.toLowerCase()}...</option>
          {station
            .filter((s: any) => s.id !== excludeId)
            .map((s: any) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
        </select>
      </div>
    </div>
  );

  const RequestItem = ({ request }: any) => {
    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
      const createdAt = new Date(request.createdAt).getTime();
      const expiration = createdAt + 10 * 60 * 1000; // 10 minutes in ms

      const updateTimer = () => {
        const now = Date.now();
        setTimeLeft(Math.max(0, expiration - now));
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }, [request.createdAt]);

    const formatCountdown = (ms: number) => {
      const totalSeconds = Math.floor(ms / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const isExpired = timeLeft <= 0;

    return (
      <form method="post" action="/dashboard" key={request.id}>
        <input type="hidden" name="intent" value="requestDelete" />
        <input type="hidden" name="requestId" value={request.id} />
        <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {request.user.firstName} {request.user.lastName}
              </p>
              <p className="text-xs text-gray-500">{request.user.phoneNumber}</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <ClockIcon className="w-6 h-6" />
              <span className="text-md">{isExpired ? "Expired" : formatCountdown(timeLeft)}</span>
            </div>
          </div>

          <div className="space-y-2">
            {["pickup", "dropoff"].map((type) => (
              <div key={type} className="flex items-start gap-2">
                <div className="mt-0.5">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      type === "pickup" ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-0.5">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </p>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {request[type].name}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse"></span>
              Pending
            </span>
            <button
              type="submit"
              disabled={isExpired}
              className={`px-3 py-0.5 rounded-full border text-xs transition-colors ${
                isExpired
                  ? "border-gray-300 bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-red-300 bg-red-200 text-red-400 hover:bg-red-400 hover:border-red-400 hover:text-white"
              }`}
            >
              {isExpired ? "Expired" : "Cancel Request"}
            </button>
          </div>
        </div>
      </form>
    );
  };

  return (
    <div className="absolute top-8 left-8 z-50 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
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
        <form method="post" action="/dashboard">
          <input type="hidden" name="intent" value="requestPickup" />
          <input type="hidden" name="userId" value={user.id} />
          <div className="space-y-4 mb-6 text-gray-700">
            <LocationSelect
              label="Pickup Location"
              value={fromLocation}
              onChange={(e: any) => setFromLocation(e.target.value)}
              excludeId=""
              icon={MapPinIcon}
              name="pickupId"
            />
            <LocationSelect
              label="Dropoff Location"
              value={toLocation}
              onChange={(e: any) => setToLocation(e.target.value)}
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
        </form>
        {!isButtonEnabled && (
          <p className="text-center text-sm text-gray-500 mt-3">
            {getDisabledReason()}
          </p>
        )}
      </div>

      <div className="border-t border-gray-100 bg-gray-50">
        <div className="p-4 pb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">
            Active Requests
          </h3>
          {requestInfo?.length > 0 && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              {requestInfo.length}
            </span>
          )}
        </div>
        <div className="max-h-64 overflow-y-auto px-4 pb-4">
          {requestInfo?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <ClockIcon className="w-6 h-6" />
              </div>
              <p className="text-sm">No active requests</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requestInfo.map((request: any) => (
                <RequestItem key={request.id} request={request} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

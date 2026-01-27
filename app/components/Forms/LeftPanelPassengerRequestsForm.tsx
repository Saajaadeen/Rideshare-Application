import { useState, useEffect } from "react";
import { UserIcon } from "../Icons/UserIcon";
import { ClockIcon } from "../Icons/ClockIcon";
import { Form } from "react-router";
import { AuthenticityTokenInput } from "remix-utils/csrf/react";
import { displayName } from "../Utilities/formatName";
import { ColorBadge } from "../Utilities/HexHelper";

export default function LeftPanelRequestsForm({ requestInfo }: any) {
  if (!requestInfo) requestInfo = [];

  const request = requestInfo[0]; // Only ever 1 request
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Reset modal when request changes
  useEffect(() => {
    setShowCancelModal(false);
  }, [request?.id]);

  const getStatusBadge = (status: string) => {
    const baseClass = "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold";

    switch (status) {
      case "Completed":
        return <span className={`${baseClass} bg-green-100 text-green-700`}>Completed</span>;
      case "Accepted":
        return <span className={`${baseClass} bg-blue-100 text-blue-700`}>Accepted</span>;
      case "In-Progress":
        return <span className={`${baseClass} bg-blue-200 text-blue-800`}>In-Progress</span>;
      case "Pending":
        return <span className={`${baseClass} bg-amber-100 text-amber-700`}>Pending</span>;
      case "Cancelled":
        return <span className={`${baseClass} bg-gray-200 text-gray-500`}>Cancelled</span>;
      default:
        return <span className={`${baseClass} bg-gray-100 text-gray-600`}>Unknown</span>;
    }
  };

  const isActiveOrPending = (status: string) => 
    status === "Accepted" || status === "Pending";

  return (
    <>
      <div className="md:fixed md:bottom-10 md:left-8 md:z-40 md:w-96 w-full bg-white rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-4 text-white flex justify-between items-center">
          <h3 className="text-lg font-semibold">Request</h3>
          {request && (
            <span className="px-2.5 py-1 bg-white/20 text-white text-xs font-bold rounded-full">
              Active
            </span>
          )}
        </div>

        <div className="p-3">
          {!request ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <ClockIcon className="w-8 h-8" />
              </div>
              <p className="text-sm font-medium">No request</p>
            </div>
          ) : (
            <Form
              method="post"
              action="/dashboard?mode=passenger"
              id="cancelRequestForm"
              className="bg-white p-4 rounded-xl"
            >
              <AuthenticityTokenInput />
              <input type="hidden" name="intent" value="cancelRequest" />
              <input type="hidden" name="requestId" value={request.id} />
              <input type="hidden" name="driverId" value={request.driverId} />

              <div className="space-y-3 mb-3">
                {/* Driver & Vehicle Info - Only show if driver exists */}
                {request.driver && (
                  <div className="flex items-center gap-4">
                    {/* Driver Info */}
                    <div className="flex items-center gap-2 flex-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                        <UserIcon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {displayName(request.driver.firstName, request.driver.lastName)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {request.driver.phoneNumber || "No phone"}
                        </p>
                      </div>
                    </div>

                    {/* Vehicle Info */}
                    {request.vehicle && (
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {[request.vehicle.year, request.vehicle.make, request.vehicle.model]
                            .filter(Boolean)
                            .join(" ")}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {request.vehicle.color && <ColorBadge hex={request.vehicle.color} />}
                          {request.vehicle.plate && (
                            <p className="text-xs text-gray-500">{request.vehicle.plate}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Pickup & Dropoff */}
                <div className="flex items-start gap-4">
                  <div className="flex items-start gap-2 flex-1">
                    <div className="w-2 h-2 rounded-full mt-1 bg-green-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">Pickup</p>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {request.pickup?.name || "Unknown"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 flex-1">
                    <div className="w-2 h-2 rounded-full mt-1 bg-red-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">Dropoff</p>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {request.dropoff?.name || "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              {request.pickedUpAt && (
                <p className="mt-1 text-xs text-gray-500">
                  <span className="font-medium text-gray-700">Picked up:</span>{" "}
                  {new Date(request.pickedUpAt).toLocaleString()}
                </p>
              )}
              {request.droppedOffAt && (
                <p className="text-xs text-gray-500">
                  <span className="font-medium text-gray-700">Dropped off:</span>{" "}
                  {new Date(request.droppedOffAt).toLocaleString()}
                </p>
              )}

              <div className="flex items-center justify-between mt-3 pt-3">
                {getStatusBadge(request.status)}

                <button
                  type={request.driver ? "button" : "submit"}
                  onClick={(e) => {
                    if (request.driver) {
                      e.preventDefault();
                      setShowCancelModal(true);
                    }
                  }}
                  className="px-4 py-2.5 min-h-[44px] font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600"
                >
                  Cancel Request
                </button>
              </div>
            </Form>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && request?.driver && (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">Cancel Ride?</h3>
          <p className="text-xs text-gray-500">Are you sure you want to cancel?</p>
        </div>
      </div>

      {/* Driver & Vehicle Side by Side */}
      <div className="flex items-start gap-4 mb-5">
        {/* Driver */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
            <UserIcon className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-500 mb-0.5">Driver</p>
            <p className="text-sm font-bold text-gray-900 truncate">
              {displayName(request.driver.firstName, request.driver.lastName)}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {request.driver.phoneNumber || "No phone"}
            </p>
          </div>
        </div>

        {/* Vehicle */}
        {request.vehicle && (
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">Vehicle</p>
            <p className="text-sm font-bold text-gray-900 truncate">
              {[request.vehicle.year, request.vehicle.make, request.vehicle.model]
                .filter(Boolean)
                .join(" ")}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              {request.vehicle.color && <ColorBadge hex={request.vehicle.color} />}
              {request.vehicle.plate && (
                <span className="text-xs text-gray-500">{request.vehicle.plate}</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setShowCancelModal(false)}
          className="flex-1 px-4 py-2 font-semibold rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
        >
          Keep Ride
        </button>
        <button
          type="submit"
          form="cancelRequestForm"
          className="flex-1 px-4 py-2 font-semibold rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all"
        >
          Yes, Cancel
        </button>
      </div>
    </div>
  </div>
)}
    </>
  );
}
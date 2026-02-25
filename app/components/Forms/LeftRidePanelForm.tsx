import { useState } from "react";
import { Form, Link, useNavigate, useRouteLoaderData, useSearchParams } from "react-router";
import { BaseBoundIcon } from "../Icons/BaseBoundIcon";
import LeftPanelPassengerRequestsForm from "./LeftPanelPassengerRequestsForm";
import LeftPanelPassengerForm from "./LeftPanelPassengerForm";
import LeftPanelDriverForm from "./LeftPanelDriverForm";
import LeftPanelDriverRequestForm from "./LeftPanelDriverRequestForm";
import { LogoutIcon } from "../Icons/LogoutIcon";
import { createTabs } from "../Modals/UserSettingsModal";
import { AuthenticityTokenInput } from "remix-utils/csrf/react";
import { usePushNotifications } from "~/hooks/usePushNotifications";

export default function LeftSideRidePanelForm({
  user,
  userId,
  station,
  accepted,
  activeRequests,
  requestInfo,
  actionData,
  activePassengerRequests,
  vehicles,
  isAvailable,
  driverCount,
}: any) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const mode = searchParams.get("mode") || "passenger";
  const [isDriverMode, setIsDriverMode] = useState(isAvailable);
  const navigate = useNavigate();
  const showMain = !searchParams.get("showmap");
  const rootData = useRouteLoaderData("root") as { vapidPublicKey?: string } | undefined;
  const { subscribe, unsubscribe, needsInstall } = usePushNotifications(rootData?.vapidPublicKey);
  const tabs = createTabs({user, vehicles});

  const toggleMode = async () => {
    const nextMode = !isDriverMode;
    setIsDriverMode(nextMode);
    setSearchParams({ mode: nextMode ? "driver" : "passenger" });
    if (nextMode) {
      await subscribe();
    } else {
      await unsubscribe();
    }
  };

  return (
    <>
      {!showMain && (
        <div className="absolute top-7 left-6 rounded-xl">
          <div className="bg-linear-to-br from-blue-600 to-indigo-700 text-white flex rounded-xl items-center gap-3">
            <div
              className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl cursor-pointer"
              onClick={() =>
                setSearchParams((prev) => {
                  const params = new URLSearchParams(prev);
                  params.delete("showmap");
                  return params;
                })
              }
            >
              <BaseBoundIcon className="w-6 h-6" />
            </div>
          </div>
        </div>
      )}

      {showMain && (
        <div className={`fixed md:absolute top-0 md:top-8 left-0 md:left-8 right-0 md:right-auto w-full md:w-96 h-full md:h-fit md:rounded-2xl z-50 bg-white shadow-2xl md:border border-gray-100 overflow-y-auto`}>
          <div
            className="sticky top-0 z-10 bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <button
                  type="button"
                  className="block md:hidden"
                 onClick={(e) => {
                    e.stopPropagation();
                    setShowMobileMenu(!showMobileMenu);
                  }}>
                  <svg className="w-6 h-6 " fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
              </button>
              <div className="relative">
                
                <div
                  className="p-3.5 hidden md:block md:p-2.5 bg-white/20 backdrop-blur-sm rounded-xl md:cursor-default cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMobileMenu(!showMobileMenu);
                  }}
                >
                  
                    <BaseBoundIcon className="w-6 h-6 " />
                </div>

                {showMobileMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40 md:hidden"
                      onClick={() => setShowMobileMenu(false)}
                    />

                    <div className="fixed left-4 top-20 w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 md:hidden">
                      <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user?.email}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {user?.isDriver
                            ? "Driver Account"
                            : "Passenger Account"}
                        </p>
                      </div>
                      <Form method="post" action="/logout">
                        <AuthenticityTokenInput />
                        {tabs.map((t) => (
                          <Link
                            key={t.name}
                            to={t.to as string}
                            className="relative w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors font-medium text-gray-600 border-b border-gray-200"
                          >

                            <span className="text-xl">{t.icon}</span>
                            <span>{t.label}</span>

                            {t.badge && (
                              <>
                                <span className="absolute right-3 top-1/2 w-2.5 h-2.5 bg-red-500 rounded-full -translate-y-1/2" />
                                <span className="absolute right-3 top-1/2 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping -translate-y-1/2" />
                              </>
                            )}
                          </Link>
                        ))}
                        <button
                          type="submit"
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-50 transition-colors font-medium text-red-600"
                        >
                          <LogoutIcon className="size-6" />
                          Logout
                        </button>
                      </Form>
                    </div>
                  </>
                )}
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Base Bound
                </h1>
                <p className="text-blue-100 text-sm">Request Your Ride</p>
              </div>
            </div>

            {user?.isDriver && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-white  sm:inline">
                  {isDriverMode ? "Driver" : "Passenger"}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMode();
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    isDriverMode ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                      isDriverMode ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            )}
          </div>

          {user?.isDriver && needsInstall && (
            <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 flex gap-3 items-start">
              <span className="text-amber-500 text-lg leading-none mt-0.5">&#x26A0;&#xFE0F;</span>
              <p className="text-sm text-amber-800">
                <span className="font-semibold">iPhone users:</span> To receive ride notifications, tap the{" "}
                <span className="font-semibold">Share</span> button in Safari, then choose{" "}
                <span className="font-semibold">Add to Home Screen</span>. Open the app from your Home Screen to enable notifications.
              </p>
            </div>
          )}

          <div className="p-6 bg-white">
            {!isDriverMode ? (
              <>
                <LeftPanelPassengerForm
                  user={user}
                  station={station}
                  params={searchParams}
                  activePassengerRequests={activePassengerRequests}
                  actionData={actionData}
                  driverCount={driverCount}
                />
              </>
            ) : (
              user?.isDriver && (
                <LeftPanelDriverForm
                  user={user}
                  activeRequests={activeRequests}
                />
              )
            )}

            <div className="md:hidden mt-6">
              {!isDriverMode ? (
                <LeftPanelPassengerRequestsForm requestInfo={requestInfo} user={user} />
              ) : (
                user?.isDriver && (
                  <LeftPanelDriverRequestForm accepted={accepted} user={user} userId={userId}/>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Desktop: Render request panels as floating panels */}
      {!isDriverMode ? (
        <div className="hidden md:block absolute bottom-0">
          <LeftPanelPassengerRequestsForm requestInfo={requestInfo} user={user}/>
        </div>
      ) : (
        user?.isDriver && (
          <div className="hidden md:block absolute bottom-0 w-screen">
            <LeftPanelDriverRequestForm accepted={accepted} user={user} userId={userId}/>
          </div>
        )
      )}
    </>
  );
}

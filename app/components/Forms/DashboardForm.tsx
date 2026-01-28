import RightSideUserPanelForm from "./RightSideUserPanelForm";
import LeftSideRidePanelForm from "./LeftRidePanelForm";
import { Outlet, useNavigate } from "react-router";
import MiddlePanelForm from "./MiddlePanelForm";

export default function Dashboard({
  user,
  userId,
  station,
  accepted,
  activeRequests,
  vehicles,
  requestInfo,
  bases,
  actionData,
  activePassengerRequests
}: any) {
  const navigate = useNavigate();
  return (
    <div className="w-full h-screen">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 w-[90%] max-w-4xl">
        <MiddlePanelForm user={user} vehicles={vehicles} bases={bases}/>
      </div>
      <div className="absolute top-0 left-0 h-full z-10">
        <LeftSideRidePanelForm
          user={user}
          userId={userId}
          station={station}
          accepted={accepted}
          activeRequests={activeRequests}
          activePassengerRequests={activePassengerRequests}
          actionData={actionData}
          requestInfo={requestInfo}
          onLogout={() => navigate("/logout")}
        />
      </div>
      <div className="hidden md:block absolute top-8 right-8 h-full md:z-10">
        <RightSideUserPanelForm user={user} />
      </div>
      <a 
        href="https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=cNEikIxyLku9z82rvvDH-ZCZaielw9NOvk93EFe11qlUQktFMEpGRFlMUUlZTDdLTzJMTFAwWFQ1NC4u"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex absolute bottom-8 right-8 bg-white hover:bg-gray-50 text-black border-2 border-black rounded-full px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 items-center gap-3 z-10 group"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth="1.5" 
          stroke="currentColor" 
          className="h-6 w-6 group-hover:scale-110 transition-transform"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0 1 12 12.75Zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 0 1-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 0 0 2.248-2.354M12 12.75a2.25 2.25 0 0 1-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 0 0-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 0 1 .4-2.253M12 8.25a2.25 2.25 0 0 0-2.248 2.146M12 8.25a2.25 2.25 0 0 1 2.248 2.146M8.683 5a6.032 6.032 0 0 1-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0 1 15.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 0 0-.575-1.752M4.921 6a24.048 24.048 0 0 0-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 0 1-5.223 1.082" />
        </svg>
        <span className="font-bold text-lg">Report a Bug</span>
      </a>
      <Outlet />
    </div>
  );
}
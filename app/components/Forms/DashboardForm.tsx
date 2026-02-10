import RightSideUserPanelForm from "./RightSideUserPanelForm";
import LeftSideRidePanelForm from "./LeftRidePanelForm";
import { Outlet, useNavigate } from "react-router";
import MiddlePanelForm from "./MiddlePanelForm";
import ReportProblem from "./ReportProblem";

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
          vehicles={vehicles}
          onLogout={() => navigate("/logout")}
        />
      </div>
      <div className="hidden md:block absolute top-8 right-8 h-full md:z-10">
        <RightSideUserPanelForm user={user} />
      </div>
      <ReportProblem />
      <Outlet />
    </div>
  );
}
import RightSideUserPanelForm from "./RightSideUserPanelForm";
import LeftSideRidePanelForm from "./LeftRidePanelForm";
import { Outlet, useNavigate, useSearchParams } from "react-router";
import { Outlet } from "react-router";
import MiddlePanelForm from "./MiddlePanelForm";

export default function Dashboard({ user, station, accepted, activeRequests, requestInfo }: any) {
  const navigate = useNavigate();

  console.log(station)

  

  return (
    <div className="w-full h-screen">
      
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 w-[90%] max-w-4xl">
        <MiddlePanelForm user={user}/>
      </div>

      <div className="absolute top-0 left-0 h-full z-10">
        <LeftSideRidePanelForm 
          user={user} 
          station={station}
          accepted={accepted}
          activeRequests={activeRequests} 
          requestInfo={requestInfo}
          onLogout={() => navigate("/logout")}
        />
      </div>

      <div className="absolute top-8 right-8 z-50 ">
      <div className="hidden md:block absolute top-0 right-0 h-full md:z-10">
        <RightSideUserPanelForm user={user} />
      </div>
      <Outlet />
    </div>
  );
}


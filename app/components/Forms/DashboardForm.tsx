import { useEffect, useRef } from "react";
import type { Map as LeafletMap, LatLngBoundsExpression } from "leaflet";
import RightSideUserPanelForm from "./RightSideUserPanelForm";
import LeftSideRidePanelForm from "./LeftRidePanelForm";
import { Outlet, useSearchParams } from "react-router";
import MiddlePanelForm from "./MiddlePanelForm";

export default function Dashboard({ user, station, accepted, activeRequests, requestInfo }: any) {


  console.log(station)

  

  return (
    <div className="relative w-full h-screen">
      
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
        />
      </div>

      <div className="hidden md:block absolute top-0 right-0 h-full z-10">
        <RightSideUserPanelForm user={user} />
      </div>
      <Outlet />
    </div>
  );
}


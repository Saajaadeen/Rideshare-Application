import { useState, useRef, useEffect } from "react";
import { useDevice } from "~/hooks/DeviceProvider";
import LocationSelect from "./LocationSelect";

export default function RideshareDashboard() {
  const { isMobile } = useDevice();
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({});
  const [pickupPoint, setPickupPoint] = useState(null); 
  const [hideMenu, setHideMenu] = useState(false);

  const containerRef = useRef(null);
  const imageRef = useRef(null);

  const constrainPosition = (newPosition: any, currentZoom: any) => {
    if (!containerRef.current || !imageRef.current) return newPosition;

    const container = containerRef.current.getBoundingClientRect();
    const image = imageRef.current;
    const imageWidth = image.naturalWidth * currentZoom;
    const imageHeight = image.naturalHeight * currentZoom;

    const maxX = Math.max(0, (imageWidth - container.width) / 2);
    const maxY = Math.max(0, (imageHeight - container.height) / 2);

    return {
      x: Math.min(Math.max(newPosition.x, -maxX), maxX),
      y: Math.min(Math.max(newPosition.y, -maxY), maxY),
    };
  };



  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    const newZoom = Math.min(Math.max(1, zoom + delta), 5);
    setZoom(newZoom);
    setPosition(constrainPosition(position, newZoom));
  };

  const handleMouseDown = (e) => {
    setIsDragging(false);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
      startX: e.clientX,
      startY: e.clientY,
    });
  };

  const handleMouseMove = (e) => {
    if (!dragStart.startX) return;
    const distance = Math.hypot(
      e.clientX - dragStart.startX,
      e.clientY - dragStart.startY
    );
    if (distance > 5) setIsDragging(true);
    if (isDragging || distance > 5) {
      const newPosition = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      };
      setPosition(constrainPosition(newPosition, zoom));
    }
  };

  const handleMouseUp = (e) => {
    if (!isDragging && dragStart.startX) handleMapClick(e);
    setIsDragging(false);
    setDragStart({});
  };

  const handleMapClick = (e) => {
    if (!containerRef.current) return;
    const container = containerRef.current.getBoundingClientRect();
    const x = e.clientX - container.left;
    const y = e.clientY - container.top;
    setPickupPoint({ x, y });
  };

  const resetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const clearPickup = () => setPickupPoint(null);

  useEffect(() => {
    setPosition(constrainPosition(position, zoom));
  }, [zoom]);

  if(!isMobile){
    return (
      <div className="h-screen flex bg-gray-50">
        {/* Left Panel */}
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/30">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 
                      3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 
                      3.42 3.42 0 013.138 3.138 3.42 3.42 0 
                      00.806 1.946 3.42 3.42 0 010 4.438 
                      3.42 3.42 0 00-.806 1.946 3.42 3.42 0 
                      01-3.138 3.138 3.42 3.42 0 00-1.946.806 
                      3.42 3.42 0 01-4.438 0 3.42 3.42 0 
                      00-1.946-.806 3.42 3.42 0 
                      01-3.138-3.138 3.42 3.42 0 
                      00-.806-1.946 3.42 3.42 0 010-4.438 
                      3.42 3.42 0 00.806-1.946 3.42 3.42 0 
                      013.138-3.138z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Base Bound</h1>
                <p className="text-xs text-gray-500">Available Rides</p>
              </div>
            </div>

            <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl font-semibold text-white transition-all shadow-lg shadow-blue-500/30">
              Request a Ride
            </button>
          </div>

          {/* Ride List */}
          <div className="flex-1 overflow-y-auto p-4">{/* Ride Cards */}</div>

          {/* Logout Button - Fixed at Bottom */}
          <form method="POST" action="/logout">
              <div className="p-6 border-t border-gray-200">
            <button
              type="submit"
              className="block w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 rounded-xl font-semibold text-white text-center transition-all shadow-lg shadow-blue-400/30"
            >
              Logout
            </button>
          </div>
          </form>
        </div>

        {/* Map Panel */}
        <div
          ref={containerRef}
          className="flex-1 relative bg-gray-100 overflow-hidden"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            ref={imageRef}
            src="/maps/TravisAFB.png"
            alt="Travis AFB Map"
            className="absolute top-1/2 left-1/2 max-w-none transition-transform select-none"
            style={{
              transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${zoom})`,
              cursor: isDragging ? "grabbing" : "grab",
            }}
            draggable={false}
          />

          {/* Pickup Marker */}
          {pickupPoint && (
            <div
              className="absolute pointer-events-none z-10"
              style={{
                left: pickupPoint.x,
                top: pickupPoint.y,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
            </div>
          )}

          {/* Clear Pickup */}
          {pickupPoint && (
            <button
              onClick={clearPickup}
              className="absolute top-6 left-6 px-4 py-2 bg-white rounded-xl shadow-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <svg
                className="w-4 h-4 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                Clear Pickup
              </span>
            </button>
          )}

          {/* Zoom Controls */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-2">
            <button
              onClick={() => setZoom(Math.min(zoom + 0.5, 5))}
              className="p-3 bg-white rounded-xl shadow-lg hover:bg-gray-50 transition-colors"
              title="Zoom In"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
            <button
              onClick={() => setZoom(Math.max(zoom - 0.5, 1))}
              className="p-3 bg-white rounded-xl shadow-lg hover:bg-gray-50 transition-colors"
              title="Zoom Out"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4"
                />
              </svg>
            </button>
            <button
              onClick={resetZoom}
              className="p-3 bg-white rounded-xl shadow-lg hover:bg-gray-50 transition-colors"
              title="Reset Zoom"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 
                    004.582 9m0 0H9m11 11v-5h-.581m0 
                    0a8.003 8.003 0 01-15.357-2m15.357 
                    2H15"
                />
              </svg>
            </button>
          </div>

          {/* Zoom Level */}
          {zoom > 1 && (
            <div className="absolute top-6 right-6 px-3 py-2 bg-white rounded-lg shadow-lg">
              <p className="text-sm font-medium text-gray-700">
                {Math.round(zoom * 100)}%
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }
  else{
    return(
      <>
      {hideMenu && 
        <div className="w-full h-screen bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/30">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 
                    3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 
                    3.42 3.42 0 013.138 3.138 3.42 3.42 0 
                      00.806 1.946 3.42 3.42 0 010 4.438 
                      3.42 3.42 0 00-.806 1.946 3.42 3.42 0 
                      01-3.138 3.138 3.42 3.42 0 00-1.946.806 
                      3.42 3.42 0 01-4.438 0 3.42 3.42 0 
                      00-1.946-.806 3.42 3.42 0 
                      01-3.138-3.138 3.42 3.42 0 
                      00-.806-1.946 3.42 3.42 0 010-4.438 
                      3.42 3.42 0 00.806-1.946 3.42 3.42 0 
                      013.138-3.138z"
                      />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Base Bound</h1>
                <p className="text-xs text-gray-500">Available Rides</p>
              </div>
            </div>

            <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl font-semibold text-white transition-all shadow-lg shadow-blue-500/30">
              Request a Ride
            </button>
          </div>
          <LocationSelect setHideMenu={setHideMenu}/>
          {/* Ride List */}
          <div className="flex-1 overflow-y-auto p-4">{/* Ride Cards */}</div>

          {/* Logout Button - Fixed at Bottom */}
          <form method="POST" action="/logout">
              <div className="p-6 border-t border-gray-200">
            <button
              type="submit"
              className="block w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 rounded-xl font-semibold text-white text-center transition-all shadow-lg shadow-blue-400/30"
              >
              Logout
            </button>
          </div>
          </form>
        </div>}
    </>
    )
  }
}

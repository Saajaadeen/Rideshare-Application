import { Form } from "react-router";
import { AuthenticityTokenInput } from "remix-utils/csrf/react";
import VehicleDescriptionForm from "~/components/Forms/VehicleDescriptionForm";
import { XMarkIcon } from "~/components/Icons/XMarkIcon";

export default function UserVehicleForm({ user, vehicles }: any) {
  return (
    <div className="space-y-8">
      <Form method="post" action="/dashboard/settings" className="space-y-6">
        <AuthenticityTokenInput />
        <input type="hidden" name="intent" value="vehicle-enable" />

        <div className="border-l-4 border-indigo-500 pl-6">
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            Vehicle Management
          </h3>
          <p className="text-gray-500 text-sm">
            Register and manage your vehicles
          </p>
        </div>

        <div className={`border ${user.isDriver ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-100':'bg-gray-100 border-gray-200'} rounded-2xl p-6 shadow-md flex items-center justify-between`}>
          <div>
            <span className="text-base font-semibold text-gray-900 block">
              Driver Mode
            </span>
            <span className="text-sm text-gray-500 mt-1 block">
              Activate driver capabilities by adding a vehicle
            </span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="isDriver"
              value="true"
              disabled
              defaultChecked={!!user?.isDriver}
              className="sr-only peer"
              onChange={(e) => e.currentTarget.form?.submit()}
            />
            <div
              className={`w-14 h-7 rounded-full hover:cursor-not-allowed peer-focus:ring-4 peer-focus:ring-green-100 
                ${user.isDriver 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-500' 
                  : 'bg-gray-300'
                }
                after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white 
                after:rounded-full after:h-5 after:w-5 after:transition-all 
                ${user.isDriver ? 'after:translate-x-7' : ''}
                after:border after:border-gray-200 relative`}
            ></div>
          </label>
        </div>
      </Form>

      {/* {user?.isDriver && vehicles?.length === 0 && ( */}
        {/* <div className="bg-red-100 p-2 rounded-lg border border-1 border-red-400">
          <p className="text-black">
            Please add a vehicle to your account to activate driver ability.
          </p>
        </div> */}
      {/* )} */}

      {/* {user?.isDriver && vehicles?.length > 0 && ( */}
        <div className="space-y-4">
          <h4 className="text-xl font-semibold text-gray-900">
            Registered Vehicles
          </h4>
          <div className="space-y-3">
            {vehicles.map((vehicle: any) => (
              <div
                key={vehicle.id}
                className="flex items-center justify-between bg-white rounded-2xl p-5 border border-gray-200 shadow hover:shadow-lg transition-all duration-300"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-sm flex-1">
                  <div>
                    <span className="text-gray-500 text-xs block">Year</span>
                    <span className="font-semibold text-gray-900">
                      {vehicle.year}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs block">Make</span>
                    <span className="font-semibold text-gray-900">
                      {vehicle.make}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs block">Model</span>
                    <span className="font-semibold text-gray-900">
                      {vehicle.model}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs block">Color</span>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0"
                        style={{ backgroundColor: vehicle.color }}
                      />
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs block">Plate</span>
                    <span className="font-semibold text-gray-900 uppercase">
                      {vehicle.plate}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs block">Added</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(vehicle.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <Form method="post" action="/dashboard/settings" className="ml-4" >
                  <AuthenticityTokenInput />
                  <input type="hidden" name="intent" value="vehicle-delete" />
                  <input type="hidden" name="id" value={vehicle.id} />
                  <button
                    type="submit"
                    className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-red-500 transition-all duration-300"
                    aria-label={`Delete ${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  >
                    <XMarkIcon className="size-5" />
                  </button>
                </Form>
              </div>
            ))}
          </div>
        </div>
      {/* )} */}

      {vehicles.length === 0 && (
        <Form method="post" action="/dashboard/settings" className="space-y-4">
          <AuthenticityTokenInput />
          <input type="hidden" name="intent" value="vehicle" />
          <VehicleDescriptionForm />
        </Form>
      )}
    </div>
  );
}

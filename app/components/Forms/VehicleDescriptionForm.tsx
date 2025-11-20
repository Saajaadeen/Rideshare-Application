export default function VehicleDescriptionForm() {
  return (
    <div className="space-y-4">
      <h4 className="text-xl font-semibold text-gray-900">Add New Vehicle</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <input
          type="text"
          name="year"
          maxLength={4}
          placeholder="Year"
          required
          className="rounded-xl border-2 border-gray-200 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
        />
        <input
          type="text"
          name="make"
          maxLength={15}
          placeholder="Make"
          className="rounded-xl border-2 border-gray-200 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
        />
        <input
          type="text"
          name="model"
          maxLength={15}
          placeholder="Model"
          required
          className="rounded-xl border-2 border-gray-200 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
        />
        <input
          type="text"
          name="color"
          maxLength={15}
          placeholder="Color"
          required
          className="rounded-xl border-2 border-gray-200 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
        />
        <input
          type="text"
          name="plate"
          maxLength={15}
          placeholder="Plate"
          required
          className="rounded-xl border-2 border-gray-200 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
        />
      </div>
      <button
        type="submit"
        className="w-full px-6 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-all duration-300"
      >
        Add Vehicle
      </button>
    </div>
  );
}

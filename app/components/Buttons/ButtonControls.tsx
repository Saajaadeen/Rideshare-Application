export default function ButtonControls({
  saveLabel = "Save Changes",
  disabled = false,
}: any) {
  return (
    <div className="flex justify-end gap-4 mt-8 pt-6">
      <button
        type="submit"
        disabled={disabled}
        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
          disabled
            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
            : "bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white hover:shadow-xl hover:scale-105"
        }`}
      >
        {saveLabel}
      </button>
    </div>
  );
}
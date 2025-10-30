import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-100 rounded-full blur-3xl"></div>
      </div>

      <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100 p-10 w-[550px] text-center">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 rounded-t-3xl"></div>

        <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg shadow-blue-500/30">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 11-12.728 12.728A9 9 0 0118.364 5.636zM9.88 9.88l4.24 4.24M14.12 9.88l-4.24 4.24"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-gray-600 mb-6">
          Oops! The page you're looking for doesn’t exist or has been moved.
        </p>

        <Link
          to=".."
          className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-[1.03] active:scale-[0.97]"
        >
          Go Back Home
        </Link>
      </div>

      <div className="absolute bottom-6 text-center text-sm text-gray-500">
        <p>Secured Shared Rides</p>
      </div>
    </div>
  );
}

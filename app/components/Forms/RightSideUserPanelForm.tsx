import { useState } from "react";

export default function RightSideUserPanelForm(userName: any) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const firstName = userName.userName.userName.firstName;
  const lastName = userName.userName.userName.lastName;
  const email = userName.userName.userName.email;

  return (
    <div className="absolute top-8 right-8 z-50 w-72 bg-white/80 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between w-full px-4 py-1.5 hover:bg-gray-50 transition-colors"
        aria-expanded={isDropdownOpen}
        aria-label="Toggle profile menu"
      >
        <div className="flex flex-col text-left">
          <p className="text-gray-900 font-semibold text-lg">
            {firstName} {lastName}
          </p>
          <p className="text-gray-500 text-sm">{email}</p>
        </div>

        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">
          {firstName[0]}
          {lastName[0]}
        </div>
      </button>

      {isDropdownOpen && (
        <div className="w-full p-3 space-y-2 bg-white border-t border-gray-100">
          <form method="get" action="/settings">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors font-medium text-gray-800"
            >
              <svg
                className="w-5 h-5 text-indigo-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Settings
            </button>
          </form>

          <form method="post" action="/logout">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-50 transition-colors font-medium text-red-600"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

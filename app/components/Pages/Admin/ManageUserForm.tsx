import { useEffect, useRef, useState } from "react";
import { Form, useFetcher } from "react-router";
import { AuthenticityTokenInput } from "remix-utils/csrf/react";
import ToggleSwitch from "~/components/Buttons/ToggleSwitch";
import { WarningIcon } from "~/components/Icons/WarningIcon";

export default function ManageUserForm({ base, user, actionData}: any) {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDriver, setIsDriver] = useState(false);
  const [isPassenger, setIsPassenger] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [selectedBase, setSelectedBase] = useState("");
  const [deletingUser, setDeletingUser] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const comboboxRef = useRef<HTMLDivElement>(null);
  const fetcher = useFetcher<{ users: any[] }>();
  const users = fetcher.data?.users ?? [];

  useEffect(() => {
    if (searchQuery.length >= 1) {
      const params = new URLSearchParams({ q: searchQuery });
      if (selectedBase) {
        params.set("baseId", selectedBase);
        fetcher.load(`/api/search-users?${params}`);
        setShowDropdown(true);
      }
    } else {
      setShowDropdown(false);
    }
  }, [searchQuery, selectedBase]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (comboboxRef.current && !comboboxRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectUser = (user: any) => {
    setSelectedUserId(user.id);
    setSelectedUser(user);
    setSearchQuery(`${user.firstName} ${user.lastName}`);
    setShowDropdown(false);
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setEmail(user.email || "");
    setPhoneNumber(user.phoneNumber || "");
    setIsAdmin(!!user.isAdmin);
    setIsDriver(!!user.isDriver);
    setIsPassenger(!!user.isPassenger);
    setIsReset(!!user.isReset);
  };

  const handleClearUser = () => {
    setSelectedUserId("");
    setSelectedUser(null);
    setSearchQuery("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhoneNumber("");
    setIsAdmin(false);
    setIsDriver(false);
    setIsPassenger(false);
    setIsReset(false);
  };

  useEffect(() => {
    if(actionData && actionData.success){
      setDeletingUser(null)
    }
  }, [actionData])

  return (
    <>
      <section className="bg-white rounded-2xl border border-gray-100 p-4 md:p-8 shadow-sm">
        <div className="mb-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900">
            Manage Users
          </h3>
          <select className="rounded-lg p-2 border border-gray-200 text-black w-full sm:w-[300px]" onChange={(e) => setSelectedBase(e.currentTarget.value)}>
            <option value="">-- Select a base --</option>
           {base.map(b => <option value={b.id}>{b.name}</option>)}
          </select>
        </div>
          <p className="text-gray-600 mt-2">
            Select an existing user to view or modify their details.
          </p>
        </div>

        {selectedUser?.resetCode && (
          <div className="mt-2 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">Reset Code:</span>{" "}
              {selectedUser.resetCode}
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              Provide this code to the user so they can log in with the
              new password.
            </p>
          </div>
        )}

        <div className="mt-5">
          <Form method="post" action="/dashboard/admin?page=users"
            className="space-y-5"
          >
            <AuthenticityTokenInput />
            <input type="hidden" name="intent" value="updateUser" />
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search User
              </label>
              <input type="hidden" name="userId" value={selectedUserId} />
              <div ref={comboboxRef} className="relative">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (selectedUserId) handleClearUser();
                    }}
                    onFocus={() => {
                      if (searchQuery.length >= 1 && users.length > 0) setShowDropdown(true);
                    }}
                    placeholder="Type to search users..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
                  />
                  {selectedUserId && (
                    <button
                      type="button"
                      onClick={handleClearUser}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
                {showDropdown && (
                  <ul className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                    {fetcher.state === "loading" ? (
                      <li className="px-4 py-3 text-sm text-gray-500">Searching...</li>
                    ) : users.length > 0 ? (
                      users.map((u: any) => (
                        <li
                          key={u.id}
                          onClick={() => handleSelectUser(u)}
                          className="cursor-pointer px-4 py-3 text-sm text-gray-900 hover:bg-indigo-50 transition"
                        >
                          <span className="font-medium">{u.firstName} {u.lastName}</span>
                          {u.email && <span className="ml-2 text-gray-500">({u.email})</span>}
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-3 text-sm text-gray-500">No users found</li>
                    )}
                  </ul>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  required
                  type="text"
                  name="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  required
                  type="text"
                  name="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                required
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@domain.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                required
                type="tel"
                name="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g., (555) 123-4567"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-2">
              {selectedUser && !selectedUser.isInvite && (
                <ToggleSwitch
                  label="Administrator"
                  name="isAdmin"
                  checked={isAdmin}
                  onChange={setIsAdmin}
                />
              )}
              <ToggleSwitch
                label="Driver"
                name="isDriver"
                checked={isDriver}
                onChange={setIsDriver}
              />
              <ToggleSwitch
                label="Passenger"
                name="isPassenger"
                checked={isPassenger}
                onChange={setIsPassenger}
              />
              <ToggleSwitch
                label="Reset Password"
                name="isReset"
                checked={isReset}
                onChange={setIsReset}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              {/* <button
                type="button"
                onClick={() => {
                  const selectedUser = accounts.find(
                    (u: any) => u.id === selectedUserId
                  );
                  if (selectedUser) {
                    setDeletingUser({
                      id: selectedUser.id,
                      name: `${selectedUser.firstName} ${selectedUser.lastName}`,
                    });
                  }
                }}
                disabled={!selectedUserId}
                className={`px-8 py-3 rounded-lg font-semibold border transition-all ${
                  selectedUserId
                    ? "bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                    : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                }`}
              >
                Remove User
              </button> */}
              <button
                type="submit"
                className="px-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all"
              >
                Save Changes
              </button>
            </div>
          </Form>
        </div>
      </section>

      {deletingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="px-6 pt-8 pb-6 text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <WarningIcon className="size-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Delete User
              </h3>
              <p className="text-gray-600">
                This will permanently delete{" "}
                <span className="font-semibold text-gray-900">
                  {deletingUser.name}
                </span>
                .
              </p>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-5 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <Form method="post" action="/dashboard/admin?page=users">
                <AuthenticityTokenInput />
                <input type="hidden" name="intent" value="deleteUser" />
                <input type="hidden" name="userId" value={deletingUser.id} />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-red-500 rounded-xl text-white text-sm font-medium transition"
                >
                  Delete Permanently
                </button>
              </Form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import { Link } from "react-router";
import { WarningIcon } from "../Icons/WarningIcon";

export default function MiddlePanelForm({ user }: any) {
  const hasBase = !!user?.base.id;
  const isReset = !!user?.isReset;
  const noErrors = hasBase && !isReset;

  if (noErrors) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center gap-3 w-full max-w-md">
      {!hasBase && (
        <div className="flex w-[400px] items-center gap-3 bg-white text-red-700 px-4 py-3 rounded-lg border border-red-200 shadow-lg animate-in fade-in duration-200">
          <WarningIcon className="w-5 h-5 text-red-500" />
          <Link to="/dashboard/settings?tab=base" className="font-medium">
            Please select a new base to continue.
          </Link>
        </div>
      )}

      {isReset && (
        <div className="flex w-[400px] items-center gap-3 bg-white text-red-700 px-4 py-3 rounded-lg border border-red-200 shadow-lg animate-in fade-in duration-200">
          <WarningIcon className="w-5 h-5 text-red-500" />
          <Link to="/dashboard/settings?tab=security" className="font-medium">
            Please create a new password to continue.
          </Link>
        </div>
      )}
    </div>
  );
}

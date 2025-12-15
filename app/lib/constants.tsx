import { BaseIcon } from "~/components/Icons/BaseIcon";
import { KeyIcon } from "~/components/Icons/KeyIcon";
import { LockIcon } from "~/components/Icons/LockIcon";
import { ShieldIcon } from "~/components/Icons/ShieldIcon";
import { UserIcon } from "~/components/Icons/UserIcon";
import { VehicleIcon } from "~/components/Icons/VehicleIcon";
import { WarningIcon } from "~/components/Icons/WarningIcon";

export const tabs = [
      {
        label: "Profile",
        name: "profile",
        icon: <UserIcon className="size-6" />,
        to: "/dashboard/settings?tab=profile",
      },
      {
        label: "Permissions",
        name: "permissions",
        icon: <LockIcon className="size-6" />,
        to: "/dashboard/settings?tab=permissions",
      },
      { label: "Base", name: "base", icon: <BaseIcon className="size-6" /> },
      {
        label: "Vehicles",
        name: "vehicles",
        icon: <VehicleIcon className="size-6" />,
        to: "/dashboard/settings?tab=vehicles",
      },
      {
        label: "Security",
        name: "security",
        icon: <ShieldIcon className="size-6" />,
        to: "/dashboard/settings?tab=security",
      },
      {
        label: "Invites",
        name: "invites",
        icon: <KeyIcon className="size-6" />,
        to: "/dashboard/settings?tab=invites",
        hide: false,
      },
      {
        label: "Deactivation",
        name: "deactivation",
        icon: <WarningIcon className="size-6" />,
        to: "/dashboard/settings?tab=deactivation",
      },
    ].filter((tab) => !tab.hide);
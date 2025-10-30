import { redirect, type LoaderFunctionArgs } from "react-router";
import {
  requireTwoFactorCode,
  requireUserId,
} from "server/session.server";
import DashboardForm from "~/components/Forms/DashboardForm";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const authentication = await requireTwoFactorCode(userId);

  if (authentication) {
    return redirect("/verify");
  }
  return null;
}

export default function Dashboard() {
  return <DashboardForm />;
}

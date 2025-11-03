import { type LoaderFunctionArgs } from "react-router";
import { requireUserId } from "server/session.server";
import DashboardForm from "~/components/Forms/DashboardForm";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);
}

export default function Dashboard() {
  return <DashboardForm />
}

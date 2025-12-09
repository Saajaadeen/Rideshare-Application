import { type LoaderFunctionArgs } from "react-router";
import { requireUserId } from "server/session.server";
import TwoFactorForm from "~/components/Forms/TwoFactorForm";
import { ErrorBoundary } from "~/components/Utilities/ErrorBoundary";

export async function loader ({ request }: LoaderFunctionArgs) {
  await requireUserId(request);
}

export default function TwoFactor() {
    return <TwoFactorForm />
}

export { ErrorBoundary };
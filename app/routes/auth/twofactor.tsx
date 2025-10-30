import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { getTwoFactorData } from "server/queries/twofactor.queries.server";
import { requireUserId } from "server/session.server";
import TwoFactorForm from "~/components/Forms/TwoFactorForm";

export async function loader ({ request }: LoaderFunctionArgs) {
    const userId = await requireUserId(request);
    const userPhoneNumber = await getTwoFactorData(userId)
    return {userPhoneNumber};
}

export default function TwoFactor() {
    const { userPhoneNumber } = useLoaderData<typeof loader>();
    return <TwoFactorForm userPhoneNumber={userPhoneNumber} />
}
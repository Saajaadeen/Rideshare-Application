import type { LoaderFunctionArgs } from "react-router";
import { requireAdminId, requireUserId } from "server/session.server";
import { searchAccounts } from "server/queries/user.queries.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  await requireAdminId(userId);

  const url = new URL(request.url);
  const query = url.searchParams.get("q") ?? "";
  const baseId = url.searchParams.get("baseId") ?? undefined;

  if (query.length < 1) {
    return { users: [] };
  }

  const users = await searchAccounts(query, baseId);
  return { users };
}

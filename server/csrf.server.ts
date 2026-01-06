import type {
  LoaderFunctionArgs,
  ActionFunctionArgs,
} from "react-router";
import { getCsrfToken, validateCsrf, getSession, storage } from "./session.server";

export function securedLoader<
  T extends (args: LoaderFunctionArgs & { csrfToken: string }) => Promise<any>
>(loader: T) {
  return async (args: LoaderFunctionArgs) => {
    const { csrfToken, session } = await getCsrfToken(args.request);

    const result = await loader({
      ...args,
      csrfToken,
    });

    if (result instanceof Response) {
      result.headers.append(
        "Set-Cookie",
        await storage.commitSession(session)
      );
      return result;
    }

    return new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": await storage.commitSession(session),
      },
    });
  };
}

export function securedAction<
  T extends (args: ActionFunctionArgs) => Promise<any>
>(action: T) {
  return async (args: ActionFunctionArgs) => {
    const session = await getSession(args.request);
    const sessionCsrf = session.get("csrf");

    const formData = await args.request.formData();
    validateCsrf(formData.get("csrf"), sessionCsrf);

    return action(args);
  };
}

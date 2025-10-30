import type { Carriers } from "@prisma/client";
import { useLoaderData, redirect, type LoaderFunctionArgs } from "react-router";
import { getCarriers, registerUser } from "server/queries/auth.queries.server";
import RegisterForm from "~/components/Forms/RegisterForm";

export async function loader({ request }: LoaderFunctionArgs) {
  const carriers = await getCarriers();
  console.log('Loader carriers:', carriers);
  return { carriers };
}

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const phoneCarrier = formData.get("carrier") as Carriers;
  const phoneNumber = formData.get("phoneNumber") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    await registerUser(
      firstName ?? "", 
      lastName ?? "", 
      email, 
      phoneCarrier, 
      phoneNumber ?? "", 
      password
    );
    return redirect("/login");
  } catch (error: any) {
    return { error: error.message || "Something went wrong..." };
  }
};

export default function Register() {
  const { carriers } = useLoaderData<typeof loader>();
  return <RegisterForm carriers={carriers} />;
}
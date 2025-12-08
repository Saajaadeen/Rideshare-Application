// app/routes/auth/verify-success.tsx
import { Form, Link, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { prisma } from "server/db.server";
import type { Route } from "./+types/verify-success";

export const loader = async({ request }:LoaderFunctionArgs) => {
      const searchParams = new URL(request.url).searchParams;
      const email = searchParams.get("identifier") as string;

      const user = await prisma.user.findUnique({
            where: {
                  email
            }
      })

      if(user){
            return {user}
      }else{
            return redirect("/login")
      }
}

export const action = async({ request }: ActionFunctionArgs) => {
      console.log('here')
      const formData = await request.formData();
      const userId = formData.get("userId") as string
      console.log('userId', userId)
      const updated = await prisma.user.update({
            where: { id: userId},
            data: {
                  emailVerified: true,
            }
      })
      console.log('updated', updated)
      return redirect('/login')
}

export default function VerifySuccess({ loaderData }: Route.ComponentProps) {
      const { user } = loaderData;
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Email Verified!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Your email has been successfully verified. You can now log in to your account.
        </p>
        
        <Form
            method="POST"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
            <input type="hidden" name="userId" value={user.id}/>
            <button type="submit">
            Go to Login
            </button>
        </Form>
      </div>
    </div>
  );
}
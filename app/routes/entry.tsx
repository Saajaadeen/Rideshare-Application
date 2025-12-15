import { toast, ToastContainer } from "react-toastify";
import type { Route } from "./+types/entry";
import Login, { ErrorBoundary } from "./auth/login";
import MainLanding from "~/components/Pages/landing";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Travis AFB: Base Bound" },
    { name: "Travis AFB: Base Bound", content: "" },
  ];
}

export default function Entry() {
  // const notify = () => toast("test", {autoClose: 1000});
  return (
    <div className="overflow-y-scroll">
      <MainLanding />
      {/* <Login /> */}
    </div>
  );
}

export { ErrorBoundary };
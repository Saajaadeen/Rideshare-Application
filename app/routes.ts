import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/entry.tsx"),
    route("/login", "./routes/auth/login.tsx"),
    route("/logout", "./routes/auth/logout.tsx"),
    route("/register", "./routes/auth/register.tsx"),
    route("/send", "./routes/auth/send.tsx"),
    route("/verify", "./routes/auth/verify.tsx"),
    route("/dashboard", "./routes/dashboard/dashboard.tsx", [
        route("settings", "./routes/settings/usersettings.tsx"),
        route("admin", "./routes/settings/adminsettings.tsx"),
    ]),
    route("*", './routes/notfound.tsx'),
    route("available", "../api/rides/available.ts"),
    route("requests", "../api/rides/userRequests.ts")

] satisfies RouteConfig;

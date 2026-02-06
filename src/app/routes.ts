import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { Classes } from "./pages/Classes";
import { Trainers } from "./pages/Trainers";
import { MembershipPlans } from "./pages/MembershipPlans";
import { Schedule } from "./pages/Schedule";
import { Gallery } from "./pages/Gallery";
import { Contact } from "./pages/Contact";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "classes", Component: Classes },
      { path: "trainers", Component: Trainers },
      { path: "membership", Component: MembershipPlans },
      { path: "schedule", Component: Schedule },
      { path: "gallery", Component: Gallery },
      { path: "contact", Component: Contact },
      { path: "login", Component: Login },
      { path: "signup", Component: Signup },
    ],
  },
]);
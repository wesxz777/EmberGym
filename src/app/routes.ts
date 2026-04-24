import { createHashRouter } from "react-router";
import { Home } from "./pages/Home";
import { Classes } from "./pages/Classes";
import { Trainers } from "./pages/Trainers";
import { MembershipPlans } from "./pages/MembershipPlans";
import { PaymentCheckout } from "./pages/PaymentCheckout";
import { PaymentConfirmation } from "./pages/PaymentConfirmation";
import { Schedule } from "./pages/Schedule";
import { Gallery } from "./pages/Gallery";
import { Contact } from "./pages/Contact";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Layout } from "./components/Layout";
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminGuard } from "./components/admin/AdminGuard";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminMembers } from "./pages/admin/AdminMembers";
import { AdminStaff } from "./pages/admin/AdminStaff";
import { AdminBookings } from "./pages/admin/AdminBookings";
import { AdminConcerns } from './pages/admin/AdminConcerns';


export const router = createHashRouter([
  // ── Public site ──────────────────────────────────────────────
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "classes",    Component: Classes },
      { path: "trainers",   Component: Trainers },
      { path: "membership", Component: MembershipPlans },
      { path: "checkout",   Component: PaymentCheckout },
      { path: "payment-confirmation", Component: PaymentConfirmation },
      { path: "schedule",   Component: Schedule },
      { path: "gallery",    Component: Gallery },
      { path: "contact",    Component: Contact },
      { path: "login",          Component: Login },
      { path: "forgot-password", Component: Login },
      { path: "signup",         Component: Signup },
    ],
  },

  // ── Admin panel ───────────────────────────────────────────────
  {
    path: "/admin",
    Component: AdminGuard,
    children: [
      {
        Component: AdminLayout,
        children: [
          { index: true,          Component: AdminDashboard },
          { path: "members",      Component: AdminMembers   },
          { path: "staff",        Component: AdminStaff     },
          { path: "bookings",     Component: AdminBookings  },
          { path: "concerns",     Component: AdminConcerns  },
        ],
      },
    ],
  },
]);

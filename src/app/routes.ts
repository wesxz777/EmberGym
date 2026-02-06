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
], {
  basename: '/EmberGym'
});
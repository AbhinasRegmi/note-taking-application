import { Outlet } from "react-router";

export function BaseLayout() {
  return (
    <main>
      <Outlet />
    </main>
  );
}

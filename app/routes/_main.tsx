import { Header } from "~/components/header";
import { Outlet } from "@remix-run/react";
export default function ShopLayout() {
  return (
    <>
      <main>
        <Header />
        <Outlet />
      </main>
    </>
  );
}

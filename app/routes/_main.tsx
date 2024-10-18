import { Header } from "~/components/header";
import { Outlet } from "@remix-run/react";
import { MetaFunction } from "@remix-run/node";
import { useState } from "react";
export const meta: MetaFunction = () => {
  const [fart, setTitle] = useState(" Unerten Shop at");
  function cycleTitle() {
    var tit = fart.split("");
    var lastchar = tit.pop();
    tit.unshift(lastchar!);
    setTitle(tit.join(""));
  }
  setInterval(cycleTitle, 300);
  return [
    { title: fart },
    { name: "description", content: "Welcome to Unerten!" },
  ];
};
export default function ShopLayout() {
  return (
    <>
      <main className="h-screen w-screen">
        <Header />
        <Outlet />
      </main>
    </>
  );
}

import { Header } from "~/components/header";

export default function MktLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>
        <Header />
        {children}
      </main>
    </>
  );
}

import { createFileRoute, Outlet } from "@tanstack/react-router";
import Header from "./-components/Header";
import Footer from "./-components/Footer";

export const Route = createFileRoute("/(public)")({
  component: Home,
});

function Home() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

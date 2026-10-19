import { redirect } from "next/navigation";
import AppDashboard from "@/components/AppDashboard";
import { isAdminLoggedIn } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  if (!(await isAdminLoggedIn())) redirect("/login");
  return <AppDashboard />;
}

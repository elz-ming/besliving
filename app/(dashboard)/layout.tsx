import { redirect } from "next/navigation";
import { getAppUser } from "@/lib/db/user";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAppUser();
  if (!user) redirect("/auth");
  return <>{children}</>;
}

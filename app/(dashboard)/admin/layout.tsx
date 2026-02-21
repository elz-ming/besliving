import { redirect } from "next/navigation";
import { getAppUser } from "@/lib/db/user";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAppUser();
  if (!user) redirect("/auth");
  if (user.role !== "admin" && user.role !== "superadmin")
    redirect("/");
  return <>{children}</>;
}

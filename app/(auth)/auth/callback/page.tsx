import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAppUser } from "@/lib/db/user";
import { syncUserToDb } from "@/lib/db/sync-user";

function isValidInternalPath(path: string): boolean {
  if (!path.startsWith("/") || path.startsWith("//")) return false;
  try {
    new URL(path, "https://example.com");
    return true;
  } catch {
    return false;
  }
}

function canAccessPath(role: string, path: string): boolean {
  if (path === "/" || path.startsWith("/catalogue") || path.startsWith("/about") || path.startsWith("/units")) return true;
  if (path.startsWith("/superadmin")) return role === "superadmin";
  if (path.startsWith("/admin")) return role === "admin" || role === "superadmin";
  if (path.startsWith("/user")) return true;
  return false;
}

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const params = await searchParams;
  const { userId } = await auth();

  if (!userId) {
    redirect("/auth");
  }

  await syncUserToDb(userId);
  const user = await getAppUser();

  if (!user) {
    redirect("/auth");
  }

  const rawRedirect = params?.redirect;
  const requestedRedirect = rawRedirect
    ? (rawRedirect.startsWith("/") ? rawRedirect : `/${rawRedirect}`).split("?")[0] || "/"
    : "/";
  if (
    requestedRedirect !== "/" &&
    isValidInternalPath(requestedRedirect) &&
    canAccessPath(user.role, requestedRedirect)
  ) {
    redirect(requestedRedirect);
  }

  if (user.role === "superadmin") redirect("/superadmin");
  if (user.role === "admin") redirect("/admin/waitlist");
  redirect("/user");
}

import { SignIn } from "@clerk/nextjs";

function sanitizeRedirect(redirect: string | undefined): string {
  if (!redirect || typeof redirect !== "string") return "/";
  const path = redirect.startsWith("/") ? redirect : `/${redirect}`;
  if (!path.startsWith("/") || path.startsWith("//")) return "/";
  return path;
}

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const params = await searchParams;
  const redirectTo = sanitizeRedirect(params?.redirect);
  const callbackUrl =
    redirectTo === "/"
      ? "/auth/callback"
      : `/auth/callback?redirect=${encodeURIComponent(redirectTo)}`;

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-[#a7f3ec]/20 via-white to-[#e9e3f5]/30 px-4">
      <SignIn
        fallbackRedirectUrl={callbackUrl}
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg border border-[#e9e3f5]",
          },
          variables: {
            colorPrimary: "#2ec4b6",
            colorBackground: "#ffffff",
            borderRadius: "0.75rem",
          },
        }}
        signUpUrl="/auth"
      />
    </main>
  );
}

import { SignIn } from "@clerk/nextjs";

export default function AuthPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-[#a7f3ec]/20 via-white to-[#e9e3f5]/30 px-4">
      <SignIn
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
        fallbackRedirectUrl="/"
        signUpUrl="/auth"
      />
    </main>
  );
}

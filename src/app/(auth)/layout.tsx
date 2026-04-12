import PublicHeader from "@/components/PublicHeader";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-kolo-bg">
      <PublicHeader />
      <div className="flex justify-center px-6 py-8">
        {children}
      </div>
    </div>
  );
}

import PublicHeader from "@/components/PublicHeader";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-kolo-bg">
      <PublicHeader />
      <main className="max-w-4xl mx-auto px-6 py-6">
        {children}
      </main>
    </div>
  );
}

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

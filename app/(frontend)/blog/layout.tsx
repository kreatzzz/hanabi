import Footer from "@/components/footer";
import Header from "@/components/header";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fbfaf7] text-neutral-950">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

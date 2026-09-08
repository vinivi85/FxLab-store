import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { CategoryGrid } from "@/components/CategoryGrid";
import { InventoryPreview } from "@/components/InventoryPreview";
import { RewardsSection } from "@/components/RewardsSection";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <CategoryGrid />
        <InventoryPreview />
        <RewardsSection />
      </main>
      <Footer />
    </>
  );
}

"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { BestSellers } from "@/components/BestSellers";
import { MenuBrowser } from "@/components/MenuBrowser";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 pb-24 sm:pb-8">
        <HeroSlideshow />
        <BestSellers />
        <MenuBrowser />
      </main>
      <SiteFooter />
    </>
  );
}

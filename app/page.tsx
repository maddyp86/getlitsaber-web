import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import StatBar from "@/components/home/StatBar";

export const metadata: Metadata = {
  title: "Litsaber — The Interactive 510 Battery",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatBar />
    </>
  );
}

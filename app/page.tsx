import type { Metadata } from "next";
import Hero from "@/components/home/Hero";

export const metadata: Metadata = {
  title: "Litsaber — The Interactive 510 Battery",
};

export default function HomePage() {
  return (
    <>
      <Hero />
    </>
  );
}

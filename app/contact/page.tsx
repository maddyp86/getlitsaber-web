import type { Metadata } from "next";
import ContactHero from "@/components/contact/ContactHero";
import ContactMethods from "@/components/contact/ContactMethods";
import ContactForm from "@/components/contact/ContactForm";
import ContactFaq from "@/components/contact/ContactFaq";

export const metadata: Metadata = {
  title: "Contact Us | Litsaber",
  description:
    "Reach us by email, phone, or message. Find answers to common questions about carts, battery, modes, orders, and wholesale.",
  openGraph: {
    title: "Contact Us | Litsaber",
    description:
      "Reach us by email, phone, or message. We're a small team in LA — we read every message and reply within 24 hours.",
    url: "https://getlitsaber.com/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="bg-background-primary pt-navbar">
      <ContactHero />
      <ContactMethods />
      <ContactForm />
      <ContactFaq />
    </main>
  );
}

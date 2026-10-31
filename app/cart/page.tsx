import type { Metadata } from "next";
import CartPageBody from "@/components/cart/CartPageBody";

export const metadata: Metadata = {
  title: "Cart | Litsaber",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return <CartPageBody />;
}

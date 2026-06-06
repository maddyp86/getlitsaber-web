import type { Metadata } from "next";
import CartPageBody from "@/components/cart/CartPageBody";

export const metadata: Metadata = {
  title: "Cart | Litsaber",
};

export default function CartPage() {
  return <CartPageBody />;
}

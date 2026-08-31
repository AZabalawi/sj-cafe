import { redirect } from "next/navigation";

// The storefront IS the menu now (see app/page.tsx) — this route only exists
// so the printed QR code (which points at /menu) keeps working without a
// reprint. New QR codes should just point at "/".
export default function MenuPage() {
  redirect("/");
}

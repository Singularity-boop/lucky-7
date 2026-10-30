import { redirect } from "next/navigation";

// Ordering lives on the home page; keep /menu working for old links.
export default function MenuPage() {
  redirect("/");
}

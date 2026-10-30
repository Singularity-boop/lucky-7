import Image from "next/image";
import { imageFor } from "../lib/images";

/** Item photo, or a branded placeholder tile until a photo exists. */
export function ItemPhoto({
  id,
  name,
  className = "",
  sizes = "(min-width: 1024px) 280px, 50vw",
}: {
  id: string;
  name: string;
  className?: string;
  sizes?: string;
}) {
  const src = imageFor(id);
  if (src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image src={src} alt={name} fill sizes={sizes} className="object-cover" />
      </div>
    );
  }
  return (
    <div
      aria-hidden
      className={`grid place-items-center bg-[radial-gradient(circle_at_50%_40%,#2e2a27,#1b1b1b_70%)] ${className}`}
    >
      <span className="grid h-14 w-14 place-items-center rounded-full bg-brand font-display text-3xl font-bold text-white">
        7
      </span>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";
import { imageFor } from "../lib/images";

/** Item photo, or a branded placeholder tile until a photo exists. Photos fade in once loaded. */
export function ItemPhoto({
  id,
  name,
  className = "",
  imgClassName = "",
  sizes = "(min-width: 1024px) 280px, 50vw",
}: {
  id: string;
  name: string;
  className?: string;
  /** Extra classes for the <img>, e.g. a hover zoom. */
  imgClassName?: string;
  sizes?: string;
}) {
  const src = imageFor(id);
  const [loaded, setLoaded] = useState(false);
  if (src) {
    return (
      <div className={`relative overflow-hidden bg-soft ${className}`}>
        <Image
          src={src}
          alt={name}
          fill
          sizes={sizes}
          onLoad={() => setLoaded(true)}
          data-loading={loaded ? undefined : ""}
          className={`photo object-cover ${imgClassName}`}
        />
      </div>
    );
  }
  return (
    <div
      aria-hidden
      className={`grid place-items-center bg-[radial-gradient(circle_at_50%_40%,#183b78,var(--navy)_70%)] ${className}`}
    >
      <Image src="/brand/icon.svg" alt="" width={56} height={56} className="h-14 w-14" />
    </div>
  );
}

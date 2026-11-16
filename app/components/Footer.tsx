import Image from "next/image";
import { store } from "../lib/menu";

export function Footer() {
  return (
    <footer className="mt-10 bg-navy pb-24 text-white/75 lg:pb-0">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm sm:grid-cols-3">
        <div>
          <Image
            src="/brand/logo-white.svg"
            alt="Lucky 7 Deli and Market"
            width={678}
            height={178}
            className="mb-3 h-12 w-auto"
          />
          <p className="font-semibold uppercase tracking-wider">{store.tagline}</p>
          <p className="mt-3">{store.quality}.</p>
        </div>
        <div>
          <p className="font-semibold uppercase tracking-wider text-white">Visit</p>
          <address className="mt-2 not-italic">
            {store.address}, {store.city}
            <br />
            <span className="text-white/50">{store.landmark}</span>
          </address>
          <a
            href={store.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block font-semibold text-teal-light"
          >
            Get directions
          </a>
        </div>
        <div>
          <p className="font-semibold uppercase tracking-wider text-white">Hours & phone</p>
          <p className="mt-2">{store.hours}</p>
          <a href={`tel:${store.phone}`} className="font-semibold text-white">
            {store.phone}
          </a>
          <p className="mt-2 text-white/50">All major credit cards accepted.</p>
        </div>
      </div>
    </footer>
  );
}

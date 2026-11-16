"use client";

import { useEffect, useRef, useState } from "react";
import { store } from "../lib/menu";

const slides = [
  {
    video: "/hero/chicken.mp4",
    poster: "/menu/fried-chicken-bucket.jpg",
    kicker: "Fried fresh all day",
    title: "Buckets from 4 to 100 pieces",
    cta: { label: "Order chicken", href: "#fried-chicken" },
  },
  {
    video: "/hero/cheesesteak.mp4",
    poster: "/menu/hs-cheesesteak.jpg",
    kicker: store.slogan,
    title: "Cheesesteaks up to 15 inches",
    cta: { label: "Order subs", href: "#hot-subs" },
  },
];

const SLIDE_MS = 8000;

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % slides.length), SLIDE_MS);
    return () => window.clearTimeout(t);
  }, [index]);

  // Play only the visible slide's video, from the start.
  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === index) {
        v.currentTime = 0;
        v.play().catch(() => {});
      } else v.pause();
    });
  }, [index]);

  return (
    <section className="relative h-[240px] overflow-hidden bg-navy text-white sm:h-[320px]">
      {slides.map((s, i) => (
        <div
          key={s.video}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${i === index ? "opacity-100" : "opacity-0"}`}
        >
          <video
            ref={(el) => {
              videos.current[i] = el;
            }}
            src={s.video}
            poster={s.poster}
            muted
            playsInline
            loop
            preload={i === 0 ? "auto" : "metadata"}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div
            className={`absolute inset-0 mx-auto flex max-w-7xl flex-col justify-center px-4 transition-[opacity,translate] duration-500 ease-out ${
              i === index ? "translate-y-0 opacity-100 delay-200" : "translate-y-3 opacity-0"
            }`}
          >
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-teal-light">{s.kicker}</p>
            <h1 className="mt-2 max-w-lg font-display text-4xl font-bold uppercase leading-none sm:text-6xl">
              {s.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a
                href={s.cta.href}
                tabIndex={i === index ? 0 : -1}
                className="rounded-full bg-action px-6 py-3 text-sm font-bold uppercase tracking-wider transition hover:bg-action-dark active:scale-[0.97]"
              >
                {s.cta.label}
              </a>
              <span className="hidden text-sm text-white/80 sm:inline">
                Pickup in ~20 min · Open 5am to 11pm
              </span>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((s, i) => (
          <button
            key={s.video}
            onClick={() => setIndex(i)}
            aria-label={`Show slide ${i + 1}`}
            aria-current={i === index}
            className={`h-2 rounded-full transition-[width,background-color] duration-300 ease-out ${i === index ? "w-8 bg-white" : "w-2 bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  );
}

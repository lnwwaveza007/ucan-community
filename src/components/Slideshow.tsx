"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Image, { StaticImageData } from "next/image";

type SlideshowProps = {
  images: Array<{ src: StaticImageData; alt?: string }>
  intervalMs?: number;
};

export default function Slideshow({ images, intervalMs = 3500 }: SlideshowProps) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const count = images.length;

  const go = (next: number) => setIndex((prev) => (prev + next + count) % count);
  const goTo = (i: number) => setIndex(((i % count) + count) % count);

  const start = () => {
    stop();
    timerRef.current = setInterval(() => go(1), intervalMs);
  };
  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  useEffect(() => {
    if (count <= 1) return;
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, intervalMs]);

  const items = useMemo(() => images, [images]);

  return (
    <div className="relative h-full w-full">
      {/* Slides */}
      <div className="relative h-full w-full">
        {items.map((img, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === index ? 1 : 0 }}
            aria-hidden={i !== index}
          >
            <Image src={img.src} alt={img.alt ?? ""} fill className="object-cover" priority={i === 0} sizes="(min-width: 768px) 50vw, 100vw" />
          </div>
        ))}
      </div>

      {/* Controls */}
      {count > 1 && (
        <>
          <button
            aria-label="Previous slide"
            onClick={() => { stop(); go(-1); start(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 grid place-items-center rounded-full bg-black/40 hover:bg-black/55 text-white"
          >
            ‹
          </button>
          <button
            aria-label="Next slide"
            onClick={() => { stop(); go(1); start(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 grid place-items-center rounded-full bg-black/40 hover:bg-black/55 text-white"
          >
            ›
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => { stop(); goTo(i); start(); }}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2.5 rounded-full transition-all ${i === index ? "w-6 bg-white" : "w-2.5 bg-white/60 hover:bg-white/80"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}



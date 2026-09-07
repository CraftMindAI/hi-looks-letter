"use client";

import { useState } from "react";

type GalleryImage = {
  key: string;
  src: string;
  alt: string;
};

export default function ProjectGallery({ images }: { images: GalleryImage[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const showPrev = () =>
    setActiveIndex((current) =>
      current === null ? null : (current - 1 + images.length) % images.length
    );

  const showNext = () =>
    setActiveIndex((current) =>
      current === null ? null : (current + 1) % images.length
    );

  return (
    <>
      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image, i) => (
          <button
            key={image.key}
            type="button"
            onClick={() => setActiveIndex(i)}
            className="flex h-48 items-center justify-center overflow-hidden rounded-xl bg-white sm:h-56"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt={image.alt}
              className="h-full w-full object-contain"
            />
          </button>
        ))}
      </div>

      {activeIndex !== null ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setActiveIndex(null)}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setActiveIndex(null)}
            className="absolute right-4 top-4 cursor-pointer text-3xl text-white/80 hover:text-white"
          >
            &times;
          </button>

          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white/10 p-3 text-2xl text-white hover:bg-white/20 sm:left-6"
          >
            &#8592;
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[activeIndex].src}
            alt={images[activeIndex].alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[45vh] max-w-[45vw] object-contain"
          />

          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white/10 p-3 text-2xl text-white hover:bg-white/20 sm:right-6"
          >
            &#8594;
          </button>
        </div>
      ) : null}
    </>
  );
}

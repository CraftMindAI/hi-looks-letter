"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

const TOTAL_FRAMES = 40;

// Duration in milliseconds for each frame in the sequence (Frames 1 to 40, indices 0 to 39).
// Calibrated to a smooth, cinematic medium pace:
const FRAME_DURATIONS: number[] = [
  // Scene 1: Straight vertical fall (Frames 1–7)
  130, 125, 120, 120, 115, 115, 115,
  // Scene 2: Impact & brief dust (Frames 8–9)
  160, 150,
  // Scene 3: Cracks spreading outward (Frames 10–13)
  140, 140, 140, 140,
  // Scene 4: Rotation begins medium-fast (Frames 14–17)
  130, 125, 120, 115,
  // Scenes 5–7: Rotation with motion blur (Frames 18–25) - strictly sequential, no repeat
  100, 100, 100, 100, 100, 100, 100, 100,
  // Scene 8: Rotation slows down (Frames 26–27)
  150, 170,
  // Scene 9: Cracks disappear cleanly (Frames 28–31)
  160, 160, 160, 160,
  // Scenes 10–11: Camera zooms in / logo grows 3D (Frames 32–38)
  150, 150, 150, 150, 150, 150, 160,
  // Scene 12: Final large 3D logo (Frames 39–40)
  220, 320,
];

const TOTAL_SEQUENCE_TIME = FRAME_DURATIONS.reduce((a, b) => a + b, 0);
const BLINK_DURATION = 450;

// Format frame index (1-based) to asset path: /assets/ezgif-frame-001.jpg
function getFramePath(frameNumber: number): string {
  const padded = String(frameNumber).padStart(3, "0");
  return `/assets/ezgif-frame-${padded}.jpg`;
}

export interface HiLooksLogoAnimationProps {
  onScene33?: () => void;
  onReplay?: () => void;
}

export default function HiLooksLogoAnimation({
  onScene33,
  onReplay,
}: HiLooksLogoAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [, setIsLoaded] = useState(false);
  const replayTriggerRef = useRef<(() => void) | null>(null);

  const onScene33Ref = useRef(onScene33);
  onScene33Ref.current = onScene33;

  const onReplayRef = useRef(onReplay);
  onReplayRef.current = onReplay;

  useEffect(() => {
    let isCancelled = false;
    let animFrameId: number | null = null;
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;
    let activeFrameIdx = 0;
    let activeBlinkIntensity = 0;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Helper to draw a specific frame onto canvas maintaining 16:9 contain
    const renderFrame = (
      img: HTMLImageElement,
      blinkIntensity = 0
    ) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const physicalWidth = Math.round(rect.width * dpr);
      const physicalHeight = Math.round(rect.height * dpr);

      if (
        canvas.width !== physicalWidth ||
        canvas.height !== physicalHeight
      ) {
        canvas.width = physicalWidth;
        canvas.height = physicalHeight;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      const logicalWidth = rect.width;
      const logicalHeight = rect.height;

      // Fill pure white background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, logicalWidth, logicalHeight);

      // Maintain exact 16:9 aspect ratio without stretching or cropping
      const imgAspect = 1920 / 1080;
      let drawW = logicalWidth;
      let drawH = logicalWidth / imgAspect;

      if (drawH > logicalHeight) {
        drawH = logicalHeight;
        drawW = logicalHeight * imgAspect;
      }

      const drawX = (logicalWidth - drawW) / 2;
      const drawY = (logicalHeight - drawH) / 2;

      // Filter lifts all studio gray edges (235-245) to pure #ffffff (255)
      // while keeping the red logo, reflections, and cracks deep and vibrant.
      ctx.filter = "contrast(1.06) brightness(1.04)";
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.filter = "none";

      // The source photos sit on a flat studio backdrop that isn't quite
      // pure white, so it shows up as a visible rectangle against the
      // page. Clip any near-white pixel straight to #ffffff so — combined
      // with mix-blend-multiply on the canvas element — the backdrop
      // disappears into the page instead of leaving a frame.
      const physX = Math.round(drawX * dpr);
      const physY = Math.round(drawY * dpr);
      const physW = Math.round(drawW * dpr);
      const physH = Math.round(drawH * dpr);
      if (physW > 0 && physH > 0) {
        const imageData = ctx.getImageData(physX, physY, physW, physH);
        const data = imageData.data;
        const WHITE_THRESHOLD = 232;
        for (let i = 0; i < data.length; i += 4) {
          if (
            data[i] > WHITE_THRESHOLD &&
            data[i + 1] > WHITE_THRESHOLD &&
            data[i + 2] > WHITE_THRESHOLD
          ) {
            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 255;
          }
        }
        ctx.putImageData(imageData, physX, physY);
      }

      // Subtle bright blink/highlight on the logo only at the very end
      // Uses 'screen' composite mode: pure white (255) remains 100% white,
      // so the white background never blinks, while red/3D logo catch a bright shine.
      if (blinkIntensity > 0) {
        ctx.save();
        ctx.globalCompositeOperation = "screen";

        const logoCenterX = drawX + drawW * 0.52;
        const logoCenterY = drawY + drawH * 0.5;
        const radius = drawW * 0.38;

        const radialGradient = ctx.createRadialGradient(
          logoCenterX,
          logoCenterY,
          0,
          logoCenterX,
          logoCenterY,
          radius
        );

        radialGradient.addColorStop(
          0,
          `rgba(255, 255, 255, ${0.45 * blinkIntensity})`
        );
        radialGradient.addColorStop(
          0.4,
          `rgba(255, 235, 235, ${0.25 * blinkIntensity})`
        );
        radialGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = radialGradient;
        ctx.fillRect(drawX, drawY, drawW, drawH);
        ctx.restore();
      }

      ctx.restore();
    };

    // Preload all 40 frames
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);

      img.onload = () => {
        if (isCancelled) return;
        loadedCount++;

        // Display frame 1 as soon as it loads
        if (i === 1) {
          renderFrame(img);
        }

        if (loadedCount === TOTAL_FRAMES) {
          setIsLoaded(true);
          startAnimation();
        }
      };

      img.onerror = () => {
        if (isCancelled) return;
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          setIsLoaded(true);
          startAnimation();
        }
      };

      images.push(img);
    }

    // Animation runner
    const startAnimation = () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      let startTime: number | null = null;
      let hasTriggeredScene33 = false;

      const tick = (now: number) => {
        if (isCancelled) return;
        if (!startTime) startTime = now;
        const elapsed = now - startTime;

        let frameIdx = 0;
        let blinkIntensity = 0;

        if (elapsed < TOTAL_SEQUENCE_TIME) {
          // Strictly monotonic frame calculation at medium speed
          let accumulated = 0;
          for (let i = 0; i < TOTAL_FRAMES; i++) {
            accumulated += FRAME_DURATIONS[i];
            if (elapsed < accumulated) {
              frameIdx = i;
              break;
            }
          }
        } else {
          // Reached final frame 40 (index 39)
          frameIdx = TOTAL_FRAMES - 1;

          const blinkElapsed = elapsed - TOTAL_SEQUENCE_TIME;
          if (blinkElapsed < BLINK_DURATION) {
            const p = blinkElapsed / BLINK_DURATION;
            blinkIntensity = Math.sin(p * Math.PI);
          } else {
            blinkIntensity = 0;
          }
        }

        // Notify parent when Scene 33 (Frame 33 / index 32) is reached
        // so hero can transition the animation to the right and reveal content
        if (frameIdx >= 32 && !hasTriggeredScene33) {
          hasTriggeredScene33 = true;
          onScene33Ref.current?.();
        }

        activeFrameIdx = frameIdx;
        activeBlinkIntensity = blinkIntensity;

        const currentImage = images[frameIdx];
        if (currentImage && currentImage.complete) {
          renderFrame(currentImage, blinkIntensity);
        }

        // Continue running until sequence + blink is complete, then settle stable
        if (elapsed < TOTAL_SEQUENCE_TIME + BLINK_DURATION + 50) {
          animFrameId = requestAnimationFrame(tick);
        }
      };

      animFrameId = requestAnimationFrame(tick);
    };

    replayTriggerRef.current = () => {
      onReplayRef.current?.();
      startAnimation();
    };

    // Handle responsive container resize
    const ro = new ResizeObserver(() => {
      if (images.length > 0) {
        const currentImg = images[activeFrameIdx] || images[0];
        if (currentImg && currentImg.complete) {
          renderFrame(currentImg, activeBlinkIntensity);
        }
      }
    });

    if (containerRef.current) {
      ro.observe(containerRef.current);
    }

    return () => {
      isCancelled = true;
      if (animFrameId) cancelAnimationFrame(animFrameId);
      ro.disconnect();
    };
  }, []);

  const handleReplay = useCallback(() => {
    if (replayTriggerRef.current) {
      replayTriggerRef.current();
    }
  }, []);

  return (
    <div
      ref={containerRef}
      onClick={handleReplay}
      className="relative flex w-full items-center justify-center overflow-hidden cursor-pointer select-none"
    >
      <canvas
        ref={canvasRef}
        className="block h-auto w-full max-w-[760px] xl:max-w-[820px] aspect-[16/9] object-contain mix-blend-multiply"
        style={{
          WebkitMaskImage:
            "radial-gradient(ellipse 96% 94% at 50% 50%, black 82%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 96% 94% at 50% 50%, black 82%, transparent 100%)",
        }}
        aria-label="Hi-Look's LETTERS 3D animated logo"
        role="img"
      />
    </div>
  );
}

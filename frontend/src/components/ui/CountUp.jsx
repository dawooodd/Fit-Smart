import React, { useEffect, useRef, useState } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Angka yang menghitung naik dari 0 saat terlihat di layar. */
export default function CountUp({ end, duration = 1400, locale = 'id-ID', className = '' }) {
  const ref = useRef(null);
  const skipAnimation = prefersReducedMotion() || typeof IntersectionObserver === 'undefined';
  const [value, setValue] = useState(skipAnimation ? end : 0);

  useEffect(() => {
    const node = ref.current;
    if (!node || skipAnimation) return undefined;

    let frame;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(end * eased));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.4 });

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [end, duration, skipAnimation]);

  return <span ref={ref} className={className}>{(skipAnimation ? end : value).toLocaleString(locale)}</span>;
}

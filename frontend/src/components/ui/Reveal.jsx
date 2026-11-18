import React, { useEffect, useRef, useState } from 'react';

const canObserve = typeof IntersectionObserver !== 'undefined';

/**
 * Memunculkan konten dengan animasi fade + slide saat masuk viewport.
 * `delay` (ms) dipakai untuk efek stagger antar kartu.
 */
export default function Reveal({ children, delay = 0, className = '', ...rest }) {
  const ref = useRef(null);
  // Tanpa IntersectionObserver (browser lama), langsung tampil.
  const [visible, setVisible] = useState(!canObserve);

  useEffect(() => {
    const node = ref.current;
    if (!node || !canObserve) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms` }}
      {...rest}
    >
      {children}
    </div>
  );
}
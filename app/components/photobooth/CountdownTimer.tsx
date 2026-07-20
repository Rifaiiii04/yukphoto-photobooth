/* ============================================================
   COUNTDOWN TIMER COMPONENT
   Animasi countdown 3-2-1 sebelum foto diambil.
   Tampil sebagai overlay besar di atas camera view.
   ============================================================ */

'use client';

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  /** Angka awal countdown (default: 3) */
  from?: number;
  /** Callback saat countdown selesai */
  onComplete: () => void;
}

export default function CountdownTimer({
  from = 3,
  onComplete,
}: CountdownTimerProps) {
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (count <= 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  if (count <= 0) return null;

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30">
      <div
        key={count}
        className="animate-countdown text-[120px] font-bold text-white select-none"
        style={{ textShadow: '0 4px 24px rgba(0,0,0,0.3)' }}
      >
        {count}
      </div>
    </div>
  );
}

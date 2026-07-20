/* ============================================================
   HOW IT WORKS SECTION
   3 langkah sederhana menggunakan YukPhoto.
   ============================================================ */

import Image from 'next/image';
import { Camera, Palette, Download } from 'lucide-react';

const steps = [
  {
    step: 1,
    icon: Camera,
    title: 'Buka Kamera',
    description: 'Izinkan akses kamera, pilih layout frame, lalu mulai sesi foto kamu.',
    color: 'var(--color-primary)',
  },
  {
    step: 2,
    icon: Palette,
    title: 'Pilih Filter & Foto',
    description: 'Pilih filter aesthetic favorit kamu. Countdown 3-2-1 lalu foto otomatis diambil.',
    color: 'var(--color-secondary)',
  },
  {
    step: 3,
    icon: Download,
    title: 'Download Hasil',
    description: 'Review foto, pilih frame, dan download hasilnya langsung sebagai gambar PNG.',
    color: 'var(--color-success)',
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full px-6 py-16 md:py-24 bg-[var(--color-surface)]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text)] mb-3">
            Cara Pakai YukPhoto
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-md mx-auto">
            Cuma 3 langkah mudah untuk foto aesthetic
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {steps.map((item, index) => (
            <div key={item.step} className="relative flex flex-col items-center text-center group">
              {/* Connector line (hidden on mobile, shown between cards on desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-[var(--color-border)]" />
              )}

              {/* Step number circle */}
              <div
                className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `color-mix(in srgb, ${item.color} 12%, white)` }}
              >
                <item.icon size={32} style={{ color: item.color }} />
                <div
                  className="absolute -top-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: item.color }}
                >
                  {item.step}
                </div>
              </div>

              {/* Text */}
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-xs">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Photo strip showcase */}
        <div className="mt-16 flex justify-center">
          <div className="bg-white p-3 pb-10 shadow-lg rotate-[-1deg] hover:rotate-0 transition-transform duration-500">
            <div className="flex flex-col gap-2">
              {['/images/people.png', '/images/people4.png', '/images/people2.png'].map((src, i) => (
                <div key={i} className="w-48 h-36 overflow-hidden bg-[var(--color-bg-alt)]">
                  <Image
                    src={src}
                    alt={`Strip foto ${i + 1}`}
                    width={380}
                    height={285}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <p className="text-center mt-3 text-xs font-medium text-[var(--color-secondary)]">
              YukPhoto
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

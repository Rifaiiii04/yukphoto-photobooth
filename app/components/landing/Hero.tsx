/* ============================================================
   HERO SECTION
   Section utama landing page. Menampilkan headline, CTA,
   dan showcase polaroid frames menggunakan foto orang asli.
   ============================================================ */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Camera, Sparkles, Heart, Star, Users, Shield } from 'lucide-react';
import Button from '@/app/components/ui/Button';

/** Data polaroid showcase */
const polaroids = [
  {
    src: '/images/people.png',
    alt: 'Wanita tersenyum',
    rotate: '-6deg',
    offsetY: '12px',
    filter: 'none',
  },
  {
    src: '/images/people4.png',
    alt: 'Wanita tertawa',
    rotate: '3deg',
    offsetY: '-8px',
    filter: 'none',
  },
  {
    src: '/images/people2.png',
    alt: 'Pria tersenyum',
    rotate: '-2deg',
    offsetY: '4px',
    filter: 'sepia(30%)',
  },
  {
    src: '/images/people3.png',
    alt: 'Grup teman',
    rotate: '5deg',
    offsetY: '-4px',
    filter: 'none',
  },
];

/** Stats section */
const stats = [
  { value: '100%', label: 'Gratis' },
  { value: 'Live', label: 'Multiplayer' },
  { value: '8+', label: 'Filter' },
  { value: '0', label: 'Data Tersimpan' },
];

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-20 left-[-40px] w-80 h-80 rounded-full opacity-[0.08]" style={{ backgroundColor: 'var(--color-primary)' }} />
      <div className="absolute bottom-10 right-[-60px] w-96 h-96 rounded-full opacity-[0.06]" style={{ backgroundColor: 'var(--color-secondary)' }} />
      <div className="absolute top-60 right-[10%] w-20 h-20 rounded-full opacity-[0.12]" style={{ backgroundColor: 'var(--color-accent)' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-12 md:pt-36 md:pb-20">
        {/* Two column layout: Text + Polaroid showcase */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left: Text content */}
          <div className="flex-1 text-center lg:text-left max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-4 px-4 py-2 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-sm)] mb-6">
              <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)]">
                <Users size={18} className="text-[var(--color-primary)]" />
                <span>Live Multiplayer</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-border)]" />
              <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)]">
                <Shield size={14} className="text-[var(--color-success)]" />
                <span>Privasi Aman</span>
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-[var(--color-text)] leading-[1.15] mb-5">
              Photobooth Online
              <br />
              <span className="text-[var(--color-primary)]">Aesthetic & Gratis</span>
            </h1>

            {/* Subheading */}
            <p className="text-base md:text-lg text-[var(--color-text-secondary)] leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
              Ambil foto dengan filter cantik dan frame polaroid ala Korean photobooth. 
              Langsung download &mdash; foto kamu tidak tersimpan di server manapun.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
              <Link href="/photobooth">
                <Button variant="primary" size="lg" icon={<Camera size={20} />} className="shadow-lg shadow-[var(--color-primary)]/20">
                  Mulai Foto
                </Button>
              </Link>
              <Link href="/photobooth">
                <Button variant="secondary" size="lg" icon={<Users size={20} />}>
                  Sesi Foto Bareng
                </Button>
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-center lg:justify-start gap-6 md:gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-xl md:text-2xl font-bold text-[var(--color-primary)]">
                    {stat.value}
                  </p>
                  <p className="text-[10px] md:text-xs text-[var(--color-text-muted)] uppercase tracking-wide">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Polaroid showcase */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="relative w-[340px] h-[380px] md:w-[420px] md:h-[440px]">
              {polaroids.map((polaroid, index) => {
                // Position each polaroid in a scattered fan layout
                const positions = [
                  { left: '0%', top: '10%' },
                  { left: '45%', top: '0%' },
                  { left: '5%', top: '52%' },
                  { left: '48%', top: '45%' },
                ];
                const pos = positions[index];

                return (
                  <div
                    key={index}
                    className="absolute w-[160px] md:w-[190px] bg-white p-2 pb-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:z-10 cursor-pointer"
                    style={{
                      left: pos.left,
                      top: pos.top,
                      transform: `rotate(${polaroid.rotate}) translateY(${polaroid.offsetY})`,
                      zIndex: index + 1,
                    }}
                  >
                    <div className="w-full aspect-[4/3] overflow-hidden bg-[var(--color-bg-alt)]">
                      <Image
                        src={polaroid.src}
                        alt={polaroid.alt}
                        width={380}
                        height={285}
                        className="w-full h-full object-cover"
                        style={{
                          filter: polaroid.filter === 'none' ? undefined : polaroid.filter,
                        }}
                      />
                    </div>
                    {/* Polaroid bottom area — simulated handwriting */}
                    <div className="flex items-center justify-center mt-2">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={8}
                            className="text-[var(--color-primary)]"
                            fill="var(--color-primary)"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

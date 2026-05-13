'use client';

import { motion } from 'framer-motion';
import Hero from '@/components/Hero';
import Testimonials from '@/components/Testimonials';
import Plans from '@/components/Plans';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-[#e2e2e2] overflow-x-hidden relative">
      <Navbar />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Hero />
      </motion.div>

      {/* Content Divider - Subtle Gradient instead of rigid SVG */}
      <div className="relative h-24 w-full bg-gradient-to-b from-black to-[#080808]" />

      <section className="relative z-10">
        <Testimonials />
      </section>

      <section className="relative z-10">
        <Plans />
      </section>

      <section className="relative z-10">
        <FAQ />
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}

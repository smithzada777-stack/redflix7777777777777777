'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Instagram, MessageCircle, ShieldCheck, CreditCard, Lock } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#050505] py-16 md:py-24 relative overflow-hidden">
            {/* Top Border Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-[#E50914]/50 to-transparent" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20 items-center mb-16">
                    
                    {/* Brand & Mission */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="text-3xl md:text-4xl font-black text-white font-['Epilogue'] tracking-tighter mb-4">
                            REDFLIX <span className="text-[#E50914]">ELITE</span>
                        </div>
                        <p className="text-white/40 text-xs md:text-sm font-medium font-['Lexend'] max-w-xs leading-relaxed uppercase tracking-widest">
                            A maior experiência de entretenimento digital com performance de elite e economia real.
                        </p>
                    </div>

                    {/* Navigation & Socials */}
                    <div className="flex flex-col items-center gap-8">
                        <div className="flex gap-8">
                            <Link href="#" className="text-[10px] font-black tracking-[0.2em] uppercase text-white/40 hover:text-[#E50914] transition-colors font-['Epilogue']">Privacidade</Link>
                            <Link href="#" className="text-[10px] font-black tracking-[0.2em] uppercase text-white/40 hover:text-[#E50914] transition-colors font-['Epilogue']">Termos</Link>
                            <Link href="#" className="text-[10px] font-black tracking-[0.2em] uppercase text-white/40 hover:text-[#E50914] transition-colors font-['Epilogue']">Contato</Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="#" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 hover:bg-[#E50914] hover:text-white transition-all border border-white/5 hover:border-[#E50914]/50">
                                <Instagram size={20} />
                            </Link>
                            <Link href="#" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 hover:bg-[#E50914] hover:text-white transition-all border border-white/5 hover:border-[#E50914]/50">
                                <MessageCircle size={20} />
                            </Link>
                        </div>
                    </div>

                    {/* Secure Badges */}
                    <div className="flex flex-col items-center md:items-end gap-6">
                        <div className="flex items-center gap-4 opacity-40 grayscale hover:grayscale-0 transition-all">
                            <ShieldCheck size={24} className="text-white" />
                            <CreditCard size={24} className="text-white" />
                            <Lock size={24} className="text-white" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 text-center md:text-right font-['Lexend']">
                            &copy; 2026 REDFLIX ELITE. <br />TODOS OS DIREITOS RESERVADOS.
                        </p>
                    </div>
                </div>

                {/* Bottom Decorative Line */}
                <div className="w-full h-px bg-white/5" />
            </div>
        </footer>
    );
}

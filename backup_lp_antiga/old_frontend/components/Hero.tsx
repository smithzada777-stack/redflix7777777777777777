'use client';

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, Star, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const Hero = () => {
    return (
        <section className="relative w-full min-h-[700px] md:h-[95vh] flex flex-col justify-center overflow-hidden bg-black">
            {/* Cinematic Background - Organic Glows without rigid images */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Desktop Atmosphere */}
                <div className="absolute inset-0 hidden md:block">
                    {/* Primary Glow */}
                    <div className="absolute left-[10%] top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E50914]/10 blur-[150px] rounded-full animate-pulse" />
                    {/* Secondary Right Glow (Placeholder space for future image) */}
                    <div className="absolute right-[-10%] top-1/4 w-[800px] h-[800px] bg-[#E50914]/5 blur-[200px] rounded-full" />
                </div>

                {/* Mobile Atmosphere - Fluid and Integrated */}
                <div className="absolute top-0 left-0 w-full h-full md:hidden">
                     <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[150%] h-[400px] bg-[#E50914]/15 blur-[120px] rounded-full" />
                     <div className="absolute bottom-1/4 right-[-20%] w-[300px] h-[300px] bg-[#E50914]/10 blur-[100px] rounded-full" />
                </div>
            </div>

            <div className="relative z-10 container mx-auto px-6 md:px-12 h-full">
                <div className="max-w-3xl flex flex-col items-center md:items-start text-center md:text-left">
                    {/* Premium Badge */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full mb-8"
                    >
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-5 h-5 rounded-full border border-black bg-[#E50914]/80 flex items-center justify-center">
                                    <Star size={10} className="text-white fill-current" />
                                </div>
                            ))}
                        </div>
                        <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/80 font-['Epilogue']">
                            A Escolha Nº1 do Brasil
                        </span>
                    </motion.div>

                    {/* Headline - Exact Text from Backup */}
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-[32px] md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.05] font-['Epilogue'] text-white"
                    >
                        Cansado de <span className="text-[#E50914] uppercase drop-shadow-[0_0_30px_rgba(229,9,20,0.5)]">pagar caro</span><br />
                        por{' '}
                        <span className="relative inline-block px-1">
                            catálogos
                            <span className="absolute bottom-1 left-0 right-0 h-[6px] md:h-[8px] bg-[#E50914] rounded-full -z-10 opacity-70"></span>
                        </span>{' '}
                        <span className="relative inline-block px-1">
                            limitados?
                            <span className="absolute bottom-1 left-0 right-0 h-[6px] md:h-[8px] bg-[#E50914] rounded-full -z-10 opacity-70"></span>
                        </span>
                    </motion.h1>

                    {/* Subheadline - Exact Text from Backup */}
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-8 text-base md:text-xl text-white/70 max-w-lg leading-relaxed font-['Lexend'] font-medium"
                    >
                        Pare de pagar e depois pagar novamente, para depois nem ter o filme que você queria.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-10 flex flex-col sm:flex-row gap-5 w-full sm:w-auto"
                    >
                        <Link href="#pricing" className="group relative">
                            <div className="absolute inset-0 bg-[#E50914] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                            <button className="relative w-full sm:w-auto bg-[#E50914] text-white font-black text-sm md:text-base px-10 py-5 rounded-[2rem] flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-2xl">
                                Assine agora e economize
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>

                        <button className="w-full sm:w-auto bg-white/5 backdrop-blur-xl border border-white/10 text-white font-black text-sm md:text-base px-10 py-5 rounded-[2rem] flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
                            <Play size={20} fill="white" />
                            Ver Catálogo
                        </button>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 flex items-center gap-6 opacity-60"
                    >
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={18} className="text-[#E50914]" />
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white font-['Lexend']">7 Dias de Garantia</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-white/20" />
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white font-['Lexend']">Sinal 100% Estável</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Fade to Content */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10" />
        </section>
    );
};

export default Hero;
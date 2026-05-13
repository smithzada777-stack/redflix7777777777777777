'use client';

import { motion } from 'framer-motion';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
    {
        name: "Carlos Eduardo",
        role: "Usuário há 1 ano",
        content: "Impressionado com a qualidade do 4K. Já testei vários IPTVs, mas a estabilidade da RedFlix é de outro nível, principalmente em dia de jogo do Premiere.",
        avatar: "https://i.pravatar.cc/150?u=carlos",
        rating: 5
    },
    {
        name: "Juliana Silva",
        role: "Usuário há 6 meses",
        content: "Melhor economia que fiz no ano. Cancelei todos os streamings e agora tenho tudo em um só lugar. O catálogo de séries é atualizado muito rápido!",
        avatar: "https://i.pravatar.cc/150?u=juliana",
        rating: 5
    },
    {
        name: "Ricardo Mendes",
        role: "Usuário há 2 anos",
        content: "O suporte é excelente. Tive uma dúvida na instalação e me responderam em menos de 5 minutos pelo WhatsApp. Recomendo para todo mundo.",
        avatar: "https://i.pravatar.cc/150?u=ricardo",
        rating: 5
    }
];

export default function Testimonials() {
    return (
        <section className="py-24 md:py-32 bg-black relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-6"
                    >
                        <CheckCircle2 size={14} className="text-green-500" />
                        <span className="text-green-500 text-[10px] font-black uppercase tracking-widest font-['Epilogue']">+15.000 CLIENTES SATISFEITOS</span>
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase font-['Epilogue']"
                    >
                        O QUE DIZEM NOSSOS <span className="text-[#E50914]">CLIENTES</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {testimonials.map((t, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group p-8 md:p-10 bg-[#0c0c0c] border border-white/5 rounded-[3rem] hover:border-[#E50914]/30 transition-all duration-500 relative flex flex-col h-full"
                        >
                            <div className="absolute top-8 right-8 text-white/5 group-hover:text-[#E50914]/10 transition-colors">
                                <Quote size={40} />
                            </div>

                            <div className="flex gap-1 mb-6">
                                {[...Array(t.rating)].map((_, i) => (
                                    <Star key={i} size={14} className="text-yellow-500 fill-current" />
                                ))}
                            </div>

                            <p className="text-white/70 text-base md:text-lg italic mb-10 font-medium leading-relaxed font-['Lexend'] flex-grow">
                                "{t.content}"
                            </p>

                            <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#E50914]/40 transition-colors">
                                    <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                                </div>
                                <div>
                                    <h4 className="text-white font-black text-sm uppercase font-['Epilogue']">{t.name}</h4>
                                    <p className="text-[#E50914] text-[10px] font-bold uppercase tracking-widest font-['Lexend']">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

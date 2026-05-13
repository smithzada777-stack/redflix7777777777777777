'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    { q: 'Tenho acesso a TUDO mesmo, sem pegadinhas?', a: 'Sim! Você terá acesso ilimitado a todos os filmes, séries, canais ao vivo, esportes e lançamentos do cinema. Sem taxas extras.' },
    { q: 'E se eu quiser usar em vários aparelhos ao mesmo tempo?', a: 'Nossos planos permitem até 3 telas simultâneas. Você pode assistir na TV da sala, no celular e no tablet ao mesmo tempo sem bloqueios.' },
    { q: 'Preciso ficar preso a um contrato de fidelidade?', a: 'Não! Na RedFlix a liberdade é sua. Você assina e cancela quando quiser, sem multas e sem letras miúdas.' },
    { q: 'O catálogo é atualizado ou vou ver sempre a mesma coisa?', a: 'Atualizamos nosso catálogo diariamente com os últimos lançamentos do cinema e novos episódios de séries assim que saem.' },
    { q: 'E se eu não gostar? Tenho alguma garantia?', a: 'Com certeza. Oferecemos 7 dias de garantia incondicional. Se não gostar, devolvemos 100% do seu dinheiro.' },
];

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <section className="py-24 md:py-32 bg-black relative">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-[#E50914]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-3xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
                            <HelpCircle size={14} className="text-[#E50914]" />
                            <span className="text-white/60 text-[10px] font-black uppercase tracking-widest font-['Epilogue']">Suporte RedFlix</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic font-['Epilogue']">
                            Ainda tem dúvidas? <span className="text-[#E50914]">A gente responde.</span>
                        </h2>
                    </motion.div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => {
                            const isActive = activeIndex === index;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`group rounded-[2rem] border transition-all duration-500 overflow-hidden ${
                                        isActive 
                                        ? 'bg-[#111] border-[#E50914]/30 shadow-[0_20px_50px_-20px_rgba(229,9,20,0.2)]' 
                                        : 'bg-[#0a0a0a] border-white/5 hover:border-white/10'
                                    }`}
                                >
                                    <button
                                        onClick={() => setActiveIndex(isActive ? null : index)}
                                        className="w-full p-6 md:p-8 text-left flex justify-between items-center gap-6"
                                    >
                                        <span className={`text-base md:text-xl font-black tracking-tight font-['Epilogue'] transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/70'}`}>
                                            {faq.q}
                                        </span>
                                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all duration-500 ${
                                            isActive ? 'bg-[#E50914] border-[#E50914] text-white rotate-180' : 'bg-white/5 border-white/10 text-white/40'
                                        }`}>
                                            <ChevronDown size={18} />
                                        </div>
                                    </button>

                                    <AnimatePresence>
                                        {isActive && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                            >
                                                <div className="px-6 md:px-8 pb-8">
                                                    <div className="pt-6 border-t border-white/5">
                                                        <p className="text-white/50 text-sm md:text-lg font-medium leading-relaxed font-['Lexend']">
                                                            {faq.a}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

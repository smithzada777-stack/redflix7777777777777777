'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, Tv, Film, Download, Headphones, Users, ChevronRight, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

const bonuses = [
    { id: 1, icon: Tv, title: '3 Telas Simultâneas', desc: 'Assista no celular, TV e PC ao mesmo tempo.' },
    { id: 2, icon: Zap, title: 'Sem Travamentos', desc: 'Qualidade máxima com tecnologia anti-lag.' },
    { id: 3, icon: Headphones, title: 'Suporte 24h', desc: 'Equipe pronta para te ajudar a qualquer hora.' },
    { id: 4, icon: Shield, title: 'Garantia de 7 Dias', desc: 'Satisfação garantida ou seu dinheiro de volta.' },
    { id: 5, icon: Film, title: '4K Ultra HD', desc: 'Imagem cristalina em todos os dispositivos.' },
    { id: 6, icon: Download, title: 'Modo Offline', desc: 'Baixe seus filmes e assista sem internet.' },
];

const plans = [
    {
        id: 1,
        period: '1 Mês',
        price: '29,90',
        oldPrice: '39,90',
        subtext: 'Plano Mensal (Completo)',
        highlight: false,
        users: 1257
    },
    {
        id: 2,
        period: '3 Meses',
        price: '79,90',
        oldPrice: '89,70',
        save: '11%',
        highlight: true,
        users: 4345
    },
    {
        id: 3,
        period: '6 Meses',
        price: '149,90',
        oldPrice: '179,40',
        save: '16%',
        highlight: false,
        users: 2570
    },
];

export default function Plans() {
    const router = useRouter();

    const goToCheckout = (id: number, period: string, price: string) => {
        router.push(`/checkout?id=${id}&plan=${encodeURIComponent(period)}&price=${price}`);
    };

    return (
        <section id="pricing" className="bg-black py-24 md:py-32 relative overflow-hidden">
            {/* Background Decorations - Organic Shapes */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E50914]/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#E50914]/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/4" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="max-w-3xl mx-auto text-center mb-20">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 bg-[#E50914]/10 border border-[#E50914]/20 rounded-full mb-6"
                    >
                        <span className="text-[#E50914] text-[10px] md:text-xs font-black uppercase tracking-[0.2em] font-['Epilogue']">TABELA DE PREÇOS 2024</span>
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 font-['Epilogue']"
                    >
                        ESCOLHA SEU PLANO E <span className="text-[#E50914]">ECONOMIZE</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-white/60 text-lg max-w-xl mx-auto font-['Lexend']"
                    >
                        Acesso instantâneo a todos os canais, filmes e séries em qualquer dispositivo. Sem fidelidade.
                    </motion.p>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-32">
                    {plans.map((plan) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className={`group relative flex flex-col p-8 md:p-10 rounded-[3rem] transition-all duration-700 border ${
                                plan.highlight 
                                ? 'bg-gradient-to-b from-[#1a1a1a] to-[#080808] border-[#E50914]/40 shadow-[0_40px_100px_-20px_rgba(229,9,20,0.2)] scale-105 z-20' 
                                : 'bg-[#0c0c0c] border-white/5 hover:border-white/20 z-10'
                            }`}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#E50914] text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-2">
                                    <Star size={14} fill="white" />
                                    <span>MAIS POPULAR</span>
                                </div>
                            )}

                            <div className="mb-10">
                                <h3 className={`text-sm font-black uppercase tracking-[0.2em] mb-6 ${plan.highlight ? 'text-[#E50914]' : 'text-white/40'} font-['Epilogue']`}>
                                    {plan.period}
                                </h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-white/30 font-['Epilogue']">R$</span>
                                    <span className={`text-6xl md:text-7xl font-black tracking-tighter text-white font-['Epilogue'] ${plan.highlight ? 'drop-shadow-[0_0_20px_rgba(229,9,20,0.3)]' : ''}`}>
                                        {plan.price.split(',')[0]}
                                    </span>
                                    <span className="text-2xl font-bold text-white/30 font-['Epilogue']">,{plan.price.split(',')[1]}</span>
                                </div>
                                {plan.oldPrice && (
                                    <p className="text-white/20 text-sm font-bold line-through mt-2 font-['Lexend']">De R$ {plan.oldPrice}</p>
                                )}
                            </div>

                            {plan.save && (
                                <div className="mb-8 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-2xl self-start">
                                    <span className="text-green-500 text-[10px] font-black uppercase tracking-widest">ECONOMIZE {plan.save}</span>
                                </div>
                            )}

                            <div className="space-y-5 mb-10">
                                <div className="flex items-center gap-3 text-white/70">
                                    <Users size={18} className={plan.highlight ? 'text-[#E50914]' : 'text-white/20'} />
                                    <span className="text-xs font-bold font-['Lexend']">+{plan.users.toLocaleString()} usuários ativos</span>
                                </div>
                                <div className="w-full h-px bg-white/5" />
                                <ul className="space-y-4">
                                    <li className="flex items-center gap-3 text-sm font-medium text-white/80">
                                        <Zap size={16} className="text-[#E50914]" />
                                        Todos os Canais Liberados
                                    </li>
                                    <li className="flex items-center gap-3 text-sm font-medium text-white/80">
                                        <Zap size={16} className="text-[#E50914]" />
                                        Cinema & Séries em 4K
                                    </li>
                                    <li className="flex items-center gap-3 text-sm font-medium text-white/80">
                                        <Zap size={16} className="text-[#E50914]" />
                                        Esportes (Premiere e +)
                                    </li>
                                </ul>
                            </div>

                            <button
                                onClick={() => goToCheckout(plan.id, plan.period, plan.price)}
                                className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 group overflow-hidden relative ${
                                    plan.highlight 
                                    ? 'bg-[#E50914] text-white hover:bg-white hover:text-black shadow-2xl' 
                                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                                }`}
                            >
                                <span className="relative z-10">{plan.highlight ? 'Assinar Agora' : 'Quero este'}</span>
                                <ChevronRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                                {plan.highlight && (
                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                                )}
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Bonuses Section */}
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h3 className="text-xl md:text-3xl font-black text-white uppercase italic tracking-tighter font-['Epilogue']">
                            BÔNUS <span className="text-[#E50914]">INCLUSOS</span> NO SEU ACESSO:
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bonuses.map((b, idx) => (
                            <motion.div
                                key={b.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group p-8 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] hover:bg-[#111] hover:border-[#E50914]/30 transition-all duration-500"
                            >
                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-[#E50914] mb-6 group-hover:scale-110 transition-transform duration-500 border border-white/5">
                                    <b.icon size={28} />
                                </div>
                                <h4 className="text-white font-black text-lg mb-2 uppercase font-['Epilogue'] tracking-tight">{b.title}</h4>
                                <p className="text-white/40 text-sm font-medium font-['Lexend'] leading-relaxed">{b.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

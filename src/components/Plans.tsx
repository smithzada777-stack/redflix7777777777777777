'use client';

// 🔒 ARQUIVO BLOQUEADO - SENHA PARA EDIÇÃO: 123 🔒
// ESTE ARQUIVO NÃO DEVE SER ALTERADO SEM AUTORIZAÇÃO EXPLÍCITA E A SENHA.

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Zap, Tv, Film, Download, Headphones, Users, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, getCountFromServer } from 'firebase/firestore';

const bonuses = [
    { id: 1, icon: Tv, title: '3 Telas Simultâneas', desc: 'Assista no celular, TV e PC ao mesmo tempo.' },
    { id: 2, icon: Zap, title: 'Sem Travamentos', desc: 'Qualidade máxima com tecnologia anti-lag.' },
    { id: 3, icon: Headphones, title: 'Suporte 24h', desc: 'Equipe pronta para te ajudar a qualquer hora.' },
    { id: 4, icon: Shield, title: 'Garantia de 7 Dias', desc: 'Satisfação garantida ou seu dinheiro de volta.' },
    { id: 5, icon: Film, title: '4K Ultra HD', desc: 'Imagem cristalina em todos os dispositivos.' },
    { id: 6, icon: Download, title: 'Modo Offline', desc: 'Baixe seus filmes e assista sem internet.' },
];

export default function Plans() {
    const router = useRouter();
    const [realSales, setRealSales] = useState(0);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                // Conta approved
                const qApp = query(collection(db, "leads"), where("status", "==", "approved"));
                const snapApp = await getCountFromServer(qApp);
                // Conta renewed
                const qRen = query(collection(db, "leads"), where("status", "==", "renewed"));
                const snapRen = await getCountFromServer(qRen);

                setRealSales(snapApp.data().count + snapRen.data().count);
            } catch (e) {
                console.error("Erro ao contar sales:", e);
            }
        };
        fetchCounts();
    }, []);

    const plans = [
        {
            id: 1,
            period: '1 Mês',
            price: '29,90',
            oldPrice: '39,90',
            highlight: false,
            users: 57 + realSales,
            features: ['Acesso Completo', 'Qualidade Full HD', '1 Tela p/ uso']
        },
        {
            id: 2,
            period: '3 Meses',
            price: '79,90',
            oldPrice: '89,70',
            save: '11%',
            highlight: true,
            users: 1345 + (realSales * 3),
            features: ['3 Telas Simultâneas', 'Qualidade 4K Ultra HD', 'Canais Adultos (+18)', 'Peça seu Filme/Série']
        },
        {
            id: 3,
            period: '6 Meses',
            price: '149,90',
            oldPrice: '179,40',
            save: '16%',
            highlight: false,
            users: 570 + (realSales * 1.5),
            features: ['Tudo do Trimestral', 'Melhor Custo-Benefício', 'Suporte Prioritário']
        },
    ];

    const goToCheckout = (id: number, period: string, price: string) => {
        router.push(`/checkout?id=${id}&plan=${encodeURIComponent(period)}&price=${price}`);
    };

    return (
        <div id="plans" className="bg-black">
            {/* Plans Section - Hero Highlight Edition (Synced with FAQ style) */}
            <section id="pricing" className="py-16 md:py-24 bg-black relative overflow-hidden text-white">
                {/* Divider Line (FAQ Style) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[5px] bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_20px_rgba(229,9,20,0.3)]" />
                {/* Background Atmosphere - Subtle Red Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
                        <h2 className="text-2xl md:text-4xl font-black mb-2 tracking-tighter text-white uppercase italic">
                            Escolha seu plano e <span className="text-primary italic drop-shadow-[0_0_15px_rgba(229,9,20,0.4)]">economize</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr_280px] gap-10 md:gap-3 max-w-6xl mx-auto items-center">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className={`group relative rounded-[2.5rem] flex flex-col transition-all duration-500 border ${plan.highlight
                                    ? 'border-primary bg-[#0f0f0f] shadow-[0_0_50px_rgba(229,9,20,0.3)] py-7 px-8 md:py-9 md:px-10 z-20 scale-[1.1] ring-1 ring-primary/30'
                                    : 'border-white/20 bg-[#111111] py-6 px-6 md:py-7 md:px-6 z-10 scale-100 shadow-[0_10px_40px_rgba(0,0,0,0.5)] hover:border-white/40 transition-all'
                                    }`}
                            >
                                {/* Recommended Badge */}
                                {plan.highlight && (
                                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(229,9,20,0.5)] flex items-center gap-2 whitespace-nowrap z-30">
                                        <Zap size={14} fill="white" className="animate-pulse" />
                                        <span>MAIS ESCOLHIDO</span>
                                    </div>
                                )}

                                <div className="text-center mb-4">
                                    <h3 className={`text-lg uppercase tracking-[0.3em] font-black mb-2 ${plan.highlight ? 'text-primary' : 'text-white'}`}>
                                        {plan.period}
                                    </h3>

                                    <div className={`flex flex-col items-center justify-center ${plan.highlight ? 'min-h-[100px]' : 'min-h-[80px]'}`}>
                                        <div className="h-6">
                                            {plan.oldPrice && (
                                                <span className="text-white/60 line-through text-lg font-bold">
                                                    R$ {plan.oldPrice}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-baseline gap-1 mt-0">
                                            <span className={`font-black ${plan.highlight ? 'text-2xl text-primary' : 'text-xl text-white/50'}`}>R$</span>
                                            <span className={`font-black tracking-tighter ${plan.highlight
                                                ? 'text-[70px] md:text-[90px] text-white leading-none drop-shadow-[0_0_30px_rgba(229,9,20,0.6)]'
                                                : 'text-6xl md:text-7xl text-white leading-none'
                                                }`}>
                                                {plan.price.split(',')[0]}
                                            </span>
                                            <span className={`font-black ${plan.highlight ? 'text-2xl text-primary' : 'text-xl text-white/50'}`}>
                                                ,{plan.price.split(',')[1]}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {plan.highlight && (
                                    <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent mb-6" />
                                )}

                                <div className={`flex flex-col items-center justify-center ${plan.highlight ? 'mb-6' : 'mb-4'}`}>
                                    {plan.save && (
                                        <div className="bg-green-500/20 px-5 py-2 rounded-xl border border-green-500/40 shadow-[0_0_15px_rgba(34,197,94,0.2)] mb-4">
                                            <p className="text-green-400 text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
                                                <span className="flex h-2 w-2 relative">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                                </span>
                                                Economize {plan.save}
                                            </p>
                                        </div>
                                    )}

                                    {/* Features List */}
                                    <div className="space-y-2 w-full px-2">
                                        {plan.features.map((feature, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <div className="w-1 h-1 rounded-full bg-primary" />
                                                <span className="text-[10px] md:text-[11px] font-black text-white/80 uppercase tracking-wider">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-auto space-y-5">
                                    <div className={`flex items-center justify-center transition-all ${plan.highlight
                                        ? 'bg-primary/5 p-4 gap-4 rounded-[1.5rem] border border-primary/20'
                                        : 'bg-white/5 p-3 gap-3 rounded-[1.5rem] border border-white/5'
                                        }`}>
                                        <div className={`${plan.highlight ? 'bg-primary text-white p-2 rounded-xl shadow-[0_0_15px_rgba(229,9,20,0.3)]' : 'bg-white/10 text-white p-1.5 rounded-lg'}`}>
                                            <Users size={plan.highlight ? 18 : 14} />
                                        </div>
                                        <div className="text-left">
                                            <span className="text-white font-black text-xs block">+{plan.users.toLocaleString()} Clientes</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => goToCheckout(plan.id, plan.period, plan.price)}
                                        className={`group h-14 md:h-16 w-full rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all duration-500 relative overflow-hidden ${plan.highlight
                                            ? 'bg-primary text-white shadow-[0_15px_40px_rgba(229,9,20,0.4)] hover:scale-[1.03] hover:shadow-[0_20px_50px_rgba(229,9,20,0.6)]'
                                            : 'bg-white text-black hover:bg-gray-100 hover:scale-[1.02] shadow-xl'
                                            }`}>
                                        <span className="relative z-10">{plan.highlight ? 'QUERO ESSE PLANO' : 'ASSINAR AGORA'}</span>
                                        <ChevronRight size={20} className="relative z-10 transition-transform duration-500 group-hover:translate-x-1" />
                                        {plan.highlight && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

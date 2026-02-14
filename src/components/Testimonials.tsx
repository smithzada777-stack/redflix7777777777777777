'use client';

import { Star, CheckCircle } from 'lucide-react';

const testimonials = [
    { id: 1, name: 'Marcos Vinicius', stars: 5, text: 'O acesso chegou em menos de 1 minuto no meu email, o sistema automático deles é real!', color: 'from-blue-600 to-blue-400' },
    { id: 2, name: 'Renata Oliveira', stars: 5, text: 'Suporte nota 10, me ajudaram a configurar na minha Smart TV rápido e sem enrolação.', color: 'from-pink-600 to-pink-400' },
    { id: 3, name: 'Dr. Ricardo Menezes', stars: 4, text: 'Serviço profissional e de alta performance. Extremamente estável para quem não quer dor de cabeça.', color: 'from-green-600 to-green-400' },
    { id: 4, name: 'Jeferson Silva', stars: 5, text: 'Os jogos do Brasileirão e a NBA rodam liso demais. Qualidade 4K de verdade!', color: 'from-zinc-600 to-zinc-400' },
    { id: 5, name: 'Bruna Santos', stars: 5, text: 'Os desenho pra criançada salvou muito aqui em casa kkk tem muita coisa (Netflix, Disney+, etc).', color: 'from-purple-600 to-purple-400' },
    { id: 6, name: 'Dona Maria Luiza', stars: 4, text: 'Muito fácil de usar, até eu que não entendo nada de tecnologia já tô assistindo minhas novelas.', color: 'from-yellow-600 to-yellow-400' },
    { id: 7, name: 'Anderson Costa', stars: 5, text: 'Tava meio na dúvida, mas depois de testar eu vi que vale cada centavo. Top demais.', color: 'from-emerald-600 to-emerald-400' },
    { id: 8, name: 'Felipe Almeida', stars: 3, text: 'O app é bom, só tive um probleminha no começo mas o suporte resolveu em 5 minutos. Vale a pena.', color: 'from-orange-600 to-orange-400' },
    { id: 9, name: 'Sandra Pires', stars: 5, text: 'A variedade de canais e filmes é absurda. Antigamente eu pagava 3 streamings pra ter metade disso.', color: 'from-red-600 to-red-400' },
];

const ProfileAvatar = ({ name, color, size = 'md' }: { name: string, color: string, size?: 'sm' | 'md' }) => {
    const sizeClasses = size === 'sm' ? 'w-8 h-8 text-[10px]' : 'w-11 h-11 text-sm';
    return (
        <div className={`${sizeClasses} rounded-full bg-gradient-to-br ${color} flex items-center justify-center font-black text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] border border-white/10`}>
            {name.charAt(0)}
        </div>
    );
};

export default function Testimonials() {
    return (
        <section className="pt-16 pb-20 bg-black relative overflow-hidden">
            {/* Cinematic Atmosfera */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[130px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center mb-12 px-4">
                    <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter text-white uppercase italic">
                        Vê o que a <span className="text-primary italic drop-shadow-[0_0_15px_rgba(229,9,20,0.4)]">galera</span> tá achando:
                    </h2>
                    <p className="text-gray-500 text-xs md:text-sm font-bold uppercase tracking-[0.15em]">Relatos reais de quem já economiza com a RedFlix há meses</p>
                </div>

                <div className="relative w-full overflow-hidden">
                    {/* SOMBRAS LATERAIS PARA NÃO PARECER CORTADO */}
                    <div className="absolute left-0 top-0 bottom-0 w-24 md:w-64 bg-gradient-to-r from-black via-black/50 to-transparent z-20 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 md:w-64 bg-gradient-to-l from-black via-black/50 to-transparent z-20 pointer-events-none" />

                    {/* Versão MOBILE: Cards Dark Empilhados */}
                    <div className="md:hidden flex flex-col gap-4 py-4 px-2">
                        {testimonials.slice(0, 6).map((t) => (
                            <div
                                key={t.id}
                                className="bg-[#0d0d0d] p-5 rounded-2xl shadow-xl border border-white/[0.05] flex flex-col justify-between group h-fit"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, starIdx) => (
                                                <Star
                                                    key={starIdx}
                                                    size={10}
                                                    className={starIdx < t.stars ? "text-primary fill-primary" : "text-gray-700"}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-[8px] font-black text-green-500 uppercase">Online</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 text-sm font-medium italic leading-relaxed mb-5">"{t.text}"</p>
                                </div>
                                <div className="flex items-center gap-3 border-t border-white/[0.05] pt-4">
                                    <ProfileAvatar name={t.name} color={t.color} size="sm" />
                                    <div className="overflow-hidden">
                                        <h4 className="font-black text-white text-[11px] uppercase tracking-tighter truncate">{t.name}</h4>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <CheckCircle size={8} className="text-primary" />
                                            <span className="text-[8px] font-black text-primary uppercase tracking-tighter">Compra Garantida</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Versão DESKTOP: Carrossel Premium */}
                    <div className="hidden md:flex overflow-hidden group">
                        <div className="flex animate-marquee gap-8 py-10">
                            {[...testimonials, ...testimonials].map((t, i) => (
                                <div
                                    key={`${t.id}-${i}`}
                                    className="flex-none w-[380px] bg-gradient-to-b from-[#111] to-[#0a0a0a] p-8 rounded-[2.5rem] border border-white/[0.05] shadow-2xl transition-all duration-500 hover:border-primary/40 hover:-translate-y-2 hover:shadow-primary/5 group/card"
                                >
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex gap-1.5">
                                            {[...Array(5)].map((_, starIdx) => (
                                                <Star
                                                    key={starIdx}
                                                    size={16}
                                                    className={`${starIdx < t.stars ? "text-primary fill-primary" : "text-gray-700"} group-hover/card:scale-110 transition-transform`}
                                                />
                                            ))}
                                        </div>
                                        <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Ativo Agora</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 text-lg font-medium italic leading-relaxed mb-10 min-h-[90px] group-hover/card:text-white transition-colors">"{t.text}"</p>
                                    <div className="flex items-center gap-4 border-t border-white/[0.05] pt-8">
                                        <ProfileAvatar name={t.name} color={t.color} />
                                        <div className="flex-1">
                                            <h4 className="font-black text-white text-base uppercase tracking-tight mb-1">{t.name}</h4>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                                                    <CheckCircle size={10} className="text-primary" />
                                                    <span className="text-[9px] font-black text-primary uppercase tracking-widest">Verificado</span>
                                                </div>
                                                <div className="w-1 h-1 bg-white/10 rounded-full" />
                                                <span className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">Membro Gold</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-center space-y-4">
                    <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-primary/30 to-transparent mx-auto mb-8" />
                    <p className="text-[11px] font-black uppercase tracking-[0.5em] text-gray-600 italic">Junte-se aos +{testimonials.length * 1000} clientes satisfeitos</p>
                    <div className="flex justify-center gap-1">
                        {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-primary fill-primary opacity-20" />)}
                    </div>
                </div>
            </div>
        </section>
    );
}

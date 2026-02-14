'use client';

import { useState, useEffect, useMemo } from 'react';
import { auth, db } from '@/lib/firebase';
import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    setPersistence,
    browserLocalPersistence
} from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, Timestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import {
    Users, Phone, Mail, Clock, Shield, Search, LogOut, CheckCircle2,
    AlertCircle, DollarSign, TrendingUp, BarChart3, Star, MessageCircle,
    MoreVertical, FileText, Trash2, Smartphone, Send, Calendar, Percent, QrCode, Copy, Loader2, Menu, X, Lock
} from 'lucide-react';
import axios from 'axios';

interface Lead {
    id: string;
    email: string;
    phone: string;
    plan: string;
    price: string;
    status: string;
    createdAt: Timestamp | null;
}

const parsePrice = (priceStr: string): number => {
    if (!priceStr) return 0;
    const cleanStr = priceStr.replace(/[^\d.,]/g, '');
    const dotStr = cleanStr.replace(',', '.');
    const val = parseFloat(dotStr);
    return isNaN(val) ? 0 : val;
};

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(val);
};

const formatPhone = (v: string) => {
    if (!v) return "";
    v = v.replace(/\D/g, "");
    v = v.replace(/(\d{2})(\d)/, "($1) $2");
    v = v.replace(/(\d{5})(\d)/, "$1-$2");
    return v.slice(0, 15);
};

const isValidGmail = (e: string) => e.toLowerCase().endsWith('@gmail.com');

const getDaysRemaining = (createdAt: Timestamp | null, plan: string) => {
    if (!createdAt) return 999;
    const startDate = createdAt.toDate();
    let durationDays = 30;
    const p = plan?.toLowerCase() || '';
    if (p.includes('trimestral') || p.includes('3 meses')) durationDays = 90;
    else if (p.includes('semestral') || p.includes('6 meses')) durationDays = 180;
    else if (p.includes('anual') || p.includes('1 ano')) durationDays = 365;
    else if (p.includes('vitalício')) return 9999;

    const expiryDate = new Date(startDate);
    expiryDate.setDate(expiryDate.getDate() + durationDays);
    const diffTime = expiryDate.getTime() - new Date().getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export default function AdminDashboard() {
    // --- Security Config ---
    const ALLOWED_IP = process.env.NEXT_PUBLIC_ALLOWED_IP; // Configure no .env.local
    const SECRET_PASSWORD = 'dviela123'; // Sua senha mestra
    const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 dias em ms

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [authChecking, setAuthChecking] = useState(true);
    const [ipChecking, setIpChecking] = useState(true);
    const [isIpAuthorized, setIsIpAuthorized] = useState(true);
    const [clientIp, setClientIp] = useState('');

    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'expiring' | 'pix'>('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState<'today' | 'yesterday' | 'month' | 'all' | 'custom'>('all');
    const [customDateStart, setCustomDateStart] = useState('');
    const [customDateEnd, setCustomDateEnd] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
    const [planFilter, setPlanFilter] = useState('all');
    const [priceFilter, setPriceFilter] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [discount, setDiscount] = useState(10);
    const [msgStyle, setMsgStyle] = useState<'aggressive' | 'informal' | 'formal' | 'fun' | 'funny' | 'scarcity' | 'short'>('fun');

    const [pixAmount, setPixAmount] = useState('');
    const [generatedPixString, setGeneratedPixString] = useState('');
    const [generatedPixImage, setGeneratedPixImage] = useState('');
    const [pixLoading, setPixLoading] = useState(false);
    const [lastManualPixId, setLastManualPixId] = useState<string | null>(null);
    const [manualPixStatus, setManualPixStatus] = useState<'pending' | 'approved' | 'none'>('none');
    const [pixType, setPixType] = useState<'anon' | 'real'>('anon');
    const [realEmail, setRealEmail] = useState('');
    const [realPhone, setRealPhone] = useState('');

    // 1. Verificação de IP (Ultra Proteção)
    useEffect(() => {
        const checkIp = async () => {
            try {
                const response = await axios.get('https://api.ipify.org?format=json');
                const ip = response.data.ip;
                setClientIp(ip);

                // Se a variável ALLOWED_IP estiver configurada, bloqueia se for diferente
                if (ALLOWED_IP && ip !== ALLOWED_IP) {
                    setIsIpAuthorized(false);
                } else {
                    setIsIpAuthorized(true);
                }
            } catch (error) {
                console.error("Erro ao validar IP:", error);
                // Em caso de erro na API de IP, por segurança, poderíamos bloquear, 
                // mas vamos permitir se não houver IP configurado no env.
                if (ALLOWED_IP) setIsIpAuthorized(false);
            }
            setIpChecking(false);
        };
        checkIp();
    }, [ALLOWED_IP]);

    // 2. Monitoramento de Sessão (Simples e Eficaz)
    useEffect(() => {
        const stored = localStorage.getItem('redflix_admin_session');
        if (stored) {
            try {
                const { timestamp, authenticated } = JSON.parse(stored);
                if (authenticated && (Date.now() - timestamp < SESSION_DURATION)) {
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem('redflix_admin_session');
                }
            } catch (e) { localStorage.removeItem('redflix_admin_session'); }
        }
        setAuthChecking(false);
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === SECRET_PASSWORD) {
            setIsAuthenticated(true);
            localStorage.setItem('redflix_admin_session', JSON.stringify({
                authenticated: true,
                timestamp: Date.now()
            }));
        } else {
            alert('Senha Incorreta!');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('redflix_admin_session');
        setIsAuthenticated(false);
        window.location.reload();
    };

    const handleGeneratePixCode = async () => {
        if (!pixAmount) return alert('Informe o valor.');
        let email = pixType === 'real' ? realEmail : `anon.${Math.floor(Math.random() * 10000)}@redflix.com`;

        if (pixType === 'real') {
            if (!realEmail || !realPhone) return alert('Preencha os campos.');
            if (!isValidGmail(realEmail)) return alert('Apenas e-mails @gmail.com são permitidos para garantir a entrega.');
        }

        setPixLoading(true); setManualPixStatus('pending');
        try {
            const res = await axios.post('/api/payment', { amount: pixAmount, description: 'Venda Dash', payerEmail: email, origin: 'painel-admin' });
            if (res.data.qrcode_content) {
                setGeneratedPixString(res.data.qrcode_content);
                setGeneratedPixImage(res.data.qrcode_image_url);
                setLastManualPixId(res.data.transaction_id);
                // Sync with Firebase
                const leadRef = doc(db, "leads", res.data.transaction_id);
                const leadData = {
                    email,
                    phone: realPhone || '11999999999',
                    plan: 'Dash Pix',
                    price: pixAmount,
                    status: 'pending',
                    transactionId: res.data.transaction_id,
                    createdAt: Timestamp.now()
                };

                try {
                    await updateDoc(leadRef, leadData);
                } catch (e) {
                    const { setDoc } = await import('firebase/firestore');
                    await setDoc(leadRef, leadData);
                }
            }
        } catch (e) { alert('Erro ao gerar Pix.'); setManualPixStatus('none'); }
        finally { setPixLoading(false); }
    };

    const getProposal = (type: string) => {
        if (!selectedLead) return { creative: '', link: '' };
        const base = type === 'monthly' ? 29.9 : type === 'trimestral' ? 79.9 : 149.9;
        const name = type === 'monthly' ? 'Mensal' : type === 'trimestral' ? 'Trimestral' : 'Semestral';
        const final = (base * (1 - discount / 100)).toFixed(2).replace('.', ',');
        const link = `${window.location.origin}/checkout/simple?plan=${encodeURIComponent(name)}&price=${final}&leadId=${selectedLead.id}`;
        const days = getDaysRemaining(selectedLead.createdAt, selectedLead.plan);

        const templates = {
            aggressive: `⚠️ ÚLTIMO AVISO: Seu acesso RedFlix será cortado em ${days} dias. Não perca seus filmes e séries favoritos. Garanti uma última chance com ${discount}% OFF: ${link}`,
            informal: `E aí! Tudo beleza? Vi aqui que seu RedFlix tá pra vencer. Pra não ficar sem seus filmes, te descolei um cupom de ${discount}% de desconto aqui: ${link} TMJ! 🍿`,
            formal: `Prezado(a), informamos que sua assinatura RedFlix expira em ${days} dias. Para manter seu acesso sem interrupções, disponibilizamos uma oferta de renovação com ${discount}% de desconto: ${link}`,
            fun: `🎬 Luz, câmera... quase pausa! Seu RedFlix tá vencendo em ${days} dias, mas a maratona não pode parar! Pegue aqui ${discount}% OFF e dê o play na renovação: ${link} 🍿`,
            funny: `Opa! Seus vizinhos já estão reclamando que você parou de assistir série? 😂 Seu RedFlix vence em ${days} dias! Resolve isso logo com ${discount}% de desconto e volta pro sofá: ${link}`,
            scarcity: `🔥 SÓ HOJE: Sua conta RedFlix vence em ${days} dias e essa oferta de ${discount}% OFF expira em poucas horas. Garanta seu acesso agora: ${link}`,
            short: `Sua RedFlix vence em ${days} dias. Renove agora com ${discount}% OFF aqui: ${link}`
        };

        return {
            creative: templates[msgStyle],
            link
        };
    };

    useEffect(() => {
        if (!lastManualPixId) return;
        const unsub = onSnapshot(doc(db, "leads", lastManualPixId), (snap) => {
            if (snap.exists() && snap.data().status === 'approved') setManualPixStatus('approved');
        });
        return () => unsub();
    }, [lastManualPixId]);

    useEffect(() => {
        if (!isAuthenticated) return;
        setLoading(true);
        const unsubscribe = onSnapshot(query(collection(db, "leads"), orderBy("createdAt", "desc")), (snapshot) => {
            setLeads(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead)));
            setLoading(false);
        });
        return () => unsubscribe();
    }, [isAuthenticated]);

    const metrics = useMemo(() => {
        const now = new Date();
        const startOfDay = new Date(new Date(now).setHours(0, 0, 0, 0));
        const startOfWeek = new Date(new Date(now).setDate(now.getDate() - 7));
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const filtered = leads.filter(l => {
            if (!l.createdAt) return false;
            const d = l.createdAt.toDate();
            let passDate = true;

            if (dateFilter === 'today') {
                passDate = d >= startOfDay;
            } else if (dateFilter === 'yesterday') {
                const startOfYesterday = new Date(startOfDay);
                startOfYesterday.setDate(startOfYesterday.getDate() - 1);
                passDate = d >= startOfYesterday && d < startOfDay;
            } else if (dateFilter === 'month') {
                passDate = d >= startOfMonth;
            } else if (dateFilter === 'custom') {
                const start = customDateStart ? new Date(customDateStart + 'T00:00:00') : null;
                const end = customDateEnd ? new Date(customDateEnd + 'T23:59:59') : null;
                if (start && end) passDate = d >= start && d <= end;
                else if (start) passDate = d >= start;
                else if (end) passDate = d <= end;
            }

            const passSearch = l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                l.phone.includes(searchTerm);

            const passPlan = planFilter === 'all' || l.plan === planFilter;
            const passPrice = !priceFilter || String(l.price).includes(priceFilter);

            return passDate && passSearch && passPlan && passPrice;
        });

        const approvedFiltered = filtered.filter(l => l.status === 'approved');
        const revFiltered = approvedFiltered.reduce((acc, curr) => acc + parsePrice(curr.price), 0);
        const approvedCount = approvedFiltered.length;

        const planCounts: Record<string, number> = {};
        approvedFiltered.forEach(l => { planCounts[l.plan] = (planCounts[l.plan] || 0) + 1; });
        const best = Object.entries(planCounts).sort((a, b) => b[1] - a[1])[0];

        // Rótulo dinâmico para os cards
        const kpiLabel = dateFilter === 'today' ? 'Hoje' :
            dateFilter === 'yesterday' ? 'Ontem' :
                dateFilter === 'month' ? 'Mês' :
                    dateFilter === 'custom' ? 'Período' : 'Sempre';

        return {
            data: filtered.slice(0, rowsPerPage),
            kpiLabel,
            revenueFiltered: revFiltered,
            salesFiltered: approvedCount,
            leadsFiltered: filtered.length,
            conversion: filtered.length > 0 ? (approvedCount / filtered.length) * 100 : 0,
            bestPlan: best ? best[0] : 'N/A',
            expiring: approvedFiltered.sort((a, b) => getDaysRemaining(a.createdAt, a.plan) - getDaysRemaining(b.createdAt, b.plan)),
            expiringTotal: leads.filter(l => l.status === 'approved').length
        };
    }, [leads, searchTerm, dateFilter, customDateStart, customDateEnd, rowsPerPage, planFilter, priceFilter]);

    const deleteLead = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir?')) return;
        await deleteDoc(doc(db, "leads", id));
    };

    const deleteSelectedLeads = async () => {
        if (selectedLeads.length === 0) return;
        if (!confirm(`Tem certeza que deseja excluir ${selectedLeads.length} itens?`)) return;
        try {
            const promises = selectedLeads.map(id => deleteDoc(doc(db, "leads", id)));
            await Promise.all(promises);
            setSelectedLeads([]);
        } catch (error) {
            alert('Erro ao excluir itens selecionados.');
        }
    };

    if (authChecking || ipChecking) return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
            <Loader2 className="text-red-600 animate-spin" size={48} />
            <div className="text-red-600 font-black tracking-widest animate-pulse">REDFLIX SECURITY...</div>
        </div>
    );

    // BARREIRA DE IP (Proteção Máxima)
    if (!isIpAuthorized) return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
            <div className="max-w-md space-y-6">
                <AlertCircle className="text-red-600 mx-auto" size={80} />
                <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">ACESSO BLOQUEADO</h1>
                <p className="text-gray-500 font-medium leading-relaxed">
                    Seu endereço de IP <span className="text-red-500 font-bold">({clientIp})</span> não está autorizado a acessar este sistema de alta precisão.
                </p>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-[10px] text-gray-400 font-mono">
                    SECURITY_ENTRY_DENIED: UNAUTHORIZED_SOURCE
                </div>
            </div>
        </div>
    );

    if (!isAuthenticated) return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black">
            <div className="w-full max-w-md bg-[#0a0a0a] p-10 rounded-[2.5rem] border border-white/5 shadow-[0_0_80px_rgba(220,38,38,0.2)]">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-red-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl shadow-red-600/30">
                        <Lock className="text-white" size={40} />
                    </div>
                    <h1 className="text-4xl font-black italic text-white tracking-tighter uppercase">REDFLIX <span className="text-red-600">ADMIN</span></h1>
                    <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Área Restrita - Senha Mestra</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Senha de Acesso</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white font-bold tracking-widest focus:border-red-600 outline-none transition-all text-center text-xl"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>
                    <button className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-red-600/40 text-sm italic tracking-tighter uppercase mt-4">
                        DESBLOQUEAR SISTEMA
                    </button>
                    <p className="text-center text-[9px] text-gray-700 font-bold uppercase tracking-widest mt-6">Sessão protegida por 7 dias</p>
                </form>
            </div>
        </div>
    );

    return (
        <div className="h-[100dvh] md:h-screen bg-[#020202] text-white font-sans flex overflow-hidden">
            {/* Overlay para Mobile quando Sidebar aberta */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[65] md:hidden animate-in fade-in duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar Premium */}
            <aside className={`fixed md:relative inset-y-0 left-0 z-[70] transition-all duration-500 ease-in-out bg-[#050505] border-r border-white/5 
                ${isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0 w-72 md:w-20 lg:w-72'}`}>

                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/40">
                            <Star className="text-white" size={20} />
                        </div>
                        <span className={`font-black italic text-xl tracking-tighter ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>REDFLIX</span>
                    </div>
                    {/* Botão fechar apenas mobile */}
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-gray-500 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <nav className="mt-10 px-4 space-y-2">
                    {[
                        { id: 'overview', icon: TrendingUp, label: 'Dashboard' },
                        { id: 'expiring', icon: Clock, label: 'Renovações' },
                        { id: 'pix', icon: QrCode, label: 'Gerador Pix' }
                    ].map(item => (
                        <button key={item.id} onClick={() => { setActiveTab(item.id as any); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                            <item.icon size={20} />
                            <span className={`text-xs font-black uppercase tracking-widest ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="absolute bottom-6 left-4 right-4">
                    <button onClick={handleLogout} className="w-full flex items-center gap-4 p-4 text-gray-500 hover:text-red-500 transition-colors">
                        <LogOut size={20} />
                        <span className={`text-xs font-black uppercase tracking-widest ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>Sair</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto relative pt-16 md:pt-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-red-900/5 via-transparent to-transparent">
                {/* Mobile Header (Fixed) */}
                <header className="md:hidden fixed top-0 w-full bg-black/90 backdrop-blur-xl p-4 flex justify-between items-center z-50 border-b border-white/5">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-white bg-white/5 rounded-lg active:scale-95 transition-transform"><Menu size={24} /></button>
                    <span className="font-black italic tracking-tighter text-xl">REDFLIX</span>
                    <div className="w-10" />
                </header>

                <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
                    {activeTab === 'overview' && (
                        <>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div>
                                    <h2 className="text-3xl font-black italic text-white tracking-tighter uppercase">Painel de <span className="text-red-600">Controle</span></h2>
                                    <p className="text-xs text-gray-500 mt-1 font-medium tracking-wide">Monitoramento em tempo real da sua operação.</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="flex bg-[#0a0a0a] p-1 rounded-xl border border-white/5">
                                        {[
                                            { id: 'today', label: 'Hoje' },
                                            { id: 'yesterday', label: 'Ontem' },
                                            { id: 'month', label: 'Mês' },
                                            { id: 'all', label: 'Sempre' },
                                            { id: 'custom', label: 'Personalizado' }
                                        ].map(f => (
                                            <button key={f.id} onClick={() => setDateFilter(f.id as any)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${dateFilter === f.id ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-white'}`}>{f.label}</button>
                                        ))}
                                    </div>
                                    {dateFilter === 'custom' && (
                                        <div className="flex items-center gap-2 animate-in slide-in-from-left-4 duration-300">
                                            <input type="date" value={customDateStart} onChange={e => setCustomDateStart(e.target.value)} className="bg-black border border-white/10 rounded-lg p-2 text-[10px] text-white outline-none focus:border-red-600" />
                                            <span className="text-gray-500 text-[10px]">ATÉ</span>
                                            <input type="date" value={customDateEnd} onChange={e => setCustomDateEnd(e.target.value)} className="bg-black border border-white/10 rounded-lg p-2 text-[10px] text-white outline-none focus:border-red-600" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* KPI Grid Premium */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                                {[
                                    { label: metrics.kpiLabel, value: formatCurrency(metrics.revenueFiltered), sub: `${metrics.salesFiltered} vendas`, icon: DollarSign, color: 'from-red-600 to-red-900' },
                                    { label: 'Leads', value: metrics.leadsFiltered, sub: 'Visitantes', icon: Users, color: 'from-orange-600 to-red-600' },
                                    { label: 'Conversão', value: `${metrics.conversion.toFixed(1)}%`, sub: 'Taxa AP', icon: Percent, color: 'from-red-600 to-pink-600' },
                                    { label: 'Top Plano', value: metrics.bestPlan, sub: 'Lidêr vendas', icon: Star, color: 'from-red-600 to-black' }
                                ].map((kpi, i) => (
                                    <div key={i} className="relative group">
                                        <div className={`absolute -inset-0.5 bg-gradient-to-r ${kpi.color} rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-500`}></div>
                                        <div className="relative bg-[#0a0a0a] p-4 md:p-8 rounded-2xl md:rounded-3xl border border-white/5 space-y-3 md:space-y-4">
                                            <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-2xl bg-gradient-to-br ${kpi.color} flex items-center justify-center shadow-lg`}>
                                                <kpi.icon size={16} className="text-white md:hidden" />
                                                <kpi.icon size={20} className="text-white hidden md:block" />
                                            </div>
                                            <div>
                                                <h3 className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest">{kpi.label}</h3>
                                                <p className="text-lg md:text-3xl font-black text-white italic tracking-tighter mt-1">{kpi.value}</p>
                                                <p className="text-[7px] md:text-[9px] text-gray-600 font-bold uppercase mt-1 md:mt-2">{kpi.sub}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Table Premium */}
                            <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden shadow-2xl transition-all">
                                <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-r from-red-600/5 to-transparent">
                                    <div className="flex items-center gap-4">
                                        <h3 className="text-lg font-black italic tracking-tighter uppercase">Últimas Transações</h3>
                                        {selectedLeads.length > 0 && (
                                            <button
                                                onClick={deleteSelectedLeads}
                                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 animate-in slide-in-from-left-4 duration-300"
                                            >
                                                <Trash2 size={14} /> EXCLUIR ({selectedLeads.length})
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="relative">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                                            <input
                                                type="text"
                                                placeholder="BUSCAR NOME/EMAIL..."
                                                value={searchTerm}
                                                onChange={e => setSearchTerm(e.target.value)}
                                                className="w-full bg-black border border-white/10 rounded-xl py-3 pl-10 pr-4 text-[9px] font-black focus:border-red-600 outline-none transition-all placeholder:opacity-30 uppercase"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <select
                                                value={planFilter}
                                                onChange={e => setPlanFilter(e.target.value)}
                                                className="bg-black border border-white/10 rounded-xl py-3 px-4 text-[9px] font-black text-gray-400 focus:border-red-600 outline-none transition-all uppercase"
                                            >
                                                <option value="all">TODOS PLANOS</option>
                                                <option value="Mensal">MENSAL</option>
                                                <option value="Trimestral">TRIMESTRAL</option>
                                                <option value="Semestral">SEMESTRAL</option>
                                                <option value="VIP">VIP</option>
                                                <option value="Dash Pix">DASH PIX</option>
                                            </select>
                                            <input
                                                type="text"
                                                placeholder="VALOR (R$)..."
                                                value={priceFilter}
                                                onChange={e => setPriceFilter(e.target.value)}
                                                className="bg-black border border-white/10 rounded-xl py-3 px-4 text-[9px] font-black focus:border-red-600 outline-none transition-all placeholder:opacity-30 uppercase"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-[#050505] text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 border-b border-white/5">
                                            <tr>
                                                <th className="px-8 py-5 w-10">
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 rounded border-white/10 bg-black accent-red-600 cursor-pointer"
                                                        checked={selectedLeads.length === metrics.data.length && metrics.data.length > 0}
                                                        onChange={(e) => {
                                                            if (e.target.checked) setSelectedLeads(metrics.data.map(l => l.id));
                                                            else setSelectedLeads([]);
                                                        }}
                                                    />
                                                </th>
                                                <th className="px-8 py-5">Cliente</th>
                                                <th className="px-8 py-5">Plano / Valor</th>
                                                <th className="px-8 py-5 text-center">Status</th>
                                                <th className="px-8 py-5 text-right">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {metrics.data.map(lead => (
                                                <tr key={lead.id} className={`hover:bg-white/[0.02] transition-colors group ${selectedLeads.includes(lead.id) ? 'bg-red-600/5' : ''}`}>
                                                    <td className="px-8 py-6">
                                                        <input
                                                            type="checkbox"
                                                            className="w-4 h-4 rounded border-white/10 bg-black accent-red-600 cursor-pointer"
                                                            checked={selectedLeads.includes(lead.id)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) setSelectedLeads([...selectedLeads, lead.id]);
                                                                else setSelectedLeads(selectedLeads.filter(id => id !== lead.id));
                                                            }}
                                                        />
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="text-xs font-black text-white">{lead.email}</div>
                                                        <div className="text-[10px] text-gray-600 font-bold mt-1 tracking-wider">{lead.phone}</div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-2">
                                                            <span className="bg-red-600/10 text-red-500 border border-red-600/20 px-2 py-0.5 rounded text-[9px] font-black uppercase">{lead.plan}</span>
                                                            <span className="text-xs font-black text-gray-300">{formatCurrency(parsePrice(lead.price))}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-center">
                                                        <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${lead.status === 'approved' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>{lead.status === 'approved' ? 'Aprovado' : 'Pendente'}</span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex justify-end gap-3 md:translate-x-4 md:opacity-0 md:group-hover:opacity-100 md:group-hover:translate-x-0 transition-all">
                                                            <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" className="p-2.5 bg-green-600/10 hover:bg-green-600/20 rounded-xl transition-all border border-green-600/20"><MessageCircle size={16} className="text-green-500" /></a>
                                                            <button onClick={() => updateDoc(doc(db, "leads", lead.id), { status: lead.status === 'approved' ? 'pending' : 'approved' })} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5"><CheckCircle2 size={16} className="text-green-500" /></button>
                                                            <button onClick={() => deleteLead(lead.id)} className="p-2.5 bg-red-600/10 hover:bg-red-600 rounded-xl transition-all border border-red-600/20 group/del"><Trash2 size={16} className="text-red-500 group-hover/del:text-white" /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'expiring' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div>
                                    <h2 className="text-3xl font-black italic tracking-tighter uppercase underline decoration-red-600 decoration-4 underline-offset-8">Recuperação de <span className="text-red-600">Vendas</span></h2>
                                    <p className="text-xs text-gray-500 mt-6 max-w-2xl font-medium leading-relaxed">Listagem de clientes com assinatura próxima do vencimento. Utilize as ações para enviar propostas de renovação ou entrar em contato direto.</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="flex bg-[#0a0a0a] p-1 rounded-xl border border-white/5">
                                        {[
                                            { id: 'today', label: 'Hoje' },
                                            { id: 'yesterday', label: 'Ontem' },
                                            { id: 'month', label: 'Mês' },
                                            { id: 'all', label: 'Sempre' },
                                            { id: 'custom', label: 'Personalizado' }
                                        ].map(f => (
                                            <button key={f.id} onClick={() => setDateFilter(f.id as any)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${dateFilter === f.id ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-white'}`}>{f.label}</button>
                                        ))}
                                    </div>
                                    {dateFilter === 'custom' && (
                                        <div className="flex items-center gap-2">
                                            <input type="date" value={customDateStart} onChange={e => setCustomDateStart(e.target.value)} className="bg-black border border-white/10 rounded-lg p-2 text-[10px] text-white outline-none focus:border-red-600" />
                                            <span className="text-gray-500 text-[10px]">ATÉ</span>
                                            <input type="date" value={customDateEnd} onChange={e => setCustomDateEnd(e.target.value)} className="bg-black border border-white/10 rounded-lg p-2 text-[10px] text-white outline-none focus:border-red-600" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                                <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-r from-red-600/5 to-transparent">
                                    <h3 className="text-lg font-black italic tracking-tighter uppercase">Assinaturas Ativas ({metrics.expiring.length} de {metrics.expiringTotal})</h3>
                                    <div className="relative w-full md:w-80">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                        <input type="text" placeholder="PESQUISAR CLIENTE..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl py-3 pl-12 pr-4 text-[10px] font-black focus:border-red-600 outline-none transition-all placeholder:opacity-30" />
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-[#050505] text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 border-b border-white/5">
                                            <tr>
                                                <th className="px-8 py-5">Cliente</th>
                                                <th className="px-8 py-5">Plano Atual</th>
                                                <th className="px-8 py-5 text-center">Vencimento</th>
                                                <th className="px-8 py-5 text-right">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {metrics.expiring.map(lead => {
                                                const days = getDaysRemaining(lead.createdAt, lead.plan);
                                                const isUrgent = days <= 5;
                                                return (
                                                    <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors group">
                                                        <td className="px-8 py-6">
                                                            <div className="text-xs font-black text-white">{lead.email}</div>
                                                            <div className="text-[10px] text-gray-600 font-bold mt-1 uppercase tracking-widest">{lead.phone}</div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <span className="bg-white/5 border border-white/10 px-2 py-1 rounded text-[9px] font-black uppercase text-gray-400">{lead.plan}</span>
                                                        </td>
                                                        <td className="px-8 py-6 text-center">
                                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isUrgent ? 'bg-red-600 text-white animate-pulse' : 'bg-green-600/10 text-green-500'}`}>
                                                                <Clock size={10} /> {days} DIAS
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <div className="flex justify-end gap-2">
                                                                <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" className="p-2.5 bg-green-600/10 hover:bg-green-600 text-green-500 hover:text-white rounded-xl transition-all border border-green-600/20">
                                                                    <MessageCircle size={16} />
                                                                </a>
                                                                <button onClick={() => { setSelectedLead(lead); setDiscount(10); }} className="px-4 py-2 bg-white text-black font-black rounded-xl text-[10px] uppercase hover:bg-red-600 hover:text-white transition-all">
                                                                    GERAR PROPOSTA
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Modal de Proposta Profissional */}
                            {selectedLead && (
                                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 lg:p-10">
                                    <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setSelectedLead(null)} />
                                    <div className="bg-[#0f0f0f] border border-white/10 rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-[0_0_100px_rgba(220,38,38,0.1)] relative z-10 scrollbar-hide">
                                        <div className="sticky top-0 bg-[#0f0f0f]/80 backdrop-blur-md p-8 border-b border-white/5 flex justify-between items-center z-20">
                                            <div>
                                                <h3 className="text-2xl font-black italic tracking-tighter text-white uppercase">Oferta de <span className="text-red-600">Renovação</span></h3>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">Configurando proposta para: {selectedLead.email}</p>
                                            </div>
                                            <button onClick={() => setSelectedLead(null)} className="p-2 text-gray-500 hover:text-white transition-colors bg-white/5 rounded-xl"><X size={24} /></button>
                                        </div>

                                        <div className="p-8 space-y-8">
                                            {/* Controle de Desconto e Estilo */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Margem de Desconto</span>
                                                        <span className="text-2xl font-black text-red-600 italic tracking-tighter">{discount}% OFF</span>
                                                    </div>
                                                    <input type="range" min="5" max="50" step="5" value={discount} onChange={e => setDiscount(parseInt(e.target.value))} className="w-full h-2 bg-black rounded-full appearance-none cursor-pointer accent-red-600" />
                                                    <div className="flex justify-between text-[7px] font-black text-gray-700 tracking-widest uppercase"><span>5%</span><span>25%</span><span>50%</span></div>
                                                </div>

                                                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4">
                                                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Tom da Mensagem</span>
                                                    <div className="grid grid-cols-4 gap-2">
                                                        {[
                                                            { id: 'aggressive', label: '🔥Braba' },
                                                            { id: 'informal', label: '🤙Mano' },
                                                            { id: 'formal', label: '👔Dr.' },
                                                            { id: 'fun', label: '🎬Play' },
                                                            { id: 'funny', label: '😂Zueira' },
                                                            { id: 'scarcity', label: '⏳Corre' },
                                                            { id: 'short', label: '⚡Papo' }
                                                        ].map(s => (
                                                            <button
                                                                key={s.id}
                                                                onClick={() => setMsgStyle(s.id as any)}
                                                                className={`py-2 rounded-lg text-[8px] font-bold uppercase transition-all border ${msgStyle === s.id ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-black border-white/10 text-gray-500 hover:border-white/20'}`}
                                                            >
                                                                {s.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Tabela de Opções */}
                                            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
                                                <table className="w-full text-left">
                                                    <thead className="bg-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 border-b border-white/5">
                                                        <tr>
                                                            <th className="px-6 py-4">Opção</th>
                                                            <th className="px-6 py-4">Prévia da Mensagem</th>
                                                            <th className="px-6 py-4 text-right">Ação</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-white/5">
                                                        {['monthly', 'trimestral', 'semestral'].map(t => {
                                                            const p = getProposal(t);
                                                            return (
                                                                <tr key={t} className="hover:bg-white/[0.01] transition-colors group">
                                                                    <td className="px-6 py-6 min-w-[140px]">
                                                                        <div className="flex items-center gap-3">
                                                                            <span className="p-2 bg-red-600/10 rounded-lg text-red-600"><Star size={14} /></span>
                                                                            <span className="text-[10px] font-black uppercase tracking-widest text-white">{t === 'monthly' ? 'Mensal' : t === 'trimestral' ? 'Trimestral' : 'Semestral'}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-6">
                                                                        <div className="bg-black/40 p-3 rounded-lg border border-white/5 max-w-md">
                                                                            <p className="text-[10px] text-gray-400 leading-relaxed italic line-clamp-2">"{p.creative}"</p>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-6">
                                                                        <div className="flex justify-end gap-2">
                                                                            <button onClick={() => { navigator.clipboard.writeText(p.link); alert('Link Copiado!'); }} className="p-2 text-gray-500 hover:text-white transition-colors"><Copy size={16} /></button>
                                                                            <a
                                                                                href={`https://wa.me/${selectedLead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(p.creative)}`}
                                                                                target="_blank"
                                                                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase flex items-center gap-2 shadow-lg shadow-green-600/20"
                                                                            >
                                                                                <Send size={12} /> ENVIAR
                                                                            </a>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'pix' && (
                        <div className="space-y-10">
                            <div className="text-center md:text-left">
                                <h2 className="text-3xl font-black italic tracking-tighter uppercase text-white">Gerador de <span className="text-red-600">Cobranças</span></h2>
                                <p className="text-xs text-gray-500 mt-2 font-medium">Capture vendas offline gerando Pix manuais instantaneamente.</p>
                            </div>

                            <div className="max-w-4xl mx-auto bg-[#0a0a0a] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row">
                                <div className="flex-1 p-10 space-y-8 border-r border-white/5">
                                    <div className="flex bg-black p-1.5 rounded-2xl border border-white/5">
                                        <button onClick={() => setPixType('anon')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${pixType === 'anon' ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-white'}`}>Anônimo</button>
                                        <button onClick={() => setPixType('real')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${pixType === 'real' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>Dados Reais</button>
                                    </div>

                                    {pixType === 'real' && (
                                        <div className="grid grid-cols-1 gap-4">
                                            <input type="email" placeholder="EMAIL DO CLIENTE (@GMAIL.COM)" value={realEmail} onChange={e => setRealEmail(e.target.value)} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:border-red-600 outline-none text-white" />
                                            <input type="text" placeholder="WHATSAPP (DDD + NÚMERO)" value={realPhone} onChange={e => setRealPhone(formatPhone(e.target.value))} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:border-red-600 outline-none text-white" />
                                        </div>
                                    )}

                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block">VALOR DA COBRANÇA (R$)</label>
                                        <input type="text" placeholder="EX: 29,90" value={pixAmount} onChange={e => setPixAmount(e.target.value)} className="w-full bg-black border border-white/10 p-8 rounded-3xl text-5xl font-black text-white italic tracking-tighter focus:border-red-600 outline-none placeholder:opacity-20" />
                                    </div>

                                    <button onClick={handleGeneratePixCode} disabled={pixLoading} className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-6 rounded-3xl flex items-center justify-center gap-4 transition-all shadow-xl shadow-red-600/30 disabled:opacity-50 text-base italic tracking-tighter">
                                        {pixLoading ? <Loader2 className="animate-spin" /> : <><QrCode size={24} /> GERAR COBRANÇA AGORA</>}
                                    </button>
                                </div>

                                <div className="w-full md:w-[350px] bg-white/[0.02] p-10 flex flex-col items-center justify-center space-y-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-red-600/10 blur-[60px] rounded-full" />
                                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-red-600/10 blur-[60px] rounded-full" />

                                    {!generatedPixString ? (
                                        <div className="text-center opacity-30 space-y-4">
                                            <QrCode size={100} className="mx-auto text-gray-500" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Aguardando Dados...</p>
                                        </div>
                                    ) : (
                                        <div className="w-full text-center space-y-8 animate-in zoom-in duration-500">
                                            <div className="bg-white p-6 rounded-[2rem] shadow-2xl relative group">
                                                <img src={generatedPixImage} className="w-full h-auto rounded-xl" />
                                                <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]">
                                                    <p className="text-white text-[10px] font-black uppercase tracking-widest px-4">{manualPixStatus === 'approved' ? 'PAGAMENTO APROVADO!' : 'MONITORANDO...'}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <button onClick={() => { navigator.clipboard.writeText(generatedPixString); alert('Pix Copiado!'); }} className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all">
                                                    <Copy size={18} /> COPIAR CÓDIGO
                                                </button>
                                                {manualPixStatus === 'approved' && (
                                                    <div className="flex items-center gap-3 justify-center text-green-500 animate-bounce">
                                                        <CheckCircle2 size={24} />
                                                        <span className="font-black italic text-xl uppercase tracking-tighter">RECEBIDO!</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

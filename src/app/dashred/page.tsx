'use client';

import { useState, useEffect, useMemo } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, Timestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import {
    Users, Phone, Mail, Clock, Shield, Search, LogOut, CheckCircle2,
    AlertCircle, DollarSign, TrendingUp, BarChart3, Star,
    MoreVertical, FileText, Trash2, Smartphone, Send, Calendar, Percent, QrCode, Copy, Loader2, Menu, X
} from 'lucide-react';
import axios from 'axios';

import { generatePixPayload } from '@/lib/pix';

interface Lead {
    id: string;
    email: string;
    phone: string;
    plan: string;
    price: string;
    status: string;
    createdAt: Timestamp | null;
}

// Helper: Parse Price
const parsePrice = (priceStr: string): number => {
    if (!priceStr) return 0;
    const cleanStr = priceStr.replace(/[^\d.,]/g, '');
    const dotStr = cleanStr.replace(',', '.');
    const val = parseFloat(dotStr);
    return isNaN(val) ? 0 : val;
};

// Helper: Format Currency
const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(val);
};

// Helper: Calculate Expiration Days
const getDaysRemaining = (createdAt: Timestamp | null, plan: string) => {
    if (!createdAt) return 999;
    const startDate = createdAt.toDate();
    let durationDays = 30; // Default Monthly

    const p = plan?.toLowerCase() || '';
    if (p.includes('trimestral') || p.includes('3 meses')) durationDays = 90;
    else if (p.includes('semestral') || p.includes('6 meses')) durationDays = 180;
    else if (p.includes('anual') || p.includes('1 ano') || p.includes('12 meses')) durationDays = 365;
    else if (p.includes('vitalício') || p.includes('vitalicio')) return 9999; // Never expires

    const expiryDate = new Date(startDate);
    expiryDate.setDate(expiryDate.getDate() + durationDays);

    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export default function AdminDashboard() {
    const SECRET_PASSWORD = 'dviela123';
    const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 Horas em milissegundos

    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [authChecking, setAuthChecking] = useState(true);

    // Data State
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    // UI State
    const [activeTab, setActiveTab] = useState<'overview' | 'expiring' | 'pix'>('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'all'>('all');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Renewal Modal State
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [discount, setDiscount] = useState(0);

    // Pix Generator State
    const [pixAmount, setPixAmount] = useState('');
    const [generatedPixString, setGeneratedPixString] = useState('');
    const [generatedPixImage, setGeneratedPixImage] = useState('');
    const [pixLoading, setPixLoading] = useState(false);
    const [lastManualPixId, setLastManualPixId] = useState<string | null>(null);
    const [manualPixStatus, setManualPixStatus] = useState<'pending' | 'approved' | 'none'>('none');
    const [pixType, setPixType] = useState<'anon' | 'real'>('anon');
    const [realEmail, setRealEmail] = useState('');
    const [realPhone, setRealPhone] = useState('');

    // Listener for manual Pix status
    useEffect(() => {
        if (!lastManualPixId) return;
        const unsub = onSnapshot(doc(db, "leads", lastManualPixId), (snap) => {
            if (snap.exists() && snap.data().status === 'approved') {
                setManualPixStatus('approved');
            }
        });
        return () => unsub();
    }, [lastManualPixId]);

    // Check Auth on Mount
    useEffect(() => {
        const storedAuthData = localStorage.getItem('redflix_admin_session');
        if (storedAuthData) {
            try {
                const { timestamp, authenticated } = JSON.parse(storedAuthData);
                if (authenticated && (Date.now() - timestamp < SESSION_DURATION)) {
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem('redflix_admin_session');
                }
            } catch (e) {
                localStorage.removeItem('redflix_admin_session');
            }
        }
        setAuthChecking(false);
    }, []);

    // Firebase Listener
    useEffect(() => {
        if (!isAuthenticated) return;
        const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead));
            setLeads(data);
            setLoading(false);
        }, (err) => {
            console.error("Erro Firebase:", err);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [isAuthenticated]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === SECRET_PASSWORD) {
            setIsAuthenticated(true);
            localStorage.setItem('redflix_admin_session', JSON.stringify({ authenticated: true, timestamp: Date.now() }));
            setPassword('');
        } else {
            alert('Senha Incorreta!');
            setPassword('');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('redflix_admin_session');
    };

    const metrics = useMemo(() => {
        const now = new Date();
        const startOfDay = new Date(new Date(now).setHours(0, 0, 0, 0));
        const startOfWeek = new Date(new Date(now).setDate(now.getDate() - 7));
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const dateFiltered = leads.filter(l => {
            if (!l.createdAt) return false;
            const d = l.createdAt.toDate();
            if (dateFilter === 'today') return d >= startOfDay;
            if (dateFilter === 'week') return d >= startOfWeek;
            if (dateFilter === 'month') return d >= startOfMonth;
            return true;
        });

        const searchFiltered = dateFiltered.filter(l =>
            l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.phone.includes(searchTerm)
        );

        const totalRevenue = searchFiltered.filter(l => l.status === 'approved').reduce((acc, curr) => acc + parsePrice(curr.price), 0);
        const totalApproved = searchFiltered.filter(l => l.status === 'approved').length;
        const totalLeads = searchFiltered.length;

        const salesTodayCount = leads.filter(l => l.status === 'approved' && l.createdAt && l.createdAt.toDate() >= startOfDay).length;
        const revenueToday = leads.filter(l => l.status === 'approved' && l.createdAt && l.createdAt.toDate() >= startOfDay).reduce((acc, curr) => acc + parsePrice(curr.price), 0);
        const leadsToday = leads.filter(l => l.createdAt && l.createdAt.toDate() >= startOfDay).length;

        const planCounts: Record<string, number> = {};
        searchFiltered.forEach(l => { if (l.status === 'approved') planCounts[l.plan] = (planCounts[l.plan] || 0) + 1; });
        const bestSellingPlan = Object.entries(planCounts).sort((a, b) => b[1] - a[1])[0];

        const expiringLeads = leads.filter(l => l.status === 'approved').sort((a, b) => getDaysRemaining(a.createdAt, a.plan) - getDaysRemaining(b.createdAt, b.plan));

        return {
            data: searchFiltered.slice(0, rowsPerPage),
            totalFiltered: searchFiltered.length,
            expiring: expiringLeads,
            revenue: totalRevenue,
            revenueToday,
            salesToday: salesTodayCount,
            leadsToday,
            avgTicket: totalApproved > 0 ? totalRevenue / totalApproved : 0,
            approved: totalApproved,
            leads: totalLeads,
            conversion: totalLeads > 0 ? (totalApproved / totalLeads) * 100 : 0,
            bestPlan: bestSellingPlan ? bestSellingPlan[0] : 'N/A',
            bestPlanCount: bestSellingPlan ? bestSellingPlan[1] : 0
        };
    }, [leads, searchTerm, dateFilter, rowsPerPage]);

    const handleGeneratePixCode = async () => {
        if (!pixAmount) return alert('Preencha o valor da cobrança.');
        let targetEmail = pixType === 'real' ? realEmail : `anon.${Math.floor(Math.random() * 10000)}@redflix.com`;
        let targetPhone = pixType === 'real' ? realPhone : '11999999999';
        if (pixType === 'real' && (!realEmail || !realPhone)) return alert('Preencha todos os campos.');

        setPixLoading(true);
        setManualPixStatus('pending');
        try {
            const response = await axios.post('/api/payment', { amount: pixAmount, description: `Dash - ${pixType}`, payerEmail: targetEmail });
            const { qrcode_content, qrcode_image_url, transaction_id } = response.data;
            if (qrcode_content) {
                setGeneratedPixString(qrcode_content);
                setGeneratedPixImage(qrcode_image_url);
                const leadRef = doc(collection(db, "leads"), transaction_id);
                const { serverTimestamp } = await import('firebase/firestore');
                await updateDoc(leadRef, { email: targetEmail, phone: targetPhone, plan: `Dash ${pixType}`, price: pixAmount, status: 'pending', transactionId: transaction_id, createdAt: serverTimestamp() }).catch(async () => {
                    const { setDoc } = await import('firebase/firestore');
                    await setDoc(leadRef, { email: targetEmail, phone: targetPhone, plan: `Dash ${pixType}`, price: pixAmount, status: 'pending', transactionId: transaction_id, createdAt: serverTimestamp() });
                });
                setLastManualPixId(transaction_id);
            }
        } catch (error: any) { alert(error.response?.data?.error || 'Erro ao gerar Pix.'); setManualPixStatus('none'); }
        finally { setPixLoading(false); }
    };

    const toggleStatus = async (lead: Lead) => {
        const newStatus = lead.status === 'approved' ? 'pending' : 'approved';
        if (!confirm(`Mudar status para ${newStatus}?`)) return;
        try {
            await updateDoc(doc(db, "leads", lead.id), { status: newStatus });
            if (newStatus === 'approved') {
                await fetch('/api/send-email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: lead.email, plan: lead.plan, price: lead.price, status: 'approved' }) });
            }
        } catch (e) { alert('Erro ao atualizar Status.'); }
    };

    const deleteLead = async (id: string) => {
        if (confirm('Deletar permanentemente?')) await deleteDoc(doc(db, "leads", id));
    };

    const generateMessage = (type: 'renew' | 'upgrade3' | 'upgrade6') => {
        if (!selectedLead) return { direct: '', creative: '', aggressive: '', checkoutLink: '' };
        let basePrice = type === 'renew' ? 29.9 : type === 'upgrade3' ? 79.9 : 149.9;
        let planName = type === 'renew' ? 'Plano Mensal' : type === 'upgrade3' ? 'Plano Trimestral' : 'Plano Semestral';
        const finalPrice = (basePrice * (1 - discount / 100)).toFixed(2).replace('.', ',');
        const link = `${window.location.origin}/checkout/simple?plan=${encodeURIComponent(planName)}&price=${finalPrice}&leadId=${selectedLead.id}`;
        const days = getDaysRemaining(selectedLead.createdAt, selectedLead.plan);
        const distxt = discount > 0 ? ` com *${discount}% OFF*` : '';

        return {
            direct: `Olá! Seu plano ${selectedLead.plan} vence em ${days} dias. Renove aqui${distxt}: ${link}`,
            creative: `Seu acesso está acabando! Garanta mais tempo com desconto${distxt}: ${link}`,
            aggressive: `Cuidado! Corte iminente em ${days} dias. Salve seu acesso agora: ${link}`,
            checkoutLink: link
        };
    };

    if (authChecking) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Carregando...</div>;

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-[#0f0f0f] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
                    <h1 className="text-3xl font-black text-center text-white mb-8">REDFLIX ADMIN</h1>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <input type="password" placeholder="SENHA" className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-white text-center" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button className="w-full bg-primary py-5 rounded-2xl text-white font-black">ENTRAR</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[100dvh] md:h-screen bg-[#020202] text-white font-sans flex overflow-hidden">
            <aside className={`fixed md:relative inset-y-0 left-0 z-[70] transition-all bg-[#050505] border-r border-white/5 ${isSidebarOpen ? 'w-64' : 'w-20 md:w-20 lg:w-64'}`}>
                <div className="p-6 font-black italic text-xl">REDFLIX</div>
                <nav className="mt-8 px-4 space-y-2">
                    <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-4 p-4 rounded-xl ${activeTab === 'overview' ? 'bg-primary/10 text-primary' : 'text-gray-500'}`}><TrendingUp size={20} /><span className="hidden lg:block text-xs font-bold uppercase">Dashboard</span></button>
                    <button onClick={() => setActiveTab('expiring')} className={`w-full flex items-center gap-4 p-4 rounded-xl ${activeTab === 'expiring' ? 'bg-primary/10 text-primary' : 'text-gray-500'}`}><Clock size={20} /><span className="hidden lg:block text-xs font-bold uppercase">Renovações</span></button>
                    <button onClick={() => setActiveTab('pix')} className={`w-full flex items-center gap-4 p-4 rounded-xl ${activeTab === 'pix' ? 'bg-primary/10 text-primary' : 'text-gray-500'}`}><QrCode size={20} /><span className="hidden lg:block text-xs font-bold uppercase">Gerador Pix</span></button>
                </nav>
                <div className="absolute bottom-4 left-4 right-4"><button onClick={handleLogout} className="w-full flex items-center gap-4 p-4 text-gray-500 hover:text-red-500"><LogOut size={20} /><span className="hidden lg:block text-xs font-bold uppercase">Sair</span></button></div>
            </aside>

            <main className="flex-1 overflow-y-auto relative pt-16 md:pt-0">
                <header className="md:hidden fixed top-0 w-full bg-black/90 p-4 flex justify-between items-center z-50">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}><Menu size={24} /></button>
                    <span className="font-black italic">REDFLIX</span>
                    <button onClick={handleLogout}><LogOut size={20} /></button>
                </header>

                {activeTab === 'overview' && (
                    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-black italic">Visão Geral</h2>
                            <div className="flex gap-2">
                                {['today', 'week', 'month', 'all'].map(f => (
                                    <button key={f} onClick={() => setDateFilter(f as any)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase border ${dateFilter === f ? 'bg-white text-black' : 'border-white/10 text-gray-500'}`}>{f}</button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-white/5">
                                <h3 className="text-[10px] font-bold text-gray-500 uppercase">Faturamento Hoje</h3>
                                <p className="text-2xl font-black mt-1">{formatCurrency(metrics.revenueToday)}</p>
                            </div>
                            <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-white/5">
                                <h3 className="text-[10px] font-bold text-gray-500 uppercase">Vendas Hoje</h3>
                                <p className="text-2xl font-black mt-1">{metrics.salesToday}</p>
                            </div>
                            <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-white/5">
                                <h3 className="text-[10px] font-bold text-gray-500 uppercase">Leads Hoje</h3>
                                <p className="text-2xl font-black mt-1">{metrics.leadsToday}</p>
                            </div>
                            <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-white/5">
                                <h3 className="text-[10px] font-bold text-gray-500 uppercase">Conversão</h3>
                                <p className="text-2xl font-black mt-1">{metrics.conversion.toFixed(1)}%</p>
                            </div>
                        </div>

                        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                                <h3 className="font-bold">Últimas Transações</h3>
                                <input type="text" placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs" />
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-white/[0.02] text-[9px] uppercase text-gray-500">
                                        <tr><th className="px-6 py-4">Cliente</th><th className="px-6 py-4">Plano</th><th className="px-6 py-4">Valor</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Ações</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-xs">
                                        {metrics.data.map(lead => (
                                            <tr key={lead.id} className="hover:bg-white/[0.01]">
                                                <td className="px-6 py-4 font-bold">{lead.email}</td>
                                                <td className="px-6 py-4">{lead.plan}</td>
                                                <td className="px-6 py-4">{formatCurrency(parsePrice(lead.price))}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${lead.status === 'approved' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>{lead.status}</span>
                                                </td>
                                                <td className="px-6 py-4 flex gap-2">
                                                    <button onClick={() => toggleStatus(lead)} className="p-2 bg-white/5 rounded hover:bg-white/10"><CheckCircle2 size={14} /></button>
                                                    <button onClick={() => deleteLead(lead.id)} className="p-2 bg-white/5 rounded hover:bg-red-500/20"><Trash2 size={14} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'expiring' && (
                    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
                        <h2 className="text-2xl font-black italic">Gestão de Renovações</h2>
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-white/[0.02] text-[9px] uppercase text-gray-500">
                                    <tr><th className="px-6 py-4">Cliente</th><th className="px-6 py-4">Vencimento</th><th className="px-6 py-4">Ação</th></tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-xs">
                                    {metrics.expiring.map(lead => {
                                        const days = getDaysRemaining(lead.createdAt, lead.plan);
                                        return (
                                            <tr key={lead.id}>
                                                <td className="px-6 py-4 font-bold">{lead.email}</td>
                                                <td className="px-6 py-4"><span className={days <= 7 ? 'text-red-500 font-bold' : ''}>{days} dias</span></td>
                                                <td className="px-6 py-4">
                                                    <button onClick={() => setSelectedLead(lead)} className="bg-green-600/10 text-green-500 px-4 py-2 rounded-lg font-black uppercase text-[10px]">Enviar Proposta</button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {selectedLead && (
                            <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
                                <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 max-w-md w-full">
                                    <div className="flex justify-between mb-6"><h3>Enviar Proposta</h3><button onClick={() => setSelectedLead(null)}><X /></button></div>
                                    <div className="space-y-4">
                                        {['renew', 'upgrade3', 'upgrade6'].map(t => {
                                            const m = generateMessage(t as any);
                                            return (
                                                <div key={t} className="bg-white/5 p-4 rounded-xl space-y-3">
                                                    <p className="text-[10px] font-black uppercase text-gray-500">{t}</p>
                                                    <div className="flex gap-2">
                                                        <a href={`https://wa.me/${selectedLead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(m.direct)}`} target="_blank" className="flex-1 bg-green-600 text-center py-2 rounded text-[10px] font-black">WHATSAPP</a>
                                                        <button onClick={() => { navigator.clipboard.writeText(m.checkoutLink); alert('Copiado!'); }} className="bg-white/10 px-4 py-2 rounded text-[10px]">Copiad</button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'pix' && (
                    <div className="p-4 md:p-8 space-y-8 max-w-2xl mx-auto">
                        <h2 className="text-2xl font-black italic">Gerador de Pix</h2>
                        <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-3xl space-y-6">
                            <div className="flex gap-2 p-1 bg-black rounded-xl">
                                <button onClick={() => setPixType('anon')} className={`flex-1 py-2 rounded-lg text-[10px] font-black ${pixType === 'anon' ? 'bg-primary' : ''}`}>ANÔNIMO</button>
                                <button onClick={() => setPixType('real')} className={`flex-1 py-2 rounded-lg text-[10px] font-black ${pixType === 'real' ? 'bg-white text-black' : ''}`}>REAL</button>
                            </div>
                            {pixType === 'real' && (
                                <div className="space-y-4">
                                    <input type="email" placeholder="Email" value={realEmail} onChange={e => setRealEmail(e.target.value)} className="w-full bg-black border border-white/10 p-3 rounded-xl" />
                                    <input type="text" placeholder="WhatsApp" value={realPhone} onChange={e => setRealPhone(e.target.value)} className="w-full bg-black border border-white/10 p-3 rounded-xl" />
                                </div>
                            )}
                            <input type="text" placeholder="Valor (ex: 29,90)" value={pixAmount} onChange={e => setPixAmount(e.target.value)} className="w-full bg-black border border-white/10 p-4 rounded-xl text-3xl font-black" />
                            <button onClick={handleGeneratePixCode} disabled={pixLoading} className="w-full bg-primary py-4 rounded-xl font-black">GERAR PIX</button>
                            {generatedPixString && (
                                <div className="text-center space-y-4">
                                    <img src={generatedPixImage} className="mx-auto w-48 h-48 bg-white p-2 rounded-xl" />
                                    <button onClick={() => { navigator.clipboard.writeText(generatedPixString); alert('Copiado!'); }} className="text-primary font-bold">COPIAR PIX</button>
                                    {manualPixStatus === 'approved' && <div className="text-green-500 font-black">PAGAMENTO APROVADO!</div>}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

'use client';

import Link from "next/link";
import { MessageSquare, Sparkles, Zap, Shield, Globe, ArrowRight } from "lucide-react";

export const LandingPage = () => {
    return (
        <div className="min-h-screen bg-[#09090b] text-white selection:bg-blue-500/30 overflow-x-hidden relative">
            {/* Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/5 blur-[120px] rounded-full animate-slow-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/5 blur-[120px] rounded-full animate-slow-pulse delay-700" />
            </div>

            <nav className="relative flex justify-between items-center px-6 py-8 max-w-7xl mx-auto">
                <div className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform cursor-pointer">
                        <MessageSquare size={20} className="text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Realtime Chat</span>
                </div>
                <div className="flex items-center gap-6">
                    <Link href={{ pathname: '/login', query: { tab: 'login' } }} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Iniciar Sesión</Link>
                    <Link href={{ pathname: '/login', query: { tab: 'register' } }} className="bg-white text-black px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-all active:scale-95 shadow-xl shadow-white/5">Comenzar Gratis</Link>
                </div>
            </nav>

            <main className="relative max-w-7xl mx-auto px-6 py-20 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-8 animate-fade-in">
                    <Sparkles size={14} /> Nueva versión 2.0 disponible
                </div>

                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
                    Conecta al instante, <br />
                    <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">en cualquier lugar.</span>
                </h1>

                <p className="max-w-2xl mx-auto text-lg text-zinc-400 mb-12 leading-relaxed">
                    Experimenta la mensajería privada más rápida del mundo con cifrado de extremo a extremo. Chat, búsqueda y notificaciones en tiempo real, todo en un diseño premium.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
                    <Link href="/login" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-2xl shadow-blue-600/40 active:scale-95 flex items-center justify-center gap-2">
                        Empezar a Chatear <ArrowRight size={20} />
                    </Link>
                    <button className="w-full sm:w-auto glass border border-white/5 hover:bg-white/10 px-8 py-4 rounded-2xl font-bold text-lg transition-all">
                        Ver Demo
                    </button>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all group text-left">
                        <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                            <Zap size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Velocidad Extrema</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed">Mensajería instantánea gracias a WebSockets optimizados. Sin latencia, sin esperas.</p>
                    </div>

                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all group text-left">
                        <div className="w-12 h-12 bg-purple-600/20 rounded-2xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
                            <Shield size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Privacidad Total</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed">Tus conversaciones son privadas y seguras. Tú tienes el control total de tus datos.</p>
                    </div>

                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all group text-left">
                        <div className="w-12 h-12 bg-emerald-600/20 rounded-2xl flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
                            <Globe size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Global y Accesible</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed">Conéctate desde cualquier dispositivo y buscador sin perder el hilo de tus chats.</p>
                    </div>
                </div>
            </main>

            <footer className="relative max-w-7xl mx-auto px-6 py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 bg-[#09090b]">
                <p className="text-zinc-500 text-sm">© 2026 Realtime Chat Inc. Todos los derechos reservados.</p>
                <div className="flex gap-8 text-sm text-zinc-500">
                    <a href="#" className="hover:text-white transition-colors">Privacidad</a>
                    <a href="#" className="hover:text-white transition-colors">Términos</a>
                    <a href="#" className="hover:text-white transition-colors cursor-pointer">Github</a>
                </div>
            </footer>
            <div className="h-20" /> {/* Spacer for mobile */}
        </div>
    );
};

"use client";

import { login, register } from "@/app/auth/actions";
import { useActionState, useState } from "react";
import Link from "next/link";
import { MessageSquare, Mail, Lock, User, AtSign, ArrowRight, Github } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const [loginState, loginAction, isLoginPending] = useActionState(login, null);
  const [registerState, registerAction, isRegisterPending] = useActionState(register, null);
  const [isRegistering, setIsRegistering] = useState(tab === "register");

  const isPending = isLoginPending || isRegisterPending;

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[150px] rounded-full" />

      <Link href="/" className="mb-12 flex items-center gap-3 transition-transform hover:scale-105">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/30">
          <MessageSquare className="text-white" size={24} />
        </div>
        <span className="text-2xl font-black tracking-tighter">Realtime Chat</span>
      </Link>

      <div className="w-full max-w-md relative">
        <div className="absolute inset-0 bg-blue-600/5 blur-2xl rounded-[40px]" />

        <div className="relative glass border border-white/10 rounded-[40px] p-8 md:p-10 shadow-2xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black mb-3 leading-tight">
              {isRegistering ? "Unirse a la Red" : "Bienvenido de Nuevo"}
            </h2>
            <p className="text-zinc-500 text-sm font-medium">
              {isRegistering ? "Crea una cuenta en segundos" : "Inicia sesión para continuar chateando"}
            </p>
          </div>

          <form action={isRegistering ? registerAction : loginAction} className="space-y-4">
            {isRegistering && (
              <>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input
                    name="name"
                    type="text"
                    placeholder="Nombre completo"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all placeholder:text-zinc-600"
                  />
                </div>
                <div className="relative group">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input
                    name="username"
                    type="text"
                    placeholder="Nombre de usuario"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all placeholder:text-zinc-600"
                  />
                </div>
              </>
            )}

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                name="email"
                type="email"
                placeholder="Dirección de email"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all placeholder:text-zinc-600"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                name="password"
                type="password"
                placeholder="Tu contraseña"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all placeholder:text-zinc-600"
              />
            </div>

            {(loginState?.error || registerState?.error) && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-xs font-medium animate-shake text-center">
                {loginState?.error || registerState?.error}
              </div>
            )}

            <button
              disabled={isPending}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-600/25 active:scale-95 disabled:opacity-50 disabled:active:scale-100 cursor-pointer"
            >
              {isPending ? "Procesando..." : isRegistering ? "Crear Mi Cuenta" : "Entrar Ahora"}
              {!isPending && <ArrowRight size={18} />}
            </button>
          </form>



          <div className="mt-8 text-center">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              {isRegistering ? "Ya tienes cuenta? Conéctate" : "¿Nuevo aquí? Crea tu cuenta"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

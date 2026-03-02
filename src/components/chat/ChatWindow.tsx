'use client';

import { Send, MessageSquare, ChevronLeft } from "lucide-react";
import { Conversation, Message } from "@/types";
import { MessageItem } from "./MessageItem";

interface Props {
    selectedChat: Conversation | null;
    messages: Message[];
    newMessage: string;
    setNewMessage: (val: string) => void;
    onSend: () => void;
    user: any;
    scrollRef: React.RefObject<HTMLDivElement | null>;
    onBack?: () => void;
}

export const ChatWindow = ({
    selectedChat,
    messages,
    newMessage,
    setNewMessage,
    onSend,
    user,
    scrollRef,
    onBack
}: Props) => {
    return (
        <div className="flex-1 flex flex-col bg-[#09090b] relative">
            {selectedChat ? (
                <>
                    {/* Header */}
                    <div className="h-20 border-b border-white/10 flex items-center justify-between px-4 md:px-8 glass z-10 transition-all duration-300">
                        <div className="flex items-center gap-2 md:gap-4">
                            {/* Mobile Back Button */}
                            <button
                                onClick={onBack}
                                className="md:hidden p-2 hover:bg-white/5 rounded-xl transition-colors text-zinc-400 hover:text-white"
                            >
                                <ChevronLeft size={24} />
                            </button>

                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-zinc-800 flex items-center justify-center font-bold text-sm md:text-lg text-blue-400">
                                {selectedChat.other_participant.username[0].toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                                <h2 className="font-bold text-sm md:text-lg tracking-tight leading-none mb-1 md:mb-1.5">{selectedChat.other_participant.username}</h2>
                                <div className="flex items-center gap-1.5 overflow-hidden">
                                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
                                    <p className="text-[8px] md:text-[10px] text-zinc-400 font-medium uppercase tracking-wider">Activo ahora</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 scroll-smooth scrollbar-hide">
                        {messages.length > 0 ? messages.map((msg) => (
                            <MessageItem key={msg.id} msg={msg} isMine={msg.sender_id === user.id} />
                        )) : (
                            <div className="flex-1 flex flex-col items-center justify-center opacity-20 select-none">
                                <MessageSquare size={100} strokeWidth={1} />
                                <p className="mt-4 font-medium tracking-[0.2em] uppercase text-xs">Sin mensajes aún</p>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>

                    {/* Input */}
                    <div className="p-8 glass-dark border-t border-white/10 animate-slide-up">
                        <div className="relative flex items-center gap-4 max-w-4xl mx-auto">
                            <input
                                type="text"
                                placeholder="Escribe un mensaje..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all placeholder:text-zinc-600 focus:bg-white/10 shadow-inner"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && onSend()}
                            />
                            <button
                                onClick={onSend}
                                className="bg-blue-600 hover:bg-blue-500 text-white p-5 rounded-2xl transition-all shadow-2xl shadow-blue-600/30 active:scale-95 disabled:opacity-30 disabled:active:scale-100 flex items-center justify-center"
                                disabled={!newMessage.trim()}
                            >
                                <Send size={22} className={!newMessage.trim() ? "opacity-50" : "animate-pop"} />
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-12 animate-fade-in select-none">
                    <div className="w-32 h-32 rounded-[40px] bg-white/5 border border-white/10 flex items-center justify-center mb-10 shadow-2xl animate-pulse backdrop-blur-3xl group transition-all hover:scale-110 cursor-default">
                        <MessageSquare size={64} className="text-blue-500/20 group-hover:text-blue-500/50 transition-colors" strokeWidth={1} />
                    </div>
                    <h2 className="text-3xl font-black mb-4 tracking-tight leading-none">Tu Círculo de Mensajes</h2>
                    <p className="max-w-xs text-zinc-500 text-sm leading-relaxed">Explora tus conversaciones existentes o busca nuevas personas para conectar al instante.</p>
                </div>
            )}
        </div>
    );
};

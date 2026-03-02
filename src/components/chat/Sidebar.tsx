'use client';

import { LogOut, Search, MessageSquare, User as UserIcon, X } from "lucide-react";
import { Conversation, Profile } from "@/types";
import { ConversationItem } from "./ConversationItem";

interface Props {
    user: any;
    conversations: Conversation[];
    selectedChat: Conversation | null;
    onSelect: (conv: Conversation) => void;
    searchQuery: string;
    onSearch: (val: string) => void;
    searchResults: Profile[];
    isSearching: boolean;
    setIsSearching: (val: boolean) => void;
    onCreateChat: (userId: string) => void;
    onLogout: () => void;
}

export const Sidebar = ({ user, conversations, selectedChat, onSelect, searchQuery, onSearch, searchResults, isSearching, setIsSearching, onCreateChat, onLogout }: Props) => {
    return (
        <div className="w-80 border-r border-white/10 flex flex-col glass backdrop-blur-xl">
            <div className="p-6 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold text-lg shadow-lg">
                        {user.user_metadata?.username?.[0]?.toUpperCase() || user.email?.[0].toUpperCase()}
                    </div>
                    <div>
                        <p className="font-semibold text-sm leading-none truncate max-w-[120px]">
                            {user.user_metadata?.username || user.email}
                        </p>
                        <p className="text-xs text-blue-400 mt-1">Conectado</p>
                    </div>
                </div>
                <button onClick={onLogout} className="p-2 hover:bg-white/10 rounded-full transition-colors group">
                    <LogOut size={18} className="text-zinc-400 group-hover:text-red-400 transition-colors" />
                </button>
            </div>

            <div className="p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                    <input
                        type="text"
                        placeholder="Buscar personas o chats..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                        value={searchQuery}
                        onChange={(e) => onSearch(e.target.value)}
                        onFocus={() => setIsSearching(true)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide px-2">
                {isSearching ? (
                    <div className="p-2">
                        <div className="flex justify-between items-center px-2 mb-2">
                            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Resultados</span>
                            <button onClick={() => setIsSearching(false)} className="text-zinc-500 hover:text-white"><X size={14} /></button>
                        </div>
                        {searchResults.length > 0 ? searchResults.map(res => (
                            <button
                                key={res.id}
                                onClick={() => onCreateChat(res.id)}
                                className="w-full p-3 flex items-center cursor-pointer gap-3 hover:bg-white/5 rounded-xl transition-all animate-slide-in group"
                            >
                                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
                                    <UserIcon size={20} className="group-hover:text-blue-400 transition-colors" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-medium">{res.username}</p>
                                    <p className="text-xs text-zinc-500">Nuevo chat</p>
                                </div>
                            </button>
                        )) : searchQuery.length > 1 ? <p className="text-center text-xs text-zinc-500 py-4">No se encontraron usuarios</p> : null}
                    </div>
                ) : (
                    <>
                        <div className="px-4 mb-2 mt-2">
                            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Mensajes Recientes</span>
                        </div>
                        {conversations.length > 0 ? conversations.map((conv) => (
                            <ConversationItem
                                key={conv.id}
                                conv={conv}
                                isSelected={selectedChat?.id === conv.id}
                                onSelect={onSelect}
                            />
                        )) : (
                            <div className="flex flex-col items-center justify-center mt-10 text-zinc-500 px-4 text-center">
                                <MessageSquare size={40} className="mb-4 opacity-10" />
                                <p className="text-sm">¿Nadie por aquí?</p>
                                <p className="text-[10px] mt-1 opacity-50">Busca a alguien para empezar a chatear</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

'use client';

import { createClient } from "@/lib/supabase/client";
import { useSocket } from "@/components/SocketProvider";
import { useEffect, useState, useRef } from "react";
import { logout } from "./auth/actions";
import { Profile, Message, Conversation } from "@/types";
import { LandingPage } from "@/components/landing/LandingPage";
import { Sidebar } from "@/components/chat/Sidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";

export default function HomePage() {
  const supabase = createClient();
  const socket = useSocket();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function getUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        if (user) {
          await fetchConversations(user.id);
        }
      } catch (err) {
        console.error("Auth error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    getUser();
  }, []);

  useEffect(() => {
    if (!socket || !user) return;

    conversations.forEach(conv => {
      socket.emit("join-conversation", conv.id);
    });

    const handleNewMessage = (message: Message) => {
      const isFromMe = message.sender_id === user.id;

      if (selectedChat && message.conversation_id === selectedChat.id) {
        setMessages((prev) => {
          if (prev.some(m => m.id === message.id)) return prev;
          return [...prev, message];
        });
        if (!isFromMe) {
          supabase.from('messages').update({ is_read: true }).eq('id', message.id).then();
        }
      }

      setConversations((prev) => {
        const index = prev.findIndex(c => c.id === message.conversation_id);
        if (index === -1) {
          // Si no existe, deberíamos quizas recargar o esperar al siguiente fetch
          // Pero por ahora, si recibimos un mensaje de uno que no esta en la lista, lo dejamos pasar
          // o podríamos intentar agregarlo. Por simplicidad, solo reordenamos los existentes.
          return prev;
        }

        const isCurrentChatOpen = selectedChat?.id === message.conversation_id;
        const updatedConv = {
          ...prev[index],
          last_message: message.content,
          last_message_at: message.created_at,
          unread_count: (isCurrentChatOpen || isFromMe) ? 0 : (prev[index].unread_count || 0) + 1
        };

        const filtered = prev.filter(c => c.id !== message.conversation_id);
        return [updatedConv, ...filtered];
      });
    };

    socket.on("new-message", handleNewMessage);
    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, [socket, user?.id, conversations.length, selectedChat?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('get_user_conversations', { p_user_id: userId });
      if (error) throw error;
      const formatted = data.map((d: any) => ({
        id: d.id,
        other_participant: {
          id: d.other_participant_id,
          username: d.other_participant_username,
          avatar_url: d.other_participant_avatar_url
        },
        last_message: d.last_message,
        last_message_at: d.last_message_at, // Asumiendo que el RPC lo devuelve
        unread_count: Number(d.unread_count)
      })).sort((a: any, b: any) => {
        const dateA = a.last_message_at ? new Date(a.last_message_at).getTime() : 0;
        const dateB = b.last_message_at ? new Date(b.last_message_at).getTime() : 0;
        return dateB - dateA;
      });
      setConversations(formatted);
    } catch (err) {
      console.error("Error fetching conversations:", err);
    }
  };

  const selectConversation = async (conv: Conversation) => {
    console.log("🐞 [CRITICAL INFO] Intentando abrir chat:", conv.id);
    try {
      if (!user?.id || !conv?.id) {
        console.warn("🔍 [DEBUG] Error: ID faltante", { userId: user?.id, convId: conv?.id });
        return;
      }

      setSelectedChat(conv);

      // Limpiar no leídos en background
      if (conv.unread_count && conv.unread_count > 0) {
        supabase.from('messages')
          .update({ is_read: true })
          .eq('conversation_id', conv.id)
          .eq('is_read', false)
          .neq('sender_id', user.id)
          .then(({ error: readError }) => {
            if (readError) console.error("🔍 [DEBUG] Error al marcar leídos:", readError.message);
          });
        setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, unread_count: 0 } : c));
      }

      if (socket) socket.emit("join-conversation", conv.id);

      const { data, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conv.id)
        .order('created_at', { ascending: true });

      if (fetchError) {
        console.error("🐞 [CRITICAL INFO] Error de Supabase al traer mensajes:", fetchError);
        return;
      }
      setMessages(data || []);
    } catch (err) {
      console.error("🐞 [CRITICAL INFO] Fallo total en selectConversation:", err);
    }
  };
  const startSearch = async (val: string) => {
    setSearchQuery(val);
    if (val.length < 2) {
      setSearchResults([]);
      return;
    }
    const { data } = await supabase.from('profiles').select('*').ilike('username', `%${val}%`).neq('id', user?.id).limit(10);
    if (data) setSearchResults(data);
  };

  const createConversation = async (targetUserId: string) => {
    try {
      if (!user) return;

      const existing = conversations.find(c => c.other_participant.id === targetUserId);
      if (existing) {
        selectConversation(existing);
        setIsSearching(false);
        setSearchQuery("");
        return;
      }

      // get_common_conversation devuelve table (array de objetos)
      const { data: commonData } = await supabase.rpc('get_common_conversation', { user_a: user.id, user_b: targetUserId });

      let finalConvId;
      if (commonData && commonData.length > 0) {
        finalConvId = commonData[0].conversation_id;
      } else {
        const { data: newConv } = await supabase.from('conversations').insert({}).select().single();
        if (!newConv) return;
        finalConvId = newConv.id;
        await supabase.from('conversation_participants').insert([
          { conversation_id: finalConvId, user_id: user.id },
          { conversation_id: finalConvId, user_id: targetUserId }
        ]);
      }

      await fetchConversations(user.id);
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', targetUserId).single();
      if (profile) {
        selectConversation({ id: finalConvId, other_participant: profile });
      }
      setIsSearching(false);
      setSearchQuery("");
    } catch (err) {
      console.error("Critical fail in createConversation:", err);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat || !socket) return;
    socket.emit("send-message", { conversationId: selectedChat.id, content: newMessage });
    setNewMessage("");
  };

  const handleLogout = async () => {
    console.log("Cerrando sesión...");
    setUser(null);
    setConversations([]);
    setSelectedChat(null);
    await supabase.auth.signOut();
    await logout();
  };

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#09090b] text-white">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-zinc-500 animate-pulse font-medium">Cargando Realtime Chat...</p>
      </div>
    );
  }

  if (!user) return <LandingPage />;

  return (
    <div className="flex h-screen bg-[#09090b] text-white font-sans overflow-hidden">
      <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} w-full md:w-80 h-full`}>
        <Sidebar
          user={user}
          conversations={conversations}
          selectedChat={selectedChat}
          onSelect={selectConversation}
          searchQuery={searchQuery}
          onSearch={startSearch}
          searchResults={searchResults}
          isSearching={isSearching}
          setIsSearching={setIsSearching}
          onCreateChat={createConversation}
          onLogout={handleLogout}
        />
      </div>

      <div className={`${!selectedChat ? 'hidden md:flex' : 'flex'} flex-1 h-full`}>
        <ChatWindow
          selectedChat={selectedChat}
          messages={messages}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          onSend={sendMessage}
          user={user}
          scrollRef={messagesEndRef}
          onBack={() => setSelectedChat(null)}
        />
      </div>
    </div>
  );
}

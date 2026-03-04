import { Conversation } from "@/types";

interface Props {
    conv: Conversation;
    isSelected: boolean;
    onSelect: (conv: Conversation) => void;
}

export const ConversationItem = ({ conv, isSelected, onSelect }: Props) => {
    return (
        <button
            onClick={() => onSelect(conv)}
            className={`w-full p-4 flex items-center cursor-pointer gap-4 rounded-2xl transition-all duration-200 mb-1 ${isSelected ? 'bg-blue-600/20 text-blue-100' : 'hover:bg-white/5 text-zinc-400 hover:text-white'
                }`}
        >
            <div className="relative">
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-lg font-semibold overflow-hidden">
                    {conv.other_participant.avatar_url ? (
                        <img src={conv.other_participant.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                        conv.other_participant.username[0].toUpperCase()
                    )}
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#09090b] rounded-full"></div>
            </div>
            <div className="flex-1 text-left overflow-hidden">
                <p className={`font-semibold text-sm truncate ${conv.unread_count && conv.unread_count > 0 ? 'text-white' : ''}`}>
                    {conv.other_participant.username}
                </p>
                <p className={`text-xs truncate mt-0.5 ${conv.unread_count && conv.unread_count > 0 ? 'text-blue-100 font-medium' : 'opacity-70'}`}>
                    {conv.last_message || 'Inicia un chat...'}
                </p>
            </div>
            {conv.unread_count && conv.unread_count > 0 && (
                <div className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center animate-bounce shadow-lg shadow-blue-500/30">
                    {conv.unread_count}
                </div>
            )}
        </button>
    );
};

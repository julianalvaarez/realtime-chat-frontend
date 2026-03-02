import { Message } from "@/types";

interface Props {
    msg: Message;
    isMine: boolean;
}

export const MessageItem = ({ msg, isMine }: Props) => {
    return (
        <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-slide-in`}>
            <div className={`max-w-[70%] p-4 rounded-2xl text-sm ${isMine ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-zinc-800 text-zinc-100 rounded-tl-none'}`}>
                <p>{msg.content}</p>
                <p className={`text-[10px] mt-2 opacity-50 ${isMine ? 'text-right' : 'text-left'}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
        </div>
    );
};

export interface Profile {
    id: string;
    username: string;
    avatar_url?: string;
    full_name?: string;
}

export interface Message {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    created_at: string;
    is_read: boolean;
}

export interface Conversation {
    id: string;
    other_participant: Profile;
    last_message?: string;
    last_message_at?: string;
    unread_count?: number;
}

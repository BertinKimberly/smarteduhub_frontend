export interface ChatMessage {
   role: "user" | "assistant";
   content: string;
   timestamp?: Date;
}

export interface ChatState {
   messages: ChatMessage[];
   isOpen: boolean;
}

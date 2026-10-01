"use client";

import { useState } from "react";
import type { Chat, ChatMessage } from "@/types/chat";

type UseChatReturn = {
  chats: Chat[];
  activeChatId: string | null;
  activeChat: Chat | undefined;
  isLoading: boolean;
  createChat: () => void;
  selectChat: (chatId: string) => void;
  sendMessage: (content: string) => Promise<void>;
  deleteChat: (chatId: string) => void;
};

export function useChat(): UseChatReturn {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const activeChat = chats.find(
    (chat) => chat.id === activeChatId,
  );

  const createChat = () => {
    const newChat: Chat = {
      id: crypto.randomUUID(),
      title: "New Chat",
      messages: [],
    };

    setChats((current) => [newChat, ...current]);
    setActiveChatId(newChat.id);
  };

  const selectChat = (chatId: string) => {
    setActiveChatId(chatId);
  };

  const sendMessage = async (content: string) => {
    if (!activeChatId || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };

    setChats((current) =>
      current.map((chat) => {
        if (chat.id !== activeChatId) {
          return chat;
        }

        return {
          ...chat,
          title:
            chat.messages.length === 0
              ? content.slice(0, 40)
              : chat.title,
          messages: [...chat.messages, userMessage],
        };
      }),
    );

    setIsLoading(true);

    // Temporary frontend-only assistant response.
    // This will become an API call later.
    await new Promise((resolve) => setTimeout(resolve, 800));

    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: `You said: "${content}"`,
    };

    setChats((current) =>
      current.map((chat) => {
        if (chat.id !== activeChatId) {
          return chat;
        }

        return {
          ...chat,
          messages: [...chat.messages, assistantMessage],
        };
      }),
    );

    setIsLoading(false);
  };

  const deleteChat = (chatId: string) => {
    setChats((current) =>
      current.filter((chat) => chat.id !== chatId),
    );

    if (activeChatId === chatId) {
      setActiveChatId(null);
    }
  };

  return {
    chats,
    activeChatId,
    activeChat,
    isLoading,
    createChat,
    selectChat,
    sendMessage,
    deleteChat,
  };
}
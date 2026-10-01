"use client";

import { useState } from "react";
import type { Chat, ChatMessage } from "@/types/chat";
import { sendMessage as sendMessageApi } from "@/lib/api/chats";

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

  const activeChat = chats.find((chat) => chat.id === activeChatId);

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
    if (!activeChatId || !content.trim() || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };

    setChats((currentChats) =>
      currentChats.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: [...chat.messages, userMessage],
            }
          : chat,
      ),
    );

    setIsLoading(true);

    try {
      const result = await sendMessageApi(content);

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: result.response,
      };

      setChats((currentChats) =>
        currentChats.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: [...chat.messages, assistantMessage],
              }
            : chat,
        ),
      );
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteChat = (chatId: string) => {
    setChats((current) => current.filter((chat) => chat.id !== chatId));

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

"use client";

import { useState, useEffect } from "react";
import type { Chat, ChatMessage } from "@/types/chat";
import { sendMessage as sendMessageApi } from "@/lib/api/chats";
import { getChats, getChatMessages } from "@/lib/api/chats";

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

  useEffect(() => {
    async function loadChats() {
      try {
        const chats = await getChats();

        setChats(
          chats.map((chat) => ({
            id: chat.id,
            title: chat.title,
            messages: [],
          })),
        );
      } catch (error) {
        console.error("Failed to load chats:", error);
      }
    }

    void loadChats();
  }, []);

  const activeChat = chats.find((chat) => chat.id === activeChatId);

  const createChat = () => {
    const newChat: Chat = {
      id: crypto.randomUUID(),
      title: "New Chat",
      messages: [],
      persisted: false,
    };

    setChats((current) => [newChat, ...current]);
    setActiveChatId(newChat.id);
  };

  const selectChat = async (chatId: string) => {
    setActiveChatId(chatId);

    try {
      const messages = await getChatMessages(chatId);

      setChats((currentChats) =>
        currentChats.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: messages.map((message) => ({
                  id: message.id,
                  role: message.role,
                  content: message.content,
                })),
              }
            : chat,
        ),
      );
    } catch (error) {
      console.error("Failed to load chat messages:", error);
    }
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
      const chatId = activeChat?.persisted
        ? activeChat.id
        : undefined;
      
      const result = await sendMessageApi(content, chatId);

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

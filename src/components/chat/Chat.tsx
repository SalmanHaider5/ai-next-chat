"use client";

import { Empty, Spin } from "antd";
import { useEffect, useRef } from "react";
import type { Chat as ChatType } from "@/types/chat";
import ChatComposer from "./ChatComposer";

type ChatProps = {
  chat?: ChatType;
  isLoading: boolean;
  onSendMessage: (message: string) => Promise<void>;
};

export default function Chat({ chat, isLoading, onSendMessage }: ChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chat?.messages.length, isLoading]);

  if (!chat) {
    return (
      <div className="chat-empty">
        <div className="chat-empty-content">
          <h1>AI Workspace</h1>
          <p>Start a new conversation to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <div className="chat-messages">
        {chat.messages.length === 0 ? (
          <div className="chat-empty-conversation">
            <h2>{chat.title}</h2>
            <p>How can I help you today?</p>
          </div>
        ) : (
          chat.messages.map((message) => (
            <div
              key={message.id}
              className={`chat-message chat-message-${message.role}`}
            >
              <div className="chat-message-content">{message.content}</div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="chat-message chat-message-assistant">
            <div className="chat-message-content chat-loading">
              <Spin size="small" />
              <span>Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <ChatComposer onSendMessage={onSendMessage} disabled={isLoading} />
    </div>
  );
}

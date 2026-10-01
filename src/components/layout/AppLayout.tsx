"use client";

import { Layout } from "antd";
import Sidebar from "./Sidebar";
import Chat from "@/components/chat/Chat";
import { useChat } from "@/hooks/useChat";

const { Content } = Layout;

export default function AppLayout() {
  const {
    chats,
    activeChatId,
    activeChat,
    isLoading,
    createChat,
    selectChat,
    sendMessage,
    deleteChat,
  } = useChat();

  return (
    <Layout className="app-layout">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={createChat}
        onSelectChat={selectChat}
        onDeleteChat={deleteChat}
      />

      <Layout className="main-layout">
        <Content className="app-content">
          <Chat
            chat={activeChat}
            isLoading={isLoading}
            onSendMessage={sendMessage}
          />
        </Content>
      </Layout>
    </Layout>
  );
}

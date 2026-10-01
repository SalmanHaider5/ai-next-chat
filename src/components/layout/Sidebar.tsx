"use client";

import {
  MessageOutlined,
  PlusOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button, Menu } from "antd";
import type { MenuProps } from "antd";
import type { Chat } from "@/types/chat";

type SidebarProps = {
  chats: Chat[];
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
};

export default function Sidebar({
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
}: SidebarProps) {
  const recentChatItems: MenuProps["items"] = chats.map((chat) => ({
    key: chat.id,
    icon: <MessageOutlined />,
    label: chat.title,
  }));

  return (
    <aside className="sidebar">
      {" "}
      <div className="sidebar-header">
        {" "}
        <h2>AI Workspace</h2>{" "}
      </div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        block
        className="new-chat-button"
        onClick={onNewChat}
      >
        New Chat
      </Button>
      <div className="sidebar-section-title">Recents</div>
      <Menu
        mode="inline"
        items={recentChatItems}
        selectedKeys={activeChatId ? [activeChatId] : []}
        onClick={({ key }) => onSelectChat(key)}
        className="sidebar-menu"
      />
      <div className="sidebar-footer">
        <Button type="text" icon={<SettingOutlined />} block>
          Settings
        </Button>
      </div>
    </aside>
  );
}

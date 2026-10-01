"use client";

import { SendOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useState } from "react";

const { TextArea } = Input;

type ChatComposerProps = {
  onSendMessage: (message: string) => Promise<void>;
  disabled?: boolean;
};

export default function ChatComposer({
  onSendMessage,
  disabled = false,
}: ChatComposerProps) {
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    const value = message.trim();

    if (!value || disabled) {
      return;
    }

    setMessage("");
    await onSendMessage(value);
  };

  return (
    <div className="chat-composer">
      <TextArea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onPressEnter={(event) => {
          if (!event.shiftKey) {
            event.preventDefault();
            void handleSend();
          }
        }}
        autoSize={{ minRows: 1, maxRows: 6 }}
        placeholder="Ask anything..."
        disabled={disabled}
      />

      <Button
        type="primary"
        icon={<SendOutlined />}
        size="large"
        onClick={() => void handleSend()}
        disabled={!message.trim() || disabled}
        loading={disabled}
      >
        Send
      </Button>
    </div>
  );
}

export type SendMessageResponse = {
  message: string;
  response: string;
};

export type ChatSummary = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type ChatMessageResponse = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export async function sendMessage(
  message: string,
  chatId?: string,
): Promise<SendMessageResponse> {
  const response = await fetch("http://localhost:4000/chats", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      ...(chatId && { chatId }),
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.status}`);
  }

  return response.json() as Promise<SendMessageResponse>;
}

export async function getChats(): Promise<ChatSummary[]> {
  const response = await fetch("http://localhost:4000/chats");

  if (!response.ok) {
    throw new Error(`Failed to fetch chats: ${response.status}`);
  }

  const data = (await response.json()) as {
    chats: ChatSummary[];
  };

  return data.chats;
}

export async function getChatMessages(
  chatId: string,
): Promise<ChatMessageResponse[]> {
  const response = await fetch(
    `http://localhost:4000/chats/${chatId}/messages`,
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch chat messages: ${response.status}`,
    );
  }

  const data = (await response.json()) as {
    messages: ChatMessageResponse[];
  };

  return data.messages;
}
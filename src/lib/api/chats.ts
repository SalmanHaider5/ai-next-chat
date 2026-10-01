export type SendMessageResponse = {
  message: string;
  response: string;
};

export async function sendMessage(
  message: string,
): Promise<SendMessageResponse> {
  const response = await fetch("http://localhost:4000/chats", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.status}`);
  }

  return response.json() as Promise<SendMessageResponse>;
}
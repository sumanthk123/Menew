export interface ChatResponseData {
  conversation_id: string;
  response: string;
}

export const sendChatMessage = async (
  message: string,
  conversationId?: string
): Promise<ChatResponseData> => {
  try {
    const response = await fetch("https://server-for-startup.vercel.app/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        conversation_id: conversationId, // optional
      }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: ChatResponseData = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
};

export const listConversations = async (): Promise<string[]> => {
  try {
    const response = await fetch(
      "https://server-for-startup.vercel.app/conversations"
    );
    if (!response.ok) {
      throw new Error("Failed to list conversations");
    }
    const data = await response.json();
    return data; // array of strings
  } catch (error) {
    console.error("Error listing conversations:", error);
    throw error;
  }
};

export interface GetConversationResult {
  conversation_id: string;
  content: string;
}

export const getConversation = async (
  conversationId: string
): Promise<GetConversationResult> => {
  try {
    const response = await fetch(
      `https://server-for-startup.vercel.app/conversations/${conversationId}`
    );
    if (!response.ok) {
      throw new Error("Failed to get conversation");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching conversation:", error);
    throw error;
  }
};

export const deleteConversation = async (
  conversationId: string
): Promise<void> => {
  try {
    const response = await fetch(
      `https://server-for-startup.vercel.app/conversations/${conversationId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to delete conversation");
    }
  } catch (error) {
    console.error("Error deleting conversation:", error);
    throw error;
  }
};

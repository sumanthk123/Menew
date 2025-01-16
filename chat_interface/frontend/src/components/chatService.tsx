// chatService.ts
export interface ChatResponseData {
  conversation_id: string;
  response: string;
}

// This now expects a `userId`
export const sendChatMessage = async (
  message: string,
  conversationId: string | undefined,
  userId: string
): Promise<ChatResponseData> => {
  try {
    const response = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        conversation_id: conversationId,
        user_id: userId, // Include user ID
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

export const listConversations = async (userId: string): Promise<string[]> => {
  try {
    // Include the user ID in query params
    const response = await fetch(
      `http://localhost:5000/conversations?user_id=${encodeURIComponent(
        userId
      )}`
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
  conversationId: string,
  userId: string
): Promise<GetConversationResult> => {
  try {
    // Include the user ID in query params
    const response = await fetch(
      `http://localhost:5000/conversations/${conversationId}?user_id=${encodeURIComponent(
        userId
      )}`
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
  conversationId: string,
  userId: string
): Promise<void> => {
  try {
    // Include the user ID in query params
    const response = await fetch(
      `http://localhost:5000/conversations/${conversationId}?user_id=${encodeURIComponent(
        userId
      )}`,
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

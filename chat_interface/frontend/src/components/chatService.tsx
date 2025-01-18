export interface ChatResponseData {
  conversation_id: number;
  response: string;
}

export interface ConversationMeta {
  id: number;
  title: string;
}


export async function fetchKeywordMatches(userId: string) {
  const response = await fetch(`http://localhost:5000/keywords?user_id=${encodeURIComponent(
        userId
      )}`);
  // const response = await fetch(`https://server-for-startup.vercel.app/keywords?user_id=${encodeURIComponent(
  //       userId
  //     )}`);
  if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch keyword matches');
  }
  return response.json();
}

export const sendChatMessage = async (
  message: string,
  conversationId: number | undefined,
  userId: string
): Promise<ChatResponseData> => {
  try {
    const response = await fetch("http://localhost:5000/chat", {
    // const response = await fetch("https://server-for-startup.vercel.app/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        conversation_id: conversationId,
        user_id: userId,
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

export const listConversations = async (
  userId: string
): Promise<ConversationMeta[]> => {
  try {
    const response = await fetch(
      `http://localhost:5000/conversations?user_id=${encodeURIComponent(
        userId
      )}`
    );
    // const response = await fetch(
    //   `https://server-for-startup.vercel.app/conversations?user_id=${encodeURIComponent(
    //     userId
    //   )}`
    // );
    if (!response.ok) {
      throw new Error("Failed to list conversations");
    }
    const data: ConversationMeta[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error listing conversations:", error);
    throw error;
  }
};

export interface GetConversationResult {
  conversation_id: number;
  content: string;
  title: string;
}

export const getConversation = async (
  conversationId: number,
  userId: string
): Promise<GetConversationResult> => {
  try {
    const response = await fetch(
      `http://localhost:5000/conversations/${conversationId}?user_id=${encodeURIComponent(
        userId
      )}`
    );
    // const response = await fetch(
    //   `https://server-for-startup.vercel.app/conversations/${conversationId}?user_id=${encodeURIComponent(
    //     userId
    //   )}`
    // );
    if (!response.ok) {
      throw new Error("Failed to get conversation");
    }
    const data: GetConversationResult = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching conversation:", error);
    throw error;
  }
};

export const deleteConversation = async (
  conversationId: number,
  userId: string
): Promise<void> => {
  try {
    const response = await fetch(
      `http://localhost:5000/conversations/${conversationId}?user_id=${encodeURIComponent(
        userId
      )}`,
      {
        method: "DELETE",
      }
    );
    // const response = await fetch(
    //   `https://server-for-startup.vercel.app/conversations/${conversationId}?user_id=${encodeURIComponent(
    //     userId
    //   )}`,
    //   {
    //     method: "DELETE",
    //   }
    // );
    if (!response.ok) {
      throw new Error("Failed to delete conversation");
    }
  } catch (error) {
    console.error("Error deleting conversation:", error);
    throw error;
  }
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${input}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init && init.headers),
    },
    ...init,
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // ignore
  }

  if (!res.ok) {
    const err = (data || {}) as { message?: string };
    throw new Error(err.message || "Request failed");
  }

  return data as T;
}

export interface ChatUser {
  _id: string;
  userName: string;
  email: string;
  profilePic?: string;
}

export interface ChatMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export async function getUsersForSidebar() {
  return request<ChatUser[]>("/api/messages/users", {
    method: "GET",
  });
}

export async function getMessages(conversationUserId: string) {
  return request<ChatMessage[]>(`/api/messages/${conversationUserId}`, {
    method: "GET",
  });
}

export async function sendMessage(
  receiverId: string,
  payload: { text?: string; image?: string }
) {
  return request<ChatMessage>(`/api/messages/send/${receiverId}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}


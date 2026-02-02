const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

interface ApiError {
  message?: string;
}

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
    const err = (data || {}) as ApiError;
    throw new Error(err.message || "Request failed");
  }

  return data as T;
}

export interface AuthUser {
  _id: string;
  userName: string;
  email: string;
  profilePic?: string;
}

export async function signup(userName: string, email: string, password: string) {
  return request<AuthUser>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ userName, email, password }),
  });
}

export async function login(email: string, password: string) {
  return request<AuthUser>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logout() {
  return request<{ message: string }>("/api/auth/logout", {
    method: "POST",
  });
}

export async function checkAuth() {
  return request<AuthUser>("/api/auth/check", {
    method: "GET",
  });
}


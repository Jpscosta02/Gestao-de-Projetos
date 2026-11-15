import type { User } from '../types/user';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface LoginData {
    email: string;
    password: string;
}

export async function getCsrfCookie(): Promise<void> {
  const response = await fetch("/sanctum/csrf-cookie", {
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Não foi possível inicializar a sessão.");
  }
}

function getXsrfToken(): string {
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith("XSRF-TOKEN="));

  if (!cookie) {
    throw new Error("Token CSRF não encontrado.");
  }

  return decodeURIComponent(cookie.substring("XSRF-TOKEN=".length));
}

export async function register(
    data: RegisterData
): Promise<AuthResponse> {
    await getCsrfCookie();

    const response = await fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-XSRF-TOKEN": getXsrfToken(),
        },
        body: JSON.stringify(data),
        credentials: "include",
    });

    if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
        errorData.message || "Não foi possível registar o utilizador."
    );
}

    return response.json();
}

export async function login(
    data: LoginData
): Promise<AuthResponse> {
    await getCsrfCookie();

    const response = await fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-XSRF-TOKEN": getXsrfToken(),
        },
        body: JSON.stringify(data),
        credentials: "include",
    });

    if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
            errorData.message || "Não foi possível fazer login."
        );
    }

    return response.json();
}   

export async function logout(): Promise<void> {
    const response = await fetch("/logout", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "X-XSRF-TOKEN": getXsrfToken(),
        },
        credentials: "include",
    });

    if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
            errorData.message || "Não foi possível fazer logout."
        );
    }
}

export async function getCurrentUser(): Promise<User | null> {
    const response = await fetch("/api/user", {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (response.status === 401) {
        return null;
    }

    if (!response.ok) {
        throw new Error("Não foi possível obter o utilizador autenticado.");
    }

    const data: { user: User } = await response.json();

    return data.user;
}
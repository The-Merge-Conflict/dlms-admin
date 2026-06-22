// src/lib/api/auth.ts
import Cookies from "js-cookie";
import apiClient from "./axios-client";
import { AuthResponseDto, LoginCommand, RegisterCommand } from "@/types/auth";

export const authApi = {
  login: async (command: LoginCommand): Promise<AuthResponseDto> => {
    const { data } = await apiClient.post<AuthResponseDto>(
      "/auth/login",
      command,
    );
    return data;
  },
  register: async (command: RegisterCommand): Promise<AuthResponseDto> => {
    const { data } = await apiClient.post<AuthResponseDto>(
      "/auth/register",
      command,
    );
    return data;
  },
};

// Logs in, and on success stores the JWT in the `dlms_token` cookie so that
// axios-client.ts can attach it as `Authorization: Bearer <token>` on every
// subsequent request. Without this the backend's [Authorize] endpoints would
// all return 401 right after a "successful" login.
export async function login(command: LoginCommand): Promise<AuthResponseDto> {
  const data = await authApi.login(command);
  if (data.succeeded && data.token) {
    // expires in 1 day; matches the backend Jwt:ExpireMinutes ballpark.
    Cookies.set("dlms_token", data.token, { expires: 1, sameSite: "lax" });
  }
  return data;
}

// Clears the auth cookie and sends the user back to the login screen.
// Mirrors the 401 handling in axios-client.ts (same cookie name, same redirect).
// The backend uses a stateless JWT, so there's no server-side logout call to make.
export function logout(): void {
  Cookies.remove("dlms_token");
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

export function saveToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
}

export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

export function removeToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}

export function isLoggedIn(): boolean {
  if (typeof window !== "undefined") {
    return !!getToken();
  }
  return false;
}

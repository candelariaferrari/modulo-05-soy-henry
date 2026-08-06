export type AuthState = {
  status: "anonymous" | "authenticated";
  userId?: string;
  email?: string;
};
export interface User {
   id: string;
   username: string;
   name: string;
   email: string;
   phone: string | null;
   country: string | null;
   field_of_study: string | null;
   role: string;
   created_at: string;
   oauth_provider?: string;
}

export type UserUpdate = Partial<
   Omit<User, "id" | "role" | "created_at" | "oauth_provider">
>;

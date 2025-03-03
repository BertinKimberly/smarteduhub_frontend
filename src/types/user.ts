export interface User {
   id: string;
   name: string;
   email: string;
   role: string;
   username?: string;
   phone?: string;
   country?: string;
   field_of_study?: string;
}

export interface UserUpdate {
   username?: string;
   name?: string;
   email?: string;
   phone?: string;
   country?: string;
   field_of_study?: string;
   password?: string;
   role?: string;
   is_active?: boolean;
}

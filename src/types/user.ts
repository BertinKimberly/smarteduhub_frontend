export interface User {
   id?: string;
   name?: string;
   email: string;
   username?: string;
   phone?: string;
   country?: string;
   field_of_study?: string;
   role?: string;
   created_at?: string;
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

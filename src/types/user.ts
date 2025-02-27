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
   name?: string;
   email?: string;
   password?: string;
   role?: string;
   username?: string;
   phone?: string;
   country?: string;
   field_of_study?: string;
}

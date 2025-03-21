export interface Notification {
   id: string;
   title: string;
   message: string;
   type: string;
   read: boolean;
   created_at: string;
   user_id: string;
   related_id?: string;
}

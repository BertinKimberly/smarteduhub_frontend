import { create } from "zustand";

interface NotificationStore {
   isDrawerOpen: boolean;
   toggleDrawer: () => void;
   closeDrawer: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
   isDrawerOpen: false,
   toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
   closeDrawer: () => set({ isDrawerOpen: false }),
}));

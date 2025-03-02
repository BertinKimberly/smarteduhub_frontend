// NotificationsDrawer.tsx
"use client";

import React from "react";
import { X, Check, Clock, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "warning" | "success" | "error";
}

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
}

const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
}) => {
  const router = useRouter();

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case "success":
        return <Check className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="notifications-drawer"
          className="absolute right-0 top-16 mt-2 mr-4 sm:mr-6 lg:mr-8 bg-white rounded-lg shadow-lg border border-gray-200 w-full max-w-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-medium">Notifications</h3>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-8"
                onClick={onMarkAllAsRead}
              >
                Mark all as read
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    !notification.read ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-start justify-between">
                        <p
                          className={`text-sm font-medium ${
                            !notification.read ? "text-black" : "text-gray-700"
                          }`}
                        >
                          {notification.title}
                        </p>
                        <div className="flex-shrink-0 flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => onMarkAsRead(notification.id)}
                          >
                            {!notification.read && (
                              <Check className="h-3 w-3 text-blue-500" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => onDelete(notification.id)}
                          >
                            <X className="h-3 w-3 text-gray-500" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {notification.time}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t border-gray-100 text-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-800 text-sm"
              onClick={() => router.push("/notifications")}
            >
              View all notifications
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationsDrawer;
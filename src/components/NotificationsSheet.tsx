import React from "react";
import {
   Bell,
   Check,
   Clock,
   AlertTriangle,
   Info,
   CheckCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTitle,
} from "@/components/ui/sheet";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface NotificationsSheetProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
}

const NotificationsSheet: React.FC<NotificationsSheetProps> = ({
   open,
   onOpenChange,
}) => {
   const { notifications, markAsRead, markAllAsRead } = useNotifications();

   const getNotificationIcon = (type: string) => {
      switch (type) {
         case "course_created":
            return <Info className="h-4 w-4 text-blue-500" />;
         case "assignment_submitted":
            return <AlertTriangle className="h-4 w-4 text-amber-500" />;
         case "assignment_graded":
            return <Check className="h-4 w-4 text-green-500" />;
         default:
            return <Bell className="h-4 w-4 text-gray-500" />;
      }
   };

   const handleMarkAllAsRead = () => {
      markAllAsRead.mutate();
   };

   return (
      <Sheet
         open={open}
         onOpenChange={onOpenChange}
      >
         <SheetContent className="w-[400px] sm:w-[540px]">
            <SheetHeader className="flex flex-row items-center justify-between">
               <SheetTitle>Notifications</SheetTitle>
               <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  // @ts-ignore
                  disabled={markAllAsRead.isLoading}
               >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Mark all as read
               </Button>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
               <div className="flex flex-col gap-2">
                  {notifications?.map((notification) => (
                     <div
                        key={notification.id}
                        className={cn(
                           "p-4 rounded-lg border",
                           !notification.read
                              ? "bg-accent border-accent"
                              : "bg-background border-border"
                        )}
                     >
                        <div className="flex items-start gap-4">
                           <div className="mt-1">
                              {getNotificationIcon(notification.type)}
                           </div>
                           <div className="flex-1">
                              <div className="flex justify-between items-start">
                                 <h4 className="text-sm font-medium">
                                    {notification.title}
                                 </h4>
                                 {!notification.read && (
                                    <Button
                                       variant="ghost"
                                       size="sm"
                                       className="h-6 w-6 p-0"
                                       onClick={() =>
                                          markAsRead.mutate(notification.id)
                                       }
                                    >
                                       <Check className="h-3 w-3" />
                                    </Button>
                                 )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                 {notification.message}
                              </p>
                              <div className="flex items-center mt-2 text-xs text-muted-foreground">
                                 <Clock className="h-3 w-3 mr-1" />
                                 {format(
                                    new Date(notification.created_at),
                                    "PPp"
                                 )}
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </ScrollArea>
         </SheetContent>
      </Sheet>
   );
};

export default NotificationsSheet;

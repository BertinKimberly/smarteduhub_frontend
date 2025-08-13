import React from "react";
import { Bell, CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DashboardNavbar from "@/components/DashboardNavbar";

const AdminNotifications = () => {
   const notifications = [
      {
         id: 1,
         type: "success",
         title: "Payment Processed",
         message: "Successfully processed payment for order #12345",
         time: "2 minutes ago",
         read: false,
      },
      {
         id: 2,
         type: "warning",
         title: "Storage Warning",
         message: "Server storage capacity reaching 90%",
         time: "1 hour ago",
         read: false,
      },
      {
         id: 3,
         type: "error",
         title: "Failed Login Attempt",
         message: "Multiple failed login attempts detected from IP 192.168.1.1",
         time: "2 hours ago",
         read: true,
      },
      {
         id: 4,
         type: "info",
         title: "System Update",
         message: "New system update available. Please review changes.",
         time: "3 hours ago",
         read: true,
      },
   ];

   const getIcon = (type: string) => {
      switch (type) {
         case "success":
            return <CheckCircle className="h-5 w-5 text-green-500" />;
         case "warning":
            return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
         case "error":
            return <XCircle className="h-5 w-5 text-red-500" />;
         case "info":
            return <Info className="h-5 w-5 text-blue-500" />;
         default:
            return <Bell className="h-5 w-5 text-gray-500" />;
      }
   };

   const getColor = (type: string) => {
      switch (type) {
         case "success":
            return "bg-green-50 border-green-200";
         case "warning":
            return "bg-yellow-50 border-yellow-200";
         case "error":
            return "bg-red-50 border-red-200";
         case "info":
            return "bg-blue-50 border-blue-200";
         default:
            return "bg-gray-50 border-gray-200";
      }
   };

   return (
      <>
         <DashboardNavbar title="Notifications" />
         <div className="p-6 w-full">
            <div className="flex justify-between items-center mb-6">
               <div>
                  
                  <p className="text-gray-600">
                     Stay updated with the latest alerts
                  </p>
               </div>
               <div className="flex gap-4">
                  <Button variant="outline">Mark all as read</Button>
                  <Button>
                     <Bell className="h-4 w-4 mr-2" />
                     <Badge className="ml-1">4</Badge>
                  </Button>
               </div>
            </div>

            <Card>
               <CardHeader>
                  <CardTitle>Recent Notifications</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-4">
                     {notifications.map((notification) => (
                        <div
                           key={notification.id}
                           className={`p-4 border rounded-lg flex items-start gap-4 ${getColor(
                              notification.type
                           )} ${notification.read ? "opacity-60" : ""}`}
                        >
                           {getIcon(notification.type)}
                           <div className="flex-1">
                              <div className="flex justify-between items-start">
                                 <h3 className="font-semibold">
                                    {notification.title}
                                 </h3>
                                 <span className="text-sm text-gray-500">
                                    {notification.time}
                                 </span>
                              </div>
                              <p className="text-gray-600 mt-1">
                                 {notification.message}
                              </p>
                           </div>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>
         </div>
      </>
   );
};

export default AdminNotifications;

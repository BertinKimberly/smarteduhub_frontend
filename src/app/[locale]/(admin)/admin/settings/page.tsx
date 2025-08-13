"use client";
import React, { useState } from "react";
import {
   Settings,
   Users,
   Book,
   Bell,
   Shield,
   Database,
   Globe,
   Palette,
   Mail,
   Lock,
   ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import DashboardNavbar from "@/components/DashboardNavbar";

const AdminSettings = () => {
   const [emailNotifications, setEmailNotifications] = useState(true);
   const [aiFeatures, setAiFeatures] = useState(true);
   const [autoGrading, setAutoGrading] = useState(true);
   const [parentAccess, setParentAccess] = useState(true);

   return (
      <>
         <DashboardNavbar title="Settings" />
         <div className="p-6 w-full">
            <div className="mb-6">
               <h3 className=" font-bold">Platform Settings</h3>
               <p className="text-gray-600">
                  Manage your Smart Eduhub platform configurations
               </p>
            </div>

            <Tabs
               defaultValue="general"
               className="space-y-4"
            >
               <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-background p-2 rounded-lg h-fit">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="users">Users & Access</TabsTrigger>
                  <TabsTrigger value="content">Learning Content</TabsTrigger>
                  <TabsTrigger value="ai">AI & Analytics</TabsTrigger>
               </TabsList>

               <TabsContent value="general">
                  <div className="grid gap-4 md:grid-cols-2">
                     <Card>
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2">
                              <Globe className="h-5 w-5" />
                              Platform Settings
                           </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div className="flex justify-between items-center">
                              <div>
                                 <h4 className="font-medium">Platform Name</h4>
                                 <p className="text-sm text-gray-500">
                                    Your platform&apos;s display name
                                 </p>
                              </div>
                              <Input
                                 className="w-48"
                                 defaultValue="Smart Eduhub"
                              />
                           </div>
                           <div className="flex justify-between items-center">
                              <div>
                                 <h3 className="font-medium">Time Zone</h3>
                                 <p className="text-sm text-gray-500">
                                    Default platform timezone
                                 </p>
                              </div>
                              <Select defaultValue="UTC">
                                 <SelectTrigger className="w-48">
                                    <SelectValue />
                                 </SelectTrigger>
                                 <SelectContent>
                                    <SelectItem value="UTC">UTC</SelectItem>
                                    <SelectItem value="EST">EST</SelectItem>
                                    <SelectItem value="PST">PST</SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>
                        </CardContent>
                     </Card>

                     <Card>
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2">
                              <Bell className="h-5 w-5" />
                              Notifications
                           </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div className="flex justify-between items-center">
                              <div>
                                 <h3 className="font-medium">
                                    Email Notifications
                                 </h3>
                                 <p className="text-sm text-gray-500">
                                    Send email updates to users
                                 </p>
                              </div>
                              <Switch
                                 checked={emailNotifications}
                                 onCheckedChange={setEmailNotifications}
                              />
                           </div>
                           <div className="flex justify-between items-center">
                              <div>
                                 <h3 className="font-medium">Parent Access</h3>
                                 <p className="text-sm text-gray-500">
                                    Allow parent account creation
                                 </p>
                              </div>
                              <Switch
                                 checked={parentAccess}
                                 onCheckedChange={setParentAccess}
                              />
                           </div>
                        </CardContent>
                     </Card>
                  </div>
               </TabsContent>

               <TabsContent value="users">
                  <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Users className="h-5 w-5" />
                           User Management Settings
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                           <div className="space-y-2">
                              <h3 className="font-medium">
                                 Default User Roles
                              </h3>
                              <Select defaultValue="student">
                                 <SelectTrigger>
                                    <SelectValue />
                                 </SelectTrigger>
                                 <SelectContent>
                                    <SelectItem value="student">
                                       Student
                                    </SelectItem>
                                    <SelectItem value="teacher">
                                       Teacher
                                    </SelectItem>
                                    <SelectItem value="parent">
                                       Parent
                                    </SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>
                           <div className="space-y-2">
                              <h3 className="font-medium">User Registration</h3>
                              <Select defaultValue="approval">
                                 <SelectTrigger>
                                    <SelectValue />
                                 </SelectTrigger>
                                 <SelectContent>
                                    <SelectItem value="open">
                                       Open Registration
                                    </SelectItem>
                                    <SelectItem value="approval">
                                       Require Approval
                                    </SelectItem>
                                    <SelectItem value="closed">
                                       Closed
                                    </SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               </TabsContent>

               <TabsContent value="content">
                  <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Book className="h-5 w-5" />
                           Learning Content Settings
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                           <div className="flex justify-between items-center">
                              <div>
                                 <h3 className="font-medium">Auto-Grading</h3>
                                 <p className="text-sm text-gray-500">
                                    Enable automatic assignment grading
                                 </p>
                              </div>
                              <Switch
                                 checked={autoGrading}
                                 onCheckedChange={setAutoGrading}
                              />
                           </div>
                           <div className="space-y-2">
                              <h3 className="font-medium">Content Language</h3>
                              <Select defaultValue="en">
                                 <SelectTrigger>
                                    <SelectValue />
                                 </SelectTrigger>
                                 <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="es">Spanish</SelectItem>
                                    <SelectItem value="fr">French</SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               </TabsContent>

               <TabsContent value="ai">
                  <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Database className="h-5 w-5" />
                           AI & Analytics Configuration
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                           <div className="flex justify-between items-center">
                              <div>
                                 <h3 className="font-medium">AI Features</h3>
                                 <p className="text-sm text-gray-500">
                                    Enable AI-powered learning assistance
                                 </p>
                              </div>
                              <Switch
                                 checked={aiFeatures}
                                 onCheckedChange={setAiFeatures}
                              />
                           </div>
                           <div className="space-y-2">
                              <h3 className="font-medium">Analytics Level</h3>
                              <Select defaultValue="advanced">
                                 <SelectTrigger>
                                    <SelectValue />
                                 </SelectTrigger>
                                 <SelectContent>
                                    <SelectItem value="basic">Basic</SelectItem>
                                    <SelectItem value="advanced">
                                       Advanced
                                    </SelectItem>
                                    <SelectItem value="premium">
                                       Premium
                                    </SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               </TabsContent>
            </Tabs>

            <div className="mt-6 flex justify-end gap-4">
               <Button variant="outline">Cancel</Button>
               <Button className="bg-main">Save Changes</Button>
            </div>
         </div>
      </>
   );
};

export default AdminSettings;

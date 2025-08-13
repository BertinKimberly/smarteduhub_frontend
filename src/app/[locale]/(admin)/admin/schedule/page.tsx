"use client";

import React, { useState, useEffect } from "react";
import DashboardNavbar from "@/components/DashboardNavbar";
import {
   CalendarEvent,
   useCalendar,
} from "@/components/ui/full-calendar";
import {
   Event,
   EventCreateData,
   useCreateEvent,
   useDeleteEvent,
   useFetchEvents,
   useUpdateEvent,
} from "@/hooks/useEvents";
import { useFetchUsers } from "@/hooks/useUsers";
import {
   Trash2,
   Edit2,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import {
   Card,
   CardContent,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import CalendarPage from "@/components/calendar/CalenderPage";

// Color options for events

// Event form component for creating and editing events

// Event details component

const AdminSchedule = () => {
   // Fetch events and users from the API
   const { data: apiEvents } = useFetchEvents();
   const { data: users } = useFetchUsers();
   const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
   const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [dialogMode, setDialogMode] = useState<"create" | "view" | "edit">(
      "create"
   );
   const { date } = useCalendar();
   const [filteredUserId, setFilteredUserId] = useState<string | null>(null);

   // Mutations for event operations

   // Convert API events to calendar events
   useEffect(() => {
      if (apiEvents) {
         let eventsToShow = apiEvents;

         // Filter events by user if a filter is applied
         if (filteredUserId) {
            eventsToShow = apiEvents.filter(
               (event) => event.user_id === filteredUserId
            );
         }

         const events: CalendarEvent[] = eventsToShow.map((event) => ({
            id: event.id,
            title: event.title,
            start: new Date(event.start_time),
            end: new Date(event.end_time),
            color: event.color as any,
         }));
         setCalendarEvents(events);
      }
   }, [apiEvents, filteredUserId]);

   // Stats cards
   const totalEvents = apiEvents?.length || 0;
   const filteredEvents = filteredUserId
      ? apiEvents?.filter((e) => e.user_id === filteredUserId).length || 0
      : totalEvents;
   const upcomingEvents = apiEvents
      ? apiEvents.filter((e) => new Date(e.start_time) > new Date()).length
      : 0;

   return (
      <div className="p-3">
         <DashboardNavbar title="Schedule Management" />

         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            <Card>
               <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                     Total Events
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">{totalEvents}</div>
               </CardContent>
            </Card>

            <Card>
               <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                     {filteredUserId ? "Filtered Events" : "All Events"}
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">{filteredEvents}</div>
               </CardContent>
            </Card>

            <Card>
               <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                     Upcoming Events
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">{upcomingEvents}</div>
               </CardContent>
            </Card>
         </div>
     <CalendarPage/>
      </div>
   );
};

export default AdminSchedule;

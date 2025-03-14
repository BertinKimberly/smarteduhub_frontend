"use client";

import React, { useState, useEffect } from "react";
import DashboardNavbar from "@/components/DashboardNavbar";
import {
   Calendar,
   CalendarCurrentDate,
   CalendarDayView,
   CalendarEvent,
   CalendarMonthView,
   CalendarNextTrigger,
   CalendarPrevTrigger,
   CalendarTodayTrigger,
   CalendarViewTrigger,
   CalendarWeekView,
   CalendarYearView,
   useCalendar,
} from "@/components/ui/full-calendar";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
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
   ChevronLeft,
   ChevronRight,
   Plus,
   Trash2,
   Edit2,
   Filter,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Color options for events
const colorOptions = [
   { value: "blue", label: "Blue" },
   { value: "green", label: "Green" },
   { value: "red", label: "Red" },
   { value: "yellow", label: "Yellow" },
   { value: "purple", label: "Purple" },
   { value: "pink", label: "Pink" },
];

// Event form component for creating and editing events
const EventForm = ({
   event,
   users,
   onSubmit,
   onDelete,
   onCancel,
   isNew = false,
   isAdmin = false,
}: {
   event?: Partial<Event>;
   users?: { id: string; name: string }[];
   onSubmit: (data: EventCreateData & { user_id?: string }) => void;
   onDelete?: () => void;
   onCancel: () => void;
   isNew?: boolean;
   isAdmin?: boolean;
}) => {
   const [title, setTitle] = useState(event?.title || "");
   const [startTime, setStartTime] = useState(
      event?.start_time
         ? format(new Date(event.start_time), "yyyy-MM-dd'T'HH:mm")
         : format(new Date(), "yyyy-MM-dd'T'HH:mm")
   );
   const [endTime, setEndTime] = useState(
      event?.end_time
         ? format(new Date(event.end_time), "yyyy-MM-dd'T'HH:mm")
         : format(
              new Date(new Date().getTime() + 60 * 60 * 1000),
              "yyyy-MM-dd'T'HH:mm"
           )
   );
   const [color, setColor] = useState(event?.color || "blue");
   const [description, setDescription] = useState(event?.description || "");
   const [userId, setUserId] = useState(event?.user_id || "");

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (!title.trim()) {
         toast.error("Title is required");
         return;
      }

      if (new Date(startTime) >= new Date(endTime)) {
         toast.error("End time must be after start time");
         return;
      }

      if (isAdmin && !userId && isNew) {
         toast.error("User is required");
         return;
      }

      const formData: EventCreateData & { user_id?: string } = {
         title,
         start_time: startTime,
         end_time: endTime,
         color,
         description,
      };

      // Only include user_id if admin is creating a new event
      if (isAdmin && isNew) {
         formData.user_id = userId;
      }

      onSubmit(formData);
   };

   return (
      <form
         onSubmit={handleSubmit}
         className="space-y-4"
      >
         <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
               id="title"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               placeholder="Event title"
               required
            />
         </div>

         {isAdmin && isNew && users && (
            <div className="space-y-2">
               <Label htmlFor="user">User</Label>
               <Select
                  value={userId}
                  onValueChange={setUserId}
               >
                  <SelectTrigger>
                     <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                     {users.map((user) => (
                        <SelectItem
                           key={user.id}
                           value={user.id}
                        >
                           {user.name}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>
         )}

         <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
               <Label htmlFor="start-time">Start Time</Label>
               <Input
                  id="start-time"
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
               />
            </div>

            <div className="space-y-2">
               <Label htmlFor="end-time">End Time</Label>
               <Input
                  id="end-time"
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
               />
            </div>
         </div>

         <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Select
               value={color}
               onValueChange={setColor}
            >
               <SelectTrigger>
                  <SelectValue placeholder="Select a color" />
               </SelectTrigger>
               <SelectContent>
                  {colorOptions.map((option) => (
                     <SelectItem
                        key={option.value}
                        value={option.value}
                     >
                        <div className="flex items-center gap-2">
                           <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: option.value }}
                           />
                           {option.label}
                        </div>
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>
         </div>

         <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
               id="description"
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               placeholder="Event description"
               rows={3}
            />
         </div>

         <DialogFooter className="gap-2 sm:gap-0">
            {!isNew && onDelete && (
               <Button
                  type="button"
                  variant="destructive"
                  onClick={onDelete}
                  className="mr-auto"
               >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
               </Button>
            )}
            <Button
               type="button"
               variant="outline"
               onClick={onCancel}
            >
               Cancel
            </Button>
            <Button type="submit">
               {isNew ? "Create Event" : "Update Event"}
            </Button>
         </DialogFooter>
      </form>
   );
};

// Event details component
const EventDetails = ({
   event,
   userName,
   onEdit,
   onClose,
}: {
   event: Event;
   userName?: string;
   onEdit: () => void;
   onClose: () => void;
}) => {
   return (
      <div className="space-y-4">
         <div>
            <h3 className="text-lg font-semibold">{event.title}</h3>
            <div className="text-sm text-muted-foreground mt-1">
               {format(new Date(event.start_time), "PPP")} at{" "}
               {format(new Date(event.start_time), "p")} -{" "}
               {format(new Date(event.end_time), "p")}
            </div>
            {userName && (
               <div className="text-sm font-medium mt-1">User: {userName}</div>
            )}
         </div>

         {event.description && (
            <div className="text-sm mt-2">
               <p>{event.description}</p>
            </div>
         )}

         <DialogFooter className="gap-2 sm:gap-0">
            <Button
               type="button"
               variant="outline"
               onClick={onEdit}
               className="mr-auto"
            >
               <Edit2 className="w-4 h-4 mr-2" />
               Edit
            </Button>
            <Button
               type="button"
               onClick={onClose}
            >
               Close
            </Button>
         </DialogFooter>
      </div>
   );
};

const AdminSchedule = () => {
   // Fetch events and users from the API
   const { data: apiEvents, isLoading } = useFetchEvents();
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
   const createEventMutation = useCreateEvent();
   const updateEventMutation = useUpdateEvent();
   const deleteEventMutation = useDeleteEvent();

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

   // Get user name by ID
   const getUserName = (userId: string) => {
      const user = users?.find((u) => u.id === userId);
      return user ? user.name : "Unknown User";
   };

   // Handle event click
   const handleEventClick = (calEvent: CalendarEvent) => {
      const apiEvent = apiEvents?.find((e) => e.id === calEvent.id);
      if (apiEvent) {
         setSelectedEvent(apiEvent);
         setDialogMode("view");
         setIsDialogOpen(true);
      }
   };

   // Handle create new event
   const handleCreateEvent = () => {
      setSelectedEvent({
         id: "",
         title: "",
         start_time: format(date, "yyyy-MM-dd'T'HH:mm"),
         end_time: format(
            new Date(date.getTime() + 60 * 60 * 1000),
            "yyyy-MM-dd'T'HH:mm"
         ),
         user_id: filteredUserId || "",
      });
      setDialogMode("create");
      setIsDialogOpen(true);
   };

   // Handle edit event
   const handleEditEvent = () => {
      setDialogMode("edit");
   };

   // Handle submit event (create or update)
   const handleSubmitEvent = (
      formData: EventCreateData & { user_id?: string }
   ) => {
      if (dialogMode === "create") {
         createEventMutation.mutate(formData as EventCreateData, {
            onSuccess: () => {
               setIsDialogOpen(false);
            },
         });
      } else if (dialogMode === "edit" && selectedEvent) {
         updateEventMutation.mutate(
            {
               eventId: selectedEvent.id,
               formData,
            },
            {
               onSuccess: () => {
                  setIsDialogOpen(false);
               },
            }
         );
      }
   };

   // Handle delete event
   const handleDeleteEvent = () => {
      if (selectedEvent) {
         deleteEventMutation.mutate(selectedEvent.id, {
            onSuccess: () => {
               setIsDialogOpen(false);
            },
         });
      }
   };

   // Close dialog
   const handleCloseDialog = () => {
      setIsDialogOpen(false);
   };

   // Handle filter change
   const handleFilterChange = (userId: string | null) => {
      setFilteredUserId(userId);
   };

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

         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

         <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Calendar</h1>
            <div className="flex gap-2">
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="outline">
                        <Filter className="w-4 h-4 mr-2" />
                        {filteredUserId
                           ? `Filtered: ${getUserName(filteredUserId)}`
                           : "All Users"}
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     <DropdownMenuLabel>Filter by User</DropdownMenuLabel>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem onClick={() => handleFilterChange(null)}>
                        All Users
                     </DropdownMenuItem>
                     {users?.map((user) => (
                        <DropdownMenuItem
                           key={user.id}
                           onClick={() => handleFilterChange(user.id)}
                        >
                           {user.name}
                        </DropdownMenuItem>
                     ))}
                  </DropdownMenuContent>
               </DropdownMenu>

               <Button onClick={handleCreateEvent}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Event
               </Button>
            </div>
         </div>

         <Calendar
            events={calendarEvents}
            onEventClick={handleEventClick}
         >
            <div className="h-dvh py-4 flex flex-col">
               <div className="flex px-6 items-center gap-2 mb-6">
                  <CalendarViewTrigger
                     className="aria-[current=true]:bg-[#D4E8F6]"
                     view="day"
                  >
                     Day
                  </CalendarViewTrigger>
                  <CalendarViewTrigger
                     view="week"
                     className="aria-[current=true]:bg-[#D4E8F6]"
                  >
                     Week
                  </CalendarViewTrigger>
                  <CalendarViewTrigger
                     view="month"
                     className="aria-[current=true]:bg-[#D4E8F6]"
                  >
                     Month
                  </CalendarViewTrigger>
                  <CalendarViewTrigger
                     view="year"
                     className="aria-[current=true]:bg-[#D4E8F6]"
                  >
                     Year
                  </CalendarViewTrigger>

                  <span className="flex-1" />

                  <CalendarCurrentDate />

                  <CalendarPrevTrigger>
                     <ChevronLeft size={20} />
                     <span className="sr-only">Previous</span>
                  </CalendarPrevTrigger>

                  <CalendarTodayTrigger>Today</CalendarTodayTrigger>

                  <CalendarNextTrigger>
                     <ChevronRight size={20} />
                     <span className="sr-only">Next</span>
                  </CalendarNextTrigger>
               </div>

               <div className="flex-1 px-6 overflow-hidden">
                  <CalendarDayView />
                  <CalendarWeekView />
                  <CalendarMonthView />
                  <CalendarYearView />
               </div>
            </div>
         </Calendar>

         {/* Event Dialog */}
         <Dialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
         >
            <DialogContent className="sm:max-w-[500px]">
               <DialogHeader>
                  <DialogTitle>
                     {dialogMode === "create"
                        ? "Create New Event"
                        : dialogMode === "edit"
                        ? "Edit Event"
                        : "Event Details"}
                  </DialogTitle>
                  <DialogDescription>
                     {dialogMode === "create"
                        ? "Add a new event to the calendar."
                        : dialogMode === "edit"
                        ? "Make changes to the event."
                        : "View event details."}
                  </DialogDescription>
               </DialogHeader>

               {dialogMode === "view" && selectedEvent ? (
                  <EventDetails
                     event={selectedEvent}
                     userName={getUserName(selectedEvent.user_id)}
                     onEdit={handleEditEvent}
                     onClose={handleCloseDialog}
                  />
               ) : (
                  <EventForm
                     event={selectedEvent || undefined}
                     users={users}
                     onSubmit={handleSubmitEvent}
                     onDelete={
                        dialogMode === "edit" ? handleDeleteEvent : undefined
                     }
                     onCancel={handleCloseDialog}
                     isNew={dialogMode === "create"}
                     isAdmin={true}
                  />
               )}
            </DialogContent>
         </Dialog>
      </div>
   );
};

export default AdminSchedule;

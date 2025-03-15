"use client";
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
   DialogTrigger,
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
import { ChevronLeft, ChevronRight, Plus, Trash2, Edit2 } from "lucide-react";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { toast } from "react-toastify";

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
   onSubmit,
   onDelete,
   onCancel,
   isNew = false,
}: {
   event?: Partial<Event>;
   onSubmit: (data: EventCreateData) => void;
   onDelete?: () => void;
   onCancel: () => void;
   isNew?: boolean;
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

      onSubmit({
         title,
         start_time: startTime,
         end_time: endTime,
         color,
         description,
      });
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
   onEdit,
   onClose,
}: {
   event: Event;
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
         </div>

         {event.description && (
            <div className="text-sm">
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

export default function CalendarPage() {
   // Fetch events from the API
   const { data: apiEvents, isLoading } = useFetchEvents();
   const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
   const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [dialogMode, setDialogMode] = useState<"create" | "view" | "edit">(
      "create"
   );
   const { date } = useCalendar();

   // Mutations for event operations
   const createEventMutation = useCreateEvent();
   const updateEventMutation = useUpdateEvent();
   const deleteEventMutation = useDeleteEvent();

   // Convert API events to calendar events
   useEffect(() => {
      if (apiEvents) {
         const events: CalendarEvent[] = apiEvents.map((event) => ({
            id: event.id,
            title: event.title,
            start: new Date(event.start_time),
            end: new Date(event.end_time),
            color: event.color as any,
         }));
         setCalendarEvents(events);
      }
   }, [apiEvents]);

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
      const newEvent = {
         id: "",
         title: "",
         start_time: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
         end_time: format(
            new Date(new Date().getTime() + 60 * 60 * 1000),
            "yyyy-MM-dd'T'HH:mm"
         ),
         color: "blue",
         user_id: "",
      };
      setSelectedEvent(newEvent);
      setDialogMode("create");
      setIsDialogOpen(true);
   };

   // Handle edit event
   const handleEditEvent = () => {
      setDialogMode("edit");
   };

   // Handle submit event (create or update)
   const handleSubmitEvent = (formData: EventCreateData) => {
      if (dialogMode === "create") {
         createEventMutation.mutate(formData, {
            onSuccess: () => {
               setIsDialogOpen(false);
               toast.success("Event created successfully");
            },
            onError: (error: any) => {
               toast.error(
                  error.response?.data?.detail || "Failed to create event"
               );
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
                  toast.success("Event updated successfully");
               },
               onError: (error: any) => {
                  toast.error(
                     error.response?.data?.detail || "Failed to update event"
                  );
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


   console.log("Data nuyumunsi aracyakora",apiEvents);
   return (
      <>
         <div className="flex justify-between items-center mb-4 px-6 pt-6">
            <h1 className="text-2xl font-bold">Calendar</h1>
            <Button onClick={handleCreateEvent}>
               <Plus className="w-4 h-4 mr-2" />
               New Event
            </Button>
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
                        ? "Add a new event to your calendar."
                        : dialogMode === "edit"
                        ? "Make changes to your event."
                        : "View your event details."}
                  </DialogDescription>
               </DialogHeader>

               {dialogMode === "view" && selectedEvent ? (
                  <EventDetails
                     event={selectedEvent}
                     onEdit={handleEditEvent}
                     onClose={handleCloseDialog}
                  />
               ) : (
                  <EventForm
                     event={selectedEvent || undefined}
                     onSubmit={handleSubmitEvent}
                     onDelete={
                        dialogMode === "edit" ? handleDeleteEvent : undefined
                     }
                     onCancel={handleCloseDialog}
                     isNew={dialogMode === "create"}
                  />
               )}
            </DialogContent>
         </Dialog>
      </>
   );
}

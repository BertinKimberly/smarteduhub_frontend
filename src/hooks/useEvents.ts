import { authorizedAPI } from "@/lib/api";
import handleApiRequest from "@/utils/handleApiRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export interface Event {
   id: string;
   title: string;
   start_time: string;
   end_time: string;
   color?: string;
   description?: string;
   user_id: string;
}

export interface EventCreateData {
   title: string;
   start_time: string;
   end_time: string;
   color?: string;
   description?: string;
   user_id?: string; // Only used by admins
}

export interface EventUpdateData {
   eventId: string;
   formData: Partial<EventCreateData>;
}

interface EventError {
   message: string;
   status: number;
}

const fetchEvents = async (options?: {
   userId?: string;
   allEvents?: boolean;
}): Promise<Event[]> => {
   const { userId, allEvents } = options || {};
   const params: Record<string, string | boolean> = {};

   if (userId) params.user_id = userId;
   if (allEvents) params.all_events = true;

   try {
      return await handleApiRequest(() =>
         authorizedAPI.get("/events", { params })
      );
   } catch (error: any) {
      const message = error.response?.data?.detail || "Failed to fetch events";
      throw { message, status: error.response?.status || 500 } as EventError;
   }
};

const fetchEventById = async (eventId: string): Promise<Event> => {
   try {
      return await handleApiRequest(() =>
         authorizedAPI.get(`/events/${eventId}`)
      );
   } catch (error: any) {
      const message = error.response?.data?.detail || "Failed to fetch event";
      throw { message, status: error.response?.status || 500 } as EventError;
   }
};

const createEvent = async (eventData: EventCreateData): Promise<Event> => {
   try {
      // Format the data according to the backend schema
      const data = {
         title: eventData.title.trim(),
         start_time: new Date(eventData.start_time).toISOString(),
         end_time: new Date(eventData.end_time).toISOString(),
         color: eventData.color || undefined,
         description: eventData.description?.trim() || undefined,
      };

      console.log("Sending event data to backend:", data);
      const response = await authorizedAPI.post("/events/", data);
      return response.data;
   } catch (error: any) {
      console.error("Full error:", error);
      console.error("Error response:", error.response?.data);
      const message = error.response?.data?.detail || "Failed to create event";
      throw { message, status: error.response?.status || 500 } as EventError;
   }
};

const updateEvent = async ({
   eventId,
   formData,
}: EventUpdateData): Promise<Event> => {
   try {
      return await handleApiRequest(() =>
         authorizedAPI.put(`/events/${eventId}`, formData)
      );
   } catch (error: any) {
      const message = error.response?.data?.detail || "Failed to update event";
      throw { message, status: error.response?.status || 500 } as EventError;
   }
};

const deleteEvent = async (eventId: string): Promise<void> => {
   try {
      return await handleApiRequest(() =>
         authorizedAPI.delete(`/events/${eventId}`)
      );
   } catch (error: any) {
      const message = error.response?.data?.detail || "Failed to delete event";
      throw { message, status: error.response?.status || 500 } as EventError;
   }
};

export const useFetchEvents = (options?: {
   userId?: string;
   allEvents?: boolean;
}) => {
   return useQuery<Event[], EventError>({
      queryKey: ["events", options?.userId, options?.allEvents],
      queryFn: () => fetchEvents(options),
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchInterval: 10000, // added for realtime updates (10 seconds)
      retry: (failureCount, error) => {
         if (error.status === 404) return false;
         return failureCount < 3;
      },
   });
};

export const useEventById = (eventId: string) => {
   return useQuery<Event, EventError>({
      queryKey: ["events", eventId],
      queryFn: () => fetchEventById(eventId),
      enabled: !!eventId,
      staleTime: 1000 * 60 * 5,
      retry: (failureCount, error) => {
         if (error.status === 404) return false;
         return failureCount < 3;
      },
   });
};

export const useCreateEvent = () => {
   const queryClient = useQueryClient();

   return useMutation<Event, EventError, EventCreateData>({
      mutationFn: createEvent,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["events"] });
      },
      onError: (error) => {
         toast.error(error.message);
      },
   });
};

export const useUpdateEvent = () => {
   const queryClient = useQueryClient();

   return useMutation<Event, EventError, EventUpdateData>({
      mutationFn: updateEvent,
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: ["events"] });
         queryClient.invalidateQueries({
            queryKey: ["events", variables.eventId],
         });
      },
      onError: (error) => {
         toast.error(error.message);
      },
   });
};

export const useDeleteEvent = () => {
   const queryClient = useQueryClient();

   return useMutation<void, EventError, string>({
      mutationFn: deleteEvent,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["events"] });
      },
      onError: (error) => {
         toast.error(error.message);
      },
   });
};

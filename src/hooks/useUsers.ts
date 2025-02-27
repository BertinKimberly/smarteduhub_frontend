import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authorizedAPI, unauthorizedAPI } from "@/lib/api";
import handleApiRequest from "@/utils/handleApiRequest";


interface User {
   role: any;
   id: string;
   name: string;
   email: string;
}

interface UpdateUserData {
   userId: string;
   formData: Partial<User>;
}

const removeUser = (userId: string) => {
   return handleApiRequest(() =>
      authorizedAPI.delete(`/users/${userId}`, { withCredentials: true })
   );
};

const modifyUser = ({ userId, formData }: UpdateUserData) => {
   return handleApiRequest(() =>
      authorizedAPI.put(`/users/${userId}`, formData, {
         withCredentials: true,
      })
   );
};

const fetchUsers = () => {
   return handleApiRequest(() =>
      authorizedAPI.get("/users", { withCredentials: true })
   );
};

const fetchUserById = (userId: string) => {
    return handleApiRequest(() =>
        authorizedAPI.get(`/users/${userId}`, { withCredentials: true })
    );
}

export const useFetchUsers = () => {
   return useQuery<User[], Error>({
      queryKey: ["users-by-admin"],
      queryFn: fetchUsers,
   });
};

export const useUserById = (userId: string) => {
    return useQuery<User, Error>({
        queryKey: ["user-by-id", userId],
        queryFn: () => fetchUserById(userId),
})
}

export const useRemoveUser = () => {
   const queryClient = useQueryClient();
   return useMutation<void, Error, string>({
      mutationFn: removeUser,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["users-by-admin"] });
      },
   });
};

export const useModifyUser = () => {
   const queryClient = useQueryClient();
   return useMutation<void, Error, UpdateUserData>({
      mutationFn: modifyUser,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["users-by-admin"] });
      },
   });
};

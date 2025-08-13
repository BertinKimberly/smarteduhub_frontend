import { useQuery } from "@tanstack/react-query";
import { authorizedAPI } from "@/lib/api";
import handleApiRequest from "@/utils/handleApiRequest";

export interface Student {
    id: string;
    name: string;
    email: string;
    enrollments: {
        course: {
            id: string;
            title: string;
        };
    }[];
    grade?: string;
    last_active?: string;
}

const getStudents = (): Promise<Student[]> => {
    return handleApiRequest(() => authorizedAPI.get("/users?role=student"));
};

export const useGetStudents = () => {
    return useQuery<Student[], Error>({
        queryKey: ["students"],
        queryFn: getStudents,
    });
};

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authorizedAPI } from "@/lib/api";
import handleApiRequest from "@/utils/handleApiRequest";

interface Child {
   id: string;
   name: string;
   grade: string;
   email: string;
   age: number;
}

interface PerformanceData {
   overall_grade: string;
   attendance: string;
   subjects: Array<{
      name: string;
      grade: string;
      progress: number;
   }>;
   recent_assignments: Array<{
      title: string;
      grade: string;
      date: string;
   }>;
}

interface EnrolledCourse {
   id: string;
   title: string;
   description?: string;
   progress: number;
   grade: string;
   teacher: {
      id: string;
      name: string;
   };
}

interface ChildDetails {
   id: string;
   name: string;
   grade: string;
   email: string;
   age: number;
   attendance: any;
   performance: PerformanceData;
   enrolledCourses: EnrolledCourse[];
   recentActivity: any[];
   upcomingAssignments: any[];
   courseProgress: any[];
}

const fetchChildren = () => {
   return handleApiRequest(() =>
      authorizedAPI.get("/parent/children", { withCredentials: true })
   );
};

const fetchChildPerformance = (childId: string) => {
   return handleApiRequest(() =>
      authorizedAPI.get(`/parent/children/${childId}/performance`, {
         withCredentials: true,
      })
   );
};

const fetchChildDetails = (childId: string) => {
   return handleApiRequest(() =>
      authorizedAPI.get(`/parent/children/${childId}`, {
         withCredentials: true,
      })
   );
};

export const useChildren = () => {
   return useQuery<Child[], Error>({
      queryKey: ["parent-children"],
      queryFn: fetchChildren,
   });
};

export const useChildPerformance = (childId: string) => {
   return useQuery<PerformanceData, Error>({
      queryKey: ["child-performance", childId],
      queryFn: () => fetchChildPerformance(childId),
      enabled: !!childId,
   });
};

export const useChildDetails = (childId: string) => {
   return useQuery<ChildDetails, Error>({
      queryKey: ["child-details", childId],
      queryFn: () => fetchChildDetails(childId),
      enabled: !!childId,
   });
};

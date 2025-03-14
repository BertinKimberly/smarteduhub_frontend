"use client";
import { useAuthStore } from "@/store/useAuthStore";
import {
   Mail,
   Phone,
   MapPin,
   Calendar,
   UserCircle,
   Book,
   Activity,
} from "lucide-react";
import ProfileForm from "@/components/profile/ProfileForm";
import { useState } from "react";
import DashboardNavbar from "@/components/DashboardNavbar";
import { useProfile, useUpdateProfile } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { User } from "@/types/user";

const ProfilePage = () => {
   const { user } = useAuthStore();
   const [isEditing, setIsEditing] = useState(false);
   const { data: profileData, isLoading } = useProfile();
   const updateProfileMutation = useUpdateProfile();

   const handleUpdateProfile = async (data: Partial<User>) => {
      try {
         await updateProfileMutation.mutateAsync({
            ...data,
            // Ensure null values are sent as empty strings if they're required
            username: data?.username ?? "",
            phone: data?.phone ?? "",
            country: data?.country ?? "",
            field_of_study: data?.field_of_study ?? "",
         });
         setIsEditing(false);
         toast.success("Profile updated successfully");
      } catch (error) {
         toast.error("Failed to update profile");
      }
   };

   const handleCancel = () => {
      setIsEditing(false);
   };

   const getInitials = (name: string) => {
      const names = name.split(" ");
      const firstName = names[0] || "";
      const lastName = names[names.length - 1] || "";
      return (firstName[0] + lastName[0]).toUpperCase();
   };

   if (isLoading) {
      return <div>Loading...</div>;
   }

   const stats = [
      { label: "Courses Enrolled", value: profileData?.coursesEnrolled || "0" },
      {
         label: "Completed Courses",
         value: profileData?.completedCourses || "0",
      },
      { label: "Achievements", value: profileData?.achievements || "0" },
      { label: "Average Grade", value: profileData?.averageGrade || "N/A" },
   ];

   return (
      <>
         <div className="w-full space-y-6">
            <DashboardNavbar title="Profile" />
            <div className="flex justify-between items-center"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {/* Main Profile Section */}
               <div className="md:col-span-2 space-y-6">
                  <div className="bg-white rounded-lg shadow p-6">
                     {isEditing ? (
                        <ProfileForm
                           user={profileData}
                           onUpdate={handleUpdateProfile}
                           onCancel={handleCancel}
                        />
                     ) : (
                        <div className="space-y-6">
                           <div className="flex justify-between items-start">
                              <div className="flex items-center gap-4">
                                 <div className="bg-main/10 h-24 w-24 rounded-full flex items-center justify-center text-2xl font-bold text-main">
                                    {profileData?.name ? (
                                       getInitials(profileData.name)
                                    ) : (
                                       <UserCircle
                                          size={40}
                                          className="text-main"
                                       />
                                    )}
                                 </div>
                                 <div>
                                    <h2 className="text-2xl font-semibold">
                                       {profileData?.name}
                                    </h2>
                                    <p className="text-gray-600 capitalize">
                                       {profileData?.role}
                                    </p>
                                    <button
                                       onClick={() => setIsEditing(!isEditing)}
                                       className="mt-2 bg-main hover:bg-main/90 transition-colors text-white px-4 py-1.5 rounded-full text-sm flex items-center gap-2"
                                    >
                                       <UserCircle size={14} />
                                       {isEditing ? "Cancel" : "Edit Profile"}
                                    </button>
                                 </div>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                              <div className="flex items-center gap-3">
                                 <UserCircle className="text-main" />
                                 <div>
                                    <p className="text-sm text-gray-500">
                                       Username
                                    </p>
                                    <p>{profileData?.username || "Not set"}</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-3">
                                 <Mail className="text-main" />
                                 <div>
                                    <p className="text-sm text-gray-500">
                                       Email
                                    </p>
                                    <p>{profileData?.email}</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-3">
                                 <Phone className="text-main" />
                                 <div>
                                    <p className="text-sm text-gray-500">
                                       Phone
                                    </p>
                                    <p>
                                       {profileData?.phone || "Not provided"}
                                    </p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-3">
                                 <MapPin className="text-main" />
                                 <div>
                                    <p className="text-sm text-gray-500">
                                       Country
                                    </p>
                                    <p>
                                       {profileData?.country || "Not provided"}
                                    </p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-3">
                                 <Book className="text-main" />
                                 <div>
                                    <p className="text-sm text-gray-500">
                                       Field of Study
                                    </p>
                                    <p>
                                       {profileData?.field_of_study ||
                                          "Not provided"}
                                    </p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-3">
                                 <Calendar className="text-main" />
                                 <div>
                                    <p className="text-sm text-gray-500">
                                       Joined
                                    </p>
                                    <p>
                                       {new Date(
                                          profileData?.created_at
                                       ).toLocaleDateString()}
                                    </p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     )}
                  </div>

                  {/* Activity Section */}
                  <div className="bg-white rounded-lg shadow p-6">
                     <h3 className="text-lg font-semibold mb-4">
                        Recent Activity
                     </h3>

                     <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                           <div
                              key={i}
                              className="flex items-center gap-3 border-b pb-4"
                           >
                              <Activity className="text-main" />
                              <div>
                                 <p className="font-medium">
                                    Completed Chapter {i}
                                 </p>
                                 <p className="text-sm text-gray-500">
                                    2 days ago
                                 </p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Stats & Additional Info */}
               <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow p-6">
                     <h3 className="text-lg font-semibold mb-4">Statistics</h3>
                     <div className="grid grid-cols-2 gap-4">
                        {stats.map((stat, index) => (
                           <div
                              key={index}
                              className="text-center p-4 bg-gray-50 rounded"
                           >
                              <p className="text-2xl font-bold text-main">
                                 {stat.value}
                              </p>
                              <p className="text-sm text-gray-600">
                                 {stat.label}
                              </p>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                     <h3 className="text-lg font-semibold mb-4">
                        Current Courses
                     </h3>
                     <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                           <div
                              key={i}
                              className="flex items-center gap-3"
                           >
                              <Book className="text-main" />
                              <div>
                                 <p className="font-medium">Course {i}</p>
                                 <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                       className="bg-main h-2.5 rounded-full"
                                       style={{ width: `${30 * i}%` }}
                                    ></div>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default ProfilePage;

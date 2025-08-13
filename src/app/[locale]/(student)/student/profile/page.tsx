"use client";
import {
   Mail,
   Phone,
   MapPin,
   Calendar,
   User,
   Book,
   Activity,
} from "lucide-react";
import ProfileForm from "@/components/profile/ProfileForm";
import { useState } from "react";
import DashboardNavbar from "@/components/DashboardNavbar";
import { useProfile, useUpdateProfile } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { UserUpdate } from "@/types/user";

const ProfilePage = () => {
   const { data: user, isLoading, isError, refetch } = useProfile();
   const updateProfile = useUpdateProfile();
   const [isEditing, setIsEditing] = useState(false);

   const handleUpdateProfile = async (data: UserUpdate) => {
      try {
         await updateProfile.mutateAsync(data);
         await refetch(); // Refetch user data after successful update
         toast.success("Profile updated successfully", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
         });
         setIsEditing(false);
      } catch (error) {
         toast.error("Failed to update profile", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
         });
      }
   };

   const stats = [
      { label: "Courses Enrolled", value: "12" },
      { label: "Completed Courses", value: "8" },
      { label: "Achievements", value: "15" },
      { label: "Average Grade", value: "A" },
   ];

   if (isLoading) {
      return <div>Loading...</div>;
   }

   if (isError) {
      return <div>Error loading profile</div>;
   }

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
                           user={user}
                           onUpdate={handleUpdateProfile}
                           onCancel={() => setIsEditing(false)}
                           isLoading={updateProfile.isPending}
                        />
                     ) : (
                        <div className="space-y-6">
                           <div className="flex justify-between items-start">
                              <div className="flex items-center gap-4">
                                 <div className="bg-main/10 h-24 w-24 rounded-full flex items-center justify-center">
                                    <User
                                       size={40}
                                       className="text-main"
                                    />
                                 </div>
                                 <div>
                                    <h2 className="text-2xl font-semibold">
                                       {user?.name}
                                    </h2>
                                    <p className="text-gray-600 capitalize">
                                       {user?.role}
                                    </p>
                                    <button
                                       onClick={() => setIsEditing(!isEditing)}
                                       className="mt-2 bg-main hover:bg-main/90 transition-colors text-white px-4 py-1.5 rounded-full text-sm flex items-center gap-2"
                                    >
                                       <User size={14} />
                                       {isEditing ? "Cancel" : "Edit Profile"}
                                    </button>
                                 </div>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                              <div className="flex items-center gap-3">
                                 <Mail className="text-main" />
                                 <div>
                                    <p className="text-sm text-gray-500">
                                       Email
                                    </p>
                                    <p>{user?.email}</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-3">
                                 <Phone className="text-main" />
                                 <div>
                                    <p className="text-sm text-gray-500">
                                       Phone
                                    </p>
                                    <p>{user?.phone || "Not provided"}</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-3">
                                 <MapPin className="text-main" />
                                 <div>
                                    <p className="text-sm text-gray-500">
                                       Country
                                    </p>
                                    <p>{user?.country || "Not provided"}</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-3">
                                 <Calendar className="text-main" />
                                 <div>
                                    <p className="text-sm text-gray-500">
                                       Joined
                                    </p>
                                    <p>{new Date().toLocaleDateString()}</p>
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

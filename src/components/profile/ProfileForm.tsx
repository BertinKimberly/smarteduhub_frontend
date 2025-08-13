"use client";
import { useState } from "react";
import { User, UserUpdate } from "@/types/user";

interface ProfileFormProps {
   user?: User;
   onUpdate: (data: UserUpdate) => void;
   onCancel: () => void;
   isLoading?: boolean;
}

const ProfileForm = ({
   user,
   onUpdate,
   onCancel,
   isLoading,
}: ProfileFormProps) => {
   const [formData, setFormData] = useState<UserUpdate>({
      name: user?.name || "",
      email: user?.email || "",
      username: user?.username || "",
      phone: user?.phone || "",
      country: user?.country || "",
      field_of_study: user?.field_of_study || "",
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Filter out empty strings for optional fields
      const updatedData = Object.entries(formData).reduce(
         (acc, [key, value]) => {
            if (value !== "") {
               acc[key as keyof UserUpdate] = value;
            }
            return acc;
         },
         {} as UserUpdate
      );

      onUpdate(updatedData);
   };

   return (
      <form
         onSubmit={handleSubmit}
         className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center"
      >
         {/* Name Field */}
         <div>
            <label
               htmlFor="name"
               className="block text-sm font-medium text-gray-700"
            >
               Full Name
            </label>
            <input
               type="text"
               id="name"
               value={formData.name}
               onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
               }
               className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
         </div>

         {/* Username Field */}
         <div>
            <label
               htmlFor="username"
               className="block text-sm font-medium text-gray-700"
            >
               Username
            </label>
            <input
               type="text"
               id="username"
               value={formData.username}
               onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
               }
               className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
         </div>

         {/* Email Field */}
         <div>
            <label
               htmlFor="email"
               className="block text-sm font-medium text-gray-700"
            >
               Email
            </label>
            <input
               type="email"
               id="email"
               value={formData.email}
               onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
               }
               className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
         </div>

         {/* Phone Field */}
         <div>
            <label
               htmlFor="phone"
               className="block text-sm font-medium text-gray-700"
            >
               Phone
            </label>
            <input
               type="tel"
               id="phone"
               value={formData.phone || ""}
               onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
               }
               className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
         </div>

         {/* Country Field */}
         <div>
            <label
               htmlFor="country"
               className="block text-sm font-medium text-gray-700"
            >
               Country
            </label>
            <input
               type="text"
               id="country"
               value={formData.country || ""}
               onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
               }
               className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
         </div>

         {/* Field of Study */}
         <div>
            <label
               htmlFor="field_of_study"
               className="block text-sm font-medium text-gray-700"
            >
               Field of Study
            </label>
            <input
               type="text"
               id="field_of_study"
               value={formData.field_of_study || ""}
               onChange={(e) =>
                  setFormData({ ...formData, field_of_study: e.target.value })
               }
               className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
         </div>

         <div className="flex gap-2">
            <button
               type="submit"
               disabled={isLoading}
               className="bg-main text-white px-4 py-2 rounded-md hover:bg-main/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
               {isLoading ? "Saving..." : "Save Changes"}
            </button>
            <button
               type="button"
               onClick={onCancel}
               disabled={isLoading}
               className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
               Cancel
            </button>
         </div>
      </form>
   );
};

export default ProfileForm;

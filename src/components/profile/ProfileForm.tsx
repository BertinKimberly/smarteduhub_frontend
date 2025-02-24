"use client";
import { useState } from "react";
import { User } from "@/store/useAuthStore";

interface ProfileFormProps {
   user: User | null;
   onUpdate: (data: Partial<User>) => void;
}

const ProfileForm = ({ user, onUpdate }: ProfileFormProps) => {
   const [formData, setFormData] = useState({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onUpdate(formData);
   };

   return (
      <form
         onSubmit={handleSubmit}
         className="space-y-4"
      >
         <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-sm font-medium mb-1">Name</label>
               <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                     setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-2 border rounded"
               />
            </div>
            <div>
               <label className="block text-sm font-medium mb-1">Email</label>
               <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                     setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full p-2 border rounded"
               />
            </div>
            <div>
               <label className="block text-sm font-medium mb-1">Phone</label>
               <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                     setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full p-2 border rounded"
               />
            </div>
            <div>
               <label className="block text-sm font-medium mb-1">Address</label>
               <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                     setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full p-2 border rounded"
               />
            </div>
         </div>
         <button
            type="submit"
            className="bg-main text-white px-4 py-2 rounded hover:bg-opacity-90"
         >
            Update Profile
         </button>
      </form>
   );
};

export default ProfileForm;

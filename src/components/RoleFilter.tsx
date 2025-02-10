import React from "react";

type RoleFilterProps = {
   selectedRole: string;
   onRoleChange: (role: string) => void;
};

const RoleFilter = ({ selectedRole, onRoleChange }: RoleFilterProps) => {
   const roles = ["all", "student", "teacher", "parent"];

   return (
      <div className="flex gap-2">
         {roles.map((role) => (
            <button
               key={role}
               onClick={() => onRoleChange(role)}
               className={`px-4 py-2 rounded-md ${
                  selectedRole === role
                     ? "bg-blue-500 text-white"
                     : "bg-gray-100 hover:bg-gray-200"
               }`}
            >
               {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
         ))}
      </div>
   );
};

export default RoleFilter;

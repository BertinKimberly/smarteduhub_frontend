import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface RoleSelectionModalProps {
   isOpen: boolean;
   onClose: () => void;
   onConfirm: (role: string) => void;
   isRegisterPage?: boolean;
}

export function RoleSelectionModal({
   isOpen,
   onClose,
   onConfirm,
   isRegisterPage = false,
}: RoleSelectionModalProps) {
   const [selectedRole, setSelectedRole] = useState<string>("student");

   const handleConfirm = () => {
      onConfirm(selectedRole);
      onClose();
   };

   return (
      <Dialog
         open={isOpen}
         onOpenChange={onClose}
      >
         <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
               <DialogTitle>Select Role</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
               {isRegisterPage ? (
                  <Select
                     onValueChange={setSelectedRole}
                     defaultValue={selectedRole}
                  >
                     <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                     </SelectContent>
                  </Select>
               ) : (
                  <p>Proceed with OAuth login?</p>
               )}
               <Button onClick={handleConfirm}>Continue</Button>
            </div>
         </DialogContent>
      </Dialog>
   );
}

import React from "react";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
   DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { toast } from "react-toastify";

interface RatingDialogProps {
   courseId: string;
   onRate: (rating: number, feedback: string) => Promise<void>;
   isOpen: boolean;
   onOpenChange: (open: boolean) => void;
}

export default function RatingDialog({
   courseId,
   onRate,
   isOpen,
   onOpenChange,
}: RatingDialogProps) {
   const [rating, setRating] = React.useState<number>(0);
   const [hover, setHover] = React.useState<number>(0);
   const [feedback, setFeedback] = React.useState<string>("");

   const handleSubmit = async () => {
      try {
         await onRate(rating, feedback);
         onOpenChange(false);
         setRating(0);
         setFeedback("");
      } catch (error) {
         // Error toast is handled in parent component
         console.error("Error in dialog:", error);
      }
   };

   return (
      <Dialog
         open={isOpen}
         onOpenChange={onOpenChange}
      >
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Rate this course</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
               <div className="flex justify-center space-x-1">
                  {[1, 2, 3, 4, 5].map((index) => (
                     <button
                        key={index}
                        type="button"
                        className="focus:outline-none"
                        onMouseEnter={() => setHover(index)}
                        onMouseLeave={() => setHover(rating)}
                        onClick={() => setRating(index)}
                     >
                        <Star
                           className={`h-8 w-8 ${
                              index <= (hover || rating)
                                 ? "fill-yellow-400 text-yellow-400"
                                 : "fill-gray-300 text-gray-300"
                           }`}
                        />
                     </button>
                  ))}
               </div>
               <Textarea
                  placeholder="Share your thoughts about this course..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="min-h-[100px]"
               />
               <div className="flex justify-end space-x-2">
                  <DialogClose asChild>
                     <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                     onClick={handleSubmit}
                     disabled={rating === 0}
                  >
                     Submit Rating
                  </Button>
               </div>
            </div>
         </DialogContent>
      </Dialog>
   );
}

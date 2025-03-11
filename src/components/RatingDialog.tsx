import React from "react";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

interface RatingDialogProps {
   courseId: string;
   onRate: (rating: number, feedback: string) => Promise<void>;
   isOpen: boolean;
   onOpenChange: (open: boolean) => void;
   initialRating?: number;
   initialFeedback?: string;
}

export default function RatingDialog({
   courseId,
   onRate,
   isOpen,
   onOpenChange,
   initialRating = 0,
   initialFeedback = "",
}: RatingDialogProps) {
   const [rating, setRating] = React.useState<number>(initialRating);
   const [hover, setHover] = React.useState<number>(0);
   const [feedback, setFeedback] = React.useState<string>(initialFeedback);
   const [isSubmitting, setIsSubmitting] = React.useState(false);
   const [error, setError] = React.useState<string>("");

   // Reset form when dialog opens/closes
   React.useEffect(() => {
      if (isOpen) {
         setRating(initialRating);
         setFeedback(initialFeedback);
         setError("");
      }
   }, [isOpen, initialRating, initialFeedback]);

   const handleSubmit = async () => {
      if (rating < 1 || rating > 5) {
         setError("Please select a rating between 1 and 5 stars");
         return;
      }

      try {
         setIsSubmitting(true);
         setError("");
         await onRate(rating, feedback);
         onOpenChange(false);
         setRating(0);
         setFeedback("");
         toast.success("Thank you for your rating!");
      } catch (error) {
         setError("Failed to submit rating. Please try again.");
         console.error("Error in dialog:", error);
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <Dialog
         open={isOpen}
         onOpenChange={(open) => {
            if (!isSubmitting) {
               onOpenChange(open);
            }
         }}
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
                        className="focus:outline-none transition-transform hover:scale-110"
                        onMouseEnter={() => setHover(index)}
                        onMouseLeave={() => setHover(rating)}
                        onClick={() => {
                           setRating(index);
                           setError("");
                        }}
                        disabled={isSubmitting}
                     >
                        <Star
                           className={`h-8 w-8 ${
                              index <= (hover || rating)
                                 ? "fill-yellow-400 text-yellow-400"
                                 : "fill-gray-300 text-gray-300"
                           } ${isSubmitting ? "opacity-50" : ""}`}
                        />
                     </button>
                  ))}
               </div>
               {error && (
                  <p className="text-sm text-red-500 text-center">{error}</p>
               )}
               <Textarea
                  placeholder="Share your thoughts about this course (optional)..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="min-h-[100px] resize-none"
                  disabled={isSubmitting}
               />
               <div className="flex justify-end space-x-2">
                  <DialogClose asChild>
                     <Button
                        variant="outline"
                        disabled={isSubmitting}
                     >
                        Cancel
                     </Button>
                  </DialogClose>
                  <Button
                     onClick={handleSubmit}
                     disabled={rating === 0 || isSubmitting}
                  >
                     {isSubmitting ? (
                        <>
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                           Submitting...
                        </>
                     ) : (
                        "Submit Rating"
                     )}
                  </Button>
               </div>
            </div>
         </DialogContent>
      </Dialog>
   );
}

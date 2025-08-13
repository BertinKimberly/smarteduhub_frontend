import {
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from "@/components/ui/sheet";
import { History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatHistory, ChatSession } from "@/hooks/useChatHistory";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatHistoryProps {
   onSelectSession: (session: ChatSession) => void;
}

export const ChatHistory = ({ onSelectSession }: ChatHistoryProps) => {
   const { sessions, isLoading } = useChatHistory();

   return (
      <Sheet>
         <SheetTrigger asChild>
            <Button
               variant="ghost"
               size="icon"
               className="text-white hover:bg-white/10"
            >
               <History className="h-5 w-5" />
            </Button>
         </SheetTrigger>
         <SheetContent>
            <SheetHeader>
               <SheetTitle>Chat History</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
               <div className="space-y-4">
                  {sessions.map((session) => (
                     <Button
                        key={session.id}
                        variant="ghost"
                        className="w-full justify-start text-left space-y-2"
                        onClick={() => onSelectSession(session)}
                     >
                        <div className="flex flex-col">
                           <span className="font-medium">
                              {/* @ts-ignore */}
                              {session.title || "Chat Session"}
                           </span>
                           <span className="text-sm text-muted-foreground">
                              {format(new Date(session.created_at), "PPp")}
                           </span>
                        </div>
                     </Button>
                  ))}
               </div>
            </ScrollArea>
         </SheetContent>
      </Sheet>
   );
};

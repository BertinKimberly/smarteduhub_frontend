import React from "react";
import {
   ResizableHandle,
   ResizablePanel,
   ResizablePanelGroup,
} from "@/components/ui/resizable";
import { File, MoveDown, PenBox, Plus, Search } from "lucide-react";

const ChatArea = () => {
   return (
      <ResizablePanelGroup
         direction="horizontal"
         className="min-h-[85vh] max-w-md rounded-lg border md:min-w-full mt-8"
      >
         <ResizablePanel
            defaultSize={25}
            maxSize={30}
            minSize={15}
         >
            <div className="flex h-full   p-6  bg-background flex-col gap-6 items-center justify-start">
               <div className="bg-[#F8F9FE] p-2 flex items-center rounded-full gap-2 px-2 h-fit">
                  <Search />
                  <input
                     className="bg-transparent border-none outline-none"
                     placeholder="Search chats..."
                  />
               </div>
               <div className="flex  justify-start items-center gap-2 w-full">
                  <div>
                     Unreads
                     <span className="bg-red-500 h-10 w-10 rounded-full p-1 text-white ml-1">
                        8
                     </span>
                  </div>
                  <div className="bg-main rounded-lg p-1 flex items-center justify-center gap-4 text-white">
                     <small>New Message</small>
                     <PenBox size={15} />
                  </div>
               </div>

               <div className="flex items-center justify-between w-full">
                  <p>Channels</p>
                  <p className="text-red-600 underline">Clear</p>
               </div>
               <div className="w-full flex flex-col gap-2">
                  <div className="rounded-lg bg-submain p-2 w-full flex items-center gap-2 cursor-pointer justify-between">
                     <div className="flex">
                        <span className="mr-4">#</span>
                        <p>General</p>
                     </div>
                     <div className="bg-main w-8 h-8 rounded-full p-1 flex items-center justify-center">
                        1
                     </div>
                  </div>
                  <div className="rounded-lg bg-submain p-2 w-full flex items-center gap-2 cursor-pointer justify-between">
                     <div className="flex">
                        <span className="mr-4">#</span>
                        <p>English</p>
                     </div>
                     <div className="bg-main w-8 h-8 rounded-full p-1 flex items-center justify-center">
                        2
                     </div>
                  </div>
               </div>
               <div className="flex items-center justify-between w-full">
                  <p>Direct Messages</p>
                  <p className="text-red-600 underline">Clear</p>
               </div>
               <div className="w-full flex flex-col gap-2">
                  <div className="rounded-lg bg-submain p-2 w-full flex items-center gap-2 cursor-pointer justify-between">
                     <p>Peter</p>
                     <div className="bg-main w-8 h-8 rounded-full p-1 flex items-center justify-center">
                        1
                     </div>
                  </div>
                  <div className="rounded-lg bg-submain p-2 w-full flex items-center gap-2 cursor-pointer justify-between">
                     <p>James</p>
                     <div className="bg-main w-8 h-8 rounded-full p-1 flex items-center justify-center">
                        2
                     </div>
                  </div>
                  <div className="rounded-lg bg-submain p-2 w-full flex items-center gap-2 cursor-pointer justify-between">
                     <p>Blessing</p>
                     <div className="bg-main w-8 h-8 rounded-full p-1 flex items-center justify-center">
                        2
                     </div>
                  </div>
                  <div className="rounded-lg bg-submain p-2 w-full flex items-center gap-2 cursor-pointer justify-between">
                     <p>Kalisa</p>
                     <div className="bg-main w-8 h-8 rounded-full p-1 flex items-center justify-center">
                        2
                     </div>
                  </div>
                  <div className="rounded-lg bg-submain p-2 w-full flex items-center gap-2 cursor-pointer justify-between">
                     <p>John</p>
                     <div className="bg-main w-8 h-8 rounded-full p-1 flex items-center justify-center">
                        2
                     </div>
                  </div>
               </div>
            </div>
         </ResizablePanel>
         <ResizableHandle withHandle />
         <ResizablePanel defaultSize={75}>
            <div className="flex h-full p-6 relative flex-col">
               <div className="border border-main rounded-t-lg p-3">
                  <p># general </p>
               </div>

               <div className="flex flex-col gap-2 py-2">
                  {/* received message */}
                  <div className="flex justify-start">
                     <div className="rounded-lg p-2 bg-[#F8F9FE] w-fit max-w-[70%]">
                        <p>Hello. It is a pleasure to meet you</p>
                     </div>
                  </div>
                  {/* sent message */}
                  <div className="flex justify-end">
                     <div className="rounded-lg p-2 bg-main text-white w-fit max-w-[70%]">
                        <p>Hello. It is a pleasure to meet you</p>
                     </div>
                  </div>
                  {/* received message */}
                  <div className="flex justify-start">
                     <div className="rounded-lg p-2 bg-[#F8F9FE] w-fit max-w-[70%]">
                        <p>Hello. It is a pleasure to meet you</p>
                     </div>
                  </div>
                  {/* sent message */}
                  <div className="flex justify-end">
                     <div className="rounded-lg p-2 bg-main text-white w-fit max-w-[70%]">
                        <p>Hello. It is a pleasure to meet you</p>
                     </div>
                  </div>
                  {/* received message */}
                  <div className="flex justify-start">
                     <div className="rounded-lg p-2 bg-[#F8F9FE] w-fit max-w-[70%]">
                        <p>
                           Lorem ipsum dolor sit amet consectetur adipisicing
                           elit. Consequatur voluptas quos adipisci accusantium
                           possimus culpa, deleniti distinctio commodi facilis.
                           Et nam reiciendis suscipit, molestias qui possimus
                           esse magnam eaque, quod, dolorum minima. Earum
                           commodi laudantium repellat sequi consectetur
                           nostrum, quisquam illum totam omnis optio facilis
                           facere aperiam incidunt unde in!
                        </p>
                     </div>
                  </div>
                  {/* sent message */}
                  <div className="flex justify-end">
                     <div className="rounded-lg p-2 bg-main text-white w-fit max-w-[70%]">
                        <p>
                           Lorem ipsum dolor sit amet consectetur adipisicing
                           elit. Amet officia laudantium laborum recusandae
                           vitae eveniet earum facere consequuntur labore natus!
                        </p>
                     </div>
                  </div>
               </div>
               <div className="absolute bottom-8 w-full flex items-center justify-center gap-8">
                  <span className="text-main cursor-pointer">
                     <Plus />
                  </span>
                  <span className="text-main cursor-pointer">
                     <File />
                  </span>
                  <input
                     className="bg-background w-3/4 p-3 rounded-lg focus:border-main outline-none"
                     placeholder="Type a message..."
                  />
               </div>
            </div>
         </ResizablePanel>
      </ResizablePanelGroup>
   );
};

export default ChatArea;

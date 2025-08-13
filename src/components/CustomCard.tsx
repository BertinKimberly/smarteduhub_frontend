import React from "react";
import { cn } from "@/lib/utils";

export type CardProps = {
   icon: React.ElementType;
   desc: string;
   title: string;
   color: string;
};

export default function CustomCard({
   icon: Icon,
   desc,
   title,
   color,
}: CardProps) {
   return (
      <div className="bg-gradient-to-b text-white from-main to-indigo-600 rounded-lg border-[0.5px] p-4">
         <section className="flex flex-col gap-4">
            <div
               className="rounded-full p-2 w-8 h-8 flex items-center justify-center"
               style={{ backgroundColor: color }}
            >
               {/* @ts-ignore */}
               <Icon className="text-white" />
            </div>
            <p className="text-600-200">{desc}</p>
            <p className="text-submain text-lg font-semibold">{title}</p>
         </section>
      </div>
   );
}

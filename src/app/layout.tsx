import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/providers/react.query.provider";
import AuthProvider from "@/providers/auth.provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NpProgress from "@/components/NpProgress";
import ChatBot from "@/components/ChatBot";

const geistSans = Geist({
   variable: "--font-geist-sans",
   subsets: ["latin"],
});

const geistMono = Geist_Mono({
   variable: "--font-geist-mono",
   subsets: ["latin"],
});

export const metadata: Metadata = {
   title: "Smart Eduhub",
   description: "Smart Eduhub",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
         >
            <AuthProvider>
               <ReactQueryProvider>
                  <div>
                     {children}
                     {/* <ChatBot /> */}
                  </div>
                  <NpProgress />
               </ReactQueryProvider>
            </AuthProvider>
            <ToastContainer
               progressClassName="bg-darkBlue"
               icon={false}
               hideProgressBar={true}
               autoClose={3000}
               toastClassName={"border-darkBlue"}
            />
         </body>
      </html>
   );
}

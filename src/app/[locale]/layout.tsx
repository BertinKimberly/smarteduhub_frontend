import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
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

export default async function RootLayout({
   children,
   params,
}: {
   children: React.ReactNode;
   params: Promise<{ locale: string }>;
}) {
   // Await the params Promise
   const { locale } = await params;
   
   if (!hasLocale(routing.locales, locale)) {
      notFound();
   }
   
   return (
      <html lang={locale}>
         <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
         >
            <NextIntlClientProvider>
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
            </NextIntlClientProvider>
         </body>
      </html>
   );
}
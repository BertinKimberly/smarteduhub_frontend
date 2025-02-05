"use client";
import { Button } from "@/components/ui/button";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState } from "react";
import logo from "@/images/logo.svg";
import Image from "next/image";
import Link from "next/link";
import google from "@/images/google.png";
import github from "@/images/github.png";
import fb from "@/images/fb.png";
import { useLoginUser } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { Cookies } from "react-cookie";
import { useSearchParams } from "next/navigation";

const cookies = new Cookies();

const formSchema = z.object({
   email: z.string().email("Invalid email"),
   password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof formSchema>;

const LoginPage = () => {
   const [isSubmitting, setIsSubmitting] = useState(false);

   const searchParams = useSearchParams();
   const redirectUrl = searchParams.get("redirectUrl");

   const loginMutation = useLoginUser();

   const form = useForm<FormData>({
      resolver: zodResolver(formSchema),
      mode: "onChange",
      defaultValues: {
         email: "",
         password: "",
      },
   });

   const onSubmit = async (data: FormData) => {
      setIsSubmitting(true);
      try {
         const response = await loginMutation.mutateAsync(data);
         console.log("Login Response:", response);

         if (response?.access_token) {
            cookies.set("auth-token", response.access_token, { path: "/" });

            const payload = JSON.parse(
               atob(response.access_token.split(".")[1])
            );

            if (redirectUrl) {
               location.replace(redirectUrl);
            } else {
               payload.role === "user"
                  ? location.replace("/dashboard")
                  : location.replace("/admin");
            }
         } else {
            toast.error(response?.error?.msg || "Login failed");
         }
      } catch (error) {
         toast.error("Login failed. Please try again.");
      } finally {
         setIsSubmitting(false);
      }
   };
   return (
      <div className="py-8 md:py-10">
         <div className="bg-background rounded-lg p-10 shadow-lg w-full md:w-5/6 xl:w-[70%] flex flex-col gap-6 xl:pl-20  mx-auto">
            <Link
               className="flex gap-3 items-center justify-start"
               href="/"
            >
               <Image
                  src={logo}
                  alt="smarteduhub"
               />{" "}
               <span className="text-main font-bold">Smart Eduhub</span>
            </Link>
            <p>Login</p>

            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8 w-full md:w-5/6 z-30"
               >
                  <FormField
                     control={form.control}
                     name="email"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Email *</FormLabel>
                           <FormControl>
                              <Input
                                 className="bg-white p-6 outline-none border border-main text-main"
                                 placeholder="Email"
                                 {...field}
                              />
                           </FormControl>
                           {form.formState.errors.email && (
                              <p className="text-red-500 text-sm">
                                 {form.formState.errors.email.message}
                              </p>
                           )}
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="password"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Password *</FormLabel>
                           <FormControl>
                              <Input
                                 className="bg-white p-6 outline-none border border-main text-main"
                                 placeholder="Password"
                                 {...field}
                                 type="password"
                              />
                           </FormControl>
                           {form.formState.errors.password && (
                              <p className="text-red-500 text-sm">
                                 {form.formState.errors.password.message}
                              </p>
                           )}
                        </FormItem>
                     )}
                  />

                  <Button
                     type="submit"
                     className="w-full bg-main py-6"
                  >
                     Login
                  </Button>
               </form>
            </Form>
            <div className="py-8 flex items-center justify-center gap-4 z-30">
               <div className="bg-white py-3 px-4 md:px-8 cursor-pointer hover:bg-background border border-white rounded-full">
                  <Image
                     src={google}
                     alt="google"
                  />
               </div>
               <div className="bg-white py-3 px-4 md:px-8 cursor-pointer hover:bg-background border border-white rounded-full">
                  <Image
                     src={github}
                     alt="github"
                  />
               </div>
               <div className="bg-white py-3 px-4 md:px-8 cursor-pointer hover:bg-background border border-white rounded-full">
                  <Image
                     src={fb}
                     alt="fb"
                  />
               </div>
            </div>
            <div className="mt-6">
               <p>
                  Don&apos;t have an account?
                  <Link
                     className="ml-4 text-main"
                     href="/register"
                  >
                     Signup
                  </Link>
               </p>
            </div>
         </div>
      </div>
   );
};

export default LoginPage;

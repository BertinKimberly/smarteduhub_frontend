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
import { toast } from "react-toastify";
import { Cookies } from "react-cookie";
import { useRegisterUser } from "@/hooks/useAuth";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

// Define the schema for the registration form
const formSchema = z
   .object({
      email: z.string().email("Invalid email"),
      password: z.string().min(8, "Password must be at least 8 characters"),
      name: z.string().min(3, "name must be at least 3 characters"),
      confirmPassword: z
         .string()
         .min(8, "Confirm Password must be at least 8 characters"),
      role: z.enum(["teacher", "student", "parent"], {
         message: "Role is required",
      }),
   })
   .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
   });

type FormData = z.infer<typeof formSchema>;

const cookies = new Cookies();

const RegisterPage = () => {
   const [isSubmitting, setIsSubmitting] = useState(false);

   const form = useForm<FormData>({
      resolver: zodResolver(formSchema),
      mode: "onChange",
      defaultValues: {
         email: "",
         password: "",
         name: "",
         confirmPassword: "",
         role: "student",
      },
   });

   const registerMutation = useRegisterUser();

   const onSubmit = async ({ confirmPassword, ...data }: FormData) => {
      setIsSubmitting(true);
      try {
         const response = await registerMutation.mutateAsync(data);
         console.log("Registration Response:", response);

         if (response?.token.access_token) {
            cookies.set("auth-token", response.token.access_token, {
               path: "/",
            });

            const payload = JSON.parse(
               atob(response.token.access_token.split(".")[1])
            );

            payload.role === "student"
               ? location.replace("/dashboard")
               : location.replace("/admin");
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
         <div className="bg-background rounded-lg p-10 shadow-lg w-full md:w-5/6 xl:w-[70%] flex flex-col gap-6 xl:pl-20 mx-auto">
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
            <p>Register</p>

            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-full md:w-5/6 z-30"
               >
                  {/* Role Selection Field */}
                  <FormField
                     control={form.control}
                     name="role"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel className="text-submain">
                              Register As *
                           </FormLabel>
                           <FormControl>
                              <Select
                                 onValueChange={field.onChange}
                                 defaultValue={field.value}
                              >
                                 <SelectTrigger className="bg-white p-6 outline-none border border-main text-main">
                                    <SelectValue placeholder="Select role" />
                                 </SelectTrigger>
                                 <SelectContent>
                                    <SelectItem value="teacher">
                                       Teacher
                                    </SelectItem>
                                    <SelectItem value="student">
                                       Student
                                    </SelectItem>
                                    <SelectItem value="parent">
                                       Parent
                                    </SelectItem>
                                 </SelectContent>
                              </Select>
                           </FormControl>
                           {form.formState.errors.role && (
                              <p className="text-red-500 text-sm">
                                 {form.formState.errors.role.message}
                              </p>
                           )}
                        </FormItem>
                     )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6  mt-6">
                     <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel className="text-submain">
                                 Name *
                              </FormLabel>
                              <FormControl>
                                 <Input
                                    className="bg-white p-6 outline-none border border-main text-main"
                                    placeholder="name"
                                    {...field}
                                 />
                              </FormControl>
                              {form.formState.errors.name && (
                                 <p className="text-red-500 text-sm">
                                    {form.formState.errors.name.message}
                                 </p>
                              )}
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel className="text-submain">
                                 Email *
                              </FormLabel>
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
                              <FormLabel className="text-submain">
                                 Password *
                              </FormLabel>
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
                     <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel className="text-submain">
                                 Confirm Password *
                              </FormLabel>
                              <FormControl>
                                 <Input
                                    className="bg-white p-6 outline-none border border-main text-main"
                                    placeholder="Confirm Password"
                                    {...field}
                                    type="password"
                                 />
                              </FormControl>
                              {form.formState.errors.confirmPassword && (
                                 <p className="text-red-500 text-sm">
                                    {
                                       form.formState.errors.confirmPassword
                                          .message
                                    }
                                 </p>
                              )}
                           </FormItem>
                        )}
                     />
                  </div>
                  <Button
                     type="submit"
                     className="w-full bg-main py-6 mt-10"
                     disabled={isSubmitting}
                  >
                     {isSubmitting ? "Registering..." : "Register"}
                  </Button>
               </form>
            </Form>

            <div className="py-8 flex items-center justify-center gap-4 z-30">
               <div className="bg-white py-3 px-8 cursor-pointer hover:bg-background border border-white rounded-full">
                  <Image
                     src={google}
                     alt="google"
                  />
               </div>
               <div className="bg-white py-3 px-8 cursor-pointer hover:bg-background border border-white rounded-full">
                  <Image
                     src={github}
                     alt="github"
                  />
               </div>
               <div className="bg-white py-3 px-8 cursor-pointer hover:bg-background border border-white rounded-full">
                  <Image
                     src={fb}
                     alt="fb"
                  />
               </div>
            </div>
            <div className="mt-6">
               <p>
                  Already have an account?
                  <Link
                     className="ml-4 text-main"
                     href="/login"
                  >
                     Login
                  </Link>
               </p>
            </div>
         </div>
      </div>
   );
};

export default RegisterPage;

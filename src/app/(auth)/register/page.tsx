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
import { RoleSelectionModal } from "@/components/RoleSelectionModal";
import { useInitiateOAuth } from "@/hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";

// Define the schema for the registration form
const formSchema = z
   .object({
      email: z.string().email("Invalid email"),
      password: z.string().min(8, "Password must be at least 8 characters"),
      name: z.string().min(3, "Name must be at least 3 characters"),
      confirmPassword: z
         .string()
         .min(8, "Confirm Password must be at least 8 characters"),
      role: z.enum(["teacher", "student", "parent"], {
         message: "Role is required",
      }),
      username: z
         .string()
         .min(3, "Username must be at least 3 characters")
         .optional(),
      phone: z.string().optional(),
      country: z.string().optional(),
      field_of_study: z.string().optional(),
   })
   .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
   });

type FormData = z.infer<typeof formSchema>;

const cookies = new Cookies();

const RegisterPage = () => {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [showRoleModal, setShowRoleModal] = useState(false);
   const [selectedProvider, setSelectedProvider] = useState<string>("");
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

   const form = useForm<FormData>({
      resolver: zodResolver(formSchema),
      mode: "onChange",
      defaultValues: {
         email: "",
         password: "",
         name: "",
         confirmPassword: "",
         role: "student",
         username: "",
         phone: "",
         country: "",
         field_of_study: "",
      },
   });

   const registerMutation = useRegisterUser();
   const initiateOAuthMutation = useInitiateOAuth();

   const onSubmit = async (data: FormData) => {
      setIsSubmitting(true);
      try {
         const response = await registerMutation.mutateAsync(data);

         if (response?.access_token) {
            // First clear any existing tokens
            cookies.remove("access_token", { path: "/" });
            // Set the new token
            cookies.set("access_token", response.access_token, {
               path: "/",
            });

            try {
               const payload = JSON.parse(
                  atob(response.access_token.split(".")[1])
               );

               // Redirect based on role
               switch (payload.role) {
                  case "admin":
                     location.replace("/admin");
                     break;
                  case "teacher":
                     location.replace("/teacher");
                     break;
                  case "parent":
                     location.replace("/parent");
                     break;
                  case "student":
                     location.replace("/student");
                     break;
                  default:
                     location.replace("/student");
               }
            } catch (error) {
               // If token decoding fails, show error and remove the token
               cookies.remove("access_token", { path: "/" });
               toast.error("Authentication error. Please try again.");
            }
         } else {
            toast.error(response?.error?.msg || "Registration failed");
         }
      } catch (error: any) {
         toast.error(
            error?.response?.data?.message ||
               "Registration failed. Please try again."
         );
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleOAuthClick = (provider: string) => {
      setSelectedProvider(provider);
      setShowRoleModal(true);
   };

   const handleRoleSelect = (role: string) => {
      initiateOAuthMutation.mutate({
         provider: selectedProvider,
         role: role, // Make sure role is passed here
      });
   };

   return (
      <div className="py-8 md:py-10">
         <div className="bg-gradient-to-b from-background via-white to-main rounded-lg p-4 md:p-10 shadow-lg w-full md:w-5/6 xl:w-[70%] flex flex-col gap-6 xl:pl-20 mx-auto">
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
                           <FormLabel>Register As *</FormLabel>
                           <FormControl>
                              <Select
                                 onValueChange={field.onChange}
                                 defaultValue={field.value}
                              >
                                 <SelectTrigger className="bg-white p-6 outline-none border border-main ">
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
                              <FormLabel>Full Name *</FormLabel>
                              <FormControl>
                                 <Input
                                    className="bg-white p-6 outline-none border border-main "
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
                              <FormLabel>Email *</FormLabel>
                              <FormControl>
                                 <Input
                                    className="bg-white p-6 outline-none border border-main "
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
                        name="username"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                 <Input
                                    className="bg-white p-6 outline-none border border-main"
                                    placeholder="Username"
                                    {...field}
                                 />
                              </FormControl>
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                 <Input
                                    className="bg-white p-6 outline-none border border-main"
                                    placeholder="Phone number"
                                    {...field}
                                 />
                              </FormControl>
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                 <Input
                                    className="bg-white p-6 outline-none border border-main"
                                    placeholder="Country"
                                    {...field}
                                 />
                              </FormControl>
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="field_of_study"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Field of Study</FormLabel>
                              <FormControl>
                                 <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                 >
                                    <SelectTrigger className="bg-white p-6 outline-none border border-main">
                                       <SelectValue placeholder="Select field of study" />
                                    </SelectTrigger>
                                    <SelectContent>
                                       <SelectItem value="computer_science">
                                          Computer Science
                                       </SelectItem>
                                       <SelectItem value="engineering">
                                          Engineering
                                       </SelectItem>
                                       <SelectItem value="mathematics">
                                          Mathematics
                                       </SelectItem>
                                       <SelectItem value="physics">
                                          Physics
                                       </SelectItem>
                                       <SelectItem value="biology">
                                          Biology
                                       </SelectItem>
                                       <SelectItem value="chemistry">
                                          Chemistry
                                       </SelectItem>
                                       <SelectItem value="other">
                                          Other
                                       </SelectItem>
                                    </SelectContent>
                                 </Select>
                              </FormControl>
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
                                 <div className="relative">
                                    <Input
                                       className="bg-white p-6 outline-none border border-main pr-10"
                                       placeholder="Password"
                                       {...field}
                                       type={showPassword ? "text" : "password"}
                                    />
                                    <button
                                       type="button"
                                       className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                       onClick={() =>
                                          setShowPassword(!showPassword)
                                       }
                                    >
                                       {showPassword ? (
                                          <EyeOff className="h-5 w-5" />
                                       ) : (
                                          <Eye className="h-5 w-5" />
                                       )}
                                    </button>
                                 </div>
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
                              <FormLabel>Confirm Password *</FormLabel>
                              <FormControl>
                                 <div className="relative">
                                    <Input
                                       className="bg-white p-6 outline-none border border-main pr-10"
                                       placeholder="Confirm Password"
                                       {...field}
                                       type={
                                          showConfirmPassword
                                             ? "text"
                                             : "password"
                                       }
                                    />
                                    <button
                                       type="button"
                                       className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                       onClick={() =>
                                          setShowConfirmPassword(
                                             !showConfirmPassword
                                          )
                                       }
                                    >
                                       {showConfirmPassword ? (
                                          <EyeOff className="h-5 w-5" />
                                       ) : (
                                          <Eye className="h-5 w-5" />
                                       )}
                                    </button>
                                 </div>
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
            <div className="flex flex-col items-center gap-4 py-6">
               <p className="text-center">Or with</p>
               <div className="flex items-center justify-center gap-4 z-30">
                  <div
                     className="bg-white py-3 px-8 cursor-pointer hover:bg-background border border-white rounded-full"
                     onClick={() => handleOAuthClick("google")}
                  >
                     <Image
                        src={google}
                        alt="google"
                     />
                  </div>
                  <div
                     className="bg-white py-3 px-8 cursor-pointer hover:bg-background border border-white rounded-full"
                     onClick={() => handleOAuthClick("github")}
                  >
                     <Image
                        src={github}
                        alt="github"
                     />
                  </div>
                  <div
                     className="bg-white py-3 px-8 cursor-pointer hover:bg-background border border-white rounded-full"
                     onClick={() => handleOAuthClick("facebook")}
                  >
                     <Image
                        src={fb}
                        alt="fb"
                     />
                  </div>
               </div>
            </div>
            <RoleSelectionModal
               isOpen={showRoleModal}
               onClose={() => setShowRoleModal(false)}
               onConfirm={handleRoleSelect}
               isRegisterPage={true}
            />

            <div className="mt-6">
               <p>
                  Already have an account?
                  <Link
                     className="ml-4 text-white"
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

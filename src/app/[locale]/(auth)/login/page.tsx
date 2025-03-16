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
import React, { useState, Suspense } from "react";
import logo from "@/images/logo.svg";
import Image from "next/image";
import Link from "next/link";
import google from "@/images/google.png";
import { useLoginUser } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { Cookies } from "react-cookie";
import { useSearchParams } from "next/navigation";
import { useInitiateOAuth } from "@/hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";

const cookies = new Cookies();

const formSchema = z.object({
   email: z.string().email("Invalid email"),
   password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof formSchema>;

// Loading component
function Loading() {
   return (
      <div className="flex items-center justify-center min-h-screen">
         <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-main mx-auto"></div>
         </div>
      </div>
   );
}

// Main login form component that uses useSearchParams
function LoginForm() {
   const t = useTranslations("auth");
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [showPassword, setShowPassword] = useState(false);

   const searchParams = useSearchParams();
   const redirectUrl = searchParams.get("redirectUrl");

   const loginMutation = useLoginUser();
   const initiateOAuthMutation = useInitiateOAuth();

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

         if (response?.access_token) {
            // First clear any existing tokens to prevent issues
            cookies.remove("access_token", { path: "/" });
            // Then set the new token
            cookies.set("access_token", response.access_token, { path: "/" });

            try {
               const payload = JSON.parse(
                  atob(response.access_token.split(".")[1])
               );

               if (redirectUrl) {
                  location.replace(redirectUrl);
               } else {
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
               }
            } catch (error) {
               // If token decoding fails, show error and remove the token
               cookies.remove("access_token", { path: "/" });
               toast.error("Authentication error. Please login again.");
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

   const handleOAuthClick = (provider: string) => {
      initiateOAuthMutation.mutate({ provider });
   };

   return (
      <div className="py-8 md:py-10 w-full flex items-center justify-center">
         <div className="bg-gradient-to-b from-background via-white to-main rounded-lg p-4 md:p-10 shadow-lg w-full md:w-5/6 xl:w-[70%] flex items-center justify-center">
            <div className="flex flex-col gap-6 w-[95%]">
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
               <p>{t("login")}</p>

               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(onSubmit)}
                     className="space-y-8 w-full z-30"
                  >
                     <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>{t("email")} *</FormLabel>
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
                        name="password"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>{t("password")} *</FormLabel>
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

                     <Button
                        type="submit"
                        className="w-full bg-main py-6"
                     >
                        {isSubmitting ? t("loading") : t("loginButton")}
                     </Button>
                  </form>
               </Form>

               <div className="flex flex-col items-center gap-4 py-6">
                  <p className="text-center">{t("or")}</p>
                  <div className="w-full flex items-center justify-center">
                     <div
                        className="w-full md:w-1/2 bg-white py-4 px-8 cursor-pointer hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3 shadow-sm"
                        onClick={() => handleOAuthClick("google")}
                     >
                        <Image
                           src={google}
                           alt="google"
                           className="w-6 h-6"
                        />
                        <span className="text-gray-600">
                           {t("continueWithGoogle")}
                        </span>
                     </div>
                  </div>
               </div>

               <div className="mt-6">
                  <p>
                     {t("dontHaveAccount")}
                     <Link
                        className="ml-4 text-white"
                        href="/register"
                     >
                        {t("signup")}
                     </Link>
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
}

// Main wrapper component with Suspense boundary
const LoginPage = () => {
   return (
      <Suspense fallback={<Loading />}>
         <LoginForm />
      </Suspense>
   );
};

export default LoginPage;

import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const locales = ["en", "fr", "rw"] as const;
export const defaultLocale = "en" as const;

export const routing = defineRouting({
   locales,
   defaultLocale,
});

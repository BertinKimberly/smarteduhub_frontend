"use client";

import { Icon } from "@/components/ui/icon";
import { Marquee } from "@devnomic/marquee";
import "@devnomic/marquee/dist/index.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface sponsorsProps {
  icon: string;
  name: string;
}

const sponsors: sponsorsProps[] = [
  {
    icon: "Crown",
    name: "Acmebrand",
  },
  {
    icon: "Vegan",
    name: "Acmelogo",
  },
  {
    icon: "Ghost",
    name: "Acmesponsor",
  },
  {
    icon: "Puzzle",
    name: "Acmeipsum",
  },
  {
    icon: "Squirrel",
    name: "Acme",
  },
  {
    icon: "Cookie",
    name: "Accmee",
  },

];

export const SponsorsSection = () => {
  return (
    <section className="py-12 bg-gray-50 ">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-main dark:text-white">
            Our Platinum Sponsors
          </h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            We are grateful for the support of our sponsors.
          </p>
        </div>

        <div>
        <Marquee
          className="gap-[3rem]"
          fade
          innerClassName="gap-[3rem]"
          pauseOnHover
        >
          {sponsors.map(({ icon, name }) => (
            <Card key={name} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center space-x-4">
                {/* @ts-ignore */}
                <Icon name={icon} className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  {name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Thank you for your support!
                </p>
              </CardContent>
            </Card>
          ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
};
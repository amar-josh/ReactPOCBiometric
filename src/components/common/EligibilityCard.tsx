import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import translator from "@/i18n/translator";

type IconProp = string | React.ElementType;

interface IEligibilityItem {
  icon: IconProp;
  alt: string;
  text: string;
}

interface IEligibilityCardProps {
  title: string;
  items: IEligibilityItem[];
  rightImage?: string;
  rightImageAlt?: string;
}

const EligibilityCard = ({
  title,
  items,
  rightImage,
  rightImageAlt,
}: IEligibilityCardProps) => {
  return (
    <Card className="flex flex-col md:flex-row items-center md:items-start justify-between px-11 py-8 border-none bg-gray-100">
      <CardContent className="flex flex-col space-y-4 w-full p-0">
        <h2 className="text-xl font-semibold text-black">
          {translator(title)}
        </h2>
        <div className="flex w-full items-start justify-between">
          <ul className="flex-1 space-y-3 text-sm text-black ">
            {items.map((item, index) => {
              const isIconString = typeof item.icon === "string";
              const IconComponent = item.icon as React.ElementType;

              return (
                <li key={index} className="flex items-center gap-2">
                  {isIconString ? (
                    <img
                      src={item.icon as string}
                      alt={item.alt}
                      className="w-5 h-5"
                    />
                  ) : (
                    <IconComponent className="w-5 h-5 " aria-label={item.alt} />
                  )}
                  {translator(item.text)}
                </li>
              );
            })}
          </ul>
          {rightImage && (
            <img
              src={rightImage}
              alt={rightImageAlt || "illustration"}
              className="w-24 h-24 object-contain ml-6"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EligibilityCard;

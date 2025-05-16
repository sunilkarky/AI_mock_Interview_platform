import { cn, getTechLogos } from "@/lib/utils";
import Image from "next/image";
import React from "react";

const DisplayTechIcons = async ({ techStack }: TechIconProps) => {
  const techIcons = await getTechLogos(techStack);
  return (
    <div className="flex flex-row ">
      {techIcons.slice(0, 3).map(({ tech, url }, index) => (
        <div
          key={tech}
          className={cn(
            "relative flex flex-center  group bg-dark-300 rounded-full p-2",
            index >= 1 && "-ml-3"
          )}>
          <span className="absolute bottom-full mb-1 hidden group-hover:flex px-2 py-1 text-xs text-white rounded-md shadow-md">
            {tech}
          </span>
          <Image
            src={url}
            alt="tech"
            width={100}
            height={100}
            className="size-7"
          />
        </div>
      ))}
    </div>
  );
};

export default DisplayTechIcons;

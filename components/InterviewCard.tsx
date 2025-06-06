import React from "react";
import dayjs from "dayjs";
import Image from "next/image";
import { getRandomInterviewCover } from "@/lib/utils";
import Link from "next/link";
import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";

const InterviewCard = ({
  id,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const feedback = null as Feedback | null;
  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;
  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  return (
    <div className="card-border w-[360px] max-sm:w-full min-h-96">
      <div className="card-interview">
        <div>
          <div className="absolute top-0 right-0 w-fit px-5 py-2 rounded-bl-lg bg-light-600">
            <p className="badge-text">{normalizedType}</p>
          </div>
          {/* cover Image for interview company*/}
          <Image
            src={getRandomInterviewCover()}
            alt="cover-image"
            width={70}
            height={70}
            className="rounded-full object-fit size-[50px] "
          />
          {/* Interview Role display */}
          <h3 className="mt-5 capitalize">{role} Interview</h3>
          {/* Date and score displaying */}
          <div className="flex flex-row gap-5 mt-3">
            <div className="flex flex-row gap-2">
              <Image
                src="/calendar.svg"
                width={22}
                height={22}
                alt="calendar"
              />
              <p>{formattedDate}</p>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <Image src="/star.svg" width={22} height={22} alt="star" />
              <p>{feedback?.totalScore || "___"}/100</p>
            </div>
          </div>
          {/* feedback of the interview dispaly message */}
          <p className="line-clamp-2 mt-5">
            {feedback?.finalAssessment ||
              "Please take this interview to get feedback to improve yourself."}
          </p>
        </div>
        <div className="flex flex-row justify-between ">
          <div className="flex flex-row ">
            <DisplayTechIcons techStack={techstack} />
          </div>
          <Button className="btn-primary">
            <Link
              href={
                feedback ? `/interview/${id}/feedback` : `/interview/${id}`
              }>
              {feedback ? "View Feedback" : "View Interview"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;

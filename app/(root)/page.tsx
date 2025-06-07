import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import InterviewCard from "../../components/InterviewCard";
import { getCurrentUser } from "@/lib/actions/auth.action";

import {
  getInterviewByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

const Page = async () => {
  const user = await getCurrentUser();

  const [userInterviews, latestInterviews] = await Promise.all([
    //parallel request insted of old approach below
    await getInterviewByUserId(user?.id!),
    await getLatestInterviews({ userId: user?.id! }),
  ]);
  // const userInterviews = await getInterviewByUserId(user?.id!);
  // const latestInterviews = await getLatestInterviews({ userId: user?.id! });
  const hasPastInterviews = userInterviews?.length > 0;
  const hasComingInterview = latestInterviews?.length > 0;
  return (
    <>
      <section className="card-cta">
        {" "}
        {/*  first image and start interview section */}
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Full-Spectrum Interview Prep Powered by PrepAI</h2>
          <p>
            Master real-world interview preparation with PrepAI's adaptive
            practice sessions
          </p>
          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Create a new AI Interviewer</Link>
          </Button>
        </div>
        <Image
          src="/robot.png"
          alt="robot"
          width={300}
          height={300}
          className="max-sm:hidden"
        />
      </section>
      {/* Interviews section of past */}
      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>
        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard key={interview.id} {...interview} />
            ))
          ) : (
            <p>There are no past interviews .</p>
          )}
        </div>
      </section>

      {/* new take a interview */}
      <section className="flex flex-col gap-6  mt-8">
        <h2>Pick Your Interview</h2>
        <div className="interviews-section">
          {hasComingInterview ? (
            latestInterviews?.map((interview) => (
              <InterviewCard key={interview.id} {...interview} />
            ))
          ) : (
            <p>There are no latest interviews available at the moment.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default Page;

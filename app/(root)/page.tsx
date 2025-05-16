import { Button } from "@/components/ui/button";
import { dummyInterviews } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import InterviewCard from "../../components/InterviewCard";

const Page = () => {
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
            <Link href="/interview">Start an Interview</Link>
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
          {dummyInterviews.map((interview) => (
            <InterviewCard key={interview.id} {...interview} />
          ))}
          {/* <p>There are no past interviews .</p> */}
        </div>
      </section>

      {/* new take a interview */}
      <section className="flex flex-col gap-6  mt-8">
        <h2>Pick Your Interview</h2>
        <div className="interviews-section">
          {dummyInterviews.map((interview) => (
            <InterviewCard key={interview.id} {...interview} />
          ))}
          {/* <p>There are no interviews available at the moment.</p> */}
        </div>
      </section>
    </>
  );
};

export default Page;

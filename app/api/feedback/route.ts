import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { feedbackSchema } from "@/constants";

export async function POST(req: NextRequest) {
  try {
    const { interviewId, userId, transcript } = await req.json();

    // Format transcript for AI prompt
    const formattedTranscript = transcript
      .map((sentence: { role: string; content: string }) =>
        `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    // Generate feedback using AI
    const {
      object: { totalScore, areasForImprovement, finalAssessment, strengths, categoryScores },
    } = await generateObject({
      model: google("gemini-2.0-flash-001", { structuredOutputs: false }),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
      `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    // Store feedback in Firestore
    const feedbackRef = await db.collection("feedback").add({
      interviewId,
      userId,
      totalScore,
      categoryScores,
      strengths,
      areasForImprovement,
      finalAssessment,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, feedbackId: feedbackRef.id }, { status: 200 });
  } catch (error) {
    console.error("API feedback error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
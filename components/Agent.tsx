"use client";
import { generator, interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";
import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import Image from "next/image";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";

enum CallStatus { //for showing which button based on state of call to call or end
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  type,
  interviewId,
  questions,
}: AgentProps) => {
  const router = useRouter();

  const [isSpeaking, setIsSpeaking] = useState(false);

  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);

  const [messages, setMessages] = useState<SavedMessage[]>([]);

  // const callStatus = CallStatus.ACTIVE;
  // const isSpeaking = true; //static state handles
  //Like captions of messages to display
  // const messages = ["What is your name?", "My name is Sunil.What about you?"];

  useEffect(() => {
    //useeffect to tell our app to perform when state of conversation changes of vapi trigerred
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };
    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = {
          role: message.role,
          content: message.transcript,
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    };
    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => console.log("Error", error);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);
    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  // const handleGenerateFeedback = async (message: SavedMessage[]) => {
  //   console.log("Generate feedback here");
  //   const { success, feedbackId: id } = await createFeedback({
  //     interviewId: interviewId!,
  //     userId: userId!,
  //     transcript: messages,
  //   });
  //   if (success && id) {
  //     router.push(`/interview/${interviewId}/feedback`);
  //   } else {
  //     console.log("Error saving your feedback try later");
  //     router.push("/");
  //   }
  // };

  // const handleGenerateFeedback = async (messages: SavedMessage[]) => {
  //   const res = await fetch("/api/feedback", {
  //     method: "POST",
  //     body: JSON.stringify({
  //       interviewId: interviewId!,
  //       userId: userId!,
  //       transcript: messages,
  //     }),
  //     headers: { "Content-Type": "application/json" },
  //   });
  //   const { success, feedbackId: id } = await res.json();
  //   if (success && id) {
  //     router.push(`/interview/${interviewId}/feedback`);
  //   } else {
  //     router.push("/");
  //   }
  // };

  const handleGenerateFeedback = async (messages: SavedMessage[]) => {
    const res = await fetch("/api/feedback", {
      method: "POST",
      body: JSON.stringify({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const { success, feedbackId: id } = await res.json();
    if (success && id) {
      router.push(`/interview/${interviewId}/feedback`);
    } else {
      router.push("/");
    }
  };
  useEffect(() => {
    //this is for app state changes in ui acc to dependencies
    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, type, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      await vapi.start(
        undefined,
        {
          variableValues: {
            username: userName,
            userid: userId,
          },
          clientMessages: ["transcript"],
          serverMessages: [],
        },
        undefined,
        generator
      );
    } else {
      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question) => `-${question}`)
          .join("\n");
      }
      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
        clientMessages: ["transcript"],
        serverMessages: [],
      });
    }
  };

  const handleDisconnect = async () => {
    //disconnect call
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const lastMessage = messages[messages.length - 1]?.content;
  const isCallInactiveOrFinished =
    callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="vapi"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>
        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="user avatar"
              width={540}
              height={540}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>
      <div>
        {messages.length > 0 && (
          <div className="transcript-border">
            <div className="transcript">
              <p
                key={lastMessage}
                className={cn(
                  "transition-opacity duration-500 opacity-0",
                  "animate-fadeIn opacity-100"
                )}>
                {lastMessage}
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button className="relative btn-call" onClick={handleCall}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />
            <span>{isCallInactiveOrFinished ? "Call" : "...."}</span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={handleDisconnect}>
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;

//   if (type === "generate") {
//     await vapi.start(
//       undefined,
//       {
//         variableValues: {
//           username: userName,
//           userid: userId,
//         },
//         clientMessages: ["transcript"],
//         serverMessages: [],
//       },
//       undefined,
//       generator
//     );
//   } else {
//     let formattedQuestions = "";
//     if (questions) {
//       formattedQuestions = questions
//         .map((question) => `- ${question}`)
//         .join("\n");
//     }

//     await vapi.start(interviewer, {
//       variableValues: {
//         questions: formattedQuestions,
//       },
//       clientMessages: ["transcript"],
//       serverMessages: [],
//     });
//   }
// };
// const handleCall = async () => {
//     setCallStatus(CallStatus.CONNECTING);

//     if (type === "generate") {
//       await vapi.start(
//         undefined,
//         {
//           variableValues: {
//             username: userName,
//             userid: userId,
//           },
//           clientMessages: ["transcript"],
//           serverMessages: [],
//         },
//         undefined,
//         generator
//       );
//     } else {
//       let formattedQuestions = "";
//       if (questions) {
//         const formattedQuestions = questions
//           .map((question) => `-${question}`)
//           .join("\n");
//       }
//       await vapi.start(interviewer, {
//         variableValues: {
//           questions: formattedQuestions,
//         },
//         clientMessages: ["transcript"],
//         serverMessages: [],
//       });
//     }
//   };

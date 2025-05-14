import AuthForm from "@/components/AuthForm";
import React from "react";

const Page = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <AuthForm type="sign-in" />
    </div>
  );
};

export default Page;

import AuthForm from "@/components/AuthForm";
import { isAuthenticated } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
  //if sign-in redirect to homepage
  const IsUserAuthenticated = await isAuthenticated();
  if (IsUserAuthenticated) {
    redirect("/");
  }
  return (
    <div className="flex items-center justify-center h-screen">
      <AuthForm type="sign-up" />
    </div>
  );
};

export default Page;

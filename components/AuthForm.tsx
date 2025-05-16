"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";

const authFormSchema = (type: FormType) => {
  return z.object({
    name:
      type === "sign-up" ? z.string().min(5).max(20) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(5),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-in") {
        toast.success("Sign In Successful");
        router.push("/homepage");
        // console.log("Sign In", values);a
      } else {
        toast.success("Sign Up Successful.Please Sign In");
        router.push("/sign-in");
        // console.log("Sign Up", values);
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`);
    }
  }
  const isSignIn = type === "sign-in";
  return (
    <div className="card-border lg:min-w-[556px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="logo.svg" alt="logo" width={38} height={32} />
          <h2 className="text-primary-100">PrepAI</h2>
        </div>
        <h3 className="text-primary-100">Crack Interview With AI</h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-6 form">
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
              />
            )}
            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your Email Address"
            />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Your Password"
              type="password"
            />
            <Button className="btn" type="submit">
              {isSignIn ? "Sign In" : "Create New Account"}
            </Button>
          </form>
        </Form>
        <p className="text-center">
          {isSignIn ? "Create new account?" : "Already have an account?"}
          <Link
            className="text-primary-100 font-bold hover:text-primary-200"
            href={!isSignIn ? "/sign-in" : "/sign-up"}>
            {!isSignIn ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;

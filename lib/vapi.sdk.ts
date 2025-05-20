import Vapi from "@vapi-ai/web";

const token = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;
if (!token) {
  throw new Error("VAPI web token is not set in environment variables.");
}

export const vapi = new Vapi(token);
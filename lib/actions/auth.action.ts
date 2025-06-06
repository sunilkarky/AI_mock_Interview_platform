// This file contains server-side authentication actions for user sign up, sign in, session management, and user retrieval.
// It uses Firebase Admin SDK for user management and Fire store for storing user data.


'use server';

import {db, auth} from "@/firebase/admin";
import {cookies} from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7; // Session cookie expiry in seconds for 1 week

// Sign up a new user in Fire store. Expects a user already created in Firebase Auth.
export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;

    try {
        // Check if user already exists in Fire store
        const userRecord = await db.collection('users').doc(uid).get();

        if(userRecord.exists) {
            return {
                success: false,
                message: 'User already exists. Please sign in instead.'
            }
        }
        
        // Create new user document in Fire store
        await db.collection('users').doc(uid).set({
            name, email
        })
        // If successful, return success
        return { 
            success: true ,
            message:"User Account created successfully."

        };
    } catch (e: any) {
        console.error('Error creating a user', e);

        if(e.code === 'auth/email-already-exists') {
            return {
                success: false,
                message: 'This email is already in use.'
            }
        }

        return {
            success: false,
            message: 'Failed to create an account'
        }
    }
}

// Sign in a user by verifying their email and setting a session cookie
export async function signIn(params: SignInParams) {
    const { email, idToken } = params;

    try {
        // Check if user exists in Firebase Auth
        const userRecord = await auth.getUserByEmail(email);

        if(!userRecord) {
            return {
                success: false,
                message: 'User does not exist. Create an account instead.'
            }
        }

        // Set session cookie for the user
        await setSessionCookie(idToken);
        return { success: true };
    } catch (e) {
        console.log(e);

        return {
            success: false,
            message: 'Failed to log into an account.'
        }
    }
}

// Set a session cookie for the authenticated user
export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK * 1000,
    })

    cookieStore.set('session', sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax'
    })
}

// Sign out the user by deleting the session cookie
export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

// Get the current user from the session cookie
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    // get user info from db
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();
    if (!userRecord.exists) return null;

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.log(error);

    // Invalid or expired session
    return null;
  }
}

// Check if a user is authenticated (returns true/false)
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}


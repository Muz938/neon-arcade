import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store } = convexAuth({
    providers: [
        Google as any,
        Password,
        // Email Provider for OTP/Link
        // Password({ id: "email-link", verify: Email }), 
        // Phone Provider using OTP logic
        // For a real app, you'd configure a transport like Twilio here.
    ],
});

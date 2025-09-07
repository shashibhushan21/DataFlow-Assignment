import { betterAuth } from "better-auth";

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || process.env.RENDER_EXTERNAL_URL || "http://localhost:9002",
  secret: process.env.AUTH_SECRET || "super-secret-key",
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});

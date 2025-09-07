import { betterAuth } from "better-auth";

export const auth = betterAuth({
  baseURL: process.env.BASE_URL || "http://localhost:9002",
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

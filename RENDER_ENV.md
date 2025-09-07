# Render Environment Variables

Set these in your Render dashboard:

```
NEXT_PUBLIC_APP_URL=https://dataflow-assignment.onrender.com
AUTH_SECRET=your-super-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Google OAuth Setup

In Google Console, add this redirect URI:
```
https://dataflow-assignment.onrender.com/api/auth/callback/google
```
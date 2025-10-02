# Vercel Environment Variables

Copy these environment variables to your Vercel dashboard:

## Required Environment Variables:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://waseem20032005_db_user:OEw8DCO5YqLt0oug@cluster0.a7qtijt.mongodb.net/jobboard?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=jhgftyhjhgvcvgh98765rfgyhjnbgy8765rfghj8765
JWT_EXPIRE=7d
FRONTEND_URL=https://cybermindworks-task-frontend.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## How to add these to Vercel:

1. Go to your Vercel dashboard
2. Select your backend project
3. Go to Settings → Environment Variables
4. Add each variable above

## MongoDB Atlas Configuration:

1. **IP Whitelist**: Add `0.0.0.0/0` to allow all IPs (required for Vercel)
2. **Database User**: Ensure user has read/write permissions
3. **Connection String**: Must include database name (`/jobboard`)

## Testing the deployment:

- Health check: `https://your-vercel-url.vercel.app/health`
- API test: `https://your-vercel-url.vercel.app/api/jobs`

## Common Issues:

1. **"Database not connected"**: Check IP whitelist in MongoDB Atlas
2. **Authentication failed**: Verify username/password in connection string
3. **Timeout errors**: Check network connectivity and Atlas cluster status
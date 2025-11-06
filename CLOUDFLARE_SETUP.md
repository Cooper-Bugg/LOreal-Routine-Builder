# Cloudflare Worker Setup Guide

This guide will help you create a Cloudflare Worker to securely handle OpenAI API requests for your L'Oréal Routine Builder.

## Why Use a Cloudflare Worker?

A Cloudflare Worker acts as a secure proxy between your frontend and the OpenAI API, keeping your API key safe from being exposed in client-side code.

## Quick Setup (5 minutes)

### Step 1: Create a Cloudflare Account

1. Go to [cloudflare.com](https://www.cloudflare.com/)
2. Sign up for a free account (if you don't have one)
3. Verify your email address

### Step 2: Create a New Worker

1. Log in to your Cloudflare dashboard
2. Click on **"Workers & Pages"** in the left sidebar
3. Click **"Create Application"**
4. Click **"Create Worker"**
5. Give your worker a name (e.g., `loreal-openai-proxy`)
6. Click **"Deploy"**

### Step 3: Edit Your Worker Code

1. After deployment, click **"Edit Code"**
2. **Delete all the default code**
3. Copy the code from `cloudflare-worker.js` in this project
4. Paste it into the worker editor
5. Click **"Save and Deploy"**

### Step 4: Add Your OpenAI API Key as a Secret

1. In your worker page, click on **"Settings"**
2. Click on **"Variables and Secrets"**
3. Under "Environment Variables", click **"Add variable"**
4. Add the following:
   - **Variable name**: `OPENAI_API_KEY`
   - **Value**: Your OpenAI API key (get one from [platform.openai.com/api-keys](https://platform.openai.com/api-keys))
   - **Type**: Choose **"Encrypt"** (this keeps it secure)
5. Click **"Save and Deploy"**

### Step 5: Copy Your Worker URL

1. After deployment, you'll see your worker URL at the top
2. It will look like: `https://loreal-openai-proxy.YOUR-SUBDOMAIN.workers.dev`
3. **Copy this URL**

### Step 6: Update Your Frontend Code

1. Open `config.js` in your project
2. Replace the `WORKER_URL` value with your actual worker URL:
   ```javascript
   const WORKER_URL = "https://loreal-openai-proxy.YOUR-SUBDOMAIN.workers.dev";
   ```
3. Save the file

## Testing Your Setup

1. Open `index.html` in your browser (or use a local server)
2. Select some products
3. Click **"Generate Routine"**
4. You should see a personalized routine appear in the chat window!

## Troubleshooting

### Error: "Worker request failed"

- Make sure your OpenAI API key is correctly set in the worker's environment variables
- Verify your OpenAI account has credits available
- Check the worker logs in Cloudflare dashboard (click "Logs" tab)

### Error: "Please set WORKER_URL"

- You need to update the `WORKER_URL` in `config.js` with your actual worker URL

### CORS Errors

- Make sure your worker code includes the CORS headers (the provided code already has them)

### Worker Not Found (404)

- Double-check that you copied the worker URL correctly
- Make sure the worker is deployed (green status in dashboard)

## Free Tier Limits

Cloudflare Workers free tier includes:

- **100,000 requests per day**
- **10ms CPU time per request**

This is more than enough for this project!

## Security Best Practices

✅ **DO:**

- Store your API key in the Cloudflare Worker environment variables
- Keep `config.js` in `.gitignore` (already done)
- Use the "Encrypt" option for the API key variable

❌ **DON'T:**

- Put your API key directly in your frontend code
- Commit `config.js` with your worker URL to a public repo (if you want to keep it private)
- Share your worker URL publicly if you want to limit usage

## Need Help?

If you get stuck:

1. Check the worker logs in the Cloudflare dashboard
2. Make sure your API key has credits
3. Verify the worker URL is correct in `config.js`
4. Test the worker directly using curl:

```bash
curl -X POST https://your-worker-url.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}],"model":"gpt-4o"}'
```

You should get a response from OpenAI!

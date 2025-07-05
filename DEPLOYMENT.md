# 🚀 Netlify Deployment Guide

This guide will help you deploy the Chinese Practice App to Netlify with proper environment variable configuration.

## 📋 Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
3. **API Keys**: Make sure you have all required API keys ready

## 🔧 Step-by-Step Deployment

### 1. Prepare Your Repository

Make sure your repository contains:
- All source files (HTML, CSS, JS)
- `netlify.toml` configuration file
- `.gitignore` file (to exclude `.env`)
- `package.json` (for dependencies)

### 2. Deploy to Netlify

#### Option A: Deploy via Netlify UI (Recommended)

1. **Connect to GitHub**:
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "New site from Git"
   - Choose "GitHub" and authorize Netlify
   - Select your repository

2. **Configure Build Settings**:
   - **Build command**: Leave empty (static site)
   - **Publish directory**: `.` (root directory)
   - Click "Deploy site"

3. **Set Environment Variables**:
   - Go to Site settings > Environment variables
   - Add the following variables:

```bash
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key_here
ELEVENLABS_VOICE_ID=BrbEfHMQu0fyclQR7lfh
ELEVENLABS_STABILITY=0.5
ELEVENLABS_SIMILARITY_BOOST=0.8
USE_ELEVENLABS=true
SPEECH_RATE=0.8
```

#### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Deploy**:
   ```bash
   netlify deploy
   ```

4. **Set Environment Variables**:
   ```bash
   netlify env:set ELEVENLABS_API_KEY "your_key_here"
   netlify env:set OPENAI_API_KEY "your_key_here"
   netlify env:set GOOGLE_CLOUD_API_KEY "your_key_here"
   netlify env:set ELEVENLABS_VOICE_ID "BrbEfHMQu0fyclQR7lfh"
   netlify env:set ELEVENLABS_STABILITY "0.5"
   netlify env:set ELEVENLABS_SIMILARITY_BOOST "0.8"
   netlify env:set USE_ELEVENLABS "true"
   netlify env:set SPEECH_RATE "0.8"
   ```

5. **Deploy to Production**:
   ```bash
   netlify deploy --prod
   ```

## 🔑 Environment Variables Setup

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `ELEVENLABS_API_KEY` | ElevenLabs API key for TTS | `sk_...` |
| `OPENAI_API_KEY` | OpenAI API key for evaluation | `sk-proj-...` |
| `GOOGLE_CLOUD_API_KEY` | Google Cloud Translation API key | `AIza...` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ELEVENLABS_VOICE_ID` | ElevenLabs voice ID | `BrbEfHMQu0fyclQR7lfh` |
| `ELEVENLABS_STABILITY` | Voice stability (0-1) | `0.5` |
| `ELEVENLABS_SIMILARITY_BOOST` | Voice similarity boost (0-1) | `0.8` |
| `USE_ELEVENLABS` | Enable ElevenLabs TTS | `true` |
| `SPEECH_RATE` | Speech playback rate | `0.8` |

## 🌐 Custom Domain (Optional)

1. Go to Site settings > Domain management
2. Click "Add custom domain"
3. Follow the DNS configuration instructions
4. Wait for DNS propagation (up to 24 hours)

## 🔒 Security Considerations

### API Key Security
- ✅ Environment variables are encrypted at rest
- ✅ Not visible in client-side code
- ✅ Can be rotated without code changes
- ⚠️ API keys are still sent to client (required for browser APIs)

### CORS Configuration
The app makes requests to:
- `https://api.openai.com`
- `https://api.elevenlabs.io`
- `https://translation.googleapis.com`
- `wss://api.elevenlabs.io` (WebSocket)

### Content Security Policy
The `netlify.toml` includes a CSP that allows:
- Scripts from the app and required APIs
- Styles from Google Fonts
- Connections to required APIs

## 🚨 Troubleshooting

### Common Issues

1. **API Keys Not Working**:
   - Check environment variables in Netlify dashboard
   - Verify API keys are correct
   - Check browser console for errors

2. **CORS Errors**:
   - Ensure all API domains are in CSP
   - Check if APIs allow your domain

3. **Build Failures**:
   - Check build logs in Netlify dashboard
   - Verify all files are committed to Git

4. **Environment Variables Not Loading**:
   - Redeploy after setting environment variables
   - Check variable names match exactly
   - Clear browser cache

### Debug Steps

1. **Check Environment Variables**:
   ```javascript
   // Add this to your app temporarily
   console.log('Environment check:', {
     elevenLabs: !!window.config?.elevenLabsApiKey,
     openai: !!window.config?.openaiApiKey,
     google: !!window.config?.googleCloudApiKey
   });
   ```

2. **Test API Connections**:
   - Use browser dev tools to check network requests
   - Look for 401/403 errors indicating API key issues

3. **Check Netlify Logs**:
   - Go to Functions tab in Netlify dashboard
   - Check for any build or runtime errors

## 📊 Monitoring

### Netlify Analytics
- Enable analytics in Site settings
- Monitor traffic and performance
- Check for errors and issues

### API Usage Monitoring
- Monitor API usage in respective dashboards:
  - ElevenLabs: [elevenlabs.io](https://elevenlabs.io)
  - OpenAI: [platform.openai.com](https://platform.openai.com)
  - Google Cloud: [console.cloud.google.com](https://console.cloud.google.com)

## 🔄 Updates and Maintenance

### Updating the App
1. Push changes to GitHub
2. Netlify automatically redeploys
3. Environment variables persist

### Updating API Keys
1. Go to Site settings > Environment variables
2. Update the key value
3. Trigger a new deployment

### Rollback
1. Go to Deploys tab
2. Click "Trigger deploy" on a previous version
3. Or use Git revert and push

## 📞 Support

If you encounter issues:
1. Check Netlify documentation: [docs.netlify.com](https://docs.netlify.com)
2. Check browser console for errors
3. Verify all environment variables are set correctly
4. Test locally with `npm start` first

---

**Happy Deploying! 🎉** 
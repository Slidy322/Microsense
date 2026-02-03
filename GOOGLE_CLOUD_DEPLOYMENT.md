# Deploying MICROSENSE to Google Cloud

This guide covers deploying your MICROSENSE weather app to Google Cloud Run for better performance compared to Vercel.

## Prerequisites

1. **Google Cloud Account**
   - Sign up at https://cloud.google.com/
   - New accounts get $300 free credit for 90 days

2. **Install Google Cloud CLI**
   ```bash
   # macOS
   brew install --cask google-cloud-sdk
   
   # Windows
   # Download from: https://cloud.google.com/sdk/docs/install
   
   # Linux
   curl https://sdk.cloud.google.com | bash
   ```

3. **Login to Google Cloud**
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

## Option 1: Cloud Run (RECOMMENDED - Best Performance)

### Why Cloud Run?
- ✅ Fast cold starts (1-2 seconds)
- ✅ Auto-scaling (0 to millions of requests)
- ✅ Pay only for what you use
- ✅ Closest region to Philippines (asia-southeast1 - Singapore)
- ✅ Built-in CDN and HTTPS
- ✅ Better performance than Vercel for Asia-Pacific users

### Initial Setup

1. **Create a Google Cloud Project**
   ```bash
   # Set your project ID
   export PROJECT_ID="microsense-app"
   
   # Create project
   gcloud projects create $PROJECT_ID --name="MICROSENSE Weather"
   
   # Set as active project
   gcloud config set project $PROJECT_ID
   
   # Enable billing (required)
   # Visit: https://console.cloud.google.com/billing
   ```

2. **Enable Required APIs**
   ```bash
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable run.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   ```

3. **Set Environment Variables**
   
   Create a `.env.production` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

### Deploy to Cloud Run

#### Method A: Using gcloud CLI (Quick Deploy)

```bash
# Build and deploy in one command
gcloud run deploy microsense \
  --source . \
  --region=asia-southeast1 \
  --platform=managed \
  --allow-unauthenticated \
  --port=8080 \
  --memory=512Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=10
```

#### Method B: Using Docker (More Control)

```bash
# 1. Build the Docker image
docker build -t gcr.io/$PROJECT_ID/microsense:latest .

# 2. Push to Google Container Registry
docker push gcr.io/$PROJECT_ID/microsense:latest

# 3. Deploy to Cloud Run
gcloud run deploy microsense \
  --image=gcr.io/$PROJECT_ID/microsense:latest \
  --region=asia-southeast1 \
  --platform=managed \
  --allow-unauthenticated \
  --port=8080 \
  --memory=512Mi \
  --cpu=1
```

#### Method C: Automatic Deployments with GitHub

```bash
# Connect your GitHub repository to Cloud Build
gcloud builds submit --config=cloudbuild.yaml

# Set up automatic deployments on git push
gcloud builds triggers create github \
  --repo-name=your-repo-name \
  --repo-owner=your-github-username \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

### Configure Environment Variables in Cloud Run

```bash
# Set Supabase credentials
gcloud run services update microsense \
  --region=asia-southeast1 \
  --update-env-vars \
    VITE_SUPABASE_URL=your_supabase_url,\
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key,\
    VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Get Your Deployment URL

```bash
gcloud run services describe microsense --region=asia-southeast1 --format='value(status.url)'
```

Your app will be available at: `https://microsense-XXXXX-an.a.run.app`

### Add Custom Domain (Optional)

```bash
# 1. Verify domain ownership
gcloud domains verify your-domain.com

# 2. Map domain to Cloud Run
gcloud run domain-mappings create \
  --service=microsense \
  --domain=your-domain.com \
  --region=asia-southeast1
```

## Option 2: Firebase Hosting (Alternative - Also Fast)

### Setup

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize Firebase
firebase init hosting

# Select options:
# - Use an existing project or create new one
# - Public directory: dist
# - Configure as single-page app: Yes
# - Set up automatic builds with GitHub: Yes (optional)
```

### Deploy

```bash
# Build your app
pnpm run build

# Deploy to Firebase
firebase deploy --only hosting
```

## Performance Comparison

| Platform | Cold Start | Asia-Pacific Latency | Cost (Est.) |
|----------|-----------|---------------------|-------------|
| **Cloud Run** | 1-2s | ~50-100ms | $0-5/month |
| **Vercel** | 2-5s | ~200-400ms | $0-20/month |
| **Firebase** | <1s | ~50-80ms | $0-2/month |

## Estimated Costs for Cloud Run

For a moderate-traffic app (10,000 requests/day):
- **Cloud Run**: ~$2-5/month
- **Container Registry**: ~$1/month
- **Total**: ~$3-6/month

First 2 million requests/month are FREE!

## Monitoring & Logs

```bash
# View logs
gcloud run services logs read microsense --region=asia-southeast1 --tail

# View metrics
# Visit: https://console.cloud.google.com/run
```

## Update Supabase CORS Settings

Add your Cloud Run URL to Supabase allowed origins:

1. Go to Supabase Dashboard → Settings → API
2. Add your Cloud Run URL to "Allowed origins"
   - Development: `http://localhost:5173`
   - Production: `https://microsense-XXXXX-an.a.run.app`

## Troubleshooting

### Build fails with environment variables

The Dockerfile builds the app during the Docker build process. If you need environment variables at build time:

```dockerfile
# Add before RUN pnpm run build
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_GOOGLE_MAPS_API_KEY

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY
```

Then build with:
```bash
docker build \
  --build-arg VITE_SUPABASE_URL=your_url \
  --build-arg VITE_SUPABASE_ANON_KEY=your_key \
  --build-arg VITE_GOOGLE_MAPS_API_KEY=your_key \
  -t gcr.io/$PROJECT_ID/microsense:latest .
```

### App shows blank page

Check nginx logs:
```bash
gcloud run services logs read microsense --region=asia-southeast1
```

Common issue: Environment variables not set correctly during build.

### Still slow performance

1. Enable Cloud CDN for static assets
2. Use Cloud Run in `asia-southeast1` (Singapore) - closest to Philippines
3. Set `--min-instances=1` to avoid cold starts (costs ~$5/month extra)

```bash
gcloud run services update microsense \
  --region=asia-southeast1 \
  --min-instances=1
```

## Cost Optimization

### Keep costs low:
```bash
# Set memory to minimum
--memory=256Mi

# Allow scaling to zero
--min-instances=0

# Set max instances
--max-instances=5
```

### For better performance:
```bash
# More memory for faster responses
--memory=1Gi

# Keep 1 instance always running (no cold starts)
--min-instances=1

# Allow more scaling
--max-instances=20
```

## Next Steps

1. Deploy using Method A (quickest)
2. Test your app at the provided URL
3. Update Supabase CORS settings
4. Add custom domain (optional)
5. Set up monitoring alerts
6. Configure automatic deployments from GitHub

## Support

- Google Cloud Run Docs: https://cloud.google.com/run/docs
- Cloud Run Pricing: https://cloud.google.com/run/pricing
- Community: https://stackoverflow.com/questions/tagged/google-cloud-run

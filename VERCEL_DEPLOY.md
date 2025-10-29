# Vercel Deployment Instructions for Standalone Guidelines App

## Important: Root Directory Configuration

When deploying to Vercel, you need to configure the **Root Directory** setting because the standalone app is in a subdirectory of the repository.

## Option 1: Vercel Dashboard (Recommended)

1. Go to your Vercel project settings
2. Navigate to **Settings** → **General**
3. Under **Root Directory**, set: `standalone-guidelines-app`
4. Save the settings
5. Redeploy

## Option 2: Vercel CLI

When using `vercel` CLI, specify the root directory:

```bash
cd standalone-guidelines-app
vercel --root standalone-guidelines-app
```

Or set it in `vercel.json` in the repository root (if deploying from root):

```json
{
  "buildCommand": "cd standalone-guidelines-app && npm install && npm run build",
  "devCommand": "cd standalone-guidelines-app && npm run dev",
  "installCommand": "cd standalone-guidelines-app && npm install",
  "framework": "nextjs",
  "outputDirectory": "standalone-guidelines-app/.next"
}
```

## Option 3: Separate Repository (Best for Independent Deployment)

For truly independent deployment, consider:

1. Create a new GitHub repository
2. Copy only the contents of `standalone-guidelines-app/` (not the folder itself)
3. Push to the new repository
4. Deploy that repository to Vercel

## Build Settings

- **Framework Preset**: Next.js
- **Root Directory**: `standalone-guidelines-app`
- **Build Command**: `npm run build` (or leave empty for auto-detection)
- **Output Directory**: `.next` (or leave empty for auto-detection)
- **Install Command**: `npm install` (or leave empty for auto-detection)

## Environment Variables

No environment variables are required for basic functionality.


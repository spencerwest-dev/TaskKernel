# Netlify Deployment Setup

## Live URL
https://taskkernel.netlify.app

## Why Netlify Instead of Vercel
Vercel free tier restricts deployments to the account owner only. Team members were unable to trigger deployments, making it incompatible with a shared team workflow. Netlify does not have this restriction.

## Configuration
- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `frontend/build`
- Branch: `main`
- Auto-deploys on every push to main
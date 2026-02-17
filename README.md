


  ## Running the code

### Frontend Only
Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

### Full Stack (with Backend & Database)
See **[HOW_TO_RUN.md](HOW_TO_RUN.md)** for complete setup instructions including:
- XAMPP MySQL setup
- Backend API server
- Database connection
- Local development workflow

## Deployment

This project is configured for automatic deployment to GitHub Pages.

### Frontend Deployment (Current)
- The site automatically deploys when changes are pushed to the `main` branch
- The live site is available at: https://wesle777.github.io/EmberGym/
- **Note:** Backend features (login, signup, booking) won't work without backend deployment

### Full Stack Deployment (Optional)
Want users to fully interact with your site? Deploy backend and database to the cloud!

**See [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md)** for step-by-step guide to:
- Deploy backend API to Railway (free tier)
- Deploy MySQL database to Railway
- Configure production environment
- Enable login, signup, booking, and all interactive features

### Setup Requirements
To enable frontend deployment, GitHub Pages must be configured in the repository settings:
1. Go to **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**

The first deployment may take a few minutes. Subsequent deployments will be automatic on every push to the main branch.
  

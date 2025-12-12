# Deployment Guide

## Frontend Deployment

### Local Deployment

#### Prerequisites
- Node.js 16+
- npm or yarn

#### Steps
```bash
# 1. Install dependencies
cd frontend
npm install

# 2. Build for production
npm run build

# 3. Output will be in 'dist/' folder
# 4. Serve using any static file server
npx serve dist
```

### Cloud Deployment Options

#### Option 1: Vercel (Recommended for React)
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Follow prompts and configure API endpoint for production
```

**Note:** Set environment variable in Vercel dashboard:
- `VITE_API_URL` = Your production backend URL

#### Option 2: Netlify
```bash
# 1. Connect GitHub repo to Netlify
# 2. Configure build command: npm run build
# 3. Set publish directory: dist

# Or use Netlify CLI:
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

**Environment Variables:**
Add in Netlify dashboard → Site settings → Build & deploy → Environment

#### Option 3: GitHub Pages
```bash
# 1. Update vite.config.js
# Add: base: '/repository-name/' if not root domain

# 2. Build
npm run build

# 3. Deploy dist folder to gh-pages branch
npm run deploy
```

#### Option 4: Docker
Create `frontend/Dockerfile`:
```dockerfile
# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve stage
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

Build and run:
```bash
docker build -t drowsiness-frontend .
docker run -p 3000:3000 drowsiness-frontend
```

#### Option 5: Azure Static Web Apps
```bash
# 1. Create resource in Azure Portal
# 2. Connect GitHub repository
# 3. Configure build settings:
#    - Build Preset: Vite
#    - App location: ./frontend
#    - Build output location: dist

# 4. Set environment variables in Static Web App settings
```

### Backend Deployment (Python)

#### Option 1: Heroku
```bash
# 1. Create Procfile in backend/
# echo 'web: uvicorn main:app --host 0.0.0.0 --port $PORT' > backend/Procfile

# 2. Deploy
git push heroku main
```

#### Option 2: Railway.app
```bash
# 1. Connect GitHub
# 2. Railway auto-detects Python
# 3. Set command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

#### Option 3: Render.com
```bash
# 1. Create new Web Service
# 2. Connect GitHub
# 3. Configure:
#    - Runtime: Python 3
#    - Build command: pip install -r requirements.txt
#    - Start command: uvicorn main:app --host 0.0.0.0 --port 10000
```

#### Option 4: Docker + Cloud Run (Google Cloud)
Create `backend/Dockerfile`:
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Deploy:
```bash
gcloud builds submit --tag gcr.io/PROJECT-ID/drowsiness-backend
gcloud run deploy drowsiness-backend --image gcr.io/PROJECT-ID/drowsiness-backend
```

### Full Stack Deployment (Docker Compose)

Create `docker-compose.yml` in project root:
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - PYTHONUNBUFFERED=1
    
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    environment:
      - VITE_API_URL=http://backend:8000
```

Run:
```bash
docker-compose up --build
```

## Environment Variables

### Frontend (.env or dashboard)
```
VITE_API_URL=https://your-backend-api.com
VITE_API_TIMEOUT=30000
```

### Backend (.env)
```
CORS_ORIGINS=https://your-frontend-domain.com
LOG_LEVEL=info
WORKERS=4
```

## Continuous Integration/Deployment (CI/CD)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install and Build
        run: |
          cd frontend
          npm install
          npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend
```

## Performance Optimization

### Frontend
- Enable gzip compression in web server
- Use CDN for static assets
- Optimize images and bundle size
- Implement lazy loading

### Backend
- Use reverse proxy (nginx)
- Enable caching headers
- Use async workers (uvicorn with multiple workers)
- Optimize ML model inference

## Monitoring & Logging

### Frontend
- Use Sentry for error tracking
- Google Analytics for usage tracking
- Performance monitoring with Web Vitals

### Backend
- Use structured logging
- Monitor API response times
- Track ML model performance
- Set up alerts for errors

## SSL/HTTPS

Most deployment platforms provide free SSL:
- Vercel: Automatic
- Netlify: Automatic
- GitHub Pages: Automatic
- Firebase: Automatic
- Custom domain: Use Let's Encrypt

## Database (if needed for future)

For storing predictions or user data:
- MongoDB Atlas (NoSQL)
- PostgreSQL on Railway/Render
- Firestore (Google Cloud)
- Supabase (PostgreSQL wrapper)

## Scaling Considerations

### Horizontal Scaling
- Deploy multiple backend instances
- Use load balancer (nginx, HAProxy)
- Cache API responses

### Vertical Scaling
- Upgrade server resources
- Optimize ML model inference
- Use GPU for faster predictions

## Troubleshooting Deployment

### CORS Errors
Add to backend:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Webcam Access Issues
- Browsers require HTTPS for webcam access
- Use localhost for development
- Check browser permissions

### API Timeout
- Increase timeout in frontend
- Optimize backend response time
- Use async operations

### Build Failures
- Check Node/Python versions
- Verify all dependencies installed
- Check environment variables

## Checklist Before Deploy

- [ ] Update API URL for production
- [ ] Optimize images and assets
- [ ] Test in production-like environment
- [ ] Set up monitoring/logging
- [ ] Configure error handling
- [ ] Enable HTTPS
- [ ] Test with real webcam
- [ ] Performance test
- [ ] Security audit
- [ ] Documentation updated

---

For more help, refer to specific platform documentation.

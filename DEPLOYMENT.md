# Deployment Guide for Gen Design AI

## Overview

This guide covers deploying both the Figma plugin and the API server for production use.

## Plugin Deployment

### 1. Production Build

```bash
cd plugin
yarn build
```

### 2. Publishing to Figma Community

1. **Prepare Assets:**
   - Icon: 128x128px PNG
   - Cover image: 1920x1080px
   - Screenshots: At least 3 showing key features

2. **Update Manifest:**
   ```json
   {
     "id": "gen-design-ai",
     "name": "Gen Design AI",
     "api": "1.0.0",
     "main": "build/main.js",
     "ui": "build/ui.js",
     "editorType": ["figma"],
     "permissions": ["teamlibrary"],
     "relaunchButtons": [
       {"command": "open", "name": "Open Gen Design AI"}
     ]
   }
   ```

3. **Submit for Review:**
   - Go to figma.com/community/plugins
   - Click "Publish a plugin"
   - Upload your manifest and assets
   - Fill in description and tags
   - Submit for review

### 3. Private Distribution

For team/enterprise use:

1. Share the plugin files directly
2. Or use Figma's organization library feature
3. Provide installation instructions

## API Server Deployment

### 1. Environment Setup

Create production `.env`:

```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/gendesign"

# API Keys
OPENROUTER_API_KEY="your-production-key"
OPENAI_API_KEY="your-openai-key"
ANTHROPIC_API_KEY="your-anthropic-key"

# Auth
NEXTAUTH_SECRET="generate-secure-secret"
NEXTAUTH_URL="https://your-domain.com"

# Site
SITE_URL="https://your-domain.com"
```

### 2. Database Setup

```bash
# Run migrations
cd website
npx prisma migrate deploy

# Seed initial data (optional)
npx prisma db seed
```

### 3. Deployment Options

#### Option A: Vercel (Recommended)

1. **Connect Repository:**
   ```bash
   vercel link
   ```

2. **Configure:**
   ```bash
   vercel env add DATABASE_URL
   vercel env add OPENROUTER_API_KEY
   # Add all other env vars
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

#### Option B: Docker

1. **Create Dockerfile:**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN yarn install --frozen-lockfile
   COPY . .
   RUN yarn build
   EXPOSE 3000
   CMD ["yarn", "start"]
   ```

2. **Build and Run:**
   ```bash
   docker build -t gen-design-api .
   docker run -p 3000:3000 --env-file .env gen-design-api
   ```

#### Option C: Traditional VPS

1. **Setup Server:**
   ```bash
   # Install Node.js 18+
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2
   npm install -g pm2

   # Clone repository
   git clone https://github.com/your-repo/gen-design.git
   cd gen-design/website
   ```

2. **Install Dependencies:**
   ```bash
   yarn install
   yarn build
   ```

3. **Start with PM2:**
   ```bash
   pm2 start yarn --name "gen-design-api" -- start
   pm2 save
   pm2 startup
   ```

### 4. Configure Plugin for Production

Update the API URL in `plugin/src/api.ts`:

```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.your-domain.com/api'
  : 'http://localhost:3000/api'
```

## Security Considerations

### 1. API Security

- [ ] Enable rate limiting
- [ ] Implement proper authentication
- [ ] Use HTTPS only
- [ ] Validate all inputs
- [ ] Sanitize LLM responses

### 2. Environment Variables

- [ ] Never commit `.env` files
- [ ] Use secure secret generation
- [ ] Rotate API keys regularly
- [ ] Use different keys for dev/prod

### 3. CORS Configuration

Update `next.config.js` for production:

```javascript
headers: [
  {
    source: '/api/:path*',
    headers: [
      { key: 'Access-Control-Allow-Origin', value: 'https://www.figma.com' },
      // ... other headers
    ],
  },
]
```

## Monitoring

### 1. Application Monitoring

```javascript
// Add to website/src/app/api/route.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
})
```

### 2. Logging

```javascript
// Use structured logging
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
})
```

### 3. Health Checks

Create `/api/health` endpoint:

```typescript
export async function GET() {
  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`
    
    // Check external APIs
    const openRouterStatus = await checkOpenRouter()
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        openRouter: openRouterStatus
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      error: error.message
    }, { status: 503 })
  }
}
```

## Scaling Considerations

### 1. Database

- Use connection pooling
- Add read replicas for scale
- Implement caching (Redis)

### 2. API Optimization

- Cache LLM responses
- Implement request queuing
- Use CDN for static assets

### 3. Rate Limiting

```typescript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
```

## Backup Strategy

### 1. Database Backups

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://your-backup-bucket/
```

### 2. Code Backups

- Use Git tags for releases
- Keep 3 previous versions deployed
- Document rollback procedures

## Updates and Maintenance

### 1. Plugin Updates

1. Update version in manifest.json
2. Build and test thoroughly
3. Submit update to Figma
4. Notify users of changes

### 2. API Updates

1. Test in staging environment
2. Run database migrations
3. Deploy with zero downtime
4. Monitor for errors

### 3. Dependency Updates

```bash
# Check for updates
yarn outdated

# Update dependencies
yarn upgrade-interactive

# Test after updates
yarn test
```

## Support

### User Documentation

- Create user guide with screenshots
- Record video tutorials
- Maintain FAQ section

### Issue Tracking

- Use GitHub Issues for bugs
- Create templates for reports
- Respond within 24-48 hours

### Communication

- Set up status page
- Create changelog
- Send update notifications
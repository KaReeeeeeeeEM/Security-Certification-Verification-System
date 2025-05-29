# Deployment Guide

This guide covers deploying the Secure Certificate Verification System to various platforms.

## 🚀 Quick Deployment Options

### 1. Heroku (Recommended for beginners)

\`\`\`bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create new app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI="your-mongodb-atlas-uri"
heroku config:set JWT_SECRET="your-jwt-secret-32-chars"
heroku config:set ENCRYPTION_KEY="your-encryption-key-32-chars"
heroku config:set NODE_ENV="production"

# Deploy
git push heroku main

# Open app
heroku open
\`\`\`

### 2. Vercel (Frontend) + Railway (Backend)

#### Frontend on Vercel:
\`\`\`bash
cd client
npx vercel --prod
\`\`\`

#### Backend on Railway:
1. Connect GitHub repo to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on git push

### 3. Docker Deployment

\`\`\`bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t certificate-verification .
docker run -p 5000:5000 certificate-verification
\`\`\`

## 🔧 Environment Variables for Production

\`\`\`env
# Required for all deployments
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/certificate_verification
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters
ENCRYPTION_KEY=your-32-character-encryption-key-exactly
NODE_ENV=production

# Optional for enhanced security
FRONTEND_URL=https://your-frontend-domain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
\`\`\`

## 🛡️ Production Security Checklist

- [ ] Strong JWT secret (32+ characters)
- [ ] Secure encryption key (exactly 32 characters)
- [ ] MongoDB Atlas IP whitelist configured
- [ ] HTTPS enabled with SSL certificates
- [ ] CORS configured for production domain
- [ ] Rate limiting enabled
- [ ] Input validation active
- [ ] Security headers configured
- [ ] Database backups scheduled
- [ ] Monitoring and logging set up

## 📊 Performance Optimization

### Database Optimization
- Enable MongoDB Atlas auto-scaling
- Set up database indexes
- Configure connection pooling
- Implement query optimization

### Application Optimization
- Enable gzip compression
- Configure CDN for static assets
- Implement caching strategies
- Monitor memory usage

## 🔍 Monitoring & Maintenance

### Health Checks
- Set up uptime monitoring
- Configure error tracking
- Monitor database performance
- Track API response times

### Backup Strategy
- Automated MongoDB Atlas backups
- Regular database exports
- Code repository backups
- Environment variable backups

## 🆘 Troubleshooting

### Common Deployment Issues

#### MongoDB Connection
\`\`\`bash
# Test connection
node -e "require('mongoose').connect('your-uri').then(() => console.log('Connected')).catch(console.error)"
\`\`\`

#### Environment Variables
\`\`\`bash
# Check if variables are set
heroku config  # For Heroku
# or check in platform dashboard
\`\`\`

#### Build Errors
\`\`\`bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
\`\`\`

## 📞 Support

For deployment assistance:
- Check platform documentation
- Review error logs
- Contact platform support
- Create GitHub issue for app-specific problems

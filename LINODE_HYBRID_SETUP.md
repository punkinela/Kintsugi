# Linode + Netlify Hybrid Architecture Setup Guide

## 🎯 Architecture Overview

### **Current Setup** (Phase 1)
```
┌─────────────────────────────────────────┐
│         Netlify (Frontend)              │
│  ┌────────────────────────────────┐    │
│  │  Next.js App (Static + SSR)    │    │
│  │  - React components             │    │
│  │  - Client-side AI (localStorage)│    │
│  │  - No backend needed            │    │
│  └────────────────────────────────┘    │
│         ↓ Deploy from GitHub            │
└─────────────────────────────────────────┘
```

### **Future Setup** (Phase 2 - Hybrid)
```
┌──────────────────────────────────────────────────────────────┐
│                      USER BROWSER                             │
└──────────────────┬───────────────────────────────────────────┘
                   │
        ┌──────────┴─────────────┐
        │                        │
        ▼                        ▼
┌──────────────────┐    ┌──────────────────────────────────┐
│  Netlify (CDN)   │    │  Linode (Backend API)            │
│  ┌────────────┐  │    │  ┌────────────────────────────┐ │
│  │ Static     │  │    │  │  Node.js/Express Server    │ │
│  │ Assets     │  │    │  │  ┌──────────────────────┐  │ │
│  │ (HTML/CSS/ │  │    │  │  │ AI Processing        │  │ │
│  │  JS/Images)│  │    │  │  │ - OpenAI API calls   │  │ │
│  └────────────┘  │    │  │  │ - Lightcast Skills   │  │ │
│                  │    │  │  │ - Heavy ML models    │  │ │
│  ┌────────────┐  │    │  │  └──────────────────────┘  │ │
│  │ Next.js    │◄─┼────┼──┤  ┌──────────────────────┐  │ │
│  │ Server     │  │    │  │  │ Database (Optional)  │  │ │
│  │ (SSR)      │  │    │  │  │ - PostgreSQL         │  │ │
│  └────────────┘  │    │  │  │ - User profiles      │  │ │
│                  │    │  │  │ - Cloud sync         │  │ │
│  Auto-deploy     │    │  │  └──────────────────────┘  │ │
│  from GitHub     │    │  └────────────────────────────┘ │
└──────────────────┘    └──────────────────────────────────┘
        ▲                              ▲
        │                              │
        └──HTTPS (auto)                └──HTTPS (Let's Encrypt)
```

---

## 📋 Prerequisites

### **You Need**
- ✅ Linode account (you have this!)
- ✅ Domain name (you already bought this!)
- ✅ GitHub repository (existing)
- ✅ Netlify account (free tier)
- ✅ Node.js knowledge

### **Estimated Costs**
| Service | Tier | Cost/Month | Notes |
|---------|------|------------|-------|
| **Netlify** | Starter | $0 | 100GB bandwidth, auto-deploy |
| **Linode** | Nanode 1GB | $5 | Sufficient for MVP backend |
| **Domain** | - | $12/year | You already have! |
| **SSL Certs** | - | $0 | Free (Let's Encrypt) |
| **Total** | - | **~$5/month** | Very affordable! |

---

## 🚀 Phase 1: Keep Current Setup (Netlify Only)

### **What You Have Now**
✅ Frontend deployed on Netlify
✅ Auto-deploys from GitHub
✅ Free HTTPS
✅ CDN included
✅ All AI processing happens in browser (localStorage)

### **Keep This!**
Don't break what works. Add Linode as **optional enhancement**, not replacement.

---

## 🔧 Phase 2: Add Linode Backend (Step-by-Step)

### **Step 1: Create Linode Instance**

#### 1.1 Choose Distribution
```bash
# Recommended: Ubuntu 22.04 LTS
# Why: Stable, well-documented, long-term support
```

#### 1.2 Select Plan
```
Nanode 1GB: $5/month
├─ 1 CPU core
├─ 1GB RAM
├─ 25GB SSD storage
├─ 1TB transfer
└─ Perfect for API server
```

#### 1.3 Choose Region
```
Closest to your users:
- US East (Newark) - if targeting US East Coast
- US West (Fremont) - if targeting US West Coast
- EU (Frankfurt) - if targeting Europe
```

#### 1.4 Set Root Password
```bash
# Use strong password (20+ characters)
# Example generator: openssl rand -base64 32
```

#### 1.5 SSH Keys (Recommended)
```bash
# On your local machine:
ssh-keygen -t ed25519 -C "kintsugi-linode"

# Save to: ~/.ssh/kintsugi_linode
# Copy public key:
cat ~/.ssh/kintsugi_linode.pub

# Paste into Linode "SSH Keys" section
```

---

### **Step 2: Initial Server Setup**

#### 2.1 Connect to Server
```bash
# Use IP address from Linode dashboard
ssh root@YOUR_LINODE_IP

# First login will ask to verify fingerprint - type "yes"
```

#### 2.2 Update System
```bash
# Update package list
sudo apt update

# Upgrade installed packages
sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl git build-essential ufw
```

#### 2.3 Create Non-Root User
```bash
# Create user
adduser kintsugi

# Add to sudo group
usermod -aG sudo kintsugi

# Copy SSH keys to new user
rsync --archive --chown=kintsugi:kintsugi ~/.ssh /home/kintsugi
```

#### 2.4 Configure Firewall
```bash
# Allow SSH
sudo ufw allow OpenSSH

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

### **Step 3: Install Node.js**

#### 3.1 Install NVM (Node Version Manager)
```bash
# Switch to kintsugi user
su - kintsugi

# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Load NVM
source ~/.bashrc

# Verify installation
nvm --version
```

#### 3.2 Install Node.js
```bash
# Install LTS version
nvm install --lts

# Verify
node --version  # Should show v20.x.x or similar
npm --version   # Should show v10.x.x or similar
```

#### 3.3 Install PM2 (Process Manager)
```bash
# Install globally
npm install -g pm2

# Configure PM2 to start on boot
pm2 startup systemd

# Follow the command it outputs (will be specific to your user)
```

---

### **Step 4: Create Backend API**

#### 4.1 Project Structure
```bash
# Create project directory
mkdir -p ~/kintsugi-backend
cd ~/kintsugi-backend

# Initialize Node project
npm init -y

# Install dependencies
npm install express cors dotenv helmet morgan
npm install --save-dev nodemon typescript @types/express @types/node
```

#### 4.2 Backend Code (`server.js`)

```javascript
// ~/kintsugi-backend/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json()); // Parse JSON bodies
app.use(morgan('combined')); // Logging

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ============================================
// AI ENDPOINTS
// ============================================

// 1. Voice Profile Analysis (Heavy Processing)
app.post('/api/ai/analyze-voice', async (req, res) => {
  try {
    const { text } = req.body;

    // TODO: Implement voice analysis logic
    // This is where you'd call OpenAI API or run ML models

    res.json({
      formality: 7,
      avgSentenceLength: 14,
      activeVoicePercentage: 85,
      commonWords: ['project', 'team', 'delivered'],
      confidenceScore: 75
    });
  } catch (error) {
    console.error('Voice analysis error:', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

// 2. Performance Review Generation
app.post('/api/ai/generate-review', async (req, res) => {
  try {
    const { entries, timeframe, voiceProfile } = req.body;

    // TODO: Call OpenAI API with voice-matched prompt

    res.json({
      summary: 'Generated summary...',
      sections: [
        {
          title: 'Key Accomplishments',
          content: 'Led multiple high-impact projects...',
          bullets: ['Delivered X', 'Improved Y', 'Reduced Z']
        }
      ]
    });
  } catch (error) {
    console.error('Review generation error:', error);
    res.status(500).json({ error: 'Generation failed' });
  }
});

// 3. Skills Extraction (Lightcast API)
app.post('/api/ai/extract-skills', async (req, res) => {
  try {
    const { text } = req.body;

    // TODO: Call Lightcast Skills API
    // const response = await fetch('https://api.lightcast.io/...');

    res.json({
      skills: [
        { name: 'Project Management', confidence: 0.92 },
        { name: 'Cross-functional Leadership', confidence: 0.85 },
        { name: 'Problem Solving', confidence: 0.78 }
      ]
    });
  } catch (error) {
    console.error('Skill extraction error:', error);
    res.status(500).json({ error: 'Extraction failed' });
  }
});

// 4. Pattern Recognition (Heavy ML)
app.post('/api/ai/detect-patterns', async (req, res) => {
  try {
    const { entries } = req.body;

    // TODO: Run pattern detection algorithms

    res.json({
      patterns: [
        {
          type: 'strength',
          title: 'Consistent Problem-Solving',
          description: 'You mention problem-solving in 72% of entries',
          confidence: 85
        }
      ]
    });
  } catch (error) {
    console.error('Pattern detection error:', error);
    res.status(500).json({ error: 'Detection failed' });
  }
});

// 5. Resume Generator
app.post('/api/ai/generate-resume', async (req, res) => {
  try {
    const { entries, format } = req.body;

    // TODO: Convert entries to ATS-optimized resume bullets

    res.json({
      bullets: [
        'Led cross-functional team of 8 through organizational restructuring, maintaining 95% retention',
        'Implemented automated testing pipeline, reducing deployment time by 40%'
      ]
    });
  } catch (error) {
    console.error('Resume generation error:', error);
    res.status(500).json({ error: 'Generation failed' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Kintsugi Backend running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 CORS enabled for: ${process.env.FRONTEND_URL}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
```

#### 4.3 Environment Variables (`.env`)
```bash
# ~/kintsugi-backend/.env
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com

# API Keys (get these from respective services)
OPENAI_API_KEY=sk-...
LIGHTCAST_CLIENT_ID=your_client_id
LIGHTCAST_CLIENT_SECRET=your_client_secret

# Database (optional, for later)
DATABASE_URL=postgresql://user:password@localhost:5432/kintsugi
```

#### 4.4 Package.json Scripts
```json
{
  "name": "kintsugi-backend",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "pm2:start": "pm2 start server.js --name kintsugi-api",
    "pm2:stop": "pm2 stop kintsugi-api",
    "pm2:restart": "pm2 restart kintsugi-api",
    "pm2:logs": "pm2 logs kintsugi-api"
  }
}
```

---

### **Step 5: Deploy Backend with PM2**

```bash
# Start with PM2
cd ~/kintsugi-backend
pm2 start server.js --name kintsugi-api

# Save PM2 process list
pm2 save

# Check status
pm2 status

# View logs
pm2 logs kintsugi-api

# Monitor
pm2 monit
```

---

### **Step 6: Configure Nginx (Reverse Proxy)**

#### 6.1 Install Nginx
```bash
sudo apt install -y nginx
```

#### 6.2 Create Nginx Config
```bash
sudo nano /etc/nginx/sites-available/kintsugi-api
```

```nginx
# /etc/nginx/sites-available/kintsugi-api

upstream kintsugi_backend {
    server 127.0.0.1:3001;
    keepalive 64;
}

server {
    listen 80;
    server_name api.yourdomain.com;  # Use your domain!

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Logging
    access_log /var/log/nginx/kintsugi-api.access.log;
    error_log /var/log/nginx/kintsugi-api.error.log;

    # Proxy to Node.js backend
    location / {
        proxy_pass http://kintsugi_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check endpoint (for monitoring)
    location /health {
        proxy_pass http://kintsugi_backend/health;
        access_log off;
    }
}
```

#### 6.3 Enable Site
```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/kintsugi-api /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

### **Step 7: SSL Certificate (Let's Encrypt)**

#### 7.1 Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

#### 7.2 Obtain Certificate
```bash
# Replace with your domain
sudo certbot --nginx -d api.yourdomain.com

# Follow prompts:
# - Enter email
# - Agree to terms
# - Choose: Redirect HTTP to HTTPS (option 2)
```

#### 7.3 Auto-Renewal
```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot auto-creates cron job for renewal
# Check with:
sudo systemctl status certbot.timer
```

---

### **Step 8: Domain Configuration**

#### 8.1 Point Domain to Linode
```
In your domain registrar (GoDaddy, Namecheap, etc.):

A Record:
  Host: api
  Points to: YOUR_LINODE_IP
  TTL: 3600

Example:
  api.yourdomain.com → 192.0.2.123
```

#### 8.2 Verify DNS Propagation
```bash
# Check DNS
dig api.yourdomain.com

# Or use online tool:
# https://www.whatsmydns.net/
```

---

### **Step 9: Connect Frontend to Backend**

#### 9.1 Create API Client (`utils/api.ts`)

```typescript
// utils/api.ts (in your Next.js frontend)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function analyzeVoice(text: string) {
  const response = await fetch(`${API_BASE_URL}/api/ai/analyze-voice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });

  if (!response.ok) {
    throw new Error('Voice analysis failed');
  }

  return response.json();
}

export async function generatePerformanceReview(
  entries: any[],
  timeframe: string,
  voiceProfile?: any
) {
  const response = await fetch(`${API_BASE_URL}/api/ai/generate-review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ entries, timeframe, voiceProfile })
  });

  if (!response.ok) {
    throw new Error('Review generation failed');
  }

  return response.json();
}

export async function extractSkills(text: string) {
  const response = await fetch(`${API_BASE_URL}/api/ai/extract-skills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });

  if (!response.ok) {
    throw new Error('Skill extraction failed');
  }

  return response.json();
}

export async function detectPatterns(entries: any[]) {
  const response = await fetch(`${API_BASE_URL}/api/ai/detect-patterns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ entries })
  });

  if (!response.ok) {
    throw new Error('Pattern detection failed');
  }

  return response.json();
}

export async function generateResume(entries: any[], format: string = 'bullets') {
  const response = await fetch(`${API_BASE_URL}/api/ai/generate-resume`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ entries, format })
  });

  if (!response.ok) {
    throw new Error('Resume generation failed');
  }

  return response.json();
}
```

#### 9.2 Environment Variables (Netlify)

```bash
# In Netlify dashboard → Site settings → Environment variables

NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

#### 9.3 Update Components to Use API

```typescript
// Example: components/AIPerformanceReviewGenerator.tsx

import { generatePerformanceReview } from '@/utils/api';

const handleGenerate = async () => {
  setIsGenerating(true);

  try {
    const filteredEntries = getFilteredEntries();
    const timeframeText = timeframe === 'custom' ? `the past ${customDays} days` : `this ${timeframe}`;

    // Call backend API instead of local generation
    const generated = await generatePerformanceReview(
      filteredEntries,
      timeframeText,
      voiceStatus?.enabled ? voiceProfile : null
    );

    setReview(generated);
  } catch (error) {
    console.error('Generation failed:', error);
    // Fallback to local generation if backend fails
    const fallbackReview = generatePerformanceReviewLocally(filteredEntries, timeframeText);
    setReview({ ...fallbackReview, voiceApplied: false });
  } finally {
    setIsGenerating(false);
  }
};
```

---

## 🔒 Security Best Practices

### **1. API Key Management**
```bash
# NEVER commit .env to Git
echo ".env" >> .gitignore

# Use environment variables
export OPENAI_API_KEY="sk-..."

# Rotate keys regularly
```

### **2. Rate Limiting**
```javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', apiLimiter);
```

### **3. Input Validation**
```javascript
const { body, validationResult } = require('express-validator');

app.post('/api/ai/analyze-voice',
  body('text').isString().trim().isLength({ min: 50, max: 10000 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // ... rest of handler
  }
);
```

### **4. HTTPS Everywhere**
```nginx
# Force HTTPS redirect
server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$host$request_uri;
}
```

### **5. Process-and-Delete Privacy Model**
```javascript
// Process AI request
app.post('/api/ai/analyze-voice', async (req, res) => {
  const { text } = req.body;

  // Process
  const result = await analyzeVoice(text);

  // NEVER store user data
  // Delete from memory immediately after response

  res.json(result);

  // Explicit cleanup
  delete req.body.text;
});
```

---

## 📊 Monitoring & Maintenance

### **1. Server Monitoring**
```bash
# Install htop
sudo apt install htop

# Monitor resources
htop

# Check disk usage
df -h

# Check memory
free -h
```

### **2. PM2 Monitoring**
```bash
# Real-time monitoring
pm2 monit

# CPU/Memory usage
pm2 list

# Detailed info
pm2 show kintsugi-api
```

### **3. Nginx Logs**
```bash
# Access logs
sudo tail -f /var/log/nginx/kintsugi-api.access.log

# Error logs
sudo tail -f /var/log/nginx/kintsugi-api.error.log
```

### **4. Application Logs**
```bash
# PM2 logs
pm2 logs kintsugi-api

# Real-time logs
pm2 logs kintsugi-api --lines 100
```

---

## 🚨 Troubleshooting

### **Issue: Can't Connect to Backend**
```bash
# Check if Node server is running
pm2 status

# Check if Nginx is running
sudo systemctl status nginx

# Check firewall
sudo ufw status

# Test from server itself
curl http://localhost:3001/health

# Test from outside
curl https://api.yourdomain.com/health
```

### **Issue: SSL Certificate Problems**
```bash
# Check certificate status
sudo certbot certificates

# Renew manually
sudo certbot renew

# Check Nginx config
sudo nginx -t
```

### **Issue: High Memory Usage**
```bash
# Check processes
htop

# Restart PM2 app
pm2 restart kintsugi-api

# Check for memory leaks in code
pm2 monit
```

---

## 💰 Cost Optimization

### **Free Tier Options**
- **Netlify**: 100GB bandwidth/month (free)
- **Lightcast Skills API**: 1,000 API calls/month (free)
- **Let's Encrypt SSL**: Unlimited certificates (free)

### **Paid Services (When Needed)**
- **OpenAI API**: ~$0.002 per 1K tokens (pay-as-you-go)
- **Linode**: $5/month (smallest instance sufficient for MVP)
- **PostgreSQL**: Use Linode's included storage (free)

### **Scaling Strategy**
```
Users 0-100:    Linode Nanode ($5/mo) ✅ Current
Users 100-1K:   Linode 2GB ($10/mo)
Users 1K-10K:   Linode 4GB ($20/mo)
Users 10K+:     Consider managed services (DigitalOcean App Platform, Railway, etc.)
```

---

## 📈 Performance Optimization

### **1. Caching**
```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes

app.post('/api/ai/extract-skills', async (req, res) => {
  const { text } = req.body;
  const cacheKey = `skills_${hash(text)}`;

  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  // Process if not cached
  const result = await extractSkills(text);
  cache.set(cacheKey, result);

  res.json(result);
});
```

### **2. Database Connection Pooling** (When you add DB)
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### **3. Compression**
```javascript
const compression = require('compression');
app.use(compression());
```

---

## 🎯 Deployment Checklist

### **Before Going Live**
- [ ] All environment variables set
- [ ] Firewall configured (UFW)
- [ ] SSL certificate installed
- [ ] PM2 configured for auto-restart
- [ ] Nginx reverse proxy working
- [ ] Domain DNS propagated
- [ ] Health check endpoint responding
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Logging configured
- [ ] Monitoring set up

### **After Going Live**
- [ ] Test all API endpoints
- [ ] Monitor server resources
- [ ] Check error logs
- [ ] Verify SSL certificate
- [ ] Test from different locations
- [ ] Load test (optional)

---

## 🔄 Update Workflow

### **Updating Backend Code**
```bash
# SSH into server
ssh kintsugi@YOUR_LINODE_IP

# Navigate to project
cd ~/kintsugi-backend

# Pull latest code (if using Git)
git pull origin main

# Install new dependencies
npm install

# Restart with PM2
pm2 restart kintsugi-api

# Check logs
pm2 logs kintsugi-api --lines 50
```

### **Automated Deployment** (Advanced)
```bash
# Use GitHub Actions to deploy to Linode
# (Setup guide in separate document if needed)
```

---

## 📚 Resources & Next Steps

### **Documentation**
- [Linode Docs](https://www.linode.com/docs/)
- [Nginx Docs](https://nginx.org/en/docs/)
- [PM2 Docs](https://pm2.keymetrics.io/docs/)
- [Let's Encrypt Docs](https://letsencrypt.org/docs/)

### **Next Steps**
1. Set up PostgreSQL database (for user accounts)
2. Implement user authentication (JWT)
3. Add OpenAI API integration
4. Add Lightcast Skills API
5. Set up error tracking (Sentry)
6. Add analytics (Plausible, privacy-focused)

---

## 🎓 Summary

**What You'll Have After This Setup**:
```
✅ Next.js frontend on Netlify (free, auto-deploy)
✅ Node.js backend API on Linode ($5/month)
✅ HTTPS everywhere (free SSL)
✅ Scalable architecture (add features without breaking existing)
✅ Privacy-first (process-and-delete model)
✅ Production-ready (PM2, Nginx, monitoring)
```

**Total Setup Time**: 2-4 hours (first time)

**Monthly Cost**: ~$5 (Linode only, everything else free)

**Scalability**: Can handle thousands of users before needing upgrades

---

Good luck with your setup! 🚀

**Questions?** Check the troubleshooting section or reach out for help.

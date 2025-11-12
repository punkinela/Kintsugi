# Linode Setup Checklist for Kintsugi App

This checklist contains all the information you need to gather before setting up your Kintsugi app on Linode.

## ✅ Account & Billing Information

- [ ] **Linode Account**: Create account at https://www.linode.com
- [ ] **Payment Method**: Credit card or PayPal ready
- [ ] **Budget**: Determine monthly hosting budget
  - Nanode 1GB: $5/month (good for testing/small class demos)
  - Linode 2GB: $12/month (recommended for class project)
  - Linode 4GB: $24/month (if expecting heavy usage)

## ✅ Instance Configuration Details

### Basic Server Info
- [ ] **Region/Datacenter**: Choose closest to your location
  - US East (Newark, NJ)
  - US Central (Dallas, TX)
  - US West (Fremont, CA)
  - US Southeast (Atlanta, GA)
  - Or international options

- [ ] **Linode Plan**: Select based on expected usage
  - Recommended: **Linode 2GB** for AI class demo
  - Instance Type: **Shared CPU** (most cost-effective)

- [ ] **Linux Distribution**:
  - Recommended: **Ubuntu 22.04 LTS** or **Ubuntu 24.04 LTS**

### Security Setup
- [ ] **Root Password**: Create a strong root password (save securely!)
- [ ] **SSH Key**: Generate SSH key pair for secure access
  ```bash
  # On your local machine:
  ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
  ```
- [ ] **Limited User**: Plan username for non-root user
- [ ] **Firewall Rules**: Will configure UFW (Uncomplicated Firewall)

## ✅ Domain & DNS (Optional but Recommended)

- [ ] **Domain Name**: Do you have a custom domain? (e.g., kintsugi-app.com)
  - If yes: Note domain registrar (GoDaddy, Namecheap, etc.)
  - If no: Can use Linode's default IP address

- [ ] **DNS Configuration Access**: Login credentials for domain registrar
- [ ] **Subdomain Choice**: What subdomain to use? (e.g., app.yourdomain.com)

## ✅ Application Environment Variables

You'll need these from your current development setup:

- [ ] **Database Connection**:
  - Current database type: ________________
  - Will you use Supabase, Firebase, or local database?
  - Database credentials ready

- [ ] **Environment Variables** from `.env.local`:
  ```
  NEXT_PUBLIC_APP_URL=
  DATABASE_URL=
  NEXTAUTH_SECRET=
  NEXTAUTH_URL=
  # Add any other env vars your app uses
  ```

## ✅ SSL/HTTPS Certificate

- [ ] **SSL Certificate**:
  - Will use **Let's Encrypt** (free, automatic)
  - Or custom SSL certificate?

- [ ] **Email for SSL**: Email address for Let's Encrypt notifications

## ✅ Deployment Strategy

- [ ] **Deployment Method**: Choose one:
  - [ ] **Option 1**: Manual deployment (npm build + serve)
  - [ ] **Option 2**: PM2 process manager (recommended)
  - [ ] **Option 3**: Docker container
  - [ ] **Option 4**: Nginx reverse proxy + Node.js

- [ ] **Port Configuration**:
  - Default Next.js: Port 3000
  - Production: Port 80 (HTTP) and 443 (HTTPS)

## ✅ Monitoring & Backups

- [ ] **Backup Strategy**:
  - Linode Backups ($2/month) - recommended for peace of mind
  - Or manual backup schedule?

- [ ] **Monitoring Tools**:
  - Linode Cloud Manager (built-in)
  - Additional monitoring needed?

## ✅ Data Migration

- [ ] **Current Data Export**: Export data from local storage
  - Journal entries
  - User profiles
  - Pottery styles/themes
  - Voice profiles

- [ ] **Migration Plan**: How will you transfer data to production?

## ✅ Software Requirements (Will Install on Linode)

These will be installed during setup - just noting for reference:

- [ ] Node.js (v18 or v20 LTS)
- [ ] npm or yarn
- [ ] Git
- [ ] Nginx (for reverse proxy)
- [ ] PM2 (for process management)
- [ ] UFW (firewall)
- [ ] Certbot (for SSL certificates)

## ✅ Pre-Deployment Testing

- [ ] **Local Production Build**: Test that `npm run build` works locally
- [ ] **Environment Variables**: All secrets documented
- [ ] **Dependencies**: All packages in package.json
- [ ] **Database Schema**: Database migrations ready (if applicable)

## 📋 Information Summary Sheet

**Fill this out and keep handy during setup:**

```
LINODE INSTANCE INFO
===================
Region: _______________________
Plan: _________________________
OS: Ubuntu _____ LTS
Root Password: (saved in password manager)
SSH Key: (saved at ~/.ssh/id_rsa.pub)

DOMAIN INFO
===========
Domain Name: __________________
Registrar: ____________________
DNS A Record: linode-ip-address
SSL Email: ____________________

APP INFO
========
GitHub Repo: https://github.com/punkinela/Kintsugi
Branch to Deploy: _____________
Node Version: _________________
Build Command: npm run build
Start Command: npm start (or PM2)

DATABASE INFO
=============
Type: _________________________
Host: _________________________
Connection String: (in .env)

CONTACTS
========
Linode Support: support.linode.com
Your Email: ___________________
```

## 🚀 Quick Start After You Have This Info

1. Create Linode instance
2. SSH into server
3. Install Node.js, Git, Nginx, PM2
4. Clone your Kintsugi repository
5. Set up environment variables
6. Build the application
7. Configure Nginx reverse proxy
8. Set up SSL with Let's Encrypt
9. Start application with PM2
10. Configure firewall (UFW)
11. Test the deployed app
12. Set up automatic backups

## 📚 Helpful Resources

- **Linode Docs**: https://www.linode.com/docs/
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Let's Encrypt**: https://letsencrypt.org/
- **PM2 Process Manager**: https://pm2.keymetrics.io/
- **Nginx Config**: https://nginx.org/en/docs/

## 🎓 For Your AI Class Presentation

Consider noting:
- Total monthly cost: $_______
- Deployment time: _______ hours
- Challenges encountered: _______________
- Solutions implemented: ________________

---

**Note**: Save this checklist and check off items as you gather the information. The actual setup process will be provided as a separate step-by-step guide once you have all this information ready.

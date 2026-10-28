# Telangana Smart PYQ — Production Deployment & Operations Guide

This guide details how to run **Sadhana | Telangana Police Smart Practice** as a production-grade, multi-user website accessible via a single shareable URL.

---

## 1. Architecture Overview

- **Single Shareable URL**: Anyone opening the site URL gets instant access.
- **Dedicated User Instances**:
  - Unauthenticated visitors can explore the demo or start learning immediately as guests.
  - When a user registers or logs in, their profile is tied to an encrypted user record in the SQLite database (`users` and `sessions` tables).
  - Every user has an isolated `Learner` record with their own target exam (Police SI vs Constable), accuracy metrics, confidence history, bookmarks, and spaced repetition mistake queue.
- **Zero-Dependency Security**:
  - Passwords hashed using Node.js built-in `crypto.scryptSync` with unique cryptographic salts and timing-safe comparison (`crypto.timingSafeEqual`).
  - Session tokens are 32-byte cryptographic hex tokens stored with 30-day expiry in HTTP-only, `SameSite=lax` secure cookies.
- **Production Performance**:
  - Turbopack-optimized Next.js build with static route pre-rendering and dynamic server-rendered API endpoints.
  - SQLite with Write-Ahead Logging (`PRAGMA journal_mode=WAL`), foreign keys (`PRAGMA foreign_keys=ON`), and `PRAGMA busy_timeout=5000` to handle concurrent user traffic.
  - Security headers enabled: HSTS, X-Frame-Options (SAMEORIGIN), X-Content-Type-Options (nosniff), Referrer-Policy, and Permissions-Policy.

---

## 2. Running in Production

### Option A: Standard Node.js Process (Linux / Windows VPS)

1. **Build the production artifact**:
   ```bash
   npm run build
   ```

2. **Start the production server**:
   ```bash
   npm run start
   ```
   By default, the server listens on `127.0.0.1:3000`. To bind to all interfaces on port 80/3000:
   ```bash
   npm run start -- --hostname 0.0.0.0 --port 3000
   ```

3. **Systemd Service Example (`/etc/systemd/system/sadhana.service`)**:
   ```ini
   [Unit]
   Description=Sadhana Telangana Police Smart Practice
   After=network.target

   [Service]
   Type=simple
   User=www-data
   WorkingDirectory=/var/www/sadhana
   ExecStart=/usr/bin/npm run start -- --hostname 127.0.0.1 --port 3000
   Restart=always
   RestartSec=5
   Environment=NODE_ENV=production
   Environment=PYQ_DATA_DIR=/var/www/sadhana/data
   Environment=PYQ_HTTPS=true

   [Install]
   WantedBy=multi-user.target
   ```

---

### Option B: Docker Container Deployment

The application includes a multi-stage `Dockerfile` (Node 24 Alpine, unprivileged `nextjs` user, mountable volume):

1. **Build the Docker container**:
   ```bash
   docker build -t telangana-smart-pyq .
   ```

2. **Run the container with persistent storage**:
   ```bash
   docker run -d \
     --name sadhana-web \
     -p 3000:3000 \
     -v sadhana-data:/app/data \
     --restart unless-stopped \
     telangana-smart-pyq
   ```
   *Note: Mounting `/app/data` ensures all user accounts, passwords, and learner states persist across container restarts and updates.*

---

### Option C: Cloudflare Tunnel Deployment (Direct Edge CDN & Zero Port Forwarding)

Cloudflare Tunnel connects the local Next.js production server with its embedded SQLite database directly to Cloudflare's global edge network via encrypted QUIC tunnels:

1. **Quick Tunnel (Instant public HTTPS URL without DNS configuration)**:
   ```bash
   ./tools/cloudflared.exe tunnel --url http://127.0.0.1:3000
   ```
   This gives an instant global URL (e.g. `https://simply-correctly-broadcasting-seeking.trycloudflare.com`) with sub-200ms latency, zero open inbound firewall ports, and full DDoS protection.

2. **Named Production Tunnel with Custom Domain**:
   ```bash
   # Authenticate with Cloudflare
   cloudflared tunnel login

   # Create permanent tunnel
   cloudflared tunnel create sadhana-prod

   # Route DNS to your custom domain
   cloudflared tunnel route dns sadhana-prod pyq.yourdomain.com

   # Run as a background service
   cloudflared tunnel run sadhana-prod
   ```

---

## 3. Reverse Proxy & Free SSL (Caddy or Nginx)

To serve the application securely over `https://your-domain.com`:

### Using Caddy (Recommended — Automatic HTTPS):
In `/etc/caddy/Caddyfile`:
```caddy
your-domain.com {
    reverse_proxy 127.0.0.1:3000
}
```

### Using Nginx:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 4. Health Monitoring & Backups

### Healthcheck Endpoint
Cloud load balancers and uptime monitors (e.g. UptimeRobot, AWS Route53) can monitor:
```http
GET /api/health
```
Response:
```json
{
  "status": "healthy",
  "timestamp": "2026-10-28T02:04:26.886Z",
  "uptimeSeconds": 28133,
  "environment": "production",
  "database": {
    "status": "connected",
    "totalQuestions": 150,
    "publishedQuestions": 150,
    "sources": 6
  }
}
```

### Automated Live Backups
To create an atomic, defragmented snapshot of the live SQLite database without downtime:
```bash
npm run backup
```
This executes `VACUUM INTO` and saves verified snapshots to `data/backups/learning_YYYY-MM-DD_HH-mm-ss.sqlite`. A cron job can be scheduled to run this daily or hourly:
```cron
0 2 * * * cd /var/www/sadhana && npm run backup >> /var/log/sadhana-backup.log 2>&1
```

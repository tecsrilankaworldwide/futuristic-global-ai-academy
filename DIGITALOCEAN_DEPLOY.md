# Deploy to DigitalOcean - Futuristic Global AI Academy

## Option 1: Droplet with Docker (Recommended - $6/mo)

### Step 1: Create a Droplet
1. Go to https://cloud.digitalocean.com/droplets/new
2. Choose **Ubuntu 22.04 LTS**
3. Select plan: **Basic → $6/mo** (1 GB RAM / 1 CPU) or **$12/mo** for better performance
4. Choose a datacenter region close to your users
5. Authentication: **SSH Key** (recommended) or Password
6. Click **Create Droplet**

### Step 2: Connect to Your Droplet
```bash
ssh root@YOUR_DROPLET_IP
```

### Step 3: Install Docker & Docker Compose
```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose-plugin -y

# Verify installation
docker --version
docker compose version
```

### Step 4: Clone Your Repository
```bash
cd /opt
git clone https://github.com/tecsrilankaworldwide/futuristic-global-ai-academy.git
cd futuristic-global-ai-academy
```

### Step 5: Set Up Environment Variables
```bash
# Copy the example file
cp .env.example .env

# Edit with your actual values
nano .env
```

Update these values in `.env`:
```
SECRET_KEY=generate-a-random-string-here
STRIPE_API_KEY=sk_live_your_live_stripe_key
PAYPAL_CLIENT_ID=your_live_paypal_client_id
PAYPAL_SECRET=your_live_paypal_secret
PAYPAL_MODE=live
REACT_APP_BACKEND_URL=http://YOUR_DROPLET_IP
```

### Step 6: Build & Start the Application
```bash
docker compose up -d --build
```

This will:
- Start MongoDB
- Build and start the FastAPI backend
- Build and start the React frontend with Nginx

### Step 7: Seed Activities (First time only)
```bash
docker compose exec backend python seed_activities.py
```

### Step 8: Verify
Open your browser and go to: `http://YOUR_DROPLET_IP`

---

## Option 2: Add a Domain Name (Optional but Recommended)

### Step 1: Point Your Domain to the Droplet
1. Go to your domain registrar
2. Add an **A Record**: `@` → `YOUR_DROPLET_IP`
3. Add a **CNAME**: `www` → `yourdomain.com`

### Step 2: Install SSL Certificate (Free with Let's Encrypt)
```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Stop the frontend container temporarily
docker compose stop frontend

# Get SSL certificate
certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Start frontend again
docker compose start frontend
```

Then update `REACT_APP_BACKEND_URL=https://yourdomain.com` in `.env` and rebuild:
```bash
docker compose up -d --build
```

---

## Useful Commands

```bash
# View running containers
docker compose ps

# View logs
docker compose logs -f

# View backend logs only
docker compose logs -f backend

# Restart all services
docker compose restart

# Stop all services
docker compose down

# Rebuild and restart (after code changes)
git pull
docker compose up -d --build

# Backup MongoDB
docker compose exec mongodb mongodump --out /data/backup
docker cp ai-academy-mongo:/data/backup ./backup
```

---

## Estimated Costs
- **Droplet**: $6/mo (1GB) or $12/mo (2GB recommended)
- **Domain**: ~$10-15/year
- **Total**: ~$6-12/month

---

## Troubleshooting

**App not loading?**
```bash
docker compose logs -f
```

**MongoDB connection error?**
```bash
docker compose restart mongodb
```

**Need to update code?**
```bash
cd /opt/futuristic-global-ai-academy
git pull
docker compose up -d --build
```

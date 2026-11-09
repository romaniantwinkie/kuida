# Run Cercana on your homelab

Everything runs in Docker: the app, a Postgres + PostGIS database, nightly backups, and optional add-ons for a test inbox,
HTTPS and Cloudflare Tunnel. Cost: $0.

## 1. What you need

- Any always-on machine with **Docker and Docker Compose v2**: a Proxmox VM or LXC, Unraid, TrueNAS SCALE, a Synology, a mini PC.
- About **1 GB of RAM** and **5 GB of disk** free to start.
- `git`, or download the repository as a ZIP.

| Platform | How to run a Compose project |
|---|---|
| Proxmox | A small Debian/Ubuntu VM or LXC with Docker installed, then the steps below over SSH |
| Unraid | The "Docker Compose Manager" plugin: add a stack pointing at the `kuidao` folder |
| TrueNAS SCALE | Apps → Custom app (or Dockge), pointing at the `kuidao` folder |
| Synology | Container Manager → Project → from `docker-compose.yml` |
| Plain Docker | The steps below |

## 2. Install

```bash
git clone https://github.com/romaniantwinkie/kuida.git
cd kuida/kuidao
cp .env.example .env
nano .env       # set POSTGRES_PASSWORD (run: openssl rand -hex 24) and APP_URL
docker compose --profile mail up -d --build
```

The first build takes a few minutes. Then open:

- **Cercana:** `http://<your-server>:3001`
- **Test inbox:** `http://<your-server>:8025`. Every login code lands here until you connect real email (step 5).

Check it's healthy: `http://<your-server>:3001/api/health` shows `{"ok":true}`.

## 3. Approve agencies

New agencies start as "license check in progress". After you check their state license:

```bash
docker compose exec app node scripts/admin.mjs list
docker compose exec app node scripts/admin.mjs approve owner@agency.com
docker compose exec app node scripts/admin.mjs suspend owner@agency.com
```

## 4. Reach it from outside your home

Pick one:

| Option | Best for | How |
|---|---|---|
| **Tailscale** | You and testers only (private) | Install Tailscale on the server and on each device. Open `http://<server-name>:3001`. No router changes. |
| **Cloudflare Tunnel** | A public link without opening ports | Cloudflare Zero Trust → Networks → Tunnels → create a tunnel, add a public hostname pointing to `http://app:3000`, copy the token into `CLOUDFLARE_TUNNEL_TOKEN` in `.env`, then `docker compose --profile mail --profile tunnel up -d`. A free Cloudflare account and a domain on Cloudflare are needed. |
| **Your domain + HTTPS** | Production on your own IP | Point your domain's DNS at your home IP, forward ports 80 and 443 on the router, set `SITE_ADDRESS=yourdomain.com` in `.env`, then `docker compose --profile https up -d`. Caddy gets the certificate automatically. |

Whichever you choose, set `APP_URL` in `.env` to the address people use (e.g. `https://cercana.ai`) and run
`docker compose up -d` again. With an `https://` address, login cookies are marked secure.

## 5. Real email

Login codes are sent by SMTP. Put your provider's SMTP address in `.env`, for example:

```
SMTP_URL=smtp://resend:YOUR_API_KEY@smtp.resend.com:587
MAIL_FROM="Cercana <hello@yourdomain.com>"
```

Resend and Postmark have free tiers that cover early use. Then you can drop `--profile mail`.

## 6. Backups

- A database backup is written to `./backups/` 10 minutes after start and then every 24 hours. The last 14 days are kept
  (`BACKUP_KEEP_DAYS`).
- **Copy them off the machine.** A backup on the same disk doesn't survive a dead disk or a fire. For example, with
  [rclone](https://rclone.org) set up to any cloud drive, add to the host's crontab:
  `30 3 * * * rclone copy /path/to/kuida/kuidao/backups remote:cercana-backups`
- **Restore** (replaces the current data):
  ```bash
  docker compose stop app
  docker compose exec -T db psql -U cercana -d postgres -c "drop database cercana with (force)" -c "create database cercana"
  gunzip -c backups/cercana-YYYY-MM-DD_HHMM.sql.gz | docker compose exec -T db psql -U cercana -d cercana
  docker compose start app
  ```

## 7. Updates

```bash
git pull
docker compose up -d --build
```

Database changes are applied automatically when the app starts.

## 8. Keep it reliable

- A battery backup (UPS) for the server and router, so a short outage doesn't take Cercana down.
- An uptime monitor (Uptime Kuma runs well on a homelab) watching `/api/health`.
- Turn on automatic security updates for the host OS.

## What's stored

Cercana keeps **no client (patient) data**: no names, addresses, diagnoses or care notes. Shifts hold the neighborhood,
ZIP, time, role and pay; locations are rounded to about 1 km. Caregiver phone numbers and emails are never shown to agencies.
Database files live in `./data/postgres`; protect that folder like any other private data.

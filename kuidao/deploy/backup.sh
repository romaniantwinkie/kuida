#!/bin/sh
# Nightly database backup, run by the "backup" service in docker-compose.yml.
# Writes /backups/cercana-YYYY-MM-DD_HHMM.sql.gz and keeps the last $KEEP_DAYS days.
set -eu
KEEP_DAYS="${KEEP_DAYS:-14}"
# First backup 10 minutes after start (lets migrations finish), then every 24 hours.
sleep 600
while true; do
  f="/backups/cercana-$(date +%Y-%m-%d_%H%M).sql.gz"
  if pg_dump -h db -U cercana -d cercana | gzip > "$f.tmp"; then
    mv "$f.tmp" "$f"
    echo "backup ok: $f"
  else
    echo "backup FAILED at $(date)" >&2
  fi
  # Caregiver documents (already encrypted; useless without VAULT_KEY, which is NOT in this backup).
  if [ -d /vault ]; then
    tar -czf "/backups/files-$(date +%Y-%m-%d_%H%M).tar.gz" -C /vault . && echo "files backup ok"
  fi
  # Prune backups older than KEEP_DAYS (only files this script created).
  find /backups -maxdepth 1 -type f -name 'cercana-*.sql.gz' -mtime "+$KEEP_DAYS" -exec rm -f {} +
  find /backups -maxdepth 1 -type f -name 'files-*.tar.gz' -mtime "+$KEEP_DAYS" -exec rm -f {} +
  sleep 86400
done

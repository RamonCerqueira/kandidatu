#!/usr/bin/env bash
# Install as /usr/local/sbin/kandidatu-deploy, owned by root.
set -Eeuo pipefail
export PATH=/opt/node-v22.23.4-linux-x64/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
export GIT_TERMINAL_PROMPT=0
umask 022
exec 9>/run/lock/kandidatu-deploy.lock
flock -n 9 || exit 0
base=/opt/kandidatu
repo=$base/repository
export npm_config_cache=$base/shared/npm-cache
export PIP_NO_CACHE_DIR=1
runuser -u kandidatu -- git -C "$repo" fetch --prune origin main
commit=$(runuser -u kandidatu -- git -C "$repo" rev-parse origin/main)
if [[ -f "$base/current/REVISION" ]] && [[ $(cat "$base/current/REVISION") == "$commit" ]]; then
    echo "Kandidatu already at $commit"
    exit 0
fi
release=$base/releases/$(date -u +%Y%m%dT%H%M%S)-${commit:0:12}
install -d -o kandidatu -g kandidatu -m 755 "$release"
runuser -u kandidatu -- bash -o pipefail -c 'git -C "$1" archive "$2" | tar -x -C "$3"' -- "$repo" "$commit" "$release"
# A production environment is never taken from Git, including legacy commits.
rm -f "$release/backend/.env"
ln -s "$base/shared/backend.env" "$release/backend/.env"
runuser -u kandidatu -- bash -c '
    set -Eeuo pipefail
    cd "$1"
    npm ci --no-audit --no-fund
    VITE_API_URL=/api npm run build
    python3 -m venv .venv
    .venv/bin/pip install --disable-pip-version-check -r backend/requirements.txt
    cd backend
    ../.venv/bin/python manage.py check --deploy --fail-level ERROR
    ../.venv/bin/python manage.py collectstatic --noinput
' -- "$release"
install -d -m 700 "$base/backups"
runuser -u postgres -- pg_dump -Fc kandidatu > "$base/backups/predeploy-$(date -u +%Y%m%dT%H%M%S).dump"
runuser -u kandidatu -- bash -c 'cd "$1/backend"; ../.venv/bin/python manage.py migrate --noinput' -- "$release"
printf '%s\n' "$commit" > "$release/REVISION"
previous=$(readlink -f "$base/current" || true)
ln -s "$release" "$base/current.next"
mv -Tf "$base/current.next" "$base/current"
systemctl restart kandidatu
for attempt in $(seq 1 30); do
    if curl --silent --fail --output /dev/null -H 'Host: kandidatu.genioplay.com.br' -H 'X-Forwarded-Proto: https' http://127.0.0.1:3220/login/; then
        echo "Deployed $commit"
        exit 0
    fi
    sleep 2
done
echo 'Health check failed. Restoring previous code; database migrations are not reversed.' >&2
if [[ -n "$previous" && -d "$previous" ]]; then
    ln -s "$previous" "$base/current.rollback"
    mv -Tf "$base/current.rollback" "$base/current"
    systemctl restart kandidatu
fi
exit 1

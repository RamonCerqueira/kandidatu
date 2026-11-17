#!/usr/bin/env bash
# Run once as root after reviewing paths and ports for this VPS.
set -Eeuo pipefail
base=/opt/kandidatu
[[ ! -e "$base" ]] || { echo "$base already exists; inspect before provisioning" >&2; exit 1; }
id kandidatu &>/dev/null || useradd --system --home-dir "$base" --shell /usr/sbin/nologin kandidatu
install -d -m 755 "$base"
install -d -m 755 -o kandidatu -g kandidatu "$base/releases" "$base/shared" "$base/shared/media"
python3 - <<'PY'
import os
import pwd
import secrets
import subprocess
from pathlib import Path

password = secrets.token_hex(32)
secret = secrets.token_hex(48)
sql = f"CREATE ROLE kandidatu LOGIN PASSWORD '{password}'; CREATE DATABASE kandidatu OWNER kandidatu;"
# CREATE DATABASE must be its own transaction.
for statement in sql.split(';'):
    if statement.strip():
        subprocess.run(['runuser', '-u', 'postgres', '--', 'psql', '-v', 'ON_ERROR_STOP=1'],
                       input=statement + ';\n', text=True, check=True, stdout=subprocess.DEVNULL)
env = Path('/opt/kandidatu/shared/backend.env')
env.write_text(
    f'DEBUG=False\nSECRET_KEY={secret}\n'
    'ALLOWED_HOSTS=kandidatu.genioplay.com.br,127.0.0.1\n'
    f'DB_NAME=kandidatu\nDB_USER=kandidatu\nDB_PASSWORD={password}\n'
    'DB_HOST=127.0.0.1\nDB_PORT=5432\n'
    'CORS_ALLOWED_ORIGINS=https://kandidatu.genioplay.com.br\n'
    'CSRF_TRUSTED_ORIGINS=https://kandidatu.genioplay.com.br\n'
    'MEDIA_ROOT=/opt/kandidatu/shared/media\nSECURE_SSL_REDIRECT=False\n'
)
os.chown(env, 0, pwd.getpwnam('kandidatu').pw_gid)
env.chmod(0o640)
PY
install -d -m 755 -o kandidatu -g kandidatu "$base/repository"
runuser -u kandidatu -- git clone --branch main --single-branch https://github.com/RamonCerqueira/kandidatu.git "$base/repository"
source_dir=$(cd -- "$(dirname -- "$0")" && pwd)
install -o root -g root -m 755 "$source_dir/update.sh" /usr/local/sbin/kandidatu-deploy
install -o root -g root -m 644 "$source_dir/kandidatu.service" /etc/systemd/system/kandidatu.service
install -o root -g root -m 644 "$source_dir/kandidatu-update.service" /etc/systemd/system/kandidatu-update.service
install -o root -g root -m 644 "$source_dir/kandidatu-update.timer" /etc/systemd/system/kandidatu-update.timer
systemctl daemon-reload
systemctl enable kandidatu
echo 'Provisioned. Run kandidatu-deploy, then install nginx.conf and enable the update timer.'

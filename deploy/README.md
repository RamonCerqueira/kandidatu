# Produção — kandidatu.genioplay.com.br

O servidor verifica `origin/main` a cada minuto usando um timer do systemd.
Um commit novo gera um release em `/opt/kandidatu/releases`, instala dependências,
compila o React com `VITE_API_URL=/api`, valida o Django, faz backup PostgreSQL,
aplica migrações e troca o link `/opt/kandidatu/current`.
O Gunicorn reinicia e uma verificação HTTP confirma a inicialização.
Em falha de inicialização, o código anterior é restaurado; migrações não são desfeitas.
Commits enviados durante um build entram na próxima verificação; commits intermediários
podem ser agrupados na versão mais recente da branch.

## Configuração da VPS

- Ubuntu, Nginx, PostgreSQL, Python com venv e Node 22.23.4 em `/opt/node-v22.23.4-linux-x64`.
- Usuário de aplicação: `kandidatu`; Gunicorn apenas em `127.0.0.1:3220`.
- Clone: `/opt/kandidatu/repository`.
- Segredos: `/opt/kandidatu/shared/backend.env` (root:kandidatu, modo 640).
- Uploads: `/opt/kandidatu/shared/media`; backups: `/opt/kandidatu/backups`.
- Banco e papel PostgreSQL: `kandidatu`. Produção usa credenciais aleatórias próprias.
- Nginx: `/etc/nginx/sites-available/kandidatu`.
- Script instalado: `/usr/local/sbin/kandidatu-deploy` (root).

Os arquivos de `deploy/` documentam a configuração instalada. Alterações nesses arquivos
precisam ser instaladas pelo administrador; o timer não executa scripts do Git como root.
O build executa como usuário `kandidatu`.

## Operação

```bash
sudo systemctl status kandidatu kandidatu-update.timer
sudo journalctl -u kandidatu -u kandidatu-update.service -n 100 --no-pager
sudo systemctl start kandidatu-update.service  # verificar atualização agora
sudo systemctl stop kandidatu-update.timer    # pausar atualizações
sudo systemctl start kandidatu-update.timer   # retomar atualizações
cat /opt/kandidatu/current/REVISION
```

Releases e backups são preservados. Monitore espaço em disco e mantenha também
backup externo do banco e dos uploads. Não execute `seed_dev_data` em produção.
As contas locais e os dados do computador não são importados automaticamente.

## DNS e HTTPS

Crie o registro A `kandidatu.genioplay.com.br` apontando para `153.75.244.238`.
Após a propagação:

```bash
sudo certbot --nginx -d kandidatu.genioplay.com.br --redirect
sudo certbot renew --dry-run
```

Após habilitar HTTPS, configure `SECURE_SSL_REDIRECT=True` no ambiente de produção.
O Nginx encaminha o protocolo original para o Django. Não publique a porta do Gunicorn.

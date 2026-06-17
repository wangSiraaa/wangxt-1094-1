# Trae Preflight

This folder is prepared for `wangxt-1094-1`.

Use `.env` for stable local ports and compose project identity:

- APP_PORT: 18394
- API_PORT: 19394
- WEB_PORT: 20394
- DB_PORT: 21394
- REDIS_PORT: 22394

Smoke entry:

```bash
bash scripts/smoke.sh
```

The preflight files are environment scaffolding only. The generated business
project can replace or extend them when needed.

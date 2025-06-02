# Deploy of portal.qfnetwork.xyz

Reminder please do no change this path `/root/cd/apps` on the server. This directory is (would be used) using for `ansible` deploy.

## Manual deploy instruction

The first please request access to the portal server via [request access instraction](https://github.com/QuantumFusion-network/infra/blob/main/docs/key_management_basic.md).

```
$> ssh 86.104.75.24
$> cd /root/cd/apps
$> git fetch --all && git pull && git checkout [SHA or TAG, or BRENCH]
$> systemctl stop qfn_polkajs; systemctl start qfn_polkajs;
# Check status:
$> systemctl status qfn_polkajs
# Check logs:
$> journalctl -f --unit=qfn_polkajs
```

## Deploy via Ansible instruction
WIP


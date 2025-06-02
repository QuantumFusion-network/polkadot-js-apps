# Deploy of portal.qfnetwork.xyz
Reminder: please do no change this path `/root/cd/apps` and please use it for any deploy. This directory is important for deploing via `ansible`.

## Manual deploy instruction
The first please request access to the portal server via [instruction](https://github.com/QuantumFusion-network/infra/blob/main/docs/key_management_basic.md).

```
 $> ssh 86.104.75.24
 $> cd /root/cd/apps
 $> git fetch --all && git pull && git checkout [SHA or TAG, or BRENCH]
 $> systemctl stop qfn_polkajs && systemctl start qfn_polkajs;
```

Please check output of `Checking service status` after you have been done with the last step of manual deploy.

## Deploy via Ansible instruction
WIP

## Cache invalidation 
WIP

# Checking service status
```
 $> systemctl status qfn_polkajs
```
If something went wrong, please use `Checking the logs` for getting the reason of failing.

## Checking the logs
```
$> journalctl -f --unit=qfn_polkajs
```

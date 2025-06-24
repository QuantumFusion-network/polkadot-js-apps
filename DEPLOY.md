# Deploy of portal.qfnetwork.xyz
Reminder: please do not change this path `/root/cd/apps` and please use it for any deploy. This directory is important for deploying via `ansible`.

## Manual deploy instruction
First, please request access to the portal server via [instruction](https://github.com/QuantumFusion-network/infra/blob/main/docs/key_management_basic.md).

```
 $> ssh PORTAL_IP
 $> cd /root/cd/apps
 $> git fetch --all && git pull && git checkout [SHA or TAG, or BRANCH]
 $> systemctl stop qfn_polkajs && systemctl start qfn_polkajs;
```
PORTAL_IP could be found in the ssh.conf's target [frontend.qfnetwork.xyz](https://github.com/QuantumFusion-network/infra/blob/main/confs/ssh/config#L53).

Please check output of `Checking service status` after you have completed the last step of manual deploy.

## Deploy via Ansible instruction
WIP

## Cache invalidation 
WIP

# Checking service status
```
 $> systemctl status qfn_polkajs
```
If something went wrong, please use `Checking the logs` for getting the reason for the failure.

## Checking the logs
```
$> journalctl -f --unit=qfn_polkajs
```

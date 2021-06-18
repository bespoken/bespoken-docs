---
title: FAQ (Google Marketplace)
permalink: /google-marketplace/faq/
---

# FAQ For Google Marketplace
Here are answers to commonly asked questions about our Server.

# Administration
## Understand the default file structure
The host has a user "bespoken" who is owner the folder where the application is deployed
```bash
/home/bespoken
```
The IVR-Server is a HTTP server, it runs by default on port 3000.
We also have a nginx server running tha is used as a reverse proxy.

## Connect to the server
It is enabled OS Login by default, you can access the server using your google user.
https://cloud.google.com/compute/docs/instances/ssh#metadata-managed_ssh_connections

## Star and Stop the server
Connecto to server to execute the commands.

Obtain the status of a service:
```bash
sudo -u bespoken /home/bespoken/script/status.sh
```

To start the service:
```bash
sudo -u bespoken /home/bespoken/script/start.sh
```

To stop the service:
```bash
sudo -u bespoken /home/bespoken/script/stop.sh
```
## Update server settings
Connecto to server to execute the commands.


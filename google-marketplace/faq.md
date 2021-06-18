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

## Setup SSL certificate
NOTE: Before using this approach, ensure that you have access to domain’s DNS configuration through your DNS provider.

### Configuring a static IP Address
Google Cloud Platform instances are launched with a dynamic IP address by default, which means that the IP address changes every time the server is stopped and restarted. In many cases, this is not desired and so, users also have the option to assign the server a static IP address.

https://cloud.google.com/compute/docs/ip-addresses/reserve-static-external-ip-address

### Update DNS record
Create a record in your DNS provider, to point to the IP address set in the previous step.

### Enable SSL access over HTTPS with with letsencrypt
Log into the server and execute the following command changing the domain you want to use
```bash
sudo certbot --nginx -d example.com
```
After that update the settings on the nginx configuration
```bash
sudo certbot --nginx -d example.com
```
Restart the nginx server
```bash
sudo certbot --nginx -d example.com
```

# Troubleshooting
## How to access to server logs
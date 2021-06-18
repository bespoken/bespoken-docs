---
title: Getting Started
permalink: /google-marketplace/getting-started/
---
# Getting Started With 

## What is the 

The Bespoken IVR-Server is a tool to execute end to end tests.

## Before you begin

### Request access credentials
go to [service accounts](https://console.cloud.google.com/iam-admin/serviceaccounts), and create a service account.
Fill the name and id.
[<img src="./assets/google-marketplace-create-service-account-1.png">](./assets/google-marketplace-create-service-account-1.png)

Grant the role "Service Account Token Creator"
[<img src="./assets/google-marketplace-create-service-account-2.png">](./assets/google-marketplace-create-service-account-2.png)
Click on "Done".

Search for the new created account service, see the details, and copy the "Unique ID"
[<img src="./assets/google-marketplace-create-service-account-3.png">](./assets/google-marketplace-create-service-account-3.png)

Reach the bespoken team, requesting the access credentials, you have the provide the "Unique Id".

The bespoken team will reply with some settings to setup your Google VM.

### HTTPS connections
The server needs HTTPS connection to work. There are a couple of alternvatives to achieve this.

- If you already have in place a Load Balancer to handle HTTPS connections, just redirect the traffic to port 3000.
- Setup the SSL certificate within the server.

## Deployment process
In the deplolyment process, fill the parameters for the VM, it is recommended at least 1vCPU and 1GB memory. For "Role arn" and "Secret name" complete those with the settings from the bespoken team.

An additional step is required after the deployment is completed. Stop the VM, edit the "Service account" field, select the service account created in the previous step and "Save" the changes.
[<img src="./assets/google-marketplace-set-service-account.png">](./assets/google-marketplace-set-service-account.png)

After that youn can start the VM again.

## Setup SSL certificate withitn the server
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
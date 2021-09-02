---
title: Getting Started
permalink: /google-marketplace/getting-started/
---
# Getting Started With Bespoken Automated Testing for IVR

## What is Bespoken Automated Testing for IVR?

Bespoken Automated Testing for IVR is a testing, training, and monitoring solution designed specifically for contact centers. Using Bespoken with your environment ensures that your contact center is delivering world-class customer service while reducing operating costs.

Increase customer satisfaction and call deflection rates, reduce speech recognition errors, and have confidence your system can meet any surge in calls. All with Bespoken.

## Features

* **Testing**: We mimic actual calls and texts to your contact center to ensure it understands your customers and is providing them with fast and easy resolutions to their queries. Our tests are easy to set up and written in plain-english. Once created, they can be run automatically, either on schedule or based on external triggers (such as changes to code).
* **Training**: We provide detailed, easy-to-implement advice to ensure your users are always well-understood. Speech recognition can be impacted by accents, poor line quality, and/or background noise. Bespoken makes sure your customers are understood every time.
* **Monitoring**: Once your Genesys application is tested, trained, and has gone live, our monitoring makes sure it continues to deliver outstanding performance and reliability. And when problems do arise, we let you know right away.
* **Load Testing**: Have confidence your application can scale. We simulate high volumes of calls, automatically, to identify bottlenecks and ensure your system will scale.

## Pre-requisites

- A google cloud [service account](/google-marketplace/faq/#how-to-set-up-a-google-cloud-service-account)
- The URL (with https) that will point to your new virtual machine
- Reach out to Bespoken and ask for the VM required security information

## Deployment process
In the deployment process, fill the parameters for the VM, it is recommended at least 1vCPU and 1GB memory. For "Role arn", and "Secret name" complete those with the settings from the bespoken team. "Server url" is the url that will be used by the server. "Port" is the number of the port used to run the server, by default is 3000, it should be greater than 1024. You can [change](/google-marketplace/faq/#update-server-settings) these settings after the deployment is done.

An additional step is required after the deployment is completed. Stop the VM, edit the "Service account" field, select the service account created in the previous step and "Save" the changes.
[<img src="./assets/google-marketplace-set-service-account.png">](./assets/google-marketplace-set-service-account.png)

After that you can start the VM again.

## Verify if service is running
Get the IP number that was assigned to the VM, and request the port you set up, by default 3000. If the server is running you will get a response, otherwise, go to [troubleshooting](/google-marketplace/faq/#troubleshooting).

```bash
http://replace-with-your-ip:3000
```

## HTTPS connections
The server needs an HTTPS connection to work. There are a couple of alternatives to achieve this:

- If you already have in place a Load Balancer to handle HTTPS connections, just redirect the traffic to the VM on the port set during deployment.
- Setup the SSL certificate [within the server](/google-marketplace/faq/#setup-ssl-certificate)

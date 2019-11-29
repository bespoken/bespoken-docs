---
title: FAQ (CLI)
permalink: /cli/faq/
---

# FAQ For Bespoken CLI
Here are answers to commonly asked questions about our CLI.

# Setup
## My organization uses a firewall - how do I use your tools with it?
Your firewall needs to allow access to the following domains:
* *.bespoken.io
* *.bespoken.tools
* *.bespoken.link

If white-listing by IP is necessary, the following IPs should be included:
* 35.244.147.217 (virtual devices)
* 18.232.68.210 (bst proxy)
* 34.233.142.145 (other services)
* 54.221.196.218 (other services)

We use the following ports for our services:
* 443
* 80 (bst proxy only)

Please note - the IP addresses above our subject to change - please contact us via [Gitter](https://gitter.im/bespoken) if you have white-listed all of the above and it is still not working.

# Errors
## I get an error trying to connect using the bst proxy
When using the bst proxy, you may see an error like below in the console:
```
INFO 2019-11-26T08:25:38.444Z Connected - proxy.bespoken.tools:80
ERROR 2019-11-26T08:25:38.449Z Socket closed by bst server: proxy.bespoken.tools:80
```

This is most likely due to a firewall issue.

See [this answer](#my-organization-uses-a-firewall-how-do-i-use-your-tools-with-it) if your organization/household uses a firewall.

Additionally, you can send us the `bst-debug.log`, which will be found in the directory where you ran the `bst proxy` command, to us via [Gitter](https://gitter.im/bespoken). This provides additional information on what is happening.
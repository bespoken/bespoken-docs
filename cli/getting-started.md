---
title: Getting Started
permalink: /cli/getting-started/
---
# Getting Started With The Bespoken CLI

## What is the Bespoken CLI

The Bespoken CLI are a set of tools created by us to let you develop faster and better. Do not slow-down for:
* Time-consuming server deployments
* Over-complicated and highly manual testing routines

## Installation

To install the Bespoken command line tool (bst) do:
```bash
$ npm install @bespoken-sdk/cli -g
```

__Note:__ If you are on MacOS and the command fails, it is probably because you need to run it with sudo, like this:
```bash
$ sudo npm install @bespoken-sdk/cli -g
```
Verify the installation by typing:
```bash
$ bst
```

Haven't used npm before? We have you covered:
[How To Install NPM](http://blog.npmjs.org/post/85484771375/how-to-install-npm/)

You will then be able to use our commands, described below: 
 
* [Init](/cli/commands/#init) Sets up a Bespoken test project
* [Proxy](/cli/commands/#proxy) Proxies the AWS Lambdas, Google Cloud Functions, and HTTPS services locally to your laptop for debugging Webhook-based code
* [Speak](/cli/commands/#speak) Sends utterances directly to the real Alexa
* [Test](/cli/commands/#test) Runs Bespoken tests on the local machine
* [Test Suite](/cli/commands/#test-suite) Runs Bespoken tests defined in the Bespoken Dashboard

You can also use:

* --version, -v - Indicates the current BST and Node versions
* --help, -h - Shows usage information

## Updating

To update bst:
```bash
$ pnpm update bespoken-tools -g
```

---
title: Getting Started
permalink: /cli/getting-started/
---
# Getting Started With The Bespoken CLI

## What is the Bespoken CLI

The Bespoken CLI are a set of tools created by us to let you develop faster and better. Do not slow-down for:

    Time-consuming server deployments
    Over-complicated and highly manual testing routines


## Installation

To install the Bespoken command line tool (bst) do:
```bash
$ npm install bespoken-tools -g
```
__Note:__ If you are on MacOS and the command fails, it is probably because you need to run it with sudo, like this:
```bash
$ sudo npm install bespoken-tools -g
```
Verify the installation by typing:
```bash
$ bst
```

Haven't used npm before?, we have you covered:
[How To Install NPM](http://blog.npmjs.org/post/85484771375/how-to-install-npm)

You will then be able to use our commands, described below: 
 
* [Proxy](commands.html#proxy) Proxies the Alexa service to your laptop - develop and debug with the real Alexa
* [Utter](commands.html#utter) Emulate utterances coming from Alexa, without Alexa. Magic!
* [Intend](commands.html#intend) Emulate intents coming from Alexa
* [Launch](commands.html#launch) Emulate launch requests coming from Alexa
* [Speak](commands.html#speak) Sends utterances directly to the real Alexa


You can also use:

* --version, -v - Indicates the current BST and Node versions
* --help, -h - Shows usage information

## Updating

To update bst:
```bash
$ npm update bespoken-tools -g
```

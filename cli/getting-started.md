<!-- ---
# Getting Started
layout: default
keywords:
comments: false

# Hero section
title: Getting Started With The Bespoken CLI

# Micro navigation
micro_nav: true
--- -->
# Getting Started With The Bespoken CLI

## Installation

Make sure you have NPM and node installed:
```
$ node --version && npm --version
```
We support node version `4.x.x` and above.  For help installing, see [How To Install NPM](http://blog.npmjs.org/post/85484771375/how-to-install-npm)

Next, install the Bespoken command line tool (bst):
```
$ npm install bespoken-tools -g
```
__Note:__ If you are on MacOS and the command fails, it is probably because you need to run it with sudo, like this:
```
$ sudo npm install bespoken-tools -g
```
Verify the installation by typing:
```
$ bst
```

You will then be able to use our commands, described below: 
 
* [Proxy](commands.html#proxy) Proxies the Alexa service to your laptop - develop and debug with the real Alexa
* [Utter](commands.html#utter) Emulate utterances coming from Alexa, without Alexa. Magic!
* [Intend](commands.html#intend) Emulate intents coming from Alexa
* [Launch](commands.html#launch) Emulate launch requests coming from Alexa
* [Speak](commands.html#speak) Sends utterances directly to the real Alexa

## Updating

To update bst:
```
$ npm update bespoken-tools -g
```

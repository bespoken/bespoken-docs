---
title: NODE.JS & LAMBDA
permalink: /tutorials/tutorial-lambda-nodejs/
---

# Debugging voice apps locally With Webstorm and Bespoken

This tutorial shows you how to get started developing for Alexa Skills Kit using a Nodejs Lambda.  

## Prerequisites

* Bespoken command-line tools (bst)
    * `$ npm install bespoken-tools -g`
    * [Installation Instructions](../getting-started.html#Installation)
* Amazon Developer Account
    * [Amazon Developer](https://developer.amazon.com/alexa)

## Getting Started

Clone the Amazon Alexa Skills Kit for JavaScript repo:  

```bash
$ git clone https://github.com/alexa/skill-sample-nodejs-hello-world
```

Go to the source code directory of the sample:
```bash
$ cd skill-sample-nodejs-hello-world/src
```

Run npm install to bring in dependencies:  
```bash
$ npm install
```

## Start bst proxy

For Nodejs Lambdas, bst proxy command, in addition to setting up the proxy, will run your lambda for you and even reload it on changes.

This will start the helloWorld lambda:

```bash
$ bst proxy lambda index.js
```

## Configure your Skill

From the [Alexa Skills Kit list](https://developer.amazon.com/edw/home.html#/skills/list) within the Amazon Developer's Console:

__Choose "Add a New Skill"__

__Fill out the Information tab__

* Give your skill a name and invocation phrase, 'bst nodejs sample' and 'greeter' for example

__Fill out the Interaction Model__

* Copy and paste the Intent Schema from [here](https://raw.githubusercontent.com/amzn/alexa-skills-kit-js/deprecated/samples/helloWorld/speechAssets/IntentSchema.json)
* Copy and paste the Sample Utterances from [here](https://raw.githubusercontent.com/amzn/alexa-skills-kit-js/deprecated/samples/helloWorld/speechAssets/SampleUtterances.txt)

__Configure the Endpoint__

When you started the proxy, bst printed out a URL that you need to configure your skill:

```bash
$ bst proxy lambda samples/helloWorld/src/index.js
BST: v2.3.14  Node: v8.9.4

Your public URL for accessing your local service:
https://your-proxy.bespoken.link
```
Alternatively, you can create this URL via the `proxy urlgen` command.

Copy and paste this URL as your endpoint:

![Alexa Skill Configuration](./../../assets/images/bst-nodejs-lambda-configuration.png "Alexa Skill Configuration")

Also make sure you select "HTTPS" and account linking to "NO".

__Configure SSL__  

On the SSL Certificate page, select the middle radio button "My development endpoint is a subdomain of a domain that has a wildcard certificate from a certificate authority"

## Test
Go to the service simulator, and type: "hello" and hit "Ask {Your Skill Name}".

You should get a valid JSON in reply:

![Test your Skill](./../../assets/images/bst-nodejs-lambda-test.png "Test your Skill")


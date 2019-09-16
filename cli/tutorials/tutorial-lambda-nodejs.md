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
$ cd skill-sample-nodejs-hello-world/lambda/custom
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

__Click on the "Create Skill" button__

__Fill out the Information tab__

<div>
<img src="attachment:./../../assets/images/Tutorials-CLI-create-skill.png" width="500"/>
</div>

* Give your skill a name, 'greeter' for example
* Click on the __"Create Skill"__ button

__Leave the default "Start from scratch" option and click on "Choose"__


__Fill out the Interaction Model__

<div>
<img src="attachment:./../../assets/images/Tutorials-CLI-InteractionModel.png" width="500"/>
</div>

* Copy the Interaction Model from [here](https://raw.githubusercontent.com/alexa/skill-sample-nodejs-hello-world/master/models/en-US.json)
* Click on the __"JSON Editor"__ from the Interaction Model Options
* Paste the Interaction Model
* Click on the __"Save Model"__ button
* Click on the __"Build Model"__ button

__Configure the Endpoint__

When you started the proxy, bst printed out a URL that you need to configure your skill:

```bash
$ bst proxy lambda samples/helloWorld/src/index.js
BST: v2.3.14  Node: v8.9.4

Your public URL for accessing your local service:
https://your-proxy.bespoken.link
```

Copy this URL as your endpoint, then:

* Select the __"Endpoint"__ option in your skill configuration
* Select __"HTTPS"__ for your service endpoint type
* Paste the proxy url
* On the SSL Certificate Option, select the middle option "My development endpoint is a sub-domain of a domain that has a wildcard certificate from a certificate authority"

<div>
<img src="attachment:./../../assets/images/Tutorials-CLI-proxy-configuration.png" width="500"/>
</div>


## Test
 * Go to the __"Test"__ tab in the skill Configuration
 * Enable testing for development by clicking in the selector on the top of the page, it starts in "Off" by default.
 * On the service simulator, type: "Ask hello world".

You should get a valid JSON in reply:

<div>
<img src="attachment:./../../assets/images/Tutorials-CLI-test.png" width="500"/>
</div>
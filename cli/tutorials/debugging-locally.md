<!-- ---
# WEBSTORM DEBUGGING
layout: default
keywords:
comments: false

# Hero section
title: Debugging voice apps locally With Webstorm and Bespoken

# Micro navigation
micro_nav: true
--- -->
# Debugging voice apps locally With Webstorm and Bespoken
This tutorial shows you how to get set up using Webstorm to debug your voice app code locally.

Using this, you can run your Alexa Skill or Google Action directly on your machine, and step through the actual code to debug it with real requests and responses.

# **Getting started**

## **Prerequisites**
If you haven't already, follow these steps:
* Install Bespoken Tools (bst) with `npm install -g bespoken-tools`
* Install Webstorm from this [link](https://www.jetbrains.com/webstorm/download){:target="_blank"}.

This tutorial is based on a simple sample project. If you want to use the same, just clone the repository [here](https://github.com/bespoken-samples/GuessThePrice){:target="_blank"} and install the dependencies by running `npm install` from its root folder. Of course, feel free to use your own existing project.

## **Configuring WebStorm**
First thing is to create a run configuration. The easiest way to do it is to right-click on the main JS file of your voice app project, and then select `Create <MainFile.js>`

![Image showing how to create a run configuration][Create-Run-Config]

Fill in the configuration:

![Image showing how to configure a run configuration][Create-Run-Config2]

Start by finding where bespoken-tools are installed on your machine. To do this, follow these steps:
* Open a command-line prompt.
* Enter ``npm list -g bespoken-tools``. This is the path to your ``NODE_DIRECTORY`` - we will use this in the next step.

![Setting a breakpoint][Create-Run-Config8]
* The path for the "JavaScript file" should be: ``NODE_DIRECTORY/node_modules/bespoken-tools/bin/bst-proxy.js``

If you want to debug an Alexa skill, set the application parameters with `lambda` followed by the filename of the Lambda entry-point, in this example, `lambda index.js --verbose`

In case you are debugging a Google Action, use `function index.js function-name --verbose`

The `--verbose` parameter prints out helpful information to the console.

Select 'OK' to save the configuration.

## **Seeing It In Action**
Let's see how this works, for that, we are going to locally run the sample project mentioned at the beginning of this tutorial.

Set a breakpoint in the code by clicking on the blank space next to the line 97, just below the declaration of the `GetOnePlayer` function, which will be triggered when we say to the skill that we are going to play with one player only.

![Setting a breakpoint][Create-Run-Config4]

Now, let's start debugging by clicking in this icon, located at the top right menu:

![Icon to start debugging][Create-Run-Config3]

When the debugger starts, it executes the Bespoken proxy with the parameters we defined when creating the run configuration, that means the skill is running locally. Now, let's interact with the skill from the command line, for that we are going to use the [launch](https://read.bespoken.io/cli/commands.html#launch){:target="_blank"} and [utter](https://read.bespoken.io/cli/commands.html#utter){:target="_blank"} commands.

First, we open a Terminal on Webstorm by clicking here:
![Opening a terminal in Webstorm][Create-Run-Config5]

Then we execute the command `bst launch` in the terminal we just opened, it will start the skill, and ask how many players are playing today.
![Launching the skill locally with Bespoken][Create-Run-Config6]

Let's reply back one by executing the command `bst utter one`. When this command is executed the breakpoint is activated and Webstorms show the debugging windows below.
![Debugging windows in WebStorm][Create-Run-Config7]

That is awesome, isn't it? We can inspect the variables we want and finding the problematic areas in our code easily. This simple saves you tons of time!.

WebStorm offers a host of capabilities via their debugger - [you can learn more here](https://www.jetbrains.com/help/webstorm/running-and-debugging-node-js.html){:target="_blank"}.

We hope this helps accelerate how you develop and debug your code. Please do not hesitate to [contact us](mailto:contact@bespoken.io) if you need assistance, we are happy to help!



<!-- Images references -->
[Create-Run-Config]: ./../../assets/images/Tutorials-webstormDebug-1.png "Creating a run configuration"
[Create-Run-Config2]: ./../../assets/images/Tutorials-webstormDebug-2.png "Setting up a run configuration"
[Create-Run-Config3]: ./../../assets/images/Tutorials-webstormDebug-3.png "Start debugging by clicking this icon"
[Create-Run-Config4]: ./../../assets/images/Tutorials-webstormDebug-4.png "Setting up a breakpoint"
[Create-Run-Config5]: ./../../assets/images/Tutorials-webstormDebug-5.png "Opening a terminal in Webstorm"
[Create-Run-Config6]: ./../../assets/images/Tutorials-webstormDebug-6.png "Launching the skill locally with Bespoken"
[Create-Run-Config7]: ./../../assets/images/Tutorials-webstormDebug-7.png "Debugging window in WebStorm"
[Create-Run-Config8]: ./../../assets/images/Tutorials-webstormDebug-8.png "Finding bst-proxy"
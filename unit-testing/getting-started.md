---
# Page settings
layout: default
keywords:
comments: false

# Hero section
title: Getting Started With Unit Testing

# Micro navigation
micro_nav: true
---
It's easy to unit-test your Alexa skill with Bespoken.

<img src="/assets/images/BST-Test-Run.gif" width="800" alt="Test Run Animated" />

Here's a sample from the tests being run:

```
---
configuration:
  locale: en-US

---
- test: "Sequence 01. Test scenario: launch request, no further interaction."
- LaunchRequest: # LaunchRequest is not an utterance but a request type
  - response.outputSpeech.ssml: "Here's your fact"
  - response.card.type: "Simple"
  - response.card.title: "Space Facts"
  - response.card.content: "/.*/" # Regular expression indicating any text will match

---
- test: "Sequence 02. Test scenario: GetNewFactIntent with an utterance"
- "give me a fact":
  - response.outputSpeech.ssml: "/here's your fact.*/i" # i flag means case insensitive
  - response.card.type: "Simple"
  - response.card.title: "Space Facts"
  - response.card.content: "*"

---
- test: "Sequence 03. Test scenario: AMAZON.HelpIntent. Ask for help and exit."
- LaunchRequest: # Empty expected part means we are not testing the response
- help: # This is what we want to test in this sequence
  - response.outputSpeech.ssml: "What can I help you with?"
  - response.card: undefined
  - response.reprompt.outputSpeech.ssml: "What can I help you with?"
- exit:
  - response.outputSpeech: undefined
```

# Setup
To get started, you need to install Bespoken Tools.

If you haven't already, follow these steps:

**Install NPM**  
[Instructions here](https://www.npmjs.com/get-npm) if you have not already installed npm.

**Open A Command Prompt**  
For Mac, run Applications -> Terminal  
For Windows, select Run -> cmd

**Install Bespoken Tools**  
Once on the command-line, type:

```
npm install bespoken-tools@beta -g
```

If that fails with a permission warning, you can simply run:
```
sudo npm install bespoken-tools@beta -g
```

To confirm that it is installed, type: `bst` on the command-prompt. You should see something like this:
```
jpk-mbp:skill-testing-ml jpk$ bst
BST: v2.0.0  Node: v8.11.1


  Usage: bst [options] [command]
  **(Output truncated)**
```

# Run Your Tests
If you are starting with one of the Alexa sample projects, just go ahead and enter:
```
bst test
```

That's all there is to it!

# Understanding The Output

<img src="/assets/images/BST-Test-Output.png" width="800" alt="Test Output"/>

The top of the output is the result of each test.
Underneath each test is the sequence of interactions.

If any failed, they are marked with an X.

Below this list of tests, we see detailed output for any test that failed:
<img src="/assets/images/BST-Test-Failure.png" width="800" alt="Test Failure"/>

This tells the exact interaction that failed, as well as why it failed.
Based on this, we can either fix our test or fix the code.

The summary at the bottom tells us about the success of the tests, as well as basic code coverage info.

To see more detailed code coverage info, we can go to `coverage/lcov-report/index.html`.
This provides detailed information about the code coverage for our tests.

# Further Reading and Examples
To add more tests, read our guide on the [Skill Testing Markup Language syntax here](../guide).

Learn about [common use-cases here](../use-cases), such as:

* State Management With Dynamo
* Testing The Address API
* Working With Dialogs

And take a look at the following skills with test examples already configured:
* Get Facts
[Github](https://github.com/ig-perez/skill-sample-nodejs-fact)
[Travis](https://travis-ci.org/ig-perez/skill-sample-nodejs-fact)
[Codecov](https://codecov.io/gh/ig-perez/skill-sample-nodejs-fact)
* Address API Example
[Github](https://github.com/ig-perez/skill-sample-node-device-address-api)
[Travis](https://travis-ci.org/ig-perez/skill-sample-node-device-address-api)
[Codecov](https://codecov.io/gh/ig-perez/skill-sample-node-device-address-api/)

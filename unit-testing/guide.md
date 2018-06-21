---
# Page settings
layout: default
keywords:
comments: false

# Hero section
title: Bespoken Unit-Testing Guide
description: Complete Guide to Unit-Testing with Bespoken

# Micro navigation
micro_nav: true
---
# Overview
The purpose of the Skill Testing Markup Language is to make it easy for anyone to test Alexa skills and voice apps.

The syntax is based on YAML, and is meant to be easy to read and write. [Learn more about YAML syntax here](http://yaml.org/spec/1.2/spec.html#Preview).

The tests are actually run with specialized version of Jest.
Jest is an excellent testing tool, that combines unit tests, code coverage, easy-to-use mocks and other nice features in one place.
[Learn more here](https://facebook.github.io/jest/).

Jest has been configured with a custom test runner, which:
* Works with YAML files, fitting the structure described here
* Runs using our [Virtual Alexa component](https://github.com/bespoken/virtual-alexa) to generate JSON requests and emulate Alexa behavior

We consider this the best of all worlds - a full-featured general testing framework tailored to work specifically with skills.

## Nota Bene
**KEEP IN MIND** the skill tester uses Virtual Alexa, which is an emulator. It is not the real Alexa. This has some benefits, such as:

* Fast execution time
* No need for deployment to run
* Minimal dependencies, and with builtin mocks that are useful

But there are also limitations. Those include:

* It does not have real speech recognition - turning utterances into intents is done with simple heuristics
* It cannot call the actual Alexa APIs, such as the Address API, because it does not generate a proper apiAccessToken
* It is emulating Alexa, and may do it imperfectly at times (and let us know if you see any issues)

If you run into issues with testing specific utterances, always keep in mind you can set the exact intent and slot values with the intent and slot properties.

# Configuration
Global configuration options for testing skills can be set in the file.

These options can include overriding Jest options, as well as setting skill testing specific ones.

The default Jest settings are as follows:
```
{
    "collectCoverage": true,
    "collectCoverageFrom": [
        "**/*.js",
        "!**/coverage/**",
        "!**/node_modules/**",
        "!**/vendor/**"
    ],
    "coverageDirectory": "./coverage/",
    "moduleFileExtensions": [
        "ts",
        "js",
        "yml"
    ],
    "silent": false,
    "testMatch: ["**/test/*.yml", "**/tests/*.yml", "**/*.test.yml", "**/*.spec.yml"],
    "verbose": true
}
```

[Learn what these do here](https://facebook.github.io/jest/docs/en/configuration.html).

An example `skill-testing.json` file:
```
{
    "handler": "src/index.handler",
    "locale": "de-DE",
    "interactionModel": "models/de-DE.json",
    "trace": true,
    "jest": {
        "silent": true
    }
}
```

Below the unit-testing configuration options and what they do are listed:

* [filter](#filtering-requestresponse-payloads) - The (optional) path to a class that can be used to override value on the request and response
* handler - The path to the handler (and function name) to run the test
* intentSchema - If using "old-style" configuration files, the path to the intent schema
* interactionModel - The path to the interaction model to use for the test
* locale - The locale to be used
* sampleUtterances - If using the "old-style" configuration files, the path to the sampleUtterances
* [trace](#viewing-requestresponse-payloads) - Causes request and response JSON payloads from the skill to be printed to the console

To override [Jest options](https://facebook.github.io/jest/docs/en/configuration.html), just set them under the "jest" key.

# CLI Options
When invoking `bst test`, the name of a specific test or regex can be used, like this:
```
bst test test/MyIntent.test.yml
```

Or this:
```
bst test MyIntent
```

# Tests
The test syntax is based on YAML.

When running `bst test`, it automatically searches for files with the following names:

* `**/test/\*\*/*.yml`
* `**/*.test.yml`
* `**/*.spec.yml`

Any tests that match these patterns will be run.
A recommended convention is to sort test files under a test dir.

## Test Suites
Each test file is a test suite. Test suites are made up of one or many tests.

The tests represent discreet conversations with Alexa. Each test can have one or many interactions - here is a simple example:
```
---
configuration:
  locale: en-US
---
- test: "Sequence 01. Test scenario: launch request, no further interaction."
- LaunchRequest: # LaunchRequest is not an utterance but a request type and "reserved" word
  - response.outputSpeech.ssml: "Here's your fact"
  - response.card.type: "Simple"
  - response.card.title: "Space Facts"
  - response.card.content: "/.*/" # Regular expression indicating any text will match

---
- test: "Sequence 02. Test scenario: GetNewFactIntent with different utterances."
- "ask space facts to tell me a space fact":
  - response.outputSpeech.ssml: "/here's your fact.*/i"
  - response.card.type: "Simple"
  - response.card.title: "Space Facts"
  - response.card.content: "/.*/"
- "tell space facts to give me fact":
  - response.outputSpeech.ssml: "/here's your fact.*/i"
  - response.card.type: "Simple"
  - response.card.title: "Space Facts"
  - response.card.content: "/.*/"
```

The test suite above contains two tests. Additionally, at the top it has a configuration element.

The configuration provides settings that work across the test - [it is described below](#test-configuration).

The tests represent sequence of conversations with the skill.

They can use specific requests (such as LaunchRequest or SessionEndedRequest), or they can simply be an utterance.

## Test Configuration
The test configuration can override elements set in the global skill testing configuration.

It can also set test-suite specific items such as:

* address: Should be set with address attributes to emulate results from the Address API - [more info here](./use-cases#testing-with-the-address-api).
* applicationId: Sets the applicationId to be used in the generated requests
* deviceId: Sets the deviceId to be used in the generated requests
* dynamo: Should be set to "mock" to use the mock dynamo component - [more info here](./use-cases#testing-with-dynamo).
* userId: Sets the userId to be used in the generated requests

## Test Structure
The start of a test is marked with three dashes on a line - `---`.

It can be followed by an optional test description, which looks like this:
```
- test: "Description of my test"
```

This description, if provided, must be the first line in the test.

The test is then made up of a series of interactions and assertions.

Each interaction is prefixed with a "-" which indicates a YAML colletion.

After each interaction, comes a series of expressions. Typically, these are assertions about the test.
But they can be:

* [Assertions](#assertions): The life-blood of tests - statements about the expected output
* [Request Expressions](#request-expressions): Allow for setting values on the request - helpful for testing more complex cases
* [Intent and Slot Properties](#intent-and-slot-properties): Allow for specifically setting the intents and slots. Bypasses mapping the utterance to the intent and slot.

For each interaction, there can be many assertions and request expressions.
There is not a limit on how much can be tested!

When tests are run, each interaction is processed in order. Within it,
each assertion is in turn evaluated in order when a response is received.

If any assertion fails for a test, the test stops processing, and information about the failed assertion is provided.

## Assertions
An assertion follows one of two simple syntaxes:  
`[JSONPath Property]: [Expected Value]`   
or  
`[JSONPath Property] [Operator] [Expected Value]`

The second syntax provides use more than just equality operators.

The operators are:

* == Partial equals - for example, the expected value "partial sentence" will match "this is a partial sentence"
* =~ Regular expression match
* != Not equal to
* \>  Greater than
* \>= Greater than or equal
* <  Less than
* <= Less than or equal

Additionally, the `:` operator is the same as == or =~, depending on whether the expected value is a regular expression.

We use JSONPath to get values from the response, such as:
`response.outputSpeech.ssml`

This will return the value: "My SSML Value" from the following JSON response:
```
{
    "response": {
        "outputSpeech": {
            "ssml": "My SSML value"
         }
    }
}
```

The expected value can be:

* A string - quote or unquoted
* A number
* `true` or `false`
* A regular expression - should be denoted with slashes (/this .* that/)
* `undefined` - special value indicating not defined

### JSONPath Properties
JSONPath is an incredibly expressive way to get values from a JSON object.

You can play around with [how it works here](http://jsonpath.com/).

Besides handling basic properties, it can also navigate arrays and apply conditions.

An array example:
```
{
     "directives": [
      {
        "type": "AudioPlayer.Play",
        "playBehavior": "ENQUEUE",
        "audioItem": {
          "stream": {
            "token": "this-is-the-audio-token",
            "url": "https://my-audio-hosting-site.com/audio/sample-song.mp3",
            "offsetInMilliseconds": 0
          }
        }
      }
    ]
}
```

`directives[0].type == "AudioPlayer.Play"`

### Shorthand Properties
For certain commonly accessed elements, we offer short-hand properties for referring to them. These are:

* cardContent - Corresponds to `response.card.content`
* cardImageURL - Corresponds to `response.card.image.largeImageUrl`
* cardTitle - Corresponds to `response.card.title`
* prompt - Grabs either the text or ssml from `response.outputSpeech`, whichever one is set
* reprompt - Grabs either the text or ssml from `response.reprompt.outputSpeech`, whichever one is set
* sessionEnded - Corresponds to `response.shouldEndSession`

These elements are intended to work across platforms and test types.

Example:

```
- test: "My Fact Skill"
- LaunchRequest:
  - prompt: "Here's your fact"
```

The `prompt` property is also used by the Dialog Interface. [More information on that here](./use_cases#testing-with-the-dialog-interface).

### Regular Expression Values
The expected value can be a regular expression.

If it follows a ":", it must be in the form of /my regular expression/ like this:
```
- response.outputSpeech.ssml: /hello, .*, welcome/i
```

Regular expression flags are also supported with this syntax, such as /case insensitive/i.
They are [described here in more detail](https://javascript.info/regexp-introduction#flags).

### Collection Values
It is also possible to specify multiple valid values for a property.

That is done with a collection of expected values, such as this:
```
"open howdy"
  - response.outputSpeech.ssml:
    - Hi there
    - Howdy
    - How are you?
```

When a collection is used like this, if any of the values matches, the assertion will be considered a success.

## Intent and Slot properties
Though it is convenient to use the utterance syntax, some times it may not work correctly.

It also is useful to be explicit at times about which intents and slots are desired.

To do that, set a test like so:
```
- "Some utterance"
  - intent: SomeIntent
  - slots:
      SlotA: ValueA
      SlotB: ValueB
```

Or, similar synax but without the dedicated "YAML object" for slots:
```
- "Some utterance"
  - intent: SomeIntent
    SlotA: ValueA
    SlotB: ValueB
```

This interaction will send an IntentRequest with the intent name SomeIntent and slots SlotA and SlotB set to ValueA and ValueB respectively.

Easy, right? The utterance is ignored, but can be useful a form of description.

## Request Expressions
Request expressions allow for setting values explicitly on the request to handler more complex cases.

For example, to set a request attribute explicity in a certain way, just write:
```
- "Some utterance"
  - request.session.attributes.myKey: myValue
```

This will set the value of `myKey` to `myValue`.

The left-hand part of the expression uses JSONPath, same as the assertion.

Note that all request expressions MUST start with request, and when they are setting part of the request element, it will appears redundant:
```
request.request.locale: en-US
```

## Goto And Exit
One advanced feature is support for `goto` and `exit`.

Goto comes at the end of an assertion - if the assertion is true, the test will "jump" to the utterance named.
Unlike regular assertions, ones that end in "goto" will not be deemed a failure if the comparison part of the assertion is not true.

For example:
```
---
- test: "Goes to successfully"
- LaunchRequest:
  - response.outputSpeech.ssml == "Here's your fact:*" goto Get New Fact
  - response.reprompt == undefined
  - response.card.content =~ /.*/
  - exit
- Help:
  - response.outputSpeech.ssml == "Here's your fact:*"
  - response.reprompt == undefined
  - response.card.content =~ /.*/
- Get New Fact:
  - response.outputSpeech.ssml == "ABC"
  - response.reprompt == undefined
  - response.card.content =~ /.*/
```

In this case, if the outputSpeech starts with "Here's your fact",
the test will jump to the last interaction and say "Get New Fact".

If the outputSpeech does not start with "Get New Fact", the other assertions will be evaluated.
The test will end when it reaches the `exit` statement at the end (no further interactions will be processed).

Using `goto` and `exit`, more complex tests can be built.

# Test Execution
## Test Environment
Whenever tests are run, the environment variable UNIT_TEST is automatically set.

This can be used to craft unit tests that run more predictably, like this:
```
sessionAttributes.guessNumber = Math.floor(Math.random() * 100);

// For testing purposes, force a number to be picked if the UNIT_TEST environment variable is set
if (process.env.UNIT_TEST) {
  sessionAttributes.guessNumber = 50;
}
```

## Test Sequence
Tests are run in the order they appear in the file.

When there are multiple test files, [Jest](https://facebook.github.io/jest/) will run them in parallel, each in their own process.

This allows test suites to run much faster. When any particular test fails, the other tests will continue to process.

## Skipping Tests
Label tests "test.only" or "test.skip" to either only run a particular test, or to skip it. Example:
```
---
- test.only: "Goes to successfully"
- LaunchRequest:
  - response.outputSpeech.ssml == "Here's your fact:*" goto Get New Fact
  - response.reprompt == undefined
  - response.card.content =~ /.*/
  - exit
```

If multiple tests are labeled only within a suite, all the ones will be labeled only.

Use these flags together with the test pattern matching when calling `bst test <pattern>` to narrow the tests that should be run.

## Viewing Request/Response Payloads
Set the `trace` flag in the skill-testing.json file and the full request and response JSON payloads will be printed to the console when the skill-tester is run.

## Filtering Request/Response Payloads
By specifying the "filter" property, it is possible to intercept the request before it is sent to the skill,
as well as the response before the assertions are run against it.

The module will be loaded from the path where the tester is being run, and should be referenced that way. For example:  
If `bst test` is being run at `/Users/bst-user/project`  
And the filter file is `/Users/bst-user/project/test/myFilterModule`    
Then the filter should be set to `filter: test/myfilterModule`  

The filter module should be a simple JS object with two functions:
* onRequest(test, request)
* onResponse(test, response)

An example filter is here:
```
module.exports = {
    onRequest: (test, request) => {
        request.requestFiltered = true;
    },

    onResponse: (test, response) => {
        response.responseFiltered = true;
    }
}
```

The filter is a very useful catch-all for handling tricky test cases that are not supported by the YAML test syntax.

## Code Coverage
Whenever Jest runs, it produces code coverage information - it is seen on the console.

An HTML report is also viewable under `<PROJECT_DIR>/coverage/lcov-report/index.html`.

## Continuous Integration
To see how a project works with a total CI setup, [checkout this project](https://github.com/ig-perez/skill-sample-nodejs-fact/tree/ContinuousIntegration).

It is configured with Travis and Codecov. Here is the `.travis.yml` configuration file included with the project:
```
language: node_js
node_js:
  - "8"
cache:
  directories:
  - lambda/custom/node_modules
install:
  - npm install bespoken-tools@beta -g
  - npm install codecov -g
  - cd lambda/custom && npm install && cd ../..
script:
 - bst test
 - codecov
```

To set it up for your own projects, you will need to enable them with [Travis](https://travis-ci.org) and [Codecov](https://codecov.io) (or whatever CI and coverage tools you prefer). Visit their websites for in-depth instructions on how to do this.

# Further Reading
Take a look at:
* Our [use cases](../use-cases)
* Our [getting started guide](../getting-started)

And don't hesitate to reach out via [Gitter](https://gitter.im/bespoken/bst).

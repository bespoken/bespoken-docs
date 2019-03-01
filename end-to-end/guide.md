---
# Page settings
layout: default
keywords:
comments: false

# Hero section
title: End-to-end Testing Guide
description: Complete Guide to End-to-end Testing

# Micro navigation
micro_nav: true
---
# Overview
Bespoken End-to-end Test Scripts make it easy for anyone to write automated tests for Alexa and Google Assistant.

The syntax is based on YAML, and is meant to be easy to read and write. [Learn more about YAML syntax here](http://yaml.org/spec/1.2/spec.html#Preview).

The tests are actually run with specialized version of Jest.
Jest is an excellent testing tool, that combines unit tests, code coverage, easy-to-use mocks and other nice features in one place.
[Learn more here](https://facebook.github.io/jest/).

Jest has been configured with a custom test runner, which:
* Works with YAML files, fitting the structure described in this document
* Runs using our [Virtual Device SDK](https://github.com/bespoken/virtual-device-sdk) to interact directly with Alexa and/or Google assistant

We use the same basic format for unit-testing and end-to-end testing, but there are differences in how the tests should be written. For information on unit-testing, [read here](../../unit-testing/guide).

ADDITIONALLY - we now support experimentally the SMAPI Simulation API. This can be enabled using the type of `simulation`.

# Installation
## Prerequisites
* [npm](https://www.npmjs.com/get-npm)

## Install
```bash
npm install bespoken-tools -g
```

To test to see if it is installed correctly, then try typing:
```bash
bst
```

You should see output like this:
```
jpk-mbp:alexa-skill jpk$ bst
BST: v2.0.0  Node: v8.11.1


  Usage: bst [options] [command]
  **(Output truncated)**
```
That means it was installed successfully!

## Virtual Device Setup
First, you need to setup a virtual device, which allows for interaction via text and API with Alexa and Google Assistant. See [here for instructions](../setup).  

# Configuration
Global configuration options for testing skills can be set in the `testing.json` file, which is typically kept at the root level of your project.

These options can include overriding Jest options, as well as setting skill testing specific ones.

The default Jest settings are as follows:
```
{
    "collectCoverage": true,
    "collectCoverageFrom": [
        "**/*.js",
        "!**/node_modules/**",
        "!**/test_output/**",
        "!**/vendor/**"
    ],
    "coverageDirectory": "./test_output/coverage/",
    "moduleFileExtensions": [
        "ts",
        "js",
        "yml"
    ],
    "silent": false,
    "testMatch": ["**/test/*.yml", "**/tests/*.yml", "**/*.e2e.yml", "**/*.spec.yml", "**/*.test.yml"],
    "verbose": true
}
```

[Learn what these do here](https://facebook.github.io/jest/docs/en/configuration.html).

An example `testing.json` file for end-to-end tests:
```
{
    "findReplace": {
        "INVOCATION_NAME": "my skill"
    }
    "homophones": {
        "lettuce": ["let us"],
        "figs": ["fix", "vicks"]
    },
    "locales": "de-DE, en-US",
    "platform": "alexa",
    "type": "e2e",
    "virtualDeviceToken": "<TOKEN>"
}
```

Below the end-to-end testing configuration options and what they do are listed:

* [filter](#filtering-during-test) - The (optional) path to a class that can be used to override value on the request and response
* [findReplace](#findreplace) - Values that will be replaced in the scripts before execution
* [homophones](#homophones) - Values that will be replaced in actual responses from the virtual device
* html - Generate a pretty HTML report of test results - defaults to `true`
* [include and exclude](#including-or-excluding-tests-using-tags) - Runs or Skip the tests having the particular specified tags
* locales - The locale or locales to be used - a comma-delimited list
* platform - The platform that is being tested - can be either `alexa` or `google` - defaults to `alexa`
* skillId - For tests of type `simulation`, the skillId must be specified
* stage - For tests of type `simulation`, the stage must be specified - can be `development` or `live`
* type - The type of test being run - can be `unit`, `simulation`, or `e2e` - defaults to `unit`
* [trace](#viewing-response-payloads) - Causes request and response JSON payloads from the skill to be printed to the console
* [virtualDeviceToken](../setup) - For end-to-end tests that use virtual devices, this must be specified. 
[Get one here](../setup)

To override [Jest options](https://facebook.github.io/jest/docs/en/configuration.html), just set them under the "jest" key.

Values in the configuration file can be overridden by setting an environment variable using dot-notation. For example, to override the INVOCATION_NAME value above, use this statement:
```
export findReplace.INVOCATION_NAME=my new skill
```

This will be as if the configuration file was set like so:
```
{
    "findReplace": {
        "INVOCATION_NAME": "my new skill"
    }
}
```

## Overwriting configuration parameters

If you want to run the tests with one or more parameters changed you can overwrite parameters directly from the run file. This will even replace existing parameters set on the testing.json file. For example if you want to replace the platform

```
bst test --platform google
```

You can get the complete list of parameters you can use by running:

```
bst test --help
```

## Find/Replace
Find/replace values are helpful for parameterizing parts of the test.

For example, if the invocation name of the skill being tested will change from one run to the next, it can be set as a find/replace value like so:


They will look like this:
```
{
    "findReplace": {
        "INVOCATION_NAME": "my skill"
    }
}
```

This will cause any instances of the value INVOCATION_NAME to be replaced by `my skill` in the test scripts.

So a script that looks like this:
```yaml
"open INVOCATION_NAME and say hello": "*"
```

Will be turned into this:
```yaml
"open my skill and say hello": "*"
```

This is a useful feature for tests that are run against multiple instances of the same skill, where there are slight variations in the input or output.

## Homophones
Our end-to-end tests use speech recognition for turning the output speech coming back from Alexa into text.

This process is imperfect - to compensate for this, homophones can be specified for errors that occur when a reply from Alexa is misunderstood.

For example, if Alexa says:
`address sent to your white car`

The Bespoken Virtual Device may transcribe it as:
`address sent to your wife car`

(FYI, for Alexa, the definitive response can be found at the Alexa user console, under [settings -> history](https://alexa.amazon.com/spa/index.html#settings/dialogs)).

This misunderstanding will lead to a test like this failing incorrectly:
```
- send address for in n out burger to my car: address sent to your white car
```

To avoid this, just define a homophone in the configuration file like so:
```
{
    "homophones": {
        "white": ["wife"]
    }
}
```

## SMAPI Configuration
For tests that are of type `simulation`, they are run using the SMAPI simulation feature. This relies on the [Alexa SMAPI to execute tests](https://developer.amazon.com/docs/smapi/skill-simulation-api.html). A few requirements to use this feature:  
* The ASK CLI must be installed and configured on the machine where tests are run
* The skillId and stage of the skill being tested must be specified as part of the configuration
* Testing must be enabled for the skill in the Alexa dev console

These tests are similar to `e2e` tests in that they interact with the "real" skill. However, they do not actually "speak" to Alexa using text-to-speech but instead use text invocations.

Simulation tests return the full skill payload from Alexa, similar to a unit-test.

**Limitations:**
* SMAPI doesn't support digits, so all numbers should be sent as words.


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
* `**/*.e2e.yml`
* `**/*.spec.yml`
* `**/*.test.yml`

Any tests that match these patterns will be run.
A recommended convention is to sort test files under a test dir, and to label end-to-end tests as `IntentName.e2e.yml`, where each test file contains tests for a specific intent.

## Test Suites
Each test file is a test suite. Test suites are made up of one or many tests.

The tests represent discreet conversations with your voice app. Each test can have one or many interactions - here is a simple example:
```
---
configuration:
  locales: en-US

---
- test: open, no further interaction
- open get fact:
  - prompt: here's your fact
  - cardContent: /.*/
  - cardTitle: Space Facts

---
- test: open, no further interaction
- open get fact:
  - prompt: here's your fact
  - cardContent: /.*/
  - cardTitle: Space Facts
- help: just say get fact to get a fact
- stop: goodbye
```

The test suite above contains two tests. Additionally, at the top it has a configuration element.

The configuration provides settings that work across the test - [it is described below](#test-configuration).

The tests represent sequence of conversations with the skill.

They can use specific requests (such as LaunchRequest or SessionEndedRequest), or they can simply be an utterance.

## Test Structure
The start of a test is marked with three dashes on a line - `---`.

It can be followed by an optional test description, which looks like this:
```
- test: Description of my test
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
`transcript`

This will return the value: "My SSML Value" from the following JSON response:
```
{
    "transcript": "My SSML value",
    "card": {
        "content": "Card Content",
        "title": "Card Title",
    }
}
```

Note that the response output from the Virtual Device is much more limited than what your actual skill returns.
This is a limitation of what is provided by Alexa Voice Service/Google Assistant.

To test the actual JSON response from your skill, we recommend writing unit-tests - they use the same structure as our end-to-end test but can be run locally and have access to the full skill payload. [More info here](../../unit-testing/guide).

The expected value can be:

* A string - quoted or unquoted
* A number
* `true` or `false`
* A regular expression - should be denoted with slashes (/this .* that/)
* `undefined` - special value indicating not defined

### JSONPath Properties
JSONPath is an incredibly expressive way to get values from a JSON object.

You can play around with [how it works here](http://jsonpath.com/).

Besides handling basic properties, it can also navigate arrays and apply conditions.

### Shorthand Properties
For certain commonly accessed elements, we offer short-hand properties for referring to them. These are:

* cardContent - Corresponds to `card.textField`
* cardImageURL - Corresponds to `card.imageURL`
* cardTitle - Corresponds to `card.title`
* prompt - An alias for the `transcript` element from the JSON payload
* streamURL - (Alexa only) Corresponds to the `streamURL` element from JSON the payload

Example:

```
- test: open fact skill
- open fact skill:
  - prompt: Here's your fact
```

The full range of card properties can be accessed by using the card property except
`card.type` which is an Alexa only property.

Example:

```
- test: open fact skill
- open fact skill:
  - card.title: Fact skill
```

These elements are intended to work across platforms and test types. The ones that are available
only for Alexa will be ignored during the tests if you are using a different platform.

### Regular Expression Values
The expected value can be a regular expression.

If it follows a ":", it must be in the form of /my regular expression/ like this:
```
- prompt: /hello, .*, welcome/i
```

Regular expression flags are also supported with this syntax, such as /case insensitive/i.
They are [described here in more detail](https://javascript.info/regexp-introduction#flags).

### Collection Values
It is also possible to specify multiple valid values for a property.

That is done with a collection of expected values, such as this:
```
- open howdy
  - prompt:
    - Hi there
    - Howdy
    - How are you?
```

When a collection is used like this, if any of the values matches, the assertion will be considered a success.

## Goto And Exit
One advanced feature is support for `goto` and `exit`.

Goto comes at the end of an assertion - if the assertion is true, the test will "jump" to the utterance named.
Unlike regular assertions, ones that end in "goto" will not be deemed a failure if the comparison part of the assertion is not true.

For example:
```
---
- test: Goes to successfully
- open my skill:
  - prompt == "Here's your fact" goto Get New Fact
  - cardContent == /.*/
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
## Test Sequence
Tests are run in the order they appear in the file.

End-to-end tests are not run in parallel, unlike unit tests. This is because of limitations in how the virtual devices work. This is also true for tests that are run using SMAPI Simulations.

## Skipping Tests
Label tests "test.only" or "test.skip" to either only run a particular test, or to skip it. Example:
```
---
- test.only: open the skill
- open my skill: hello
```

If multiple tests are labeled only within a suite, all the ones will be labeled only.

Use these flags together with the test pattern matching when calling `bst test <pattern>` to narrow the tests that should be run.

## Viewing Response Payloads
Set the `trace` flag in the testing.json file and the full request and response JSON payloads will be printed to the console when the tests are run.

## Filtering during test
By specifying the "filter" property, it is possible to intercept and even change the properties of the tests along their execution.
For example you can intercept the response before the assertions are run against it.

The module will be loaded from the path where the tester is being run, and should be referenced that way. For example:  
If `bst test` is being run at `/Users/bst-user/project`  
And the filter file is `/Users/bst-user/project/test/myFilterModule`    
Then the filter should be set to `filter: test/myfilterModule`  

The filter module should be a simple JS object with all or some of this functions:
* onTestSuiteStart(testSuite)
* onTestStart(test)
* onResponse(test, response)
* onTestEnd(test, testResults)
* onTestSuiteEnd(testResults)

An example filter is here:
```
module.exports = {
    onResponse: (test, response) => {
        response.responseFiltered = true;
    }
}
```

The filter is a very useful catch-all for handling tricky test cases that are not supported by the YAML test syntax or if you want to fine tune some aspects of the tests.

## Including or excluding tests using tags

By specifying tags in particular tests you can then run only the tests you want. Let's say you have tests specific to the first time a user uses your skill, we are going to apply the tag "FirstUse" to them:

```
---
- test: open the skill
- tags: FirstUse, Alexa
- open my skill: hello
```

Note that multiple tags can be applied to a test, as a comma-delimited list.

If you want to run all the tests that have that particular tag, you can edit testing.json to indicate that those are the ones to run by adding the "include" property:

```
{
    "include": ["FirstUse"],
}
```

You can also use the exclude property to prevent some tests from being run, suppose we marked some broken tests with the tag broken, the following configuration will prevent those tests marked from being run:

```
{
    "exclude": ["broken"],
}
```

Remember you can also use the override properties when executing the bst test command and also combine include and exclude together. This command will run all the tests that have either FirstUse or ReturningUser tags but exclude the ones that are also marked as broken

```
bst test --include FirstUse,ReturningUser --exclude broken
```

## Ignore properties on demand

Different platforms have different properties and sometimes is not possible to validate the same exact properties when running the test using
another platform. For these cases, you can ignore a list of properties from your tests.
Here is an example of a testing.json that have some properties ignored:

```
{
    "ignoreProperties": {
        "google": {
            "paths": "streamURL, display.array[0].url",
            "type": "e2e"
        },
        "alexa": {
            "paths": "streamURL"
        },
    },
    "platform": "alexa",
    "type": "e2e",
    "virtualDeviceToken": "<TOKEN>"
}
```

The "ignoreProperties" setting can receive setup for Google, Alexa or both. This setup must have a list of paths that are ignored and can also
present optionally a type (e2e or unit). With this, you can run the same tests files by changing the platform without modifying the tests at all.

If you need to fine tune this, you can overwrite the configuration at test level by adding the ignoreProperties setup as part of your configuration for that test.
```
---
configuration:
    locales: en-US
    ignoreProperties:
        google:
            paths: display, debug.arrayProperty[0]
            type: e2e
        alexa
            paths: display.template.content
            type: e2e
---
- test: open, no further interaction
- open get fact:
    - prompt: here's your fact
    - cardContent: /.*/
    - cardTitle: Space Facts
```

## HTML Reporting
The results of your tests are automatically formatted into a nice HTML report, courtesy of jest-stare.

It is viewable under `./test_output/results/index.html`.

It provides a nice summary of the results of your tests, with charts. You can also drill down into the detailed test results.

To read more about jest-stare, [click here](https://github.com/dkelosky/jest-stare#readme).

# Further Reading
Take a look at:
* Our [getting started guide](../getting-started)
* Our [example project](https://github.com/bespoken/virtual-device-example)

And don't hesitate to reach out via [Gitter](https://gitter.im/bespoken/bst).

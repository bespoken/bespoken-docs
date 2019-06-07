---
title: In-Depth Guide Google
permalink: /unit-testing/guide-google/
---

# Complete Guide to Unit-Testing for Google Actions
## Overview
The purpose of Bespoken Unit Testing is to make it easy for anyone to test voice apps.
This section is dedicated to the testing of Google Actions.

Our approach to unit-testing allows for writing tests across Google and Alexa in a common format, but there is functionality unique to Google versus Alexa. This guide covers our functionality in general, as well as specific aspects for Google Actions.

The syntax is based on YAML, and is meant to be easy to read and write. [Learn more about YAML syntax here](http://yaml.org/spec/1.2/spec.html#Preview).

The tests are actually run with specialized version of Jest.
Jest is an excellent testing tool, that combines unit tests, code coverage, easy-to-use mocks and other nice features in one place.
[Learn more here](https://facebook.github.io/jest/).

Jest has been configured with a custom test runner, which:
* Works with YAML files, fitting the structure described in this document
* Runs using our [Virtual Google Assistant component](https://github.com/bespoken/virtual-google-assistant) to generate JSON requests and emulate Google Assistant behavior

We consider this the best of all worlds - a full-featured general testing framework tailored to work specifically with Actions.

### Nota Bene
**KEEP IN MIND** the skill tester uses Virtual Google Assistant, which is an emulator. It is not the real Google Assistant. This has some benefits, such as:

* Fast execution time
* No need for deployment to run
* Minimal dependencies, and with builtin mocks that are useful

But there are also limitations. Those include:

* It does not have real speech recognition - turning utterances into intents is done with simple heuristics
* It cannot call the actual Google Assistant APIs, such as the Location API, because it does not generate a proper apiAccessToken
* It is emulating Google Assistant, and may do it imperfectly at times (and let us know if you see any issues)

If you run into issues with testing specific utterances, always keep in mind you can set the exact intent and slot values with the intent and slot properties.

## Initial Setup

In order to turn utterances into intents correctly we need your interaction model. For Google export your [Dialog Flow Agent](https://dialogflow.com/docs/agents/export-import-restore)
then unzip it. You need to keep these files up to date or you won't be able to correctly run your tests.

## Configuration
Global configuration options for testing skills can be set in the `testing.json` file, which is typically kept at the root level of your project.

These options can include overriding Jest options, as well as setting skill testing specific ones.

The default Jest settings are as follows:
```json
{
    "collectCoverage": true,
    "collectCoverageFrom": [
        "**/*.js",
        "!**/node_modules/**",
        "!**/test_output/**",
        "!**/vendor/**"
    ],
    "coverageDirectory": "./coverage/",
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

Below the unit testing configuration options and what they do are listed:

* [actionURL](#url-configuration) - The complete url that is going to receive the requests (Required if you need to start your endpoint manually).
* dialogFlowDirectory - The location of the unzipped folder retrieved from [Dialog Flow Agent](https://dialogflow.com/docs/agents/export-import-restore), used to be able to interact with your Intents and Entities.
* [expressModule](#express-server-configuration) - The javascript file where express is started, it needs the express instance exported (Required if you use a express server for your endpoint).
* [expressPort](#express-server-configuration) - The port in which express is serving  (Required if you use a express server for your endpoint).
* [filter](#filtering-during-test) - The (optional) path to a class that can be used to override value on the request and response
* handler - The path to the handler (and function name) to run the test
* html - Generate a pretty HTML report of test results - defaults to `true`
* [include and exclude](#including-or-excluding-tests-using-tags) - Runs or Skip the tests having the particular specified tags
* [locales](#locales) - The locale or locales to be used - a comma-delimited list. The entire suite will be run once for each locale.
* [trace](#viewing-request-response-payloads) - Causes request and response JSON payloads from the skill to be printed to the console

To override [Jest options](https://facebook.github.io/jest/docs/en/configuration.html), just set them under the "jest" key.

## Configuration (Google-specific)
In order to test Google Actions you need to set the platform parameter to "google"

An example `testing.json` file:
```json
{
    "dialogFlowDirectory": "../FactsAboutGoogle",
    "expressModule": "index.js",
    "expressPort": 3000,
    "locale": "en-US",
    "platform": "google"
}
```

There are multiple ways to work with google actions and most of them are reflected in the testing.json

#### Express server configuration
You need to include the javascript file that starts the express server. It needs to be exported in order to be used by the tests, for example:
index.js
```js
...
const server = express().use(bodyParser.json(), app).listen(3000);

module.exports = server;
```

Then on the testing.json you need to add that file and the port being listened

Example:
```json
{
    "dialogFlowDirectory": "../FactsAboutGoogle",
    "expressModule": "index.js",
    "expressPort": 3000,
    "platform": "google"
}
```

#### Google Cloud Function configuration
If you are using Google Cloud Functions the configuration is even easier, in this case you only need to provide the handler.
We support multiple formats of google cloud functions, and for all of them you just need to indicate what is the file that have your handler.

Example:
```json
{
    "dialogFlowDirectory": "../FactsAboutGoogle",
    "handler": "index.js",
    "platform": "google"
}
```

If your Google Cloud Function main function is not called handler, you have to indicate it's name

Example:
```json
{
    "dialogFlowDirectory": "../FactsAboutGoogle",
    "handler": "src/index.helloWorld",
    "platform": "google"
}
```

#### URL configuration
If you can not use the above configurations, you can also start your server manually and provide the google action URL, so that we direct
all the requests there.

Example:
```json
{
    "dialogFlowDirectory": "../FactsAboutGoogle",
    "actionURL": "http://localhost:8080/google",
    "platform": "google"
}
```

### Overwriting configuration parameters

If you want to run the tests with one or more parameters changed you can overwrite parameters directly from the run file. This will even replace existing parameters set on the testing.json file. For example if you want to replace the platform

```bash
bst test --platform google
```

You can get the complete list of parameters you can use by running:

```bash
bst test --help
```


## CLI Options
When invoking `bst test`, the name of a specific test or regex can be used, like this:
```bash
bst test test/MyIntent.test.yml
```

Or this:
```bash
bst test MyIntent
```

## Tests
The test syntax is based on YAML.

When running `bst test`, it automatically searches for files with the following names:

* `**/test/\*\*/*.yml`
* `**/*.e2e.yml`
* `**/*.spec.yml`
* `**/*.test.yml`

Any tests that match these patterns will be run.
A recommended convention is to sort test files under a test dir.

### Localization
Localization is a built-in feature of Bespoken unit-testing.

To leverage it, add a directory `locales` where your tests are located. Inside it add files for each language and/or locale, like so:
```bash
test
  index.test.yml
  locales
    en.yml # Core english phrases
    en-GB.yml # Overrides for english phrases in Great Britain locale
    de.yml # Core german phrases
```
The files themselves look like this:
```
heresIsAFact: Here's your fact
cardTitle: Space Facts
helpPrompt: You can say tell me a space fact, or, you can say exit... What can I help you with?
helpReprompt: What can I help you with?
stopPrompt: Goodbye!
cancelPrompt: Goodbye!
fallbackPrompt: The Space Facts skill can't help you with that.  It can help you discover facts about space if you say tell me a space fact. What can I help you with?
fallbackReprompt: What can I help you with?
```

When utterances, slot values and assertions are being resolved, tokens from the left-hand side are automatically replaced with values on the right-hand side. For example, take this simple test:
```yml
---
- test: Launch request, no further interaction.
- LaunchRequest: heresIsAFact
```

In this scenario, when the test is run for the en-US locale, the output speech will be compared to "Here's your fact", the value that heresIsAFact resolves to in our locale file.

To see a complete example, [check out this project](https://github.com/ig-perez/skill-sample-nodejs-fact/tree/MultiLocalesScripts/test/unit).

### Test Suites
Each test file is a test suite. Test suites are made up of one or many tests.

The tests represent discreet conversations with Google Assistant. Each test can have one or many interactions - here is a simple example:
```yml
# A simple example of skill test suite for google assistant
--- # Configuration YAML document
configuration:
  locale: en-US

--- # The --- indicates the start of a new test, which is a self-contained YAML document
- test: "Launches successfully" # Optional info about the test
- I want to hear about Google's History: Sure, here's a history fact.
# Using intent slot
- tell_fact category=history:
  - prompt == "Sure, here's a history fact"
- I want to hear about Google's History: Sure, here's a history fact.
- I want to hear about Google's History: Sure, here's a history fact.
# This example preserves context, after 4 random history facts, it prompt a different message
- I want to hear about Google's History: Looks like you've heard all there is to know about


--- # The --- indicates the start of a new test, which is a self-contained YAML document
- test: "Launches successfully Again" # Optional info about the test
- I want to hear about Google's History: Sure, here's a history fact.
# Using intent slot
- tell_fact category=history:
  - prompt == "Sure, here's a history fact"
- I want to hear about Google's History: Sure, here's a history fact.
- I want to hear about Google's History: Sure, here's a history fact.
# This example preserves context, after 4 random history facts, it prompt a different message
- I want to hear about Google's History: Looks like you've heard all there is to know about

```

The test suite above contains two tests. Additionally, at the top it has a configuration element.

The configuration provides settings that work across the test - [it is described below](#test-configuration).

The tests represent sequence of conversations with the skill.

They can use specific requests (such as LaunchRequest or SessionEndedRequest), or they can simply be an utterance.


### Test Structure
The start of a test is marked with three dashes on a line - `---`.

It can be followed by an optional test description, which looks like this:
```yml
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

### Assertions
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
```json
{
    "response": {
        "outputSpeech": {
            "ssml": "My SSML value"
         }
    }
}
```

The expected value can be:

* A string - quoted or unquoted
* A number
* `true` or `false`
* A regular expression - should be denoted with slashes (/this .* that/)
* `undefined` - special value indicating not defined

#### JSONPath Properties
JSONPath is an incredibly expressive way to get values from a JSON object.

You can play around with [how it works here](http://jsonpath.com/).

Besides handling basic properties, it can also navigate arrays and apply conditions.

An array example:
```json
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

#### Shorthand Properties
For certain commonly accessed elements, we offer short-hand properties for referring to them. These are:

* cardContent - Corresponds to `displayText`
* cardTitle - Corresponds to `speech`
* prompt - Grabs either the text from `data.google.richResponse.items[0].simpleResponse.textToSpeech` or from `speech, whichever one is set
* sessionEnded - Corresponds to `expectUserResponse` or `data.google.expectUserResponse`

These elements are intended to work across platforms and test types.

Example:

```yml
- test: "My Fact Skill"
- LaunchRequest:
  - prompt: "Here's your fact"
```

#### Regular Expression Values
The expected value can be a regular expression.

If it follows a ":", it must be in the form of /my regular expression/ like this:
```yml
- response.outputSpeech.ssml: /hello, .*, welcome/i
```

Regular expression flags are also supported with this syntax, such as /case insensitive/i.
They are [described here in more detail](https://javascript.info/regexp-introduction#flags).

#### Collection Values
It is also possible to specify multiple valid values for a property.

That is done with a collection of expected values, such as this:
```yml
LaunchRequest:
  - response.outputSpeech.ssml:
    - Hi there
    - Howdy
    - How are you?
```

When a collection is used like this, if any of the values matches, the assertion will be considered a success.

### Intent and Slot properties
Though it is convenient to use the utterance syntax, some times it may not work correctly.

It also is useful to be explicit about which intents and slots are desired.

To do that, set the first line of the test like so:
```yml
- SomeIntent SlotA=ValueA SlotB=ValueB
```

This is a shorthand for this more verbose syntax:
```yml
- "Some utterance"
  - intent: SomeIntent
    SlotA: ValueA
    SlotB: ValueB
```

This interaction will send an IntentRequest with the intent name SomeIntent and slots SlotA and SlotB set to ValueA and ValueB respectively.

### Request Expressions
Request expressions allow for setting values explicitly on the request to handler more complex cases.

For example, to set a request attribute explicity in a certain way, just write:
```yml
- "Some utterance"
  - request.session.attributes.myKey: myValue
```

This will set the value of `myKey` to `myValue`.

The left-hand part of the expression uses JSONPath, same as the assertion.

Note that all request expressions MUST start with request, and when they are setting part of the request element, it will appears redundant:
```yml
request.request.locale: en-US
```

### Goto And Exit
One advanced feature is support for `goto` and `exit`.

Goto comes at the end of an assertion - if the assertion is true, the test will "jump" to the utterance named.
Unlike regular assertions, ones that end in "goto" will not be deemed a failure if the comparison part of the assertion is not true.

For example:
```yml
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

## Test Execution
### Test Environment
Whenever tests are run, the environment variable UNIT_TEST is automatically set.

This can be used to craft unit tests that run more predictably, like this:
```js
sessionAttributes.guessNumber = Math.floor(Math.random() * 100);

// For testing purposes, force a number to be picked if the UNIT_TEST environment variable is set
if (process.env.UNIT_TEST) {
  sessionAttributes.guessNumber = 50;
}
```

### Test Sequence
Tests are run in the order they appear in the file.

When there are multiple test files, [Jest](https://facebook.github.io/jest/) will run them in parallel, each in their own process.

This allows test suites to run much faster. When any particular test fails, the other tests will continue to process.

### Locales
For each locale defined in either the testing.json file or in the test suite itself, the tests will be run in their entirety.

That means if three locales are defined, the entire test suite will be run three times.

### Skipping Tests
Label tests "test.only" or "test.skip" to either only run a particular test, or to skip it. Example:
```yml
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

### Viewing Request/Response Payloads
Set the `trace` flag in the testing.json file and the full request and response JSON payloads will be printed to the console when the tests are run.

### Filtering during test
By specifying the "filter" property, it is possible to intercept and even change the properties of the tests along their execution.
For example you can intercept the request before it is sent to the skill, as well as the response before the assertions are run against it.

The module will be loaded from the path where the tester is being run, and should be referenced that way. For example:
If `bst test` is being run at `/Users/bst-user/project`
And the filter file is `/Users/bst-user/project/test/myFilterModule`
Then the filter should be set to `filter: test/myfilterModule`

The filter module should be a simple JS object with all or some of this functions:
* onTestSuiteStart(testSuite)
* onTestStart(test)
* onRequest(test, request)
* onResponse(test, response)
* onTestEnd(test, testResults)
* onTestSuiteEnd(testResults)
* resolve(variable, interaction)

An example filter is here:
```js
module.exports = {
    onRequest: (test, request) => {
        request.requestFiltered = true;
    },

    onResponse: (test, response) => {
        response.responseFiltered = true;
    }
}
```

The filter is a very useful catch-all for handling tricky test cases that are not supported by the YAML test syntax or if you want to fine tune some aspects of the tests.

### Replacing values using filter
If you need to modify certain assertions during the test run, based on the test utterances or external API's you can do it with
the test [filter](#filtering-during-test) property implementing the `resolve` method.

With it you can have a variable inside the YML file, for example:
```yml
- open my skill:
  - prompt: Hi {name}, welcome to the skill. You have {points} points
```

Then inside the [filter](#filtering-during-test) you can set the resolve method to return:
 - a string
 - a number
 - a promise resolving in a string or a number

```js
module.exports = {
    resolve: function(variable, interaction) {
      // interaction allows seeing any information from the interaction
      // and the parent test and testSuite you need

      if (variable === "name") return "John";
      if (variable === "points") {
         let points;
         // you can include here any logic you would need to modify "points", including external API's
         return points;
      }
    }
};

```

This replacement will be done after the response is gotten from the test but before evaluation of the assertion.

### Including or excluding tests using tags

By specifying tags in particular tests you can then run only the tests you want. Let's say you have tests specific to the first time a user uses your skill, we are going to apply the tag "FirstUse" to them:

```yml
---
- test: open the skill
- tags: FirstUse, Google
- open my skill: hello
```

Note that multiple tags can be applied to a test, as a comma-delimited list.

If you want to run all the tests that have that particular tag, you can edit testing.json to indicate that those are the ones to run by adding the "include" property:

```json
{
    "include": ["FirstUse"],
}
```

You can also use the exclude property to prevent some tests from being run, suppose we marked some broken tests with the tag broken, the following configuration will prevent those tests marked from being run:

```json
{
    "exclude": ["broken"],
}
```

Remember you can also use the override properties when executing the bst test command and also combine include and exclude together. This command will run all the tests that have either FirstUse or ReturningUser tags but exclude the ones that are also marked as broken

```bash
bst test --include FirstUse,ReturningUser --exclude broken
```

### Code Coverage
Whenever Jest runs, it produces code coverage information - it is seen on the console.

An HTML report is also viewable under `<TESTING_CONFIG_DIR>/coverage/lcov-report/index.html`.
TESTING_CONFIG_DIR is the directory where your `testing.json` file is located.

### HTML Reporting
The results of your tests are automatically formatted into a nice HTML report, courtesy of jest-stare.

It is viewable under `./test_output/results/index.html`.

It provides a nice summary of the results of your tests, with charts. You can also drill down into the detailed test results.

To read more about jest-stare, [click here](https://github.com/dkelosky/jest-stare#readme).

### Continuous Integration
To see how a project works with a total CI setup, [checkout this project](https://github.com/ig-perez/skill-sample-nodejs-fact/tree/ContinuousIntegration).

It is configured with Travis and Codecov. Here is the `.travis.yml` configuration file included with the project:
```yml
language: node_js
node_js:
  - "8"
cache:
  directories:
  - lambda/custom/node_modules
install:
  - npm install bespoken-tools -g
  - npm install codecov -g
  - cd lambda/custom && npm install && cd ../..
script:
 - bst test
 - codecov
```

To set it up for your own projects, you will need to enable them with [Travis](https://travis-ci.org) and [Codecov](https://codecov.io) (or whatever CI and coverage tools you prefer). Visit their websites for in-depth instructions on how to do this.

## Further Reading
Take a look at:
* Our [use cases](./use-cases.html)
* Our [getting started guide](./getting-started.html)

And don't hesitate to reach out via [Gitter](https://gitter.im/bespoken/bst).

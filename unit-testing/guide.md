---
title: In-Depth Guide Alexa
permalink: /unit-testing/guide/
---

# Complete Guide to Unit-Testing for Alexa
## Overview
The purpose of Bespoken Unit Testing is to make it easy for anyone to test Alexa skills and voice apps.

The syntax is based on YAML, and is meant to be easy to read and write. [Learn more about YAML syntax here](http://yaml.org/spec/1.2/spec.html#Preview).

The tests are actually run with specialized version of Jest.
Jest is an excellent testing tool, that combines unit tests, code coverage, easy-to-use mocks and other nice features in one place.
[Learn more here](https://facebook.github.io/jest/).

Jest has been configured with a custom test runner, which:
* Works with YAML files, fitting the structure described in this document
* Runs using our [Virtual Alexa component](https://github.com/bespoken/virtual-alexa) to generate JSON requests and emulate Alexa behavior

We consider this the best of all worlds - a full-featured general testing framework tailored to work specifically with skills.

### Nota Bene
**KEEP IN MIND** the skill tester uses Virtual Alexa, which is an emulator. It is not the real Alexa. This has some benefits, such as:

* Fast execution time
* No need for deployment to run
* Minimal dependencies, and with builtin mocks that are useful

But there are also limitations. Those include:

* It does not have real speech recognition - turning utterances into intents is done with simple heuristics
* It cannot call the actual Alexa APIs, such as the Address API, because it does not generate a proper apiAccessToken
* It is emulating Alexa, and may do it imperfectly at times (and let us know if you see any issues)

If you run into issues with testing specific utterances, always keep in mind you can set the exact intent and slot values with the intent and slot properties.

## BST Init
The `bst init` command is the fastest way to create all the files and folders needed to start testing your voice apps. It's a great starting point! You can read more about it [here](./../../cli/commands/#init).

## Configuration
Global configuration options for testing skills can be set in the `testing.json` file, which is typically kept at the root level of your project.

These options can include overriding Jest options, as well as setting skill testing specific ones.

The default Jest settings are as follows:
```json
{
    "collectCoverage": true,
    "collectCoverageFrom": [
        "**/*.js",
        "!**/coverage/**",
        "!**/node_modules/**",
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

An example `testing.json` file:
```json
{
    "handler": "src/index.handler",
    "locales": "de-DE",
    "interactionModel": "models/de-DE.json",
    "trace": true,
    "jest": {
        "silent": true
    }
}
```

Below the unit testing configuration options and what they do are listed:

| Key | Description |
| --- | --- |
| [address](/unit-testing/use-cases/#testing-with-the-address-api) | Sets the address to be returned by the address API |
| deviceId | Sets the deviceId to be used in the generated requests |
| [dynamo](/unit-testing/use-cases/#testing-with-dynamo) | Should be set to "mock" to use the mock dynamo component |
| description | The description of the set of tests |
| env | The location of the .env file to load environment variables, defaults to ".env" at the project root directory|
| [filter](#filtering-during-test) | The (optional) path to a class that can be used to override value on the request and response |
| [findReplace](#find-replace) | Values that will be replaced in the scripts before execution |
| handler | The path to the handler (and function name) to run the test |
| html | Generate a pretty HTML report of test results - defaults to `true` |
| [include and exclude](#including-or-excluding-tests-using-tags) | Runs or Skip the tests having the particular specified tags |
| intentSchema | If using "old-style" configuration files, the path to the intent schema |
| interactionModel | The path to the interaction model to use for the test |
| lenientMode | Removes the following punctuation signs: `().-"',;:!?)` as well as any extra white spaces present in the transcript while doing assertions | defaults to `false` |
| [locales](#locales) | The locale or locales to be used - a comma-delimited list. The entire suite will be run once for each locale |
| sampleUtterances | If using the "old-style" configuration files, the path to the sampleUtterances |
| skillURL | If not calling a javascript handler directly, the URL to call instead - e.g., http://localhost:9000/skill. Very useful for testing skills written in languages other than Javascript |
| [trace](#viewing-requestresponse-payloads) | Causes request and response JSON payloads from the skill to be printed to the console |
| userId | Sets the userId in the request payload |

To override [Jest options](https://facebook.github.io/jest/docs/en/configuration.html), just set them under the "jest" key.

## BST Test
### Description
Execute the test(s).

### Usage
```bash
bst test [OPTIONS] [REGEX]
```
When running `bst test`, it automatically searches for files with the following names:

* `**/test/\*\*/*.yml`
* `**/*.e2e.yml`
* `**/*.spec.yml`
* `**/*.test.yml`

The name of a specific test can be used:
```bash
bst test test/MyIntent.test.yml
```

Or a regular expression:
```bash
bst test MyIntent
```
Any tests that match these patterns will be run.

### Options

| Option | Description |
| --- | --- |
| --version| current version of Bespoken CLI |
| --config | Set the path of the testing.json file |
| --context | Set the context to resolve relative paths, defaults to where testing.json is located |
| --deviceId | Override the deviceId set in the configuration file |
| --env | The location of the .env file to load environment variables, defaults to ".env" at the project root directory|
| [--exclude](#including-or-excluding-tests-using-tags) | Set the exclude tags to execute |
| [--include](#including-or-excluding-tests-using-tags) | Set the include tags to execute |
| --locales | Override the locales set in the configuration file |
| --platform | Override the platform set in the configuration file |
| --skillURL | Override the skillURL set in the configuration file |
| --trace | Override the trace set in the configuration file |
| --userId | Override the userId set in the configuration file |

### Overwriting configuration parameters

If you want to run the tests with one or more parameters changed you can overwrite parameters directly from the run file. This will even replace existing parameters set on the testing.json file. For example if you want to replace the platform

```bash
bst test --platform google
```

You can get the complete list of parameters you can use by running:

```bash
bst test --help
```

### Using environment variables as settings

You can use environment variables inside the testing.json file by using the `${variable}` format.

For example, this:

```json
{
    "interactionModel": "${SKILL_LOCALE}.json"
}
```

...will look for an environment variable called "SKILL_LOCALE" and replace the value in your testing.json file with it.

### Custom configuration path and context
By convention, the testing.json file is kept under the root of the project, but you can also set a custom path for it.

```bash
bst test --config customPath/testing.json
```
By default the context to resolve custom paths are relative to the location of the testing.json file. So if your testing.json file is in the root folder:

```bash
.
├ testing.json
├ test.yml
├ lambda
    └ index.js
```

To set the location of your handler in your testing.json, it will be:
```json
{
  "handler": "./lambda/index"
}
```

If you have a particular folder structure, you have to set the configuration path and the context you want to use to resolve the relative path.

```bash
.
├ config
|   └ testing.json
├ lambda
    └ custom
        └ index.js
```

```json
{
  "handler": "./lambda/custom/index"
}
```

```bash
bst test --config config/testing.json --context .
```


If you do not set the context, the handler path should be relative to the testing.json
```json
{
  "handler": "../lambda/custom/index"
}
```

```bash
bst test --config config/testing.json
```

## Tests
The test syntax is based on YAML.

### Localization
Localization is a built-in feature of the Bespoken tests.

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

The tests represent discreet conversations with Alexa. Each test can have one or many interactions - here is a simple example:
```yml
---
configuration:
  locales: en-US

---
- test: Launch and get a fact
- LaunchRequest: # LaunchRequest sends a LaunchRequest
  - response.outputSpeech.ssml: Here's your fact
  - response.card.type: Simple
  - response.card.title: Space Facts
  - response.card.content: /.*/ # Regular expression indicating any text will match for card content

---
- test: Get help then get a fact
- HelpIntent: say get fact to get a fact
- GetFactIntent:
  - response.outputSpeech.ssml: here's your fact
  - response.card.type: Simple
  - response.card.title: Space Facts
  - response.card.content: "*" # Plain asterisk can also be used to match any text
```

The test suite above contains two tests. Additionally, at the top it has a configuration element.

The configuration provides settings that work across the test - [it is described below](#test-configuration).

The tests represent sequence of conversations with the skill.

They can use specific requests (such as LaunchRequest or SessionEndedRequest), or they can simply be an utterance.

### Test Configuration
The test configuration can override elements set in the global skill testing configuration.

It can also set test-suite specific items such as:

* accessToken: Sets the access token in the generated requests
* [address](/unit-testing/use-cases/#testing-with-the-address-api): Should be set with address attributes to emulate results from the Address API
* applicationId: Sets the applicationId to be used in the generated requests
* deviceId: Sets the deviceId to be used in the generated requests
* [dynamo](/unit-testing/use-cases/#testing-with-dynamo): Should be set to "mock" to use the mock dynamo component
* userId: Sets the userId to be used in the generated requests

### Test Structure
The start of a test is marked with three dashes on a line - `---`.

It can be followed by an optional test description, which looks like this:
```yml
- test: "Description of my test"
```

This description, if provided, must be the first line in the test.

The test is then made up of a series of interactions and assertions.

Each interaction is prefixed with a "-" which indicates a YAML collection.

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
An assertion follows a simple syntax:  
 `[JSONPath Property/Shortand property] [Operator] [Expected Value]`

An example is line 4 of the following yaml test:

```yaml
---
- test: Launch the skill
- LaunchRequest:
  - response.outputSpeech.ssml: My SSML Value
```
#### JSONPath Properties
JSONPath is an incredibly expressive way to get values from a JSON object. We use JSONPath to get values from the response, such as: `response.outputSpeech.ssml`.

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

Besides handling basic properties, it can also navigate arrays and apply conditions. For example, to get the first directive type in this response:

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

Our assertion would look like this:
```yaml
- "response.directives[0].type" : "AudioPlayer.Play"`
```

You can play around with [how it works here](http://jsonpath.com/). Just make sure to wrap your expression in double-quotes if you use these so that they don't conflict with our YAML syntax.

#### Shorthand Properties
We offer short-hand properties for certain commonly accessed elements. These are:

* cardContent - Corresponds to `response.card.content`
* cardImageURL - Corresponds to `response.card.image.largeImageUrl`
* cardTitle - Corresponds to `response.card.title`
* prompt - Grabs either the text or ssml from `response.outputSpeech`, whichever one is set
* reprompt - Grabs either the text or ssml from `response.reprompt.outputSpeech`, whichever one is set
* sessionEnded - Corresponds to `response.shouldEndSession`

These elements are intended to work across platforms and test types.

Example:

```yml
- test: "My Fact Skill"
- LaunchRequest:
  - prompt: "Here's your fact"
```

The `prompt` property is also used by the Dialog Interface. [More information on that here](/unit-testing/use-cases/#testing-with-the-dialog-interface).

#### Operators
Operators define the type of comparison we do between the property being evaluated and the expected values. These are:

* : Partial equals or regular expression - for example, the expected value "partial sentence" will match "this is a partial sentence", the expected value /.*is.*/ will match "this sentence has is on it"
* != Not equal to
* \>  Greater than
* \>= Greater than or equal
* <  Less than
* <= Less than or equal
#### Expected Values
The expected value can be:

* A string - quoted or unquoted
* A number
* `true` or `false`
* `undefined` - special value indicating not defined
* A regular expression - should be denoted with slashes (/this .* that/)

For regular expressions, if following a ":" operator, it must be in the form of /my regular expression/ like this:
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

When a collection is used like this, if **any** of the values matches, the assertion will be considered a success.

#### Empty Assertions
You can also write interactions without assertions. This would be equivalent to doing `- MyIntent: "*"`, but it can be useful when you have interactions that are not relevant to your test but required to get to the interaction that is. In the following example, after launching our voice app, we only focus on testing the help intent:

```yaml
---
- test: Ask for help and exit
- LaunchRequest
- AMAZON.HelpIntent: 
  - response.outputSpeech.ssml: "What can I help you with?"
  - response.card: undefined
  - response.reprompt.outputSpeech.ssml: "What can I help you with?"
- exit
```

### Intent and Slot properties
Though it is convenient to use the utterance syntax, some times it may not work correctly. On those cases, it is useful to be explicit about which intents and slots are desired. To do that, set the first line of the test like so:

```yml
- SomeIntent SlotA=ValueA SlotB=ValueB
```

This is a shorthand for this more verbose syntax:
```yml
- "Some utterance"
  - intent: SomeIntent
  - slots:
      SlotA: ValueA
      SlotB: ValueB
```

This interaction will send an IntentRequest with the intent name SomeIntent and slots SlotA and SlotB set to ValueA and ValueB respectively.

### Request Expressions
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

### Find/Replace
Find/replace values are helpful for parameterizing parts of the test.

For example, if the invocation name of the skill being tested will change from one run to the next, it can be set as a find/replace value like so:


They will look like this:
```json
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
* onTestSuiteStart([testSuite](https://bespoken.github.io/skill-testing-ml/api/TestSuite.html))
* onTestStart([test](https://bespoken.github.io/skill-testing-ml/api/Test.html))
* onRequest([test](https://bespoken.github.io/skill-testing-ml/api/Test.html), request)
* onResponse([test](https://bespoken.github.io/skill-testing-ml/api/Test.html), response)
* onTestEnd([test](https://bespoken.github.io/skill-testing-ml/api/Test.html), [testResults](https://bespoken.github.io/skill-testing-ml/api/TestResult.html))
* onTestSuiteEnd([testResults](https://bespoken.github.io/skill-testing-ml/api/TestResult.html))
* resolve(variable, [interaction](https://bespoken.github.io/skill-testing-ml/api/TestInteraction.html))

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
- tags: FirstUse, Alexa
- open my skill: hello
```

You can also apply tags to all the tests inside a file by setting the tags inside de configuration element:

```yml
configuration
  tags: FirstUse, Alexa
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

### Ignore properties on demand

Different platforms have different properties and sometimes is not possible to validate the same exact properties when running the test using another platform. For these cases, you can ignore a list of properties from your tests. Here is an example of a testing.json that has some properties ignored:

```json
{
    "ignoreProperties": {
        "google": {
            "paths": "display.array[0].url",
            "type": "unit"
        },
        "alexa": {
            "paths": "streamURL"
        },
    },
    "platform": "alexa",
    "type": "unit"
}
```

The "ignoreProperties" setting can receive setup for Google, Alexa or both. This setup must have a list of paths that are ignored and can also
present optionally a type (e2e or unit). With this, you can run the same tests files by changing the platform without modifying the tests at all.

If you need to fine tune this, you can overwrite the configuration at test level by adding the ignoreProperties setup as part of your configuration for that test.
```yml
---
configuration:
    locales: en-US
    ignoreProperties:
        google:
            paths: display, debug.arrayProperty[0]
            type: unit
        alexa
            paths: display.template.content
            type: unit
---
- test: open, no further interaction
- open get fact:
    - prompt: here's your fact
    - cardContent: /.*/
    - cardTitle: Space Facts
```

## Code Coverage
Whenever Jest runs, it produces code coverage information - it is seen on the console.

![code coverage](https://user-images.githubusercontent.com/6411740/69264113-acc6da80-0b94-11ea-96af-464e3acf8f39.png)

An HTML report is also viewable under `./test_output/coverage/lcov-report/index.html`.

![files](https://user-images.githubusercontent.com/6411740/69264437-527a4980-0b95-11ea-8066-c5506c2e23f6.png)

Clicking on a file will reveal the lines that were covered (highlighted in green) and the ones that were not (highlighted in red).

![detailed results](https://user-images.githubusercontent.com/6411740/69264647-bc92ee80-0b95-11ea-8622-051d9a08c41a.png)


## HTML Reporting
The results of your tests are automatically formatted into a nice HTML report, courtesy of jest-stare.
Once you run your tests, you'll find it under `./test_output/results/index.html`.
The report provides a nice summary of the results of your tests along with useful charts.

![bst html report](https://user-images.githubusercontent.com/6411740/69192235-2f4a8e00-0af2-11ea-9176-2628e8f73927.png)

You can filter the tests by result with the toggles at the top.

![result toggles](https://user-images.githubusercontent.com/6411740/69192392-7769b080-0af2-11ea-99e5-72a15040be5e.png)

By scrolling down or clicking on any of the tests of the summary, you can go into the detailed test results.

![detailed results](https://user-images.githubusercontent.com/6411740/69192709-24dcc400-0af3-11ea-941b-3b26fed8aaa1.png)

You can also customize the title at the start of the report and the title of the report window by setting the following environment variables respectively:
```
JEST_STARE_REPORT_HEADLINE
JEST_STARE_REPORT_TITLE
```
To generate a single page version of the report:
```
JEST_STARE_INLINE_SOURCE=true
```
To generate a pdf version of the report:
```
JEST_STARE_GENERATE_PDF=true
```
To read more about jest-stare, [click here](https://github.com/bespoken/jest-stare#readme).

## Continuous Integration
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
* Our [use cases](/unit-testing/use-cases/)
* Our [getting started guide](/unit-testing/getting-started/)

And don't hesitate to reach out via [Gitter](https://gitter.im/bespoken/bst/).

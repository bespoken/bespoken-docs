---
title: In-depth Guide
permalink: /end-to-end/guide/
---

# Complete Guide to End-to-end Testing
## Overview
Bespoken End-to-end Test Scripts make it easy for anyone to write automated tests for Alexa and Google Assistant.

The syntax is based on YAML, and is meant to be easy to read and write. [Learn more about YAML syntax here](http://yaml.org/spec/1.2/spec.html#Preview).

The tests are actually run with specialized version of Jest.
Jest is an excellent testing tool, that combines unit tests, code coverage, easy-to-use mocks and other nice features in one place.
[Learn more here](https://facebook.github.io/jest/).

Jest has been configured with a custom test runner, which:
* Works with YAML files, fitting the structure described in this document
* Runs using our [Virtual Device SDK](https://github.com/bespoken/virtual-device-sdk) to interact directly with Alexa and/or Google assistant

We use the same basic format for unit-testing and end-to-end testing, but there are differences in how the tests should be written. For information on unit-testing, [read here](/unit-testing/guide/).

ADDITIONALLY - we now support experimentally the SMAPI Simulation API. This can be enabled using the type of `simulation`.

## Installation
### Prerequisites
* [Node.js v12 or superior](https://nodejs.org/en/download/)
* [npm](https://www.npmjs.com/get-npm)

### Install
```bash
npm install bespoken-tools -g
```

To test to see if it is installed correctly, then try typing:
```bash
bst
```

You should see output like this:
```bash
jpk-mbp:alexa-skill jpk$ bst
BST: v2.0.0  Node: v12.22.11


  Usage: bst [options] [command]
  **(Output truncated)**
```
That means it was installed successfully!

### Virtual Device Setup
First, you need to setup a virtual device, which allows for interaction via text and API with Alexa and Google Assistant. See [here for instructions](/end-to-end/setup/).  

## BST Init
The `bst init` command is the fastest way to create all the files and folders needed to start testing your voice apps. It's a great starting point! You can read more about it [here](./../../cli/commands/#init).

## Configuration
Global configuration options for testing can be set in the `testing.json` file, which is typically kept at the root level of your project. Here's an example of how it looks:

```json
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
    "virtualDeviceToken": "<VIRTUAL DEVICE TOKEN>"
}
```

The following are the different configuration options available ordered alphabetically:

| Key | Description |
| --- | --- |
| [deviceLocation](./faq/#how-do-i-change-my-virtual-device-location-to-test-location-specific-features) | Only for Google virtual devices, it allows to set a specific location value from where the requests are sent. It is composed by the `lat` and `lng` keys.
| env | The location of the .env file to load environment variables, defaults to ".env" at the project root directory|
| [filter](#filtering-during-test) | Optional path to a class that can be used to override values on the requests and responses |
| [findReplace](#find-replace) | Values that will be replaced in the scripts before execution |
| [homophones](#homophones) | Values that will be replaced in actual responses from a virtual device |
| [include/exclude](#including-or-excluding-tests-using-tags) | Run or skip the tests that match the specified set of tags |
| lenientMode | Removes the following punctuation signs: `().-"',;:!?)` as well as any extra white spaces present in the transcript while doing assertions - defaults to `false` |
| [locales](#locales) | The locale or locales to be used - a comma-delimited list. The entire suite will be run once for each locale |
| platform | The platform to test (alexa, google, phone, sms, whatsapp, webchat) defaults to `alexa` |
| [runInBand](#test-running-sequence-parallelism) | If set to `true` (default), a test suite will run only when the previous one has finished running. If set to `false` test suites will run in parallel to each other - defaults to `true`|
| stopTestOnFailure | Stops the execution of a test and continues with the next one as soon as there is an assertion error - defaults to `false` |
| stt | Speech to text service to use on your test's utterances. Supported services are google and witai - defaults to google |
| [trace](#viewing-response-payloads) | Causes request and response JSON payloads to be printed to the console |
| traceOutput | Saves a copy of each request and response in the `test_output` folder for debugging purposes - defaults to false|
| type | The type of test being run - can be `unit` or `e2e` - defaults to `unit` |
| [virtualDeviceToken](/end-to-end/setup/) | For end-to-end tests that use virtual devices, this must be specified. [Get one here](../setup/) |
| voiceId| For end-to-end tests that use spoken utterances, this must be specified. Sets the voice id for text to speech conversion of your utterances.|

Additionally, you can override [Jest options](https://facebook.github.io/jest/docs/en/configuration.html) under the "jest" key. Here are our default ones:

```json
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

## BST Test
### Description
Execute the test(s).

### Usage

When running `bst test`, it automatically searches for files with the following names:

* `**/test/\*\*/*.yml`
* `**/*.e2e.yml`
* `**/*.spec.yml`
* `**/*.test.yml`

Any tests that match these patterns will be run.
A recommended convention is to sort test files under a test dir, and to label end-to-end tests as `IntentName.e2e.yml`, where each test file contains tests for a specific intent.

When invoking `bst test`, the name of a specific test or regex can be used, like this:
```bash
bst test test/MyIntent.test.yml
```

Or this:
```bash
bst test MyIntent
```

### Overwriting configuration parameters
If you want to run the tests with one or more parameters changed you can overwrite default parameters directly from the command line. This will even replace existing parameters set on the `testing.json` file. For example, if you want to replace the env file path you can write:

```bash
bst test --env myVariables.env
```

You can get the complete list of parameters you can use by running:

```bash
bst test --help
```

### Using environment variables as settings

Speaking of environment variables, you can use them inside the `testing.json` file by using the `${variable}` format.

For example, this:

```json
{
    "virtualDeviceToken": "${VIRTUAL_DEVICE_TOKEN}"
}
```

...will look for an environment variable called "VIRTUAL_DEVICE_TOKEN" and replace the value in your testing.json file with it. This can be useful if you don't want that information exposed in a project, among other uses.

### Custom configuration path
By convention, the testing.json file is kept under the root of the project, but you can also set a custom path for it.

```bash
bst test --config customPath/testing.json
```

## Tests

### Test Suites
Each test file is a test suite. Test suites are made up of one or many tests.

The tests represent discreet conversations with your voice app. Each test can have one or many interactions - here is a simple example:
```yml
---
configuration:
  description: My first test suite
  locale: en-US

---
- test: open, no further interaction
- open get fact: here's your fact

---
- test: open, no further interaction
- open get fact:
  - prompt: here's your fact
  - caption: Welcome to the facts skill
- help: just say get fact to get a fact
- stop: goodbye
```

The test suite above contains two tests. Additionally, at the top it has a configuration element.

The configuration provides settings that work across the test - [it is described below](#test-suite-configuration).

The tests represent sequence of conversations with the skill.

They can use specific requests (such as LaunchRequest or SessionEndedRequest), or they can simply be an utterance.

### Test Suite Configuration
The test suite file can optionally have a configuration section. This is a good place to put things that vary between sets of tests - such as the voice to use for Speech-To-Text or the name of the suite. It looks like this:  

```yaml
configuration:
  description: A friendly name for your test suite
  locale: <en-US, en-GB, de-DE, etc.>
  voiceId: <The Voice ID to use for TTS>
```

### Available voices
We use different voice providers for our tests. To change the voice used for your tests, simply specify the voiceId you want to use in your `testing.json` file. The lisf of available voices can be found below:

* [Amazon Polly](https://docs.aws.amazon.com/polly/latest/dg/voicelist.html)
* [Google Speech to Text](https://cloud.google.com/text-to-speech/docs/voices)

### Test Structure
The start of a test is marked with three dashes on a line - `---`.

It can be followed by an optional test description or name, which looks like this:
```yml
- test: First test
```

This description, if provided, must be the first line in the test.

The test is then made up of a series of interactions and assertions.

Each interaction is prefixed with a "-" which indicates a YAML collection.

The first part of each interaction is an [utterance](#utterance), and the first utterance of each test should include your voice app [invocation name](#invocation-names). After each utterance, there comes a series of expressions. Typically, these are assertions about the test, but they can be:

* [Assertions](#assertions): The life-blood of tests - statements about the expected output
* [Request Expressions](#request-expressions): Allow for setting values on the request - helpful for testing more complex cases
* [Intent and Slot Properties](#intent-and-slot-properties): Allow for specifically setting the intents and slots. Bypasses mapping the utterance to the intent and slot.

For each interaction, there can be many assertions and request expressions.
There is not a limit on how much can be tested!

When tests are run, each interaction is processed in sequential order. Within it, each assertion is in turn evaluated in order when a response is received.

If any assertion fails for a test, the test stops processing, and information about the failed assertion is provided.

### Utterance
Is the first part of the interaction, it can be plain text, SSML (Speech Synthesis Markup Language), or a url with prerecorded audio.

Plain text:
```
- this is a plain text:
```

SSML:
```xml
- <speak>this is SSML</speak>:
```

URL:
```yaml
- https://mywebpage.com/alexa_interaction.mp3
```

For more details on how to write SSML, look [here](#ssml).

Prerecorded audios that are sent as utterances should have the following formats: 
- Any of the [FFMPEG supported audio formats](https://ffmpeg.org/ffmpeg-formats.html) for regular end-to-end tests.
- Any of the [Twilio Play supported audio formats](https://www.twilio.com/docs/voice/twiml/play#nouns) for IVR end-to-end tests. 

### Invocation Names
The first utterance of your test should contain the invocation name of your voice app. It is important to know that since you'll be interacting with your voice platform directly, you don't need to use the wake words "Alexa" or "Hey Google". 

Here's an example of invoking an Alexa skill:
```yaml
- open bring! shopping list
```

and here's an example for a Google action:
```yaml
- talk to bring! shopping list
```

These are not the only ways you can invoke your voice apps, however. For more details on how to invoke an Alexa skill, including different locales, see [here](https://developer.amazon.com/en-US/docs/alexa/custom-skills/understanding-how-users-invoke-custom-skills.html). For Google Actions, take a look at how invocation phrases work [here](https://developers.google.com/assistant/discovery#invocation_phrases), and their variants per locale [here](https://developers.google.com/assistant/console/languages-locales).

### Response Structure
A typical response from a virtual device call looks like this:

```json
{
    "message": "utterance",
    "utteranceURL": "url that contains the utterance in audio form",
    "card": {
      "content": "Alexa only - Card Content",
      "title": "Alexa only - Card Title",
      "imageURL": "Alexa only - Card image URL"
    },
    "streamURL": "streaming url (for audio skills)",
    "transcript": "speech to text result from the voice platform's audio response",
    "display": {},
    "caption": "alexa only - contains the caption in text form",
    "debug": {
        "deviceInteractionDuration": 2.51
    },
    "raw": {}
}

The `display` property contains any raw JSON response related to display information on the response.
The `raw` property contains the whole JSON response coming back from the voice platform. In the case of Alexa, this means all the directives are included here.

```
### Assertions
An assertion follows a simple syntax:
 `[JSONPath/Shorthand Property] [Operator] [Expected Value]`

An example is line 4 of the following yaml test:

```yaml
---
- test: Lima
- what is the capital of Peru:
  - transcript: the capital of Peru is Lima
```


#### JSONPath Properties
JSONPath is a simple and expressive way to get values from a JSON object. We use it to get values from the response, such as `transcript` or `card.content`. These will return the values "My audio transcript" and "Card Content" from the following JSON response:

```json
{
    "transcript": "My audio transcript",
    "card": {
        "content": "Card Content",
        "title": "Card Title",
    }
}
```

Besides handling basic properties, it can also navigate arrays and apply conditions. For example, see this other response in which we include some Alexa directives to the question "what time is it" inside the `raw` property:

```json
{
    "message": "what time is it",
    "transcript": "the time is 6:14 p.m.",
    "raw": {
        "messageBody": {
          "directives": [
                {
                    "payload": {
                        "endOfSpeechOffsetInMilliseconds": 2155
                    },
                    "namespace": "SpeechRecognizer",
                    "name": "SetEndOfSpeechOffset"
                },
                {
                    "payload": {},
                    "namespace": "InteractionModel",
                    "name": "RequestProcessingStarted"
                },
                {
                    "payload": {},
                    "namespace": "InteractionModel",
                    "name": "RequestProcessingCompleted"
                }
            ]
        }
    }
}
```

To get the namespace of the first directive, the JSONPath property would look like this: `raw.messageBody.directives[0].namespace`. And this is how it would look inside a test:

```yaml
---
- test : What time is it
- what time is it :
  - transcript : the time is 
  - "raw.messageBody.directives[0].namespace" : SpeechRecognizer
```

You can play around more with how JSONPath works [here](http://jsonpath.com/). Just make sure to wrap your assertion in double quotes if you use these, so that they don't conflict with the YAML syntax.

Note that the response output from the Virtual Device is much more limited than what your actual skill returns. This is a limitation of what is provided by Alexa Voice Service/Google Assistant. To test the actual JSON response from your skill, we recommend writing unit-tests - they use the same structure as our end-to-end test but can be run locally and have access to the full skill payload. [More info here](/unit-testing/guide/).

#### Shorthand Properties
We offer short-hand properties for certain commonly accessed elements. These are:

* cardContent - Corresponds to `card.textField`
* cardImageURL - Corresponds to `card.imageURL`
* cardTitle - Corresponds to `card.title`
* prompt - An alias for the `transcript` element from the JSON payload
* streamURL - (Alexa only) Corresponds to the `streamURL` element from JSON the payload
* caption - (Alexa only) The caption data for the spoken response - comes from the Speak directive on SpeechSynthesizer interface

Example:

```yml
- test: open fact skill
- open fact skill:
  - prompt: Here's your fact
```

The full range of card properties can be accessed by using the card property except
`card.type` which is an Alexa only property.

Example:

```yml
- test: open fact skill
- open fact skill:
  - card.title: Fact skill
```

These elements are intended to work across platforms and test types. The ones that are available
only for Alexa will be ignored during the tests if you are using a different platform.

#### Operators
Operators define the type of comparison we do between the property being evaluated and the expected values. These are:

* : Partial equals or regular expression - for example, the expected value "partial sentence" will match "this is a partial sentence", the expected value /.*is.*/ will match "this sentence has is on it"
* != Not equal to

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

Finally, you can also write utterances without assertions. This would be equivalent to doing `- open my skill: "*"`, but it can be useful when some utterances are not relevant to your tests. In the following example, we only focus on testing the stop intent of our voice app and ignore the response to `open fact skill`:

```yaml
---
- test: Invoke skill and stop
- open fact skill
- stop: 
  - prompt: Goodbye!
  - card.title: Fact skill
```
#### Collection Values
It is also possible to specify multiple valid values for a property.

That is done with a collection of expected values, such as this:
```yml
- open howdy
  - prompt:
    - Hi there
    - Howdy
    - How are you?
```

When a collection is used like this, if **any** of the values matches, the assertion will be considered a success.

### SSML

To create a more natural speech for your tests we can use Speech Synthesis Markup Language(SSML). With SSML tags, you can customize and control aspects of speech such as pronunciation, volume, and speech rate.

To use SSML add the tag speak into your utterance.

 ```html
<speak>Hello using SSML</speak>
```

Example:
 ```html
<speak>
    Here are <say-as interpret-as="characters">SSML</say-as> samples.
    I can pause <break time="3" />.
    I can speak in cardinals. Your position is <say-as interpret-as="cardinal">10</say-as> in line.
    Or I can speak in ordinals. You are <say-as interpret-as="ordinal">10</say-as> in line.
    Or I can even speak in digits. Your position in line is <say-as interpret-as="digits">10</say-as>.
    I can also substitute phrases, like the <sub alias="World Wide Web Consortium">W3C</sub>.
    Finally, I can speak a paragraph with two sentences.
    <p><s>This is sentence one.</s><s>This is sentence two.</s></p>
</speak>
```
say-as: Lets you indicate information about the type of text construct that is contained within the element. It also helps specify the level of detail for rendering the contained text.
break: An empty element that controls pausing or other prosodic boundaries between words.
sub: Indicate that the text in the alias attribute value replaces the contained text for pronunciation.
s, p: Sentence and paragraph elements.

For details on how to use the ssml tags for Amazon Polly go to [Amazon SSML Reference](https://developer.amazon.com/docs/custom-skills/speech-synthesis-markup-language-ssml-reference.html#ssml-supported) and for Google Text-to-Speech go to [Google SSML Reference](https://cloud.google.com/text-to-speech/docs/ssml#support-for-ssml-elements).

If you want to create utterances valid for both providers use only common tags: break, emphasis, p, prosody, s, say-as, sub.


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

### Homophones
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
```json
{
    "homophones": {
        "white": ["wife"]
    }
}
```

### Test Running Sequence - Parallelism
Individual tests run in the order in which they appear in their file. Test suites, however, run in random order and, by default, in serial. You can change this behavior by setting the `runInBand` property to `false` in your testing.json file, allowing test suites to run much faster and in parallel.

Be aware that, when enabling parallelism, you will need to define a different virtual device within each of your test suites, and these should be from unique Amazon/Google accounts. Otherwise, you'll run into concurrency issues.

Here's how test suites running in parallel looks like:

![parallel-run](https://user-images.githubusercontent.com/6411740/139502228-dc29cd92-f328-47a0-8a99-a75df91cf9e1.gif)

### Locales
For each locale defined in either the testing.json file or in the test suite itself, the tests will be run in their entirety.

That means if three locales are defined, the entire test suite will be run three times.

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
openSpaceFacts: Open Space Facts
heresIsAFact: Here's your fact
cardTitle: Space Facts
helpPrompt: You can say tell me a space fact, or, you can say exit... What can I help you with?
stopPrompt: Goodbye!
cancelPrompt: Goodbye!
fallbackPrompt: The Space Facts skill can't help you with that.  It can help you discover facts about space if you say tell me a space fact. What can I help you with?
```

When utterances, slot values and assertions are being resolved, tokens from the left-hand side are automatically replaced with values on the right-hand side. For example, take this simple test:
```yml
---
- test: Launch request, no further interaction.
- openSpaceFacts: heresIsAFact
```

In this scenario, when the test is run for the en-US locale, the utterance will be replaced by "Open Space Facts" and the output speech will be compared to "Here's your fact", the value that heresIsAFact resolves to in our locale file.

To see a complete example, [check out this project](https://github.com/bespoken-samples/space-facts/tree/master/test/e2e).

### Pause

By adding a "$PAUSE" instruction within the test, the execution of the test can be paused for the specific time. Add "$PAUSE" follow by the time to pause in seconds.

For example:
```yml
---
- test: pause instruction
- open get fact: here's your fact
- help: just say get fact to get a fact
- $PAUSE 3
- open get fact: here's your fact
- stop: goodbye
```

### Skipping Tests
Label tests "test.only" or "test.skip" to either only run a particular test, or to skip it. Example:
```yml
---
- test.only: open the skill
- open my skill: hello
```

If multiple tests are labeled only within a suite, all the ones will be labeled only.

Use these flags together with the test pattern matching when calling `bst test <pattern>` to narrow the tests that should be run.

### Viewing Response Payloads
Set the `trace` flag in the testing.json file and the full request and response JSON payloads will be printed to the console when the tests are run.

### Filtering during test
By specifying the "filter" property, it is possible to intercept and even change the properties of the tests along their execution.
For example you can intercept the response before the assertions are run against it.

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
    onResponse: (test, response) => {
        response.responseFiltered = true;
    }
}
```

The filter is a very useful catch-all for handling tricky test cases that are not supported by the YAML test syntax or if you want to fine tune some aspects of the tests.

### Replacing values using filter
If you need to modify certain assertions during the test run, based on the test utterances or external APIs, you can do it with the test [filter](#filtering-during-test) property by implementing the `resolve` method.

With it you can have a variable inside the YML file, for example:
```yml
- open my skill:
  - prompt: Hi {name}, welcome to the skill. You have {points} points
```

Then inside the [filter](#filtering-during-test), you can set the resolve method to return:
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

Notice that this method is meant only for the right side of an assertion (i.e. expected values and not utterances). This replacement will be done after the response is gotten from the test but before the evaluation of the assertion. 

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
```yml
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
### Retrying tests 

As end-to-end tests depend on external services, sometimes things unrelated to your voice applications can fail and spoil a long-running test session. To prevent that from happening, you can set a number of times in which your tests should be retried before marking them as failed. To do this, you need to set the following properties in your testing.json file:

```json
{
    "retryOn": [551, 552],
    "retryNumber" : 2
}

```

`retryOn` is an array containing error codes returned from our Virtual Device server, while `retryNumber` is the number of times you want to retry your tests in case of an error (from 0 to 5, defaults at 2). Below is a list of the most significant error codes:

Error code | Reason | Category
-- | -- | --
400 | A required parameter was set with invalid values | user
450 | Multiple calls made at the same time to the same virtual device | user
451 | The virtual device associated with this token did not work correctly. Try refreshing your credentials in https://apps.bespoken.io/dashboard/ | user
500 | Unknown system error | system
540 | Call was not answered | system
541 | Call ended | system
550 | Error sending request to AVS | system
551 | Error in response from AVS | system
552 | The Alexa Voice Service took too long to respond | system
553 | Error refreshing AVS credentials | system

Errors 551 and 552 are retried by default unless you specify other codes for `retryOn`.

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

To read more about jest-stare, [click here](https://github.com/dkelosky/jest-stare#readme).

## Special / Advanced Configurations
The following are settings than can help you overcome specific testing issues. However, you should use them with caution.

| Key | Description |
| --- | --- |
| ignoreExternalErrors | When a not controlled error happens while executing your tests, mark them as skipped instead of failures - defaults to `false` |
| includeRaw | If true, the whole raw payload from the tested platform is included as part of the response. This provides much more insight, but makes the response a lot bigger -  defaults to true |
| maxAsyncE2EResponseWaitTime | Set an interval in milliseconds to wait before stop looking for new results and throwing an error - defaults to 15000 |
| [retryOn](#retrying-tests) | An array with Virtual Device error codes on which to do a retry if a test fails |
| [retryNumber](#retrying-tests) | The number of retrys to execute if a test fails must be in the range [0,5] |

## Further Reading 
Take a look at:
* Our [getting started guide](/end-to-end/getting-started/)
* Our [example project](https://github.com/bespoken-samples/virtual-device-example/)

And don't hesitate to reach out via [Gitter](https://gitter.im/bespoken/bst/).

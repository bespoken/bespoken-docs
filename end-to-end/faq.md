---
# Page settings
layout: default
keywords:
comments: false

# Hero section
title: FAQ for End-to-end Testing

# Micro navigation
micro_nav: true
---
Here you can find common questions on regards End-to-end testing for voice apps.

# **Getting started**

## **What is End-to-end (E2E) testing and why do I need it?**
>_End-to-end testing involves ensuring that the integrated components of an application function as expected. The entire application is tested in a real-world scenario such as communicating with the database, network, hardware and other applications ... Techopedia_

Talking specifically about voice apps. End-to-end tests focus on testing:
* The voice app as a whole (from Alexa/Google through infrastructure to voice app).
* The utterance resolution aka the speech recognition.
* The interaction models.

You need to do E2E testing because it's critical to be sure your voice app will behave as expected before it reaches your users. Most apps work with other services and use different pieces of technology and testing only your code (i.e. just doing Unit testing) is no guarantee you are free from errors.

Our approach to E2E testing is based on the creation and execution of __test scripts__. Ideally, the test scripts should cover the entire functionality of your voice app.

E2E testing and Regression testing are two types of _functional testing_.


## **What is Regression testing?**
Regression testing is re-running functional and non-functional tests to ensure that previously developed and tested software still performs after a change. Changes that may require regression testing include bug fixes, software enhancements, configuration changes, and even substitution of electronic components. As regression test suites tend to grow with each found defect, test automation is frequently involved.

As E2E, Regression testing is another type of _functional testing_.

## **Which tools does Bespoken offer to do E2E or Regression testing for voice apps?**
The simplest and easiest way to do functional testing is creating and executing test scripts. These scripts contain the interactions needed to verify the functionality of your voice app.

An interaction is a group of utterances and expected responses that are executed against your voice app (Alexa or Google Action) through our Virtual Device.

As with Unit testing, the functional test scripts are based on our simple YAML syntax, which is very easy to understand, create and maintain.

# **How to run E2E or Regression tests**
To get started, you need to install the Bespoken CLI, please follow next steps:
1) Install the CLI by running `npm install -g bespoken-tools` on your command line.
2) Open a command-line window and change directory to the root of your `<PROJECT_FOLDER>`
3) Run the tests - just enter `bst test`. The output should look like this:
```console
$ bst test
BST: v2.0.10  Node: v8.9.4

 PASS  de-DE\launchRequest.e2e.yml (38.316s)
  de-DE
    Launch request, no further interaction
      √ öffne bring
    Launch request, one interaction
      √ öffne bring
      √ sag mir was auf meiner liste ist

 PASS  de-DE\addItems.e2e.yml (45.518s)
  de-DE
    Invoke intent with one-shot utterance (adding items)
      √ öffne bring und füge obst hinzu
    Invoke intent, multiple interactions (adding items)
      √ öffne bring
      √ füge gemüse
      √ sag mir was auf meiner liste ist

Test Suites: 2 passed, 2 total
Tests:       7 passed, 7 total
Snapshots:   0 total
Time:        150.985s
```
## How to learn more
Take a look at this [__sample project__](https://github.com/bespoken/virtual-device-example) and use it as a base to start creating your own functional test scripts. For more info on End-to-end testing please read [__here__](https://read.bespoken.io/end-to-end/getting-started).
If you need assistance reach us on any of these channels:
* [Email](mailto:contact@bespoken.io)
* [Twitter](https://twitter.com/bespokenio)
* [Gitter](https://gitter.im/bespoken/bst)


## **Besides Alexa, can I use Bespoken to functional test Google Actions?**
Yes, you can. Our Virtual Device Test Scripts can also be used to do E2E or Regression testing for Google Actions. First thing is to generate a Virtual Device token to be used with your Action, get it [__here__](https://virtual-device.bespoken.io/link_account?platform=google). Then you need to include the token in your `testing.json` file, something like this:
```json
{
    "type": "e2e",
    "trace": false,
    "jest": {
      "silent": false
    },
    "virtualDeviceToken": "google-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

```
Then create and execute your scripts as usual.

# **Working with test scripts**

## <a name="anchorToFolderStructure"></a>**How should I organize my folder structure to store my test script files?**
That depends, if you are testing your voice app and it supports just one locale you can have a folder structure like this:

```
└───My Skill E2E testing
        functionalityName.e2e.yml
        otherFunctionalityName.e2e.yml
        testing.json
```

For this case, we recommend the locale and Virtual Device Token is defined on your `testing.json` file.

If your voice app supports multiple locales you have to get a Virtual Device token per each locale you want to test. The folder structure for testing 3 locales might look like this:

```
└───My Multi-locale E2E testing
    │   testing.json
    │
    ├───de-DE
    │       functionalityName.e2e.yml
    │
    ├───en-GB
    │       functionalityName.e2e.yml
    │
    └───en-US
            functionalityName.e2e.yml
```

Your Virtual Device Token and locale can be defined either on the configuration section of each test script file or in the `testing.json`.

For example this is a configuration section on a German script:

```yaml
---
configuration:
  locale: de-DE
  voiceId: Hans
  virtualDeviceToken: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```
And this is how a `testing.json` file looks like for a multi-locale test project:
```json
{
  "type": "e2e",
  "homophones": {
    "lettuce": ["let us"],
    "figs": ["six", "vicks"]
  },
  "trace": false,
  "jest": {
    "silent": false
  },  
  "virtualDeviceToken": {
    "alexa": {
       "en-US": "token-en-us-alexa-xxxx-xxxx",
       "de-DE": "token-de-de-alexa-xxxx-xxxx",
       "en-GB": "token-en-gb-alexa-xxxx-xxxx"
    }
 }
}
```


## **How can I troubleshoot when working with functional test scripts for Alexa skills?**
We recommend taking into account the following:
- Set the trace option to __true__ in the `testing.json` file to see the response coming from Alexa/Google.

```json
{
  "type": "e2e",
  "homophones": {
    "lettuce": ["let us"]
  },
  "trace": true,
  "jest": {
    "silent": false
  }
}
```

- Check the history of interactions on the Alexa website.
![Showing Alexa's utterances history][AlexaHistory]
- Use the `.only` command in the scripts to isolate a specific sequence.

If you need assistance, please talk to us through the chat widget at the lower right-hand corner of our [Dashboard](https://apps.bespoken.io/dashboard/) or [Website](https://bespoken.io/).


## **My skill supports multiple locales, how can I create functional tests for it?**
First thing is to generate one Bespoken Virtual Device token per each locale you want to test. Then organize your test folder as [shown previously](#anchorToFolderStructure) and add your tokens to your test script files or `testing.json` file.

## **I have a different invocation name for the locales my skill supports, how can I configure Bespoken Testing Tools?**
In case you have different invocation names for your skill you can define them all in the `testing.json` file as you were defining variables. Then use those variables in your test script. We will do the find/replace when executing the test scripts.

This is how to define them:
```json
{
  "type": "e2e",
  "homophones": {
    "lettuce": ["let us"],
    "figs": ["six","vicks"]
  },
  "trace": false,
  "jest": {
    "silent": false
  },
  "findReplace": {
    "invocationName-US": "my skill",
    "invocationName-DE": "meine Fertigkeit"
  },  
  "virtualDeviceToken": {
    "alexa": {
       "en-US": "token-en-us-alexa-xxxx-xxxx",
       "de-DE": "token-de-de-alexa-xxxx-xxxx"
    }
 }
}
```
And this is how a simple test script looks like:
```yml
---
configuration:
  locale: de-DE
  voiceId: Hans

---
- test: Using find/replace
- öffne invocationName-DE: hallo
- stop: auf wierdesehen
```

## **What are homophones and how can I use them to improve my script's execution results?**
Our end-to-end tests use speech recognition for turning the output speech coming back from Alexa into text. This process is imperfect - to compensate for this, homophones can be specified for errors that occur when a reply from Alexa is misunderstood. For example, if Alexa says: `address sent to your white car`; the Bespoken Virtual Device may transcribe it as: `address sent to your wife car`

(FYI, for Alexa, the definitive response can be found at the Alexa user console, under settings -> history).

This misunderstanding will lead to a test like this failing incorrectly:

`- send address for in n out burger to my car: address sent to your white car`

To avoid this, just define a homophone in the configuration file like so:
```json
{
    "homophones": {
        "white": ["wife"]
    }
}
```

## **How can I see the JSON response that is coming from my voice app?**
You need to update the `testing.json` configuration file and set the trace property to true.
  ```json
  {
    "type": "e2e",
    "homophones": {
      "lettuce": ["let us"]
    },
    "trace": true,
    "jest": {
      "silent": false
    }
  }
  ```

## **How can I execute just one of the interactions in my test script?**
Add `.only` after the reserved word `test` on the sequence you want to execute. In this example, only the second sequence will be executed.
```yml
---
configuration:
  locale: de-DE
  voiceId: Hans
  virtualDeviceToken: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

---
- test: Adding items with one-shot utterance, no further interaction
- öffne bring und füge obst hinzu: okay obst ist auf deiner liste

---
- test.only: Removing items with one-shot utterance, no further interaction
- öffne bring und entferne obst: okay ich habe obst entfernt

---
- test: Invoke intent, multiple interactions
- öffne bring: willkommen
- füge gemüse: okay gemüse ist auf deiner liste
- sag mir was auf meiner liste ist:
  - prompt:
    - äpfel
    - gemüse
- entferne gemüse: okay ich habe gemüse entfernt
```

## **Which shorthand properties can I use to make my scripts more readable?**
You can use these:
* __cardContent__: Corresponds to `card.textField`
* __cardImageURL__: Corresponds to `card.imageURL`
* __cardTitle__: Corresponds to `card.title`
* __prompt__: An alias for the transcript element from the JSON payload

## **My skill uses multiple possible valid responses, how should write my test script to test that?**
It is also possible to specify multiple valid values for a property. That is done with a collection of expected values, such as this:
```yaml
- open howdy
  - prompt:
    - Hi there
    - Howdy
    - How are you?
```

<!-- Images references -->
[AlexaHistory]: ../assets/alexaHistory.png "Showing Alexa voice interactions history"

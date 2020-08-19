---
title: IVR Testing Guide
permalink: /end-to-end/ivr/
---

# End-To-End Testing for Interactive Voice Response systems
We provide support for Interactive Voice Response (IVR) systems by leveraging Twilio to interact with them.

Most of the features from our standard end-to-end testing work as normal for this, but there are some special features that we will cover in this guide.

For in-depth information on how our end-to-end testing works, [read here](/end-to-end/guide).

## Approach
Take a look at the following excerpt from a call made to the American Airlines IVR system.

<p style="text-align:center">
<img src="./assets/ivr-excerpt.gif" style="max-width: 60%;">
</p>

Unlike Alexa or Google Assistant, where communication is done "in turns", an IVR call happens over a bi-directional line where each end can speak at any given time, so it is important to identify key moments during the call to translate that correctly into a test. From a caller perspective, the key moments in the call are:

- Dialing the American Airlines number
- Replying with our intention after the prompt "please, tell me what you're calling about"
- Repeating our intention if the IVR system does not understand us 
- Pressing a number on the phone keypad if necessary

Here's the same call translated into one of our YAML tests:

```yaml
- test: Call to American Airlines
- $DIAL: 
    - transcript: 
      - Thanks for calling American Airlines
      - Thanks for choosing American Airlines
      - Welcome to American Airlines
    - set finishOnPhrase: please tell me what you're calling about
- New flight reservation: 
    - transcript: Okay
    - set listeningTimeout: 10
    - set repeatOnPhrase: I didn't get that
- Yes: 
    - transcript: Excellent
    - set finishOnPhrase: if so press 1
- $1: Please wait while I transfer you to an agent
```

What happens here is we call the United Airlines number, which is set as part of our configuration file. We then have a back and forth interaction with the system - the first part of each line before the `:` is what we say to the system, such as "new flight reservation". The second part, which comes after the colon, contains assertions as well as additional configuration. We check the `transcript` property to verify the system's response is as expected. We `set` the finishOnPhrase to help us figure out when the system has finished speaking. These keywords and modifiers will be explained in the following sections.

If the expected response matches the actual response we receive from the system, then the test passes. Please note we use partial matches - so if the full response is "hi, how are you doing", a test that looks for "hi" will be considered a pass.

There is much more that can be done with our response assertions - [you can read all about them here](/end-to-end/guide/#assertions).

## Configuration
We have some parameters that are particular to IVR testing. In addition to the [regular e2e configuration](https://read.bespoken.io/end-to-end/guide/#configuration). 

|Name|Description|Unit / Type|Scope|Default|
|--- |--- |--- |--- |--- |
|phoneNumber|Phone number to call to. Should be in the [E.164 format](https://www.twilio.com/docs/glossary/what-e164).|number|Global||
|finishOnPhrase|Phrases that, when detected, will make the test continue to the next utterance.|string, array|Utterance||
|listeningTimeout|The maximum time to listen to before sending the next utterance. Can be used instead of finishOnPhrase.|seconds|Global/Utterance|45|
|recognitionHints|Phrases that improve speech recognition for speech to text detection.|string, array|Utterance||
|recordCall|Whether to record the call. If recorded, the URL for accessing the call will be provided as part of the response in a `callAudioURL` property.|boolean|Global|false|
|repeatOnPhrase|Repeats the previous utterance when one of these values is found. For cases when the system we are calling does not understand, for whatever reason, our utterance.|string, array|Global/Utterance||

All Global parameters, except `phoneNumber` should go inside a `virtualDeviceConfig` property inside your testing.json file if set: 

```json
{
    "phoneNumber": "PHONE_NUMBER",
    "virtualDeviceConfig": {
      "repeatOnPhrase": [
        "Sorry I didn't get that",
        "Could you repeat that"
      ],
    "recordCall": false
  }
}
```

These values can also be set inside a particular test file with a configuration section at the top of the file, like this:
```yaml
---
configuration:
  phoneNumber: "PHONE_NUMBER"
  repeatOnPhrase:
    - Sorry I didn't get that
    - Could you repeat that
  recordCall: false
```

"Utterance" level parameters are set inside each test with the use of the reserved keyword `set`.

## Special syntax
### The $DIAL Command
The `$DIAL` command is always the first command that we issue. It initiates the phone call to the specified `phoneNumber`.

### The "set" keyword
The `set` keyword is used to establish parameters that will alter the behavior of each interaction, it's also used to differentiate them from properties that will be verified (and not set) like `transcript`. 

### Touch-tone entry
Touch-tone numbers can be entered by prefixing them with a `$`, like so:
```
- test: Call a touchtone service
- $DIAL: Welcome to Bespoken Enterprises. Press one for English, two for Spanish
- $2: Gracias y bienvenido
```

## Debugging and Troubleshooting
### Tracing output
Make sure "trace" is set to true in the testing.json file. This will output the complete back and forth of the test. It includes:
* The message we send to the IVR system
* The transcript of the response received

### Listening to Twilio recordings
If `recordCall` is set to true, the response payload will include the `callURL` property. It contains the call recording in `.wav` format and will be shown as part of the bst command line output. Listening to it is a good way to understand why a test doesn't do well. Recordings are available for a week.

### Increasing the response wait time
IVR systems have prompts that vary in their length before expecting a user interaction. When these go over the one minute mark, you may find an error saying: `Timeout exceeded while waiting for the interaction response`. If this happens, be sure to set the property `maxAsyncE2EResponseWaitTime` to a value higher than 60000 ms, which is the default value, in your testing.json file. This property will allow our tests to wait longer for a response before timing out.

### Improving transcript accuracy
Transcripts that are evaluated in our tests come from doing speech to text detection over the call streaming. To improve their accuracy, `transcript`, `finishOnPhrase`, and `repeatOnPhrase` values are sent to Google's speech recognition service as "hints" of what we are expecting to get back. While this is usually enough to get correct transcripts, those three properties are usually short and can also accept regular expressions that won't work as hints. For example, the star here could be used as a placeholder for "calling" and "choosing":

```yaml
- $DIAL: 
  - transcript: Thanks for * American Airlines
  - set finishOnPhrase: Please tell me what you're calling about
```

If you want the most accurate transcripts possible, you can help the speech to text process by setting up the `recognitionHints` property like this:

```yaml
- $DIAL: 
  - transcript: Thanks for * American Airlines
  - set finishOnPhrase: please tell me what you're calling about
  - set recognitionHints: 
    - Thanks for calling American Airlines. In a few words, please tell me what you're calling about.
    - Thanks for choosing American Airlines. In a few words, please tell me what you're calling about.
```

When this is set, the `recognitionHints` values will be the **only** values sent to Google's speech to text. The more detailed they are, the better the results will be.

## Limitations
As of today, only Amazon Polly voices are supported for IVR testing with Twilio. We do not support Twilio's own "Alice" voice. For a list of Amazon Polly voices that work with Twilio, take a look [here](https://support.twilio.com/hc/en-us/articles/223132827-What-Languages-can-the-Say-TwiML-Verb-Speak-).
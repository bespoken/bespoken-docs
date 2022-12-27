---
title: IVR Testing Guide
permalink: /end-to-end/ivr/
---

# End-To-End Testing for Interactive Voice Response systems
We provide support for Interactive Voice Response (IVR) and Intelligent Virtual Agent (IVA) systems by leveraging Twilio to interact with them.

Most of the features from our standard end-to-end testing work as normal for this, but there are some special features that we will cover in this guide.

For in-depth information on how our end-to-end testing works, [read here](/end-to-end/guide/).

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
The following parameters are exclusive to IVR testing. They work in addition to the [regular e2e configuration](https://read.bespoken.io/end-to-end/guide/#configuration).  

|Name|Description|Unit / Type|Scope|Default|
|--- |--- |--- |--- |--- |
|finishOnPhrase|Phrases that, when detected, will make the test continue to the next utterance.|string, array|Utterance||
|listeningTimeout|The maximum time to listen to before sending the next utterance in seconds. Can be used instead of finishOnPhrase.|seconds|Global/Utterance|45|
|[pauseBeforeUtterance](#adding-pauses-before-speaking)|Delay in seconds that is added before playing the current utterance. This delay comes after detecting a `finishOnPhrase` or reaching a `listeningTimeout` value, i.e., after the system finishes speaking.|seconds|Global/Utterance|1|
|phoneNumber|Phone number to call to. Should be in the [E.164 format](https://www.twilio.com/docs/glossary/what-e164).|number|Global||
|recognitionHints|Phrases that improve speech recognition for speech to text detection.|string, array|Utterance||
|[recordCall](#listening-to-call-recordings)|Whether to record the call. If set to `true`, the URL for accessing the call will be provided as part of the response in the `callAudioURL` property.|boolean|Global|false|
|repeatOnPhrase|Repeats the previous utterance when one of these values is found. For cases when the system we are calling does not understand, for whatever reason, what was said.|string, array|Utterance||Global/Utterance||
| [runInBand](#test-running-sequence-parallelism) | If set to `true` (default), a test suite will run only when the previous one has finished running. If set to `false` test suites will run in parallel to each other - defaults to `true`|boolean|Global|true|
| [sttThreshold]((#matching-finishonphrase-values)) | A decimal number from 0 to 1 that represents the threshold applied when using fuzzy matching to identify a `finishOnPhrase` value. Setting this property to 1 means no fuzzy matching is applied. |number|Global|0.8|

All Global parameters, except `phoneNumber` and `runInBand` should go inside a `virtualDeviceConfig` property inside your testing.json file if set: 

```json
{
    "phoneNumber": "PHONE_NUMBER",
    "runInBand": false,
    "virtualDeviceConfig": {
      "pauseBeforeUtterance": 1,
      "recordCall": false, 
      "repeatOnPhrase": [
        "Sorry I didn't get that",
        "Could you repeat that"
      ],
      "sttThreshold": 0.8
    },
    "virtualDeviceToken": "phone-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
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

Finally, IVR tests are always executed with a [max response wait time](#increasing-the-response-wait-time) of one minute per interaction. 

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
## Supported voices
As of today, voices from [Google Text to Speech Service](https://cloud.google.com/text-to-speech/docs/voices), [IBM Watson](https://cloud.ibm.com/docs/text-to-speech?topic=text-to-speech-voices), and Amazon Polly are supported. We do not support Twilio's own "Alice" voice. For a list of Amazon Polly voices that work with Twilio, take a look at the end of [this article](https://support.twilio.com/hc/en-us/articles/223132827-What-Languages-can-the-Say-TwiML-Verb-Speak-). 

If you need to use a custom voice, a good alternative is to use pre-recorded audios. To do this, simply replace your utterances for publicly available URLs containing the files you would like to use. Like this:

```yaml
- test: Call to American Airlines
- $DIAL: 
    - transcript: Thanks for calling American Airlines
    - set finishOnPhrase: please tell me what you're calling about
- https://bespoken-samples.s3.amazonaws.com/audios/YES.wav: 
    - transcript: Okay
    - set listeningTimeout: 10
    - set repeatOnPhrase: I didn't get that
- https://bespoken-samples.s3.amazonaws.com/audios/NewFlightReservation.mp3: 
    - transcript: Excellent
    - set finishOnPhrase: if so press 1
- $1: Please wait while I transfer you to an agent
```

Information about supported audio formats can be found [here](https://www.twilio.com/docs/voice/twiml/play).

## BST Init
The `bst init` command is the fastest way to create all the files and folders needed to start testing your IVR system. It's a great starting point! You can read more about it [here](./../../cli/commands/#init).

## Test Running Sequence - Parallelism
Individual tests run in the order in which they appear in their file. Test suites, however, run in random order and, by default, one after another. You can change this behavior by setting the `runInBand` property to `false` in your `testing.json` file, allowing test suites to run much faster and in parallel.

When enabling parallelism for IVR scripts, you don't need to define different virtual devices for your test suites, as multiple calls using the same phone virtual device are allowed.

Here's how test suites running in parallel looks like:

![parallel-run](https://user-images.githubusercontent.com/6411740/139502228-dc29cd92-f328-47a0-8a99-a75df91cf9e1.gif)

## Debugging and Troubleshooting
### Tracing output
Make sure "trace" is set to true in the testing.json file. This will output the complete back and forth of the test. It includes:
* The message we send to the IVR system
* The transcript of the response received

### Listening to call recordings
If `recordCall` is set to true, the response payload will include the `callURL` property. It contains the call recording in `.wav` format and will be shown as part of the bst command line output. Listening to it is a good way to understand why a test doesn't do well. Recordings are available for a week.

### Increasing the response wait time
IVR systems have interactions that vary in their length. When these go over the minute mark, you may find an error saying: `Timeout exceeded while waiting for the interaction response`. To fix this:
- Make sure that you have set a correct `finishOnPhrase` value so that the test can move to the next interaction correctly
- If you are using the `listeningTimeout` property instead, check that the value has been set to a value lower than 60 seconds
- Finally, if the interaction is sure to last more than a minute, set the property `maxWaitTimeForResponse` in your testing.json file to a value higher than the default of 60000 ms. This will allow your tests to wait longer for a response before timing out.

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

### Matching `finishOnPhrase` values
By default, we apply fuzzy matching on `finishOnPhrase` values to identify the end of an interaction. Fuzzy matching means that we look for a value that is not identical but "similar enough" to the supplied value; we do this to bypass ocassional speech-to-text mismatches that could prevent call interactions from continuing. The confidence level that we use is controlled by the `sttThreshold` property, which allows for a numeric value between 0 and 1 . The default value is 0.8; setting it lower is more forgiving with the transcripts, while setting it to 1 makes the tests look for the exact value that was defined as a `finishOnPhrase`.

### Adding pauses before speaking
Our tests are programmed so that the next utterance plays after detecting a `finishOnPhrase` or reaching a `listeningTimeout`. On rare occasions, this happens before your system is ready to receive the next instruction. To better adjust these times, you can use the `pauseBeforeUtterance` property at the utterance level. Eg:

```yaml
---
- test : Cancel a reservation
- $DIAL :
  - prompt : Welcome to the American Airlines
  - set finishOnPhrase : please tell me what you're calling about
- Cancellations: 
  - prompt: what's your four digit booking code
  - set pauseBeforeUtterance: 2
```
In the example above, we dial the American Airlines contact center and, as soon as we hear "please tell me what you're calling about", we'll wait 2 seconds before saying "Cancellations".

## Project Sample
You can find the American Airlines tests we used in this page [here](https://github.com/bespoken-samples/ivr-test-samples). 

---
title: IVR Testing Guide
permalink: /end-to-end/ivr/
---

# End-To-End Testing For Interactive Voice Response Systems
We provide support for Interactive Voice Response (IVR) systems by leveraging Twilio to interact with them.

Most of the features from our standard end-to-end testing work as normal for this, but there are some special features that we will cover in this guide.

For in-depth information on how our end-to-end testing works, [read here](/end-to-end/guide).

## Approach
Take a look at the following excerpt from a call made to the American Airlines IVR system.
![IVR sample call](assets/ivr-excerpt.gif)

Unlike Alexa or Google Assistant, where communication is done "in turns", an IVR call happens over a bi-directional line where each end can speak at any given time, so it is important to identify key moments during the call to translate that correctly into a test. From a caller perspective, the key moments in the call are:

- Dialing the American Airlines number
- Replying with our intention after the prompt "please, tell me what you're calling about"
- Repeating our intention if the IVR system does not understand us 
- Pressing a number on the phone key pad if necessary

Here's the same call translated into one of our YAML tests:

```yaml
- test: Call to American Airlines
- $DIAL: 
    - transcript: Thanks for calling American Airlines
    - set finishOnPhrase: Please tell me what you're calling about
- New flight reservation: 
    - transcript: Okay
    - set listeningTimeout: 10
    - set repeatOnPhrase: I didn't get that
- Yes: 
    - transcript: Excellent
    - set finishOnPhrase: if so press 1
- $1: Please wait while I transfer you to an agent
```

What happens here is we call the United Airlines number, which is set as part of our configuration file. We then have a back and forth interaction with the system - the first part of each line before the `:` is what we say to the system, such as "new flight reservation". The second part, which comes after the colon, contains the expected response(s) evaluated with via the `transcript` property, as well as request modifiers (defined by the keyword `set`) that allows us to go to the next interaction, or to repeat an interaction when needed. These keywords and modifiers will be explained in following sections.

If the expected response matches the actual response we receive from the system, then the test passes. Please note we use partial matches - so if the full response is "hi, how are you doing", a test that looks for "hi" will be considered a pass.

There is much more that can be done with our response assertions - [you can read all about them here](/end-to-end/guide/#assertions).

## Configuration
We have some parameters that are particular to IVR testing. In addition to the [regular e2e configuration](https://read.bespoken.io/end-to-end/guide/#configuration).

|Name|Description|Unit / Type|Scope|Default|
|--- |--- |--- |--- |--- |
|phoneNumber|Phone number to call to. Should be in the [E.164 format](https://www.twilio.com/docs/glossary/what-e164).|number|Global||
|finishOnPhrase|Phrases that, when detected, will make the test continue to the next utterance.|String array|Utterance||
|listeningTimeout|The maximum time to listen to before sending the next utterance. Can be used instead of finishOnPhrase.|seconds|Global/Utterance|45|
|recognitionHints|Phrases that improve speech recognition for STT.|String array|Utterance||
|recordCall|Whether to record the call. If recorded, the URL for accessing the call will be provided as part of the response in a `callAudioURL` property.|boolean|Global|FALSE|
|repeatOnPhrase|Repeats the previous utterance when one of these values is found.|String array|Global/Utterance||

"Global" parameters can be set in the testing.json file like this:
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

These values can also be set inside particular test file with a configuration section at the top of the file, like this:
```yaml
---
configuration:
  phoneNumber: "PHONE_NUMBER"
  repeatOnPhrase:
    - Sorry I didn't get that
    - Could you repeat that
  recordCall: false
```

"Utterance" level parameters are set inside each test with the use of the reserverd keyword `set`.

## Special syntax
### DIAL Command
The `$DIAL` command is always the first command that we issue. It initiates the phone call to the specified `phoneNumber`.

### set keyword
The `set` keyword is used to stablish parameters that will alter the behavior of an interaction, it's also used to differentiate them from properties that will be evaluated like `transcript`. 

### Touch-tone entry
Touch-tone numbers can be entered by prefixing them with a `$`, like so:
```
- test: Call a touchtone service
- $DIAL: Welcome to Bespoken Enterprises. Press one for english, two for spanish
- $2: Gracias y bienvenido
```

## Debugging
### Tracing Output
Make sure "trace" is set to true in the testing.json file. This will output the complete back and forth of the test. It includes:
* The message we send to the IVR system
* The transcript of the response received

### Listen To Twilio Recordings
If `recordCall` is set to true. The response payload will include the `callURL` property. It contains the call recording in `.wav` format. Listening to it is a good way to understand why a test doesn't do well. Recordings are available for a week.

## Limitations
As of today, only Amazon Polly voices are supported for IVR testing with Twilio. We do not support Twilio's own "Alice" voice. For a list of Amazon Polly voices that work with Twilio, take a look [here](https://support.twilio.com/hc/en-us/articles/223132827-What-Languages-can-the-Say-TwiML-Verb-Speak-).
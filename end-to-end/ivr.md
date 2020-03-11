---
title: IVR Testing Guide
permalink: /end-to-end/ivr/
---

# End-To-End Testing For Interactive Voice Response Systems
We provide support for Interactive Voice Response (IVR) systems.

Most of the features from our standard end-to-end testing work as normal for this, but there are some special features that we will cover in this guide.

For in-depth information on how our end-to-end testing works, [read here](/end-to-end/guide).

## Approach
We leverage Twilio to interact with IVR systems.

Here is a simple test
```yaml
- test: Make a call to United Airlines
- $DIAL: welcome to united airlines customer service
- new reservation: where would you like to go
- boston: okay, and where are you traveling from
- san francisco: great, when will you be traveling
```

What happens here is we call the United Airlines number, which is set as part of the configuration - we will show that in the next section.

We then have a back and forth interaction with the system - the first part of each line before the `:` is what we say to the system, such as "new reservation". The second part, which comes after the colon, is the expected response.

If the expected response matches the actual response we receive from the system, then the test passes. Please note we use partial matches - so if the full response is "hi, how are you doing", a test that looks for "hi" will be considered a pass.

There is much more that can be done with our response assertions - [read all about them here](/end-to-end/guide/#assertions).

## Configuration
We have several parameters that are particular to IVR testing. They are set like so in the testing.json file:
```json
{
    phoneNumber: "NUMBER_TO_CALL",
    extraParameters: {
        twilio_pause_seconds: 2,
        twilio_record: true,
        twilio_repeat_message: 1,
        twilio_repeat_when: "Sorry I didn't understand|Please try again",
        twilio_say_inside_gather: true,
        twilio_speech_timeout: 2,
        twilio_timeout: 10
    }
}
```

Most of these can be set across the entire project.

| Property | Description |
| --- | --- |
| twilio_pause_seconds | How long to wait before speaking in response to a prompt |
| twilio_record | Whether or not to record the conversation for debugging purposes on Twilio's Dashboard |
| twilio_repeat_message | How many times to repeat the input phrase [OPTIONAL - Defaults to 1]|
| twilio_repeat_when | If the response received matches one of the pipe-delimited values specified here, the input message will be repeated to the system | 
| twilio_say_inside_gather | Whether to speak to the system while also simultaneously listening for a response |
| twilio_speech_timeout | How long of a pause to wait for from the system before considering the response as completed |
| twilio_timeout | How long to wait for the system to respond to an input message, in seconds | 

The twilio_speech_timeout we would highlight as being of particular importance when interacting with a new system for the first time. Particular systems and responses may have longer pauses in their spoken output, so this may need to be lengthened or shorted to ensure that we:
* Capture entire response from the system
* In turn, respond ourselves before the system times out

This variable, along with the timeout variable, may require some tuning for each system.

These values can also be set inside particular test files with a configuration section at the top of the file, like so:
```yaml
---
configuration:
  phoneNumber: "PHONE_NUMBER"
```

## Special syntax
### DIAL Command
The `$DIAL` command is always the first command that we issue. It initiates the phone call to the specified `phoneNumber`.

### Touch-tone entry
Touch-tone numbers can be entered by prefixing them with a `$`, like so:
```
- test: Call a touchtone service
- $DIAL: Welcome to JPK Enterprises. Press one for english, two for spanish
- $2: Gracias y bienvenido
```

## Debugging
### Tracing Output
Make sure "trace" is set to true in the testing.json file. This will output the complete back and forth of the test. It includes:
* The message we send to the IVR system
* The transcript of the response received

### Listen To Twilio Recordings
* Log into Twilio (ask [Bespoken Support](mailto:support@bespoken.io) for access if you don't have  it already)
* Click on phone icon (Programmable Voice)
* Click on the number being used for the test (should be 202-559-1161)
* Click on calls logs

From there, you can access any of the phone calls. You can:
* See the payload for each request and response
* Listen to the recording of the phone call

## Limitations
As of today, only Amazon Polly voices are supported for IVR testing with Twilio. We do not support Twilio's own "Alice" voice. For a list of Amazon Polly voices that work with Twilio, take a look [here](https://support.twilio.com/hc/en-us/articles/223132827-What-Languages-can-the-Say-TwiML-Verb-Speak-).

While our regular end-to-end tests use Google's Cloud Speech to Text service, IVR tests use [Twilio's Speech Recognition API](https://www.twilio.com/speech-recognition) to get the most accurate transcript. 


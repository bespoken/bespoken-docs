---
title: Alexa and Google Assistant
permalink: /guides/alexa-google
sidebarDepth: 3
---

# Functional Testing for Alexa and Google Assistant
Bespoken can interact with your Alexa skills and Google Actions and test their functionality using an authenticated Virtual Device. We'll send audio to invoke the desired skill, capture the responses audio as well as their JSON payload and use them in our assertions. 

::: tip Important
In this guide, we'll cover the specifics of testing Alexa and Google Assistant systems. For common concepts on how to test with Bespoken, refer to the [Test Page](/dashboard/test-page) article in the Dashboard section. We highly recommend reading that first.

Additionally, you will have to create your own Alexa and Google virtual devices as explained [here](/dashboard/virtual-devices#alexa-and-google-devices). 
:::

## Approach
Consider the following example from a user interacting with Alexa:

![Test Sample](../assets/images/guides/alexa-conversation.png)

In this image, the user has:
- Asked for the time, which can have a variable response
- Asked for the capital of Peru, which can only be Lima
- Opened a skill "Bespoken Overview"
- Continued the conversation with the skill

Here's how this would look like as a Bespoken test:

![Test Sample](../assets/images/guides/alexa-test-example.png)

Notice how:
- We did not need to say "Alexa" (or "Ok Google", for Google actions). This is because wake words are needed when interacting with hardware devices, we can omit them because we interact directly with Alexa and Google APIs.
- We used a wildcard for the time question, as this can be highly variable.
- We only put "Lima" as the expected response, and not the whole phrase to, again, account for variability in the responses.
- We opened the Bespoken Overview skill and were able to continue the conversation with it

## Configuration
The main configuration for an these tests consists of the following:
| Property | Description | Default |
|----------------|--------------------------------------------------------------------------------------------------|---------------|
| Locale         | The language in which the system is being tested. Used for transcription and text-to-speech conversion. | en-US |
| Voice          | The voice to use when speaking. Options include voices from Amazon Polly, Google Text-to-Speech, and IBM Watson. | Joey |
| Virtual Device | The virtual device to use in your test. A virtual device is tied to an existing Amazon or Google account | Default device |

### Input Configuration
In the input field, any text will be converted into audio and sent to Alexa/Google. 

Additionally, you have the option to enter SSML directly into this field to further customize an utterance. For example: 
```
<speak>Hello, <break time="1s"/> how are you today?</speak>
```
would take a 1-second pause after the word "Hello," while 
```
<speak>Hello, how are <emphasis level="strong">you</emphasis> today?</speak>
``` 
would put a strong emphasis on "you." You can learn more about SSML [here](https://cloud.google.com/text-to-speech/docs/ssml).

Finally, you can also use prerecorded audio simply by entering a WAV or MP3 file URL in the input field.

### Expected Configuration
The main expected property `prompt` will be compared against the transcription of what we hear from your skill, as explained previously [here](/dashboard/test-page.md#interpreting-the-results).

For both Alexa and Google, we also return any JSON payload returned to us. These tipically include information about directives, stream ids, image urls, etc. You can query these by turning on the YAML editor and directly replacing the `prompt` property with a JSON path to the property you want to test. 

### Advanced Settings
In addition to the [common advanced settings](/dashboard/test-page/#advanced-settings), the following parameters are also accepted for Alexa and Google testing:

| Property | Description | Default Value |
|---|---|---|
| Speech-to-Text model | Specifies the machine-learning model used to transcribe the response audio. This can improve transcription accuracy depending on the audio source. Note: not all models support all languages. Learn more about it [here](https://cloud.google.com/speech-to-text/docs/transcription-model). | Phone call |
| Homophones | Lists values that will be replaced by their key when found to help with speech recognition. For example, "There" vs. "Their" vs. "They're". Separate values with commas. | N/A |

## Reviewing your Alexa History

A good debugging technique for Alexa consists on looking at your Alexa history to:
- Verify your commands reached Alexa 
- Review what was understood by Alexa 
- Verify the responses

![Alexa Voice History](../assets/images/guides/alexa-voice-history.png)

To do this, simply go to: [https://www.amazon.com/alexa-privacy/apd/rvh](https://www.amazon.com/alexa-privacy/apd/rvh)

## Account Linking

Some Alexa skills will ask you to go through an account linking process. When this happens, please follow the account linking steps from the skill's homepage or the Alexa app in your cellphone. After doing so, Bespoken will be able to continue interacting with your skill and you won't need to do this process again.

![Alexa Link Account](../assets/images/guides/alexa-link-account.png)
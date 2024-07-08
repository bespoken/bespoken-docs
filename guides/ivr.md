---
title: IVR and IVA
permalink: /guides/ivr
---

# Functional Testing for Interactive Voice Response Systems
We provide support for Interactive Voice Response (IVR) and Intelligent Virtual Agent (IVA) systems by simulating being a real user, placing a call and talking to your system via voice and DTMF inputs. 

::: tip Important
In this guide, we'll cover the specifics of this platform, but you can find common concepts on how to test with Bespoken in the [Test Page](dashboard/test-page) article of the Dashboard section. We highgly recommend you to read that first.
:::

## Approach
Take a look at the following excerpt from a call made to an Airlines company IVR system.

![Conversation](https://placehold.co/600x400)

Unlike other conversational platforms, where communication is done "in turns", an IVR call happens over a bi-directional line where each end can speak at any given time, so it is important to identify key moments during the call to translate that correctly into a test. From a caller perspective, the key moments in the call are:

- Dialing the Airlines number
- Identifying when it's our turn to talk "tell me what you're calling about"
- Replying with our intention 
- Pressing a number on the phone keypad if necessary
- Repeating a step if the IVR system does not understand us

Here's the same call represented as a Bespoken test:

![Test Sample](https://placehold.co/600x400)

In this test:
- We call the configured number and start transcribing the call in real time.
- We expect to hear "Bespoken Airlines". 
- We say "Cancellations" after hearing "tell me what you are calling about".
- We press `6286` in our keypad after hearing "4 digit booking code". 
- We expected to hear "your flight has been cancelled"

The keywords corresponding to this key moments in a conversation are: `$DIAL`, `finishOnPhrase`, `$<NUMBER>`. These are the more common keywords we'll need to get familiar with and we'll explain those and other options below.

## Configuration
The main configuration for an IVR test consists of the following:
- Locale: Language in which the system is being tested. This will be used both for transcribing the phone call in real time, as well as converting our text into utterances.
- Voice: The voice to use when speaking on the call. You can pick voices from services like Amazon Polly, Google Text to Speech and IBM Watson.
- Phone number: The phone number to call in your test.
- Virtual Device: The virtual device to use in your test. There is a default device already included in your account.

### Input configuration
In the input field, any text will be converted into audio and played during the call. However, there are other keywords accepted in this field:
- `$DIAL` is the first input in any IVR test. It represents the action of picking up the phone and calling the configured phone number.
- `$<NUMBER>` represents a DTMF input. For example, when prompted to press 1 to enter a menu option, the input should be `$1`. Longer numbers are also accepted.

Additionally you have the option to enter SSML directly into this field to further customize a utterance. For example: `<speak>Hello, <break time="1s"/> how are you today?</speak>` would take a 1 second pause after the word hello, while `<speak>Hello, how are <emphasis level="strong">you</emphasis> today?</speak>` would put a strong emphasis when saying "you. You can learn more about SSML [here](https://cloud.google.com/text-to-speech/docs/ssml). 

Finally, you can also use prerecorded audio simply by entering a wav or mp3 file URL in the input field.

### Expected configuration
The main expected property `prompt` will be compared against the transcription of what we hear from your IVR system as explained previously [here](/dashboard/test-page.md#interpreting-the-results). 

There are other properties that will modify the behavior of the interaction, and allow it to move the test further. These start with the word `set` and are all optional:

| Property | Description | Default |
|---|---|---|
| `set finishOnPhrase` | A string that, when configured, will make the test end the current interaction and move to the next when it hears the content of this property. If not set, we'll take the last portion of your current `prompt` instead. | Last portion of the current `prompt` |
| `set listeningTimeout` | A numeric value that, when configured, will make the test end the current interaction and move to the next when the configured number of seconds have passed. | 60 seconds |
| `set endSpeechTimeout` | A numeric value that, when configured, will make the test end the current interaction and move to the next when the configured number of **seconds in silence** have passed. | N/A |
| `set pauseBeforeUtterance` | A numeric value that, when configured, will add the specified number of seconds as a silent pause before saying the input utterance. | N/A |
| `set repeatOnPhrase` | When configured, if we hear this phrase, we will repeat the current utterance. E.g.: "sorry I didn't get that". | N/A |

Finally, you can also evaluate the property `connection.endedBy` that will tell you who ended the call. It contains two possible values: `caller` or `callee` and it can only be present on the last utterance.

### Advanced settings
In addition to the [common advanced settings](/dashboard/test-page/#advanced-settings), the following parameters are exclusive to IVR testing:

| Property | Descrition | Default Value |
|---|---|---|
| Record call | When enabled, the call recording is available for listening after a test runs. | true |
| "Repeat on" phrases | Repeats the current utterance when one of these values is found. Useful when the system we are calling does not understand what was said. | N/A |
| Speech-to-Text model | Machine-learning model to transcribe the call audio. This can improve the transcript results depending on the audio source. Use with caution: not all models support all languages. Learn more about it [here](https://cloud.google.com/speech-to-text/docs/transcription-model). | Phone call |
| Homophones | List of values that will be replaced by their key when found. Example: There vs. Their vs. They're. Values should be separated by commas. | N/A |
| Pause before utterance | Number of seconds in silence before playing a utterance. | 0 |
| Finish on phrase fuzzy threshold | A decimal number from 0 to 1 that represents the threshold applied when using fuzzy matching to identify a finishOnPhrase value. Setting this property to 1 means the values have to match exactly. | 0.9 |
| End of speech timeout | Time in seconds of silence that we'll wait for before moving to the next interaction.  | N/A |

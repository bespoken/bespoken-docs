---
title: API
permalink: /end-to-end/api/
---
# Virtual Device API Documentation
## Overview
We provide APIs to interact with our virtual devices programmatically. These APIs can be accessed via Node.js or HTTP.

They are easy to work with, and require simply sending a payload of what you want to "say" to Alexa or Google, such as:  
```js
virtualDevice.message("ask my skill what is the weather", (result) => {
    console.log(result.transcript); // Prints out the reply from Alexa - e.g., "the weather is nice"
});
```

It is as easy as that! For more information on how our end-to-end testing work, [read here](/end-to-end/getting-started/).

## Node.js API
### Installation
1. Add the Virtual Device SDK to your project:
    ```bash
    npm install virtual-device-sdk --save
    ```
2. Get your token: Follow the instructions [here](/end-to-end/setup/).

### Constructor parameters

```javascript
export interface IVirtualDeviceConfiguration {
    token: string;
    locale?: string;
    voiceID?: string;
    skipSTT?: boolean;
    asyncMode?: boolean;
    stt?: string;
    locationLat?: string;
    locationLong?: string;
    conversationId?: string;
    screenMode?: string;
    projectId?: string;
}
```
 - token: Your virtual device token, check [here](/end-to-end/setup/) how to obtain it
 - locale: The locale you are using, defaults to en-US
 - voiceID: The voice from Polly to use with the current locale, defaults to the default voice for the locale
 - skipSTT: Skip speech to text for Google (Google can return text directly), defaults to false
 - asyncMode: Retrieve the conversation sent in batch asynchronously, defaults to false
 - stt: What speech to text to use (google or witai), defaults to google
 - locationLat: Location Latitude used in Google Virtual Devices.
 - locationLong: Location Longitude used in Google Virtual Devices.
 - conversationId: Set a conversation id in advance for the batch process in async mode.
 - screenMode: State of the screen used in Google Virtual Devices(playing or off), defaults to playing
 - projectId: Dialog Flow project id

### Sending a Message
Here is a simple example in Javascript:
```javascript
const vdSDK = require("virtual-device-sdk");
const configuration = {
    token: "<PUT_YOUR_TOKEN_HERE>",
    locale: "en-US",
    voiceId: "Joey",
}
const virtualDevice = new vdSDK.VirtualDevice(configuration);
virtualDevice.message("open my skill").then((result) => {
    console.log("Reply Transcript: " + result.transcript);
    console.log("Reply Card Title: " + result.card.mainTitle);
});
```

### Result Payload
Here is the full result payload:
```js
export interface IVirtualDeviceResult {
    card: ICard | null;
    debug?: {
        rawJSON: any;
    };
    sessionTimeout: number;
    streamURL: string | null;
    transcript: string;
    transcriptAudioURL: string;
    utteranceURL: string;
    caption: string;
    display: object;
    debug: object;
}

export interface ICard {
    imageURL: string | null;
    mainTitle: string | null;
    subTitle: string | null;
    textField: string;
    type: string;
}
```

### Adding homophones

Our end-to-end tests use speech recognition for turning the output speech coming back from the virtual device into text.

This process is imperfect - to compensate for this, homophones can be specified for errors that occur when a reply from the virtual device is misunderstood.

Before sending your message call the "addHomophones" method to indicate what are the ones you expect

```javascript
const virtualDevice = new vdSDK.VirtualDevice(configuration);

virtualDevice.addHomophones("white", ["wife", "while"]);

virtualDevice.message("open my skill").then((result) => {
    console.log("Reply Transcript: " + result.transcript);
    console.log("Reply Card Title: " + result.card.mainTitle);
});
```

### Sending messages in batch

You can send multiple messages and expected phrases in an object array. The goal of this method is to handle a complete interaction with the virtual device. By sending all messages to the endpoint, it is able to sequence them faster, avoiding session timeouts.

```javascript
sdk.batchMessage(
    [{text: "what is the weather"}, {text:  "what time is it"}, {text: "tell test player to play"}],
).then((results) => {
    console.log("Results: ", results);
});
```

The result will be an array of objects as defined in the [Result Payload Section](#result-payload)


### Processing the results asynchronously

By default when you use batchMessage the promise will return a promise that will resolve once the complete interaction is finished. By setting the async mode
in the constructor of the SDK instance you can change that behavior so that it returns a conversation id that can be used to retrieve
the results progressively.

```javascript
const configuration = {
    token: "<PUT_YOUR_TOKEN_HERE>",
    locale: "en-US",
    voiceId: "Joey",
    skipSTT: false,
    asyncMode: true,
}

const virtualDevice = new vdSDK.VirtualDevice(configuration);

sdk.batchMessage(
  [{text: "what is the weather"}, {text:  "what time is it"}, {text: "tell test player to play"}],
).then((result) => {
  console.log("Conversation Id: ", result.conversation_id);

  // logic to wait some time - you can use setTimeout to do this
  
  return sdk.getConversationResults(result.conversation_id);
}).then((results) => {
  console.log("Results: ", results);
});
```

As the results are processed the "getConversationResults" method will return them in subsequent calls to the method.

## HTTP API
The VirtualDevice service can also be called directly via HTTP.

To use it, first get your token:  
Follow the instructions [here](/end-to-end/setup/).

The Base URL is:  
https://virtual-device.bespoken.io

### **Process** Endpoint

  Takes a single message and returns the AVS response in text form.
* **URL**

  /process

* **Method:**

  `GET`

*  **URL Params**

   **Required:**

   `message=string`: the message that we want to send to Alexa

   `user_id=string`: "validation token" obtained from Bespoken Dashboard (http://apps.bespoken.io/dashboard/)


   **Optional:**

   `language_code=string`: one of Alexa's supported locales (e.g. en-US, de-DE, etc.). Default value: "en-US". Taken from https://developer.amazon.com/docs/custom-skills/develop-skills-in-multiple-languages.html#h2-code-changes

   `voice_id=string`: one of Amazon Polly's supported voices (e.g. Joey, Vicki, Hans, etc.). Default value: "Joey". MUST correspond with the language_code. Taken from: https://docs.aws.amazon.com/polly/latest/dg/voicelist.html

   `phrases=string`: a word or phrase used as a hint so that the speech recognition is more likely to recognize them as part of the alexa response. You can use this multiple times in the query string to send more than one.

   `debug=boolean`: return additional information like process duration, transcript duration and raw response. Default value: "false"

   `new_conversation=boolean`: open a new session, only for google virtual devices.
    Default value: "false"

   `stt=string`: speech to text service to use, supported services are google and witai. Default value: "google"

   `project_id=string`: project id of the Dialog Flow agent

   `audio_url: string`: Url address of the audio file.

   `format: string`: When audio data is provided, the format of the audio. If an audio_url that includes an extension is provided, we'll use that instead. Valid values are 'raw' (for PCM), 'wav', 'mp3', and 'ogg'. Defaults to 'raw'.

   `frame_rate: int`: When audio data is provided, the sample rate of the audio - defaults to 16000. We recommend using audio recorded at 16000 as this is what is typically used by the assistants. Using other sample rates will require re-sampling the audio. This field is only needed for audio with 'raw' format - for other formats, the frame_rate is contained in the audio data.

   `channels: int`: When audio data is provided, the number of channels in the audio. Defaults to 1. This field is only needed for audio with 'raw' format - for other formats, the frame_rate is contained in the audio data.

   `sample_width: int`: When audio data is provided, the number of 8-bit bytes in the audio - defaults to 2. This field is only needed for audio with 'raw' format - for other formats, the frame_rate is contained in the audio data.

* **Success Response:**


  * **Code:** 200 <br />
    **Content:**
  ```json
  {
      "streamURL": "string",
      "sessionTimeout": 0,
      "transcriptAudioURL": "string",
      "message": "string",
      "transcript": "string",
      "card": {
          "subTitle": "string",
          "mainTitle": "string",
          "textField": "string",
          "type": "string",
          "imageURL": "string"
      },
      "display": "object",
      "caption": "string"
  }
  ```

* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `"message is required"`

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `"user_id is required"`

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `"Invalid user_id"`

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{error: 'stt is invalid, it could be google or witai'}`

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** `{error: 'error message in case of an exception'}`


* **Sample Call:**
```bash
curl "https://virtual-device.bespoken.io/process?message="what time is it"&user_id=<your user id>&voice_id=Joey&language_code=en-US" ;
```

* **Notes:**

  * Not sending the language_code or voice_id will default **both** to en-US and Joey.


### **Batch process** Endpoint

Receives multiple messages and expected phrases in an object array. The goal of this endpoint to handle a complete interaction with Alexa. By sending all messages to the endpoint, it is able to sequence them faster, avoiding session timeouts.

* **URL**

  /batch_process

* **Method:**

 `POST`

* **Headers**

   `Content-Type: application/json` - The content type must be set to application/json.

*  **URL Params**

   **Required:**

      `user_id=string`: "validation token" obtained from Bespoken Dashboard (http://apps.bespoken.io/dashboard/)

   **Optional:**

   `language_code=string`: one of Alexa's supported locales (e.g. en-US, de-DE, etc.). Default value: "en-US". Taken from https://developer.amazon.com/docs/custom-skills/develop-skills-in-multiple-languages.html#h2-code-changes

   `voice_id=string`: one of Amazon Polly's supported voices (e.g. Joey, Vicki, Hans, etc.). Default value: "Joey". MUST correspond with the language_code. Taken from: https://docs.aws.amazon.com/polly/latest/dg/voicelist.html

   `async_mode=boolean`: process the messages in the background, results can be obtained in the conversation endpoint. Default value: "false".

   `debug=boolean`: return additional information like process duration, transcript duration and raw response. Default value: "false"

   `stt=string`: speech to text service to use, supported services are google and witai. Default value: "google"

   `location_lat=float`: only for google, latitude coordinate from the location of the request

   `location_long=float`: only for google, longitude coordinate from the location of the request

   `conversation_id=string`: only from async_mode, set the conversation id

   `project_id=string`: project id of the Dialog Flow agent

* **Request Body**

   **Required:**

    `messages=message[]`: object array where each object represent a message sent to the device. Each message can contain text or audio. 
    
    The JSON fields for the `message` object are as follows - either the text or audio field must be provided for each object:
    
    `text: string`: For messages to be converted to audio via text-to-speech, the text to convert.

    `phrases: string[]`: Hints for converting the audio response from the assistant back to text. This will guide the speech-to-text that is performed on the response from Alexa and/or Google.

    `audio_data: string`: Base64-encoded audio data - for sending pre-recorded audio to the assistant.

    `audio_url: string`:  Url address of the audio file.

    `format: string`: When audio data is provided, the format of the audio. If an audio_url that includes an extension is provided, we'll use that instead. Valid values are 'raw' (for PCM), 'wav', 'mp3', and 'ogg'. Defaults to 'raw'.

    `frame_rate: int`: The sample rate of the audio - defaults to 16000. We recommend using audio recorded at 16000 as this is what is typically used by the assistants. Using other sample rates will require re-sampling the audio. This field is only needed for audio with 'raw' format - for other formats, the frame_rate is contained in the audio data.

    `channels: int`: The number of channels in the audio. Defaults to 1. This field is only needed for audio with 'raw' format - for other formats, the frame_rate is contained in the audio data.

    `sample_width: int`: The number of 8-bit bytes in the audio - defaults to 2. This field is only needed for audio with 'raw' format - for other formats, the frame_rate is contained in the audio data.

    ```json
    {
        "messages": [
            {
                "text": string, 
                "phrases": string[], 
                "audio_data": string (Base64-Encoded Byte Array), 
                "audio_url": string,
                "format": string, 
                "frame_rate": int, 
                "channels": int, 
                "sample_width": int
            }
        ]
    }
    ```

* **Success Response:**


  * **Code:** 200 <br />
    **Content:**
	```javascript
	{
      "results": [
          {
              "streamURL": "string",
              "sessionTimeout": 0,
              "transcriptAudioURL": "string",
              "message": "string",
              "transcript": "string",
              "card": {
                  "subTitle": "string",
                  "mainTitle": "string",
                  "textField": "string",
                  "type": "string",
                  "imageURL": "string"
              },
              "display": "object",
              "caption": "string"
          }
      ]
	}
	```

* **Success Response (async mode):**


  * **Code:** 200 <br />
    **Content:**
	```javascript
	{
	    "conversation_id": "string",
	}
	```

* **Error Response:**
	* **Code:** 400 BAD REQUEST <br />
    **Content:** `"Invalid message"`

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `"Invalid user_id"`

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{error: 'stt is invalid, it could be google or witai'}`

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{error: 'Invalid format in message'}`

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{error: 'Invalid encoded audio in message'}`

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{error: 'Error processing audio'}`

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** `{error: 'error message in case of an exception'}`

* **Sample Call:**

    ```javascript
    const userId = <your user id>;
    const voiceId = "Joey";
    const languageCode = "en-US":

    $.post(`https://virtual-device.bespoken.io/batch_process?user_id=${userId}&voice_id=${voiceId}&language_code=${languageCode}`,  
    {  
        "messages": [
            {
                "text":"open guess the price", 
                "phrases":["how many persons"]
            },
            {
                "text":"one"
            }
        ]
    },  
    function(data, status){  
        console.log("Got: " + data.results.length + " responses!");  
    });
    ```

### **Conversation** Endpoint

Obtains the processed results from a batch process sent in async mode

* **URL**

  /conversation

* **Method:**

 `GET`

*  **URL Params**

   **Required:**

      `uuid=[string]`: the id of the conversation, returned by the Batch process when async mode param is set to true

* **Success Response:**


  * **Code:** 200 <br />
    **Content:**
	```javascript
	{
	    "results": [
          {
              "streamURL": "string",
              "sessionTimeout": 0,
              "transcriptAudioURL": "string",
              "message": "string",
              "transcript": "string",
              "card": {
                  "subTitle": "string",
                  "mainTitle": "string",
                  "textField": "string",
                  "type": "string",
                  "imageURL": "string"
              },
              "display": "object",
              "caption": "string"
          }
	    ]
	}
	```

* **Error Response:**
  * **Code:** 400 Bad Request <br />
    **Content:** `{error: 'Required parameter uuid is missing'}`

  * **Code:** 404 Not Found <br />
    **Content:** `{error: 'The uuid provided doesn\'t match a process'}`

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** `{error: 'error message in case of an exception'}`
* **Sample Call:**

    ```javascript
    const userId = <your user id>;
    const voiceId = "Joey";
    const languageCode = "en-US":

    $.post(`https://virtual-device.bespoken.io/batch_process?user_id=${userId}&voice_id=${voiceId}&language_code=${languageCode}&async=true`,
    {
        "messages": [
            {"text":"open guess the price", "phrases":["how many persons"]},
            {"text":"one"}
        ]
    },
    function(data, status){
        console.log("Got conversation id: " + data.conversation_id);

        // Logic implementation to wait for a number of seconds

        $.post(`https://virtual-device.bespoken.io/conversation?uuid={uuid},
        function(convData, convStatus){
            console.log("Got: " + convData.results.length + " responses!");
        });
    });
    ```

---
# Page settings
layout: default
keywords:
comments: false

# Hero section
title: Virtual Device API
description: Virtual Device API Documentation

# Micro navigation
micro_nav: true
---
# Overview
We provide APIs to interact with our virtual devices programmatically. These APIs can be accessed via Node.js or HTTP.

They are easy to work with, and require simply sending a payload of what you want to "say" to Alexa or Google, such as:  
```
virtualDevice.message("ask my skill what is the weather", (result) => {
    console.log(result.transcript); // Prints out the reply from Alexa - e.g., "the weather is nice"
});
```

It is as easy as that! For more information on how our end-to-end testing work, [read here](../getting-started).

# Node.js API
## Installation
1. Add the Virtual Device SDK to your project:
    ```bash
    npm install virtual-device-sdk --save
    ```
2. Get your token: Follow the instructions [here](../setup).

## Sending a Message
Here is a simple example in Javascript:
```javascript
const vdSDK = require("virtual-device-sdk");
const locale = "en-US";
const voiceId = "Joey"
const virtualDevice = new vdSDK.VirtualDevice("<PUT_YOUR_TOKEN_HERE>", locale, voiceId);
virtualDevice.message("open my skill").then((result) => {
    console.log("Reply Transcript: " + result.transcript);
    console.log("Reply Card Title: " + result.card.mainTitle);
});
```

## Result Payload
Here is the full result payload:
```
export interface IVirtualDeviceResult {
    card: ICard | null;
    debug?: {
        rawJSON: any;
    };
    sessionTimeout: number;
    streamURL: string | null;
    transcript: string;
    transcriptAudioURL: string;
}

export interface ICard {
    imageURL: string | null;
    mainTitle: string | null;
    subTitle: string | null;
    textField: string;
    type: string;
}
```
# HTTP API
The VirtualDevice service can also be called directly via HTTP.

To use it, first get your token:  
Follow the instructions [here](../setup).

The Base URL is:  
https://virtual-device.bespoken.io

## **Process** Endpoint

  Takes a single message and returns the AVS response in text form.
* **URL**

  /process

* **Method:**

  `GET`

*  **URL Params**

   **Required:**

   `message=[string]`: the message that we want to send to Alexa

   `user_id=[string]`: "validation token" obtained from Bespoken Dashboard (http://apps.bespoken.io/dashboard)


   **Optional:**

   `language_code=[string]`: one of Alexa's supported locales (e.g. en-US, de-DE, etc.). Default value: "en-US". Taken from https://developer.amazon.com/docs/custom-skills/develop-skills-in-multiple-languages.html#h2-code-changes

   `voice_id=[string]`: one of Amazon Polly's supported voices (e.g. Joey, Vicki, Hans, etc.). Default value: "Joey". MUST correspond with the language_code. Taken from: https://docs.aws.amazon.com/polly/latest/dg/voicelist.html

	`phrases=[string]`: a word or phrase used as a hint so that the speech recognition is more likely to recognize them as part of the alexa response. You can use this multiple times in the query string to send more than one.

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
            }
        }
	```


* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `"message is required"`

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `"user_id is required"`

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `"Invalid user_id"`

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** `{error: 'error message in case of an exception'}`


* **Sample Call:**
```
curl "https://virtual-device.bespoken.io/process?message="what time is it"&user_id=<your user id>&voice_id=Joey&language_code=en-US" ;
```

* **Notes:**

  * Not sending the language_code or voice_id will default **both** to en-US and Joey.


## **Batch process** Endpoint

Receives multiple messages and expected phrases in an object array. The goal of this endpoint to handle a complete interaction with Alexa. By sending all messages to the endpoint, it is able to sequence them faster, avoiding session timeouts.

* **URL**

  /batch_process

* **Method:**

 `POST`

*  **URL Params**

   **Required:**

      `user_id=[string]`: "validation token" obtained from Bespoken Dashboard (http://apps.bespoken.io/dashboard)

   **Optional:**

   `language_code=[string]`: one of Alexa's supported locales (e.g. en-US, de-DE, etc.). Default value: "en-US". Taken from https://developer.amazon.com/docs/custom-skills/develop-skills-in-multiple-languages.html#h2-code-changes

   `voice_id=[string]`: one of Amazon Polly's supported voices (e.g. Joey, Vicki, Hans, etc.). Default value: "Joey". MUST correspond with the language_code. Taken from: https://docs.aws.amazon.com/polly/latest/dg/voicelist.html

   `async=[boolean]`: process the messages in the background, results can be obtained in the conversation endpoint. Default value: "false".

* **Data Params**

   **Required:**

    `messages=[array]`: object array where each object's "text" field is a required property that represents the message sent to Alexa and each "phrases" property is an optional array of strings representing words or phrases used as hint for the speech recognition library to recognize them better.

    ```json
    {
      "messages": [
        {"text":"string", "phrases":["string"]}
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
              }
          }
	    ]
	}
	```

* **Error Response:**
	* **Code:** 400 BAD REQUEST <br />
    **Content:** `"Invalid message"`

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `"Invalid user_id"`

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
            {"text":"open guess the price", "phrases":["how many persons"]},
            {"text":"one"}
        ]
    },  
    function(data, status){  
        console.log("Got: " + data.results.length + " responses!");  
    });
    ```

* **Notes:**

  * Not sending the language_code or voice_id will default **both** to en-US and Joey.


## **Conversation** Endpoint

Obtains the processed results from a batch process sent in async mode

* **URL**

  /conversation

* **Method:**

 `POST`

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
              }
          }
	    ]
	}
	```

* **Error Response:**
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

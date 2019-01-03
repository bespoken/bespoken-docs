# Utterance Resolution SDK
The Utterance Resolution SDK allows for testing skills with Bespoken's Usability Performance Tester.

For basic testing, this SDK is not needed. It can be done simply by providing your interaction model.

For more advanced cases, integration is required, such as when:
* The Dialog Interface is used
* Custom slot resolution is done - outside of the slot resolution performed by Alexa

The SDK works with your skill code to pull out important information about what Alexa heard and pass it back to our testing service. Our testing service then uses this data to analyze the performance of Alexa and your skill at utterance resolution.

We use the card content field to pass data back and forth because that is a "safe" place to put data, where it will not be modified in the process of being sent back to our service.

# Usage
To add the SDK to your project, enter:
```
npm install utterance-resolution-sdk --save
```

To integrate it in skills where the default entity resolution is used, just call:
```
const UtteranceResolution = require("utterance-resolution-sdk");
response.card.type = "Simple"; 
// If the card type is Standard, the text field should be set instead of content 
response.card.content = UtteranceResolution.encodeRequest(requestJSON);
```

For custom resolution, the call is like this:
```
const UtteranceResolution = require("utterance-resolution-sdk");
response.card.type = "Simple"; 
// If the card type is Standard, the text field should be set instead of content 
response.card.content = UtteranceResolution.encodeCustomResolution(
	"Intent Name", // The name of the intent on the request
	"Slot Name", // The name of the slot on the request
	"Slot Value", // The value that Alexa heard for the slot
	"Slot ID", // The ID of the slot value this was resolved to
);
```

The slot value can be a bit confusing to identify. It is found here on the request:
```
request.intent.slots.<SLOT_NAME>.value
```

It is NOT the value object that is inside the resolutions section.

The slot ID is the ID of the slot from the interaction model. It is typically found here on the request payload:
```
request.intent.slots.<SLOT_NAME>.resolutions.resolutionsPerAuthority[0].values[0].value.id
```

# Next Steps
Reach out to Bespoken at support@bespoken.io with any questions.

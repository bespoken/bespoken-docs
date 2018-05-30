# Unit-Testing
# Working with alexa-app
https://github.com/bespoken/virtual-alexa/issues/45

# End-to-end Testing
## How does the end-to-end tests actually work?
The tests do the following:
- They take the input text and convert it to audio using AWS Polly (and using the AWS polly voice specified as voiceID in the config)
- They send the audio to Alexa
- Alexa sends its to your skill, which then replies to Alexa
- Alexa sends audio back to us
- We convert the audio into text for comparison with the expected output

## Why do the end-to-end tests some times have the wrong response from the skill? For example, it thinks the word "car" is "card".
In that last step, the speech-to-text conversion, there are errors as it does not always transcribe the answer correctly. We have tried to optimize this as much as possible, but it does still happen. We generally recommend using a wildcard to deal with this, (replace "and" with *) but if you send me particular cases I can make specific recommendations.

## Would it be possible to interrupt Alexa mid-response via the test scripts?
This is not possible today unfortunately. 

## I got a lot of "Actual: null" responses. Why is that?

I don't think so - can you send it to me. And just to make sure - you are just running one script at a time, correct? It is not possible to run multiples.
 
## Also, would it be better performance of testing if every sequence case end with "stop" or "Cancel"? I mean if I need to invoke stop intent to get better testing results after every test scenario?

No, this is not necessary.
 
## I checked what does Alexa app history shows and sometimes there are "alexa quit" commands. Is it automatically sent when I am running tests after each scenario or it is something else?

For the reason you said above, we include the quit statement to clear out the session between tests. We are in the process of removing this, though, and will simply use a wait function instead.

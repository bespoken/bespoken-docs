---
title: Detect End Of Speech
permalink: /training/ivr/functional/end-of-speech/
---
# End Of Speech Detection
<video width="640" height="480" controls >
  <!--<source src='/assets/videos/Dashboard-IVR-IBM.mp4' alt="foo"  type="video/mp4">-->
   <source src='https://bespoken-random.s3.amazonaws.com/Bespoken_Dashboard_Demo_extended.mp4#t=387' alt="Bespoken IVR Demo Video"  type="video/mp4">
</video>

## Overview
Understanding end-of-speech detection is critial to testing IVR systems.

It is a challenge because with IVR systems, there is no uniform, consistent signal that indicates a system has stopped talking.

There are three basic approaches we use:
* End of Speech Timeout - time to wait in seconds for the system to finish talking
* Listening Timeout - we set our test to wait a preset period of time before responding - useful for barge-in
* Finish On Phrase - our test looks for certain phrases from the system to determine it has stopped speaking

## End Of Speech Timeout
The end of speech timeout (found in the advanced settings) indicates how long to wait for the system to finish speaking. It looks for a period of silence as the basis to determine when to progess to the next step in the test.

This is a very reliable, and simple mechanism, for managing end-of-speech detection.

The value is set in seconds.

## Listening Timeout
We set our listening timeout to 10 seconds to indicate we should wait for at most 10 seconds before speaking the next utterance.

This is a simple technique for managing interactions, but if the system response is variable in length, it does not work well.

## Finish On Phrase
What we refer to as the "finishOnPhrase" is more reliable. We specify the last thing we expect the system to say. Once that is heard, we go to the next step in the test.

When performing speech recognition with the finishOnPhrase, we use "fuzzy matching" to see if the phrase we are looking for is heard. The test is less strict about matching for the finishOnPhrase that when testing the prompt. This is because for our prompt we want to ensure it is an exact match, while for the finishOnPhrase, accuracy is less critical than moving on to the next interaction at the right time.


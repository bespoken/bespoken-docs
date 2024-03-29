---
title: Change Voices
permalink: /training/ivr/functional/voices/
---
# Use Alternative Voices
<video width="640" height="480" controls >
  <!--<source src='/assets/videos/Dashboard-IVR-IBM.mp4' alt="foo"  type="video/mp4">-->
   <source src='https://bespoken-random.s3.amazonaws.com/Bespoken_Dashboard_Demo_extended.mp4#t=529' alt="Bespoken IVR Demo Video"  type="video/mp4">
</video>

## Overview
Automated testing for IVR relies upon generating audio to talk with the phone system we are testing.

By default, we use the Watson `en-US_MichaelV2Voice`. We also offer a broad selection of other voices from:
* Amazon Polly
* Google TTS
* Watson TTS

Additionally, when the Locale field is changed, the choices for voice testing will be updated.

## Changing Voices
To change the voice being used, simply pick a different one from the voice drop-down.

## Using Recorded Audio
Alternatively, to use recorded audio for a test, simply insert a URL to an audio file into the "Input" field.

That will be used instead of Text-To-Speech.

Accepted formats are `wav` and `mp3`. Simply insert the URL in the field, such as below:
<img src="/assets/images/training/ivr/functional/DashboardAudioFileTest.png" style='margin-top: 20px'/>


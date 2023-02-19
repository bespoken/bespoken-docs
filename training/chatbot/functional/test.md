---
title: Create A Test
permalink: /training/chatbot/functional/test/
---
# Creating A Test
<video width="640" height="480" controls >
  <!--<source src='/assets/videos/Dashboard-IVR-IBM.mp4' alt="foo"  type="video/mp4">-->
  <source src='https://bespoken-random.s3.amazonaws.com/Bespoken_Dashboard_Watson_Chatbot.mp4#t=447' alt="Bespoken Chatbot Demo Video"  type="video/mp4">
</video>

## Writing A First The Test
* Set the first interaction to be:
  * Input -> "hi"
  * Expected Response -> "I'm afraid I don't understand. Please rephrase your question."
* Click "Run" to verify it is working

## Adding More Interactions
* Click "Add Interaction"
* Enter "Book a flight" for the Input
* Enter "book a flight, great, which city are you traveling from?" for the Expected Response
* Click "Add Interaction" again
* Enter "Lima" for the Input
* Enter "which city are you traveling to" for the Expected Response
* Click "Add Interaction" once more
* Enter "new york" for the Input
* Enter "Ok, we have 2 flights available from lima to new york let me connect you to an agent to review prices." for the Expected Response

Then click "Run". You should have your first complete tests passing. Congratulations!

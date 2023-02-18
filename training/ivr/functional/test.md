---
title: Create A Test
permalink: /training/ivr/functional/test/
---
# Creating A Test
<video width="640" height="480" controls >
  <!--<source src='/assets/videos/Dashboard-IVR-IBM.mp4' alt="foo"  type="video/mp4">-->
  <source src='https://bespoken-random.s3.amazonaws.com/Bespoken_Dashboard_Demo_extended.mp4#t=251' alt="Bespoken IVR Demo Video"  type="video/mp4">
</video>

## Creating A Test Suite
* Select the "Test Suites" icon on the left navigation bar
* Select "Create a new test suite"
* Enter a test suite name - such as "First IVR Test"
* Click "Create"

## Writing A First The Test
* Enter the phone number to call in the "Phone Number" field
  * For the first test, enter "+12028301887" - this is the number for a Bespoken sample application
* Click "Run" - this will dial the number and show us the response
  * This will take around 30 seconds to run
* The response will look like the following:
<img src="/assets/images/training/ivr/functional/FirstTestResult.png" />
  * The test result is red because our expected response did not match the actual response
* Paste the following "welcome to the spoken Airlines for Spanish press one or say espanol" into the expected response field
* Enter "say espanol" in the field for "Finish on Phrase"
  * The finish on phrase tells the test when to stop listening for a response
  * This is an important concept - to learn more about end-of-speech detection, [read here](/training/ivr/functional/end-of-speech)
* Click "Run" again to see the test passing

That's it - our first simple test passing.

## Adding Interactions
Now let's add the next interaction that use touchtone:
* Press "Add Interaction"
* Enter "$2" in the Input field - the leading $ means that it is to be pressed not spoken
* Enter "in a few words please tell me what you were calling about" in the "Expected Response" field
* Enter "calling about" in the "set finishOnPhrase" field

And another interaction that uses voice, like this:
* Press "Add Interaction" again
* Enter "Reservations" in the Input field
* Enter "in a few words please tell me what you were calling about" in the "Expected Response" field
* Enter "calling about" in the "set finishOnPhrase" field
* Click "Run"

Now we have a slightly more complex test passing. We can now keep adding to it in order to check more behavior.

But before we go further, let's pause and learn about Homophones.
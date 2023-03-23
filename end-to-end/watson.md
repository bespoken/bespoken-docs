---
title: Watson Assistant Testing Guide
permalink: /end-to-end/watson/
---
# Functional Testing for Watson Assistant
<video width="640" height="480" controls >
  <!--<source src='/assets/videos/Dashboard-IVR-IBM.mp4' alt="foo"  type="video/mp4">-->
  <source src='https://bespoken-random.s3.amazonaws.com/VID004+Watson+Testing+Overview.mp4' alt="Bespoken Watson Demo Video"  type="video/mp4">
</video>
<br>

We provide support for testing Watson Assistant directly via API.

To leverage this, Watson Virtual Devices will need to be enabled for your account. If they are not, just reach out to us at [support@bespoken.io](mailto:support@bespoken.io).

Most of the features from our standard functional testing work as normal for this, but there are some special features that we will cover in this guide.

For in-depth information on how our functional testing works, [read here](/end-to-end/guide/).

## Getting Started
Setup a new Watson Virtual Device. To do this, simply click on Virtual Devices on the left-hand side of the Dashboard.

Then click the "+ Add Virtual Device" button.

Select "Watson Virtual Device" as the device type. You are now ready to start creating tests.

## Creating a Test Suite
Now that you have your Virtual Device, let's create our first test suite:
* Select the "Test Suites" icon on the left navigation bar
* Select "Create a new test suite"
* Enter a test suite name - such as "First Watson Test"
* Click "Create"

## Configuring Watson Assistant Access
Once the Test Suite is open, click on the "Advanced settings" on the right-hand side. Set the following properties for your Watson Assistant:
* Watson Assistant API Key
* Watson Assistant Service URL
* Watson Assistant ID

The first two values can be found in the IBM cloud console, on the Resource page for the Watson Assistant instance that you want to test.

The Watson Assistant ID can be found by launching the Watson Assistant Console. Once there:
* Click on the "..." next to the Assistant you want to test
* Select "Settings"
* Copy the "Assistant ID" value

## Creating Tests
Tests can now be created via our Dashboard in the typical manner.

To learn how to do this with our step-by-step training guide, just [read here](https://read.bespoken.io/training/chatbot/functional/test/).

---
title: Setting Up
permalink: /end-to-end/setup/
---

# Setting Up A Virtual Device
## Background
In order to test your Alexa skills and Google Actions, you need to create a Virtual Device. What is a Virtual Device? It is like a physical Amazon Echo, but one that can be interacted with programmatically.

We'll create a trial Virtual Device for you, the only thing we need you to do is to grant us to access to your Amazon Alexa or Google Assistant account. Once completed, you will have a token, which uniquely identifies the Virtual Device, that you can use in your tests.

There a couple steps for the setup - but don't worry - you will only have to do it once. And if you run into any issues, just [ping us here](https://gitter.im/bespoken/bst). We'll get it sorted out quickly!

## Creating A Virtual Device
### Virtual Devices for Alexa
1. The way to get a token is through [Bespoken Dashboard](https://apps.bespoken.io/dashboard). Sign up for free or login; you will see a screen like this:
![Bespoken Dashboard](./assets/dashboard.png "Bespoken Dashboard")

2. Add a source for your skill, to do it just click on the big + icon below the llama, you will be asked to input the name for this source, for example, *"my awesome skill"*. Then click on the text saying **"Validate your new skill >>"**. You will see a window like this:
![A skill source inside Bespoken Dashboard](./assets/source.png "New source added")

3. Click on the **"Create Virtual Device"** link, you will see an Amazon window where you have to log in:
![Window to log in with Amazon](./assets/amazonLogin.png "Giving permissions to Virtual Device")

4. After providing your credentials you will return to Bespoken dashboard and the **"Virtual Device Token"** will be retrieved automatically:
![Skill source with token retrieved](./assets/sourceWithToken.png "Token is retrieved automatically")

5. Click on the copy icon next to the name of your virtual device to copy it to the clipboard and you are set.

### Virtual Devices for Google
1. The way to get a token is through [Bespoken Dashboard](https://apps.bespoken.io/dashboard). Sign up for free or login; you will see a screen like this:
![Bespoken Dashboard](./assets/dashboard.png "Bespoken Dashboard")

2. Add a source for your action, to do it just click on the big + icon below the llama, you will be asked to input the name for this source, for example, *"my awesome action"*. Then click on the text saying **"Validate your new skill >>"**. You will see a window like this:
![An action source inside Bespoken Dashboard](./assets/source.png "New source added")

3. Ensure the type of your source is set to Google Action.
![An action source with the correct type](./assets/sourceAction.png "Type action selected")

4. Click on the **"Create Virtual Device"** link, after you login or select your account, you will see a Google window where you have to allow Bespoken to access to your Google Account:
![Window to allow permissions in Google](./assets/googlePermissions.png "Giving permissions to Virtual Device")

5. After allowing access to Bespoken you will return to Bespoken dashboard and the **"Virtual Device Token"** will be retrieved automatically:
![Action source with token retrieved](./assets/sourceForGoogleWithToken.png "Token is retrieved automatically")

6. Click on the copy icon next to the name of your virtual device to copy it to the clipboard and you are set.

### Enable personal results for Google 

If you get a response: "to let me read out that information turn on personal results in the google app home" instead a reponse from your actions, follow these additional steps:

![Google app home](./assets/enable-personal-results.gif "enable personal results")

On Android Devices:

1. Long press the “home” button on an Android device.

2. Click on the compass icon.

3. Click on your user's icon.

4. Click on Settings.

5. Click on the Assistant Tab.

6. Scroll Down and you should see “virtual device” listed after your phone.

7. Click on it and enable Personal Results.

Additional information:

For IOS devices you need to install the *Google Assistant* from the [app store](https://itunes.apple.com/us/app/google-assistant/id1220976145) and do the same steps starting from step 3.

## Using the Device In Your Scripts
Now you can use the virtual device with your test script. Place it in the testing.json file of your project like so:
``` js
{
    "virtualDeviceToken": "MY_TOKEN"
}
```

See how we do it [here](https://github.com/bespoken/virtual-device-example/blob/master/testing.json).

And that is all you need in the setup process, now you can continue with the creation of your test scripts, or using Virtual Device programmatically. 

---
title: IBM Watson Assistant
permalink: /guides/watson
sidebarDepth: 3  
---

# Functional Testing for IBM Watson Assistant 

::: tip Important
In this guide, we'll cover the specifics of testing IBM Watson Assistant. For common concepts on how to test with Bespoken, refer to the [Test Page](dashboard/test-page) article in the Dashboard section. We highly recommend reading that first.
:::

## Approach
IBM Watson Assistant allows you to build your own branded live chatbot into any device, application, or channel. This means, Watson could be at the core of your IVR, web chatbot, or whatsapp bot. Bespoken provides support for IBM Watson Assistant testing directly via API.

See this video where we explain how a Watson test is setup with Bespoken.

<video width="640" height="480" controls >
  <source src='https://bespoken-random.s3.amazonaws.com/VID004+Watson+Testing+Overview.mp4' alt="Bespoken Watson Demo Video"  type="video/mp4">
</video>
<br>

## Configuration
The main configuration for an IBM Watson Assistant test consists of the following:
| Property       | Description                                                                                      | Default       |
|----------------|--------------------------------------------------------------------------------------------------|---------------|
| Virtual Device | The virtual device to use in your test. A default device is already included in your account.     | Default device |
| Watson Assistant Service URL | URL that represents a Watson Assistant instance hosted in an specific region. Its value can be found in the IBM cloud console, on the Resource page for the Watson Assistant instance that you want to test. | N/A |
| Watson Assistant API Key | A token that will grant you access to talk with your assistant externally. Its value can be found in the IBM cloud console, on the Resource page for the Watson Assistant instance that you want to test. | N/A |
| Watson Assistant ID | Identifier for your Watson Assistant. To get its value, go within your Assistant Settings in the IBM console. | N/A |

The last three settings are located under the [advanced settings](/dashboard/test-page/#advanced-settings) of your test page. 

### Input Configuration
In the input field, any text will be sent to your Watson Assistant directly.

### Expected Configuration
The main expected property `prompt` will be compared against the responses coming back from your assistant as previously explained [here](/dashboard/test-page.md#interpreting-the-results).

---
title: Getting Started
permalink: /end-to-end/getting-started/
---

# Getting Started With End-to-end Testing
## Overview
Bespoken makes it easy to do end-to-end testing for voice apps.

We use Virtual Devices to do it. A virtual device works like a physical device, such as Amazon Echo, but can be interacted with via our [simple test scripting syntax](/end-to-end/guide/) (as well as programmatically [via our API](../api)).

```yml
--- 
configuration:
  locales: en-US
  voiceId: Joey

---
- test: launch request, no further interaction
- open bring: welcome to bring

---
- test: launch and check what is on the shopping list
- open bring: welcome to bring
- what is on my list: you have the following items on your list
```

How does it work? Take a look at this line:
```yml
- open bring: welcome to bring
```

What happens is:
* We turn `open bring` into audio using text-to-speech from [Amazon Polly](https://aws.amazon.com/polly/)
* We send the speech audio to Alexa or Google Assistant
* Alexa or Google Assistant invokes the skill or action named (in this case, the grocery-list skill Bring)
* The skill/action provides a reply - a combination of audio (the vocal response from Alexa/Google) and metadata (for card information)
* We turn the response back into text using speech-to-text
* We compare it to the expected output, "welcome to bring" in this case

There is a lot going on under the covers, but the tests themselves are very easy to write and maintain - in fact, we believe it's as easy to type the tests as it is to manually say them. And once they have been written, you have an automated test suite, that can be run at any time and incorporated into other automated processes (such as continuous integration/continuous delivery).

To see a complex example in action, [check out this project](https://github.com/bespoken-samples/virtual-device-example/).

## Next Steps
 * [Setup A Virtual Device](/end-to-end/setup)
 * [Complete Guide To Test Scripts](/end-to-end/guide/)
 * [Example Project](https://github.com/bespoken-samples/virtual-device-example)
 * [API](/end-to-end/api)

---
# Page settings
layout: default
keywords:
comments: false

# Hero section
title: Getting Started With End-to-end Testing

# Micro navigation
micro_nav: true
---
# Overview
Bespoken makes it easy to do end-to-end testing for voice apps.

We use Virtual Devices to do it. A virtual device works like a physical device, such as Amazon Echo, but can be interacted with via our [simple test scripting syntax](../guide) (as well as programmatically [via our API](../api)).

```
config:
  locale: en-US
  voiceID: Joey
  
# Sequence 01. Test scenario: launch request, no further interaction
"open bring": "welcome to bring"

# Sequence 02. Test scenario: launch request, one interaction
"open bring": "welcome to bring"
"what is on my list": "you have the following items on your list *"
```

To see a complex example in action, [check out this project](https://github.com/bespoken/virtual-device-example).

# Important Links
 * [Setup A Virtual Device](../setup)
 * [Guide To Test Scripts](../guide)
 * [Example Project](https://github.com/bespoken/virtual-device-example)
 * [API](../api) 
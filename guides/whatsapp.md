---
title: WhatsApp
permalink: /guides/whatsapp
sidebarDepth: 3  
---

# Functional Testing for WhatsApp  
Bespoken can interact with your WhatsApp for Business bots to test their functionality by simulating real user interactions and evaluating the responses.

::: tip Important  
In this guide, we'll cover the specifics of testing WhatsApp for Business bots. For common concepts on how to test with Bespoken, refer to the [Test Page](/dashboard/test-page) article in the Dashboard section. We highly recommend reading that first.  
:::

## Approach  
Let's take a look at this conversation with a South American bank:

![WhatsApp test](../assets/images/guides/whatsapp-conversation.png)

In this chat:
- The user sends a "Hello" message to the bank.
- The bank instantly responds with multiple messages.
- The user agrees to the terms and conditions.
- The bank asks the user to enter an ID number.
- The conversation continues.

This is how the same conversation would look as a Bespoken test:

![WhatsApp test](../assets/images/guides/whatsapp-test.png)

Notice that response messages have been grouped together as a single response before proceeding to the next interaction. This grouping is based on timing and can be configured globally or per interaction as explained below.

## Configuration  
The main configuration for WhatsApp tests consists of the following:

| Property       | Description                                              | Default        |  
| ---            | ---                                                      | ---            |  
| Phone Number   | Phone number of the WhatsApp for Business bot to reach.   | N/A            | 
| Response Wait Time   | Numeric value in seconds that the system waits for response messages before moving to the next interaction. Response messages are grouped together before being returned. Changing this value affects all interactions unless another value is set at the interaction level. Lower the value for faster responses. | 30      |  
| Virtual Device | The virtual device to use in your test.                   | Default device |

### Input Configuration  
In the input field, any entered text will be sent as a message to WhatsApp.

### Expected Configuration  
The main expected property `Prompt` will be compared against the WhatsApp responses as explained previously [here](/dashboard/test-page.md#interpreting-the-results). Responses will be gathered for a brief time before being returned and moving to the next interaction. This period can be customized per interaction with the `Response Wait Time` property under the "Expressions" tab.

## Special Considerations  
Bespoken uses its own WhatsApp for Business account to test others. This comes with some considerations that you should be aware of and plan around.

### Concurrency
Bespoken uses its own WhatsApp numbers to run tests. This means that the same number can't run two tests against the same bot simultaneously as this would be like having two WhatsApp chats with a single contact. If you try to do this, you might get mixed-up results.

### Testing Window
There are two ways in which WhatsApp bots can send freeform messages to a user:
- The user has initiated the conversation with the bot.
- The bot has sent a "template" message and the user has responded to it.

After any of these two conditions is met, the WhatsApp for Business number can send freeform messages for up to 24 hours until one of the conditions above is met again.

Bespoken's default template message is:

```
Hi! On behalf of Bespoken, this is a reminder to run your scheduled automated tests today.
```


You can use this template once per day, whenever you want to test your WhatsApp bot. As long as your system responds to this template, the content of that response is not relevant.

![WhatsApp template](../assets/images/guides/whatsapp-template.png)

::: tip Tip  
Leverage Bespoken's monitoring to set up a test that opens your WhatsApp testing window every 24 hours, so you don't need to worry about it.
:::

### Session Handling
Bespoken interacts with your WhatsApp bot as a real user would. This means that after running a test, the next test would continue where the first left off. To prevent this, it is required that your bot has a session reset mechanism. This could either be an API call or, preferably, a message that triggers the session reset. 

![Session reset message](../assets/images/guides/whatsapp-session.png)

### Supported Message Types
The following message types are supported by Bespoken's WhatsApp testing:
- Text
- Media: Images

Images are returned as clickable links within the response. Clicking the link will show the received image.

### Menu Messages Mocking
Currently, Bespoken does not support receiving menu messages via WhatsApp. However, you can mock receiving your expected menu by adding `[MENU]` at the start of your expected value. When we detect these messages, we'll return them as part of the response. This way, you can continue testing past these steps.

![Mock message and response](../assets/images/guides/whatsapp-menu.png)

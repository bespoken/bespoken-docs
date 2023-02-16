---
title: Sample Bot
permalink: /training/chatbot/functional/airlines
---
# Sample Chatbot
Click on the icon on the lower-right to interact with our Bespoken Airlines bot, built with IBM Watson Assistant.

<script>
  window.watsonAssistantChatOptions = {
    integrationID: "6a621c5c-9248-4be8-9c58-9801a57adf54", // The ID of this integration.
    region: "us-south", // The region your integration is hosted in.
    serviceInstanceID: "15dd764a-41da-419d-8d63-f88ef744d1f5", // The ID of your service instance.
    onLoad: function(instance) { instance.render(); }
  };
  setTimeout(function(){
    const t=document.createElement('script');
    t.src="https://web-chat.global.assistant.watson.appdomain.cloud/versions/" + (window.watsonAssistantChatOptions.clientVersion || 'latest') + "/WatsonAssistantChatEntry.js";
    document.head.appendChild(t);
  });
</script>
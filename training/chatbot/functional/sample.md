---
title: Sample Bot
permalink: /training/chatbot/functional/sample
---
# Sample Chatbot
Click on the icon on the lower-right to interact with our Bespoken Airlines bot, built with IBM Watson Assistant.

<script>
  window.watsonAssistantChatOptions = {
    integrationID: "858381c2-e602-41c2-a7ce-3b032774b2fc", // The ID of this integration.
    region: "us-south", // The region your integration is hosted in.
    serviceInstanceID: "f9334cf8-f8fa-480b-ba13-738be45b9ba7", // The ID of your service instance.
    onLoad: async (instance) => { await instance.render(); }
  };
  setTimeout(function(){
    const t=document.createElement('script');
    t.src="https://web-chat.global.assistant.watson.appdomain.cloud/versions/" + (window.watsonAssistantChatOptions.clientVersion || 'latest') + "/WatsonAssistantChatEntry.js";
    document.head.appendChild(t);
  });
</script>
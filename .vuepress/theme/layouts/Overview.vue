<template>
  
  <Training>
    <div class="flex flex-row mt-20">
      <div class="mx-auto w-1/2">
        <div class="flex flex-col mx-auto">
          <div class="text-zinc-900 text-2xl pb-5">What type of system are you testing?</div>
          <div class="grid grid-cols-4 space-x-2">
            <button id="ivr-button"
              class="rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm " 
              onclick="javascript:window.location='/training/ivr/overview'"
              @mouseenter="onHover('ivr')" @mouseleave="onHoverEnd('ivr')">IVR</button>
            <button id="chatbot-button"
              onclick="javascript:window.location='/training/chatbot/overview'"
              class="rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm"
              @mouseenter="onHover('chatbot')" @mouseleave="onHoverEnd('chatbot')">Chatbot</button>
            <button id="assistant-button"
              onclick="javascript:window.location='/training/assistant/overview'"
              class="rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm"
              @mouseenter="onHover('assistant')" @mouseleave="onHoverEnd('assistant')">Virtual Assistant</button>
            <button id="other-button"
              class="rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm"
              onclick="return false"
              @mouseenter="onHover('other')" @mouseleave="onHoverEnd('other')">Other
            </button>
          </div>
          <div class="hidden mt-5" id="ivr-overview">
            <div>
              Interactive Voice Response systems allow users to interact with bots by simply making a phone call.

              Input is a combination of touchtone and voice, and guides users to perform typically simple tasks online.

              Key considerations for IVR testing are:
            </div>
            <ul>
              <li>Accuracy Testing - to ensure the speech recognition and NLU models are working optimally and users are understood correctly</li>
              <li>Functional Testing - to ensure the system is behaving according to specification</li>
              <li>Load Testing - to ensure the system can scale to handle peak volumes</li>
              <li>Monitoring - to ensure the system is working reliably on an ongoing basis</li>
            </ul>
            Click the button to get started with testing an IVR system with Bespoken.
          </div>
          <div class="hidden mt-5" id="chatbot-overview">
            <div>
              Chatbots allow users to interact with bots by simply clicking on a webpage.

              Input is a combination of typing and clicking, and the chatbot enables performing routine inquiries, as well as asking general questions about the business.

              Key considerations for Chatbot testing are:
            </div>
            <ul>
              <li>Functional Testing - to ensure the bot is behaving according to specification</li>
              <li>Load Testing - to ensure the bot can scale to handle peak volumes</li>
              <li>Monitoring - to ensure the bot is working reliably on an ongoing basis</li>
            </ul>
            Click the button to get started with testing a Chatbot with Bespoken.
          </div>
          <div class="hidden mt-5" id="assistant-overview">
            <div>
              Virtual Assistants allow users to interact via voice and touch with complex, general-purpose AIs.

              These virtual assistants may be in the car, in a smart speaker, or built into our phones. 
              They include solutions such Amazon Alexa, Google Assistant, IBM Watson, Hey Mercedes In-Car assistant any many more.

              Key considerations for Virtual Assistant testing are:
            </div>
            <ul>
              <li>Accuracy Testing - to ensure users are correctly understood</li>
              <li>Fulfillment Testing - to ensure the bot delivers right result/content for the user's request</li>
              <li>Functional Testing - to ensure the bot is behaving according to specification</li>
              <li>Monitoring - to ensure the bot is working reliably on an ongoing basis</li>
            </ul>
            Click the button to get started with testing Virtual Assistants with Bespoken.
          </div>
          <div class="hidden mt-5" id="other-overview">
              For other types of Conversational AI testing, just reach out to us at <a href="mailto:support@bespoken.io">support@bespoken.io</a>
              We will be happy to help - remember, if you can talk to it, we can test it.
          </div>
        </div>
      </div>
    </div> 
    
  </Training>
  
</template>

<script>
import { resolvePage, outboundRE, endingSlashRE } from '../util'
import Training from '@theme/layouts/Training.vue'

export default {
  components: { Training },
  methods: {
    onHover(section) {
      $(`#${section}-overview`).show()
      $(`#${section}-button`).removeClass('border')
      $(`#${section}-button`).addClass('border-2')
    },
    onHoverEnd(section) {
      $(`#${section}-overview`).hide()
      $(`#${section}-button`).removeClass('border-2')
      $(`#${section}-button`).addClass('border')
    }
  }
}
</script>
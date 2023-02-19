<template>
  
  <Training>
    <div class="flex flex-row mt-20 training-menu">
      <div class="mx-auto w-1/2">
        <div class="flex flex-col mx-auto">
          <div class="text-zinc-900 text-2xl pb-5 question">What type of testing are you performing?</div>
          <div class="grid grid-cols-4 space-x-2">
            <button id="accuracy-button"
              class="menu-option" 
              onclick="javascript:window.location='/training/ivr/accuracy/overview'"
              @mouseenter="onHover('accuracy')" >Accuracy</button>
            <button id="functional-button"
              onclick="javascript:window.location='/training/ivr/functional/overview'"
              class="menu-option" 
              @mouseenter="onHover('functional')" >Functional</button>
            <button id="load-button"
              onclick="javascript:window.location='/training/ivr/load/overview'"
              class="menu-option" 
              @mouseenter="onHover('load')">Load</button>
            <button id="monitoring-button"
              class="menu-option" 
              onclick="return false"
              @mouseenter="onHover('monitoring')" >Monitoring
            </button>
          </div>
          <div class="hidden mt-5 menu-detail" id="accuracy-overview">
            <div>
              <p>Accuracy testing assesses and optimizes how well your IVR system is understanding users.</p>

              <p>
                Accuracy testing starts with measuring the current performance of the speech recognition (ASR) and natural language (NLU) models.
                Detailed recommendations are then provided on how to improve it.
              </p>

              <p>Key outcomes for IVR accuracy testing are:</p>
            </div>
            <ul>
              <li>Higher user satisfaction</li>
              <li>Better performance across a range of accents, languages, and audio environments (in-car, at-home, on-the-go, etc.)</li>
              <li>Huge potential savings, <a href="https://bespoken.io/blog/the-roi-of-accuracy/" target="_blank">vastly improving the ROI of your contact center investment</a></li>
            </ul>
            Click the button to learn more about accuracy testing for IVR from Bespoken.
          </div>
          <div class="hidden mt-5 menu-detail" id="functional-overview">
            <div>
              Functional testing ensures systems are working according to spec. Benefits of functional testing include:
            </div>
            <ul>
              <li>Minimizing the need for tedious, time-consuming, and error-prone manual testing</li>
              <li>Inoculating your team and application against latent regression issues</li>
              <li>Accelerating the time to delivery for development cycles</li>
            </ul>
            Click the button to get started with functional testing chatbots with Bespoken.
          </div>
          <div class="hidden mt-5 menu-detail" id="load-overview">
            <div>
              <p>Load testing ensures that your application can handle the highest levels of usage, 
                identifies bottlenecks that prevent it from scaling, 
                and provides an overall picture on the customer experience during periods of heavy call and chat volume.</p>
              <p>
                Key outcomes from load testing include:
              </p>
            </div>
            <ul>
              <li>Identify bottlenecks that prevent your system from scaling</li>
              <li>Detailed metrics on the max throughput, wait times, and latencies in high-demand periods</li>
              <li>Assurance that your customer experience will not detiorate or fall down when customers need your service most</li>
            </ul>
            Click the button to learn more about load testing with Bespoken.
          </div>
          <div class="hidden mt-5 menu-detail" id="monitoring-overview">
            <p>Monitoring routinely checks your IVR application to ensure it is always working correctly.</p> 
            <p>Setting up continuous monitoring can be done in as little as ten minutes, 
              and will provide peace of mind and assurance that your system is always available.</p>
            <p>Enable monitoring to:</p>
            <ul>
              <li>Ensure your IVR is working consistently</li>
              <li>Be the first to know when there is an issue with your IVR system</li>
              <li>Have a complete history of what has happened with your IVR system over time</li>
            </ul>
            Click the button to learn more about monitoring IVR systems with Bespoken.
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
      $(`.menu-detail`).hide()
      $(`.highlight`).removeClass('highlight')
      $(`#${section}-button`).addClass('highlight')
      $(`#${section}-overview`).show()
      $(`#${section}-button`).removeClass('border')
      $(`#${section}-button`).addClass('border-2')
    }
  }
}
</script>
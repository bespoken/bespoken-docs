<template>

  <main class="page">
    <slot name="top"/>
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
    
    <footer class="page-edit">
      <div
        class="edit-link"
        v-if="editLink"
      >
        <a
          :href="editLink"
          target="_blank"
          rel="noopener noreferrer"
        >{{ editLinkText }}</a>
        <OutboundLink/>
      </div>

      <div
        class="last-updated"
        v-if="lastUpdated"
      >
        <span class="prefix">{{ lastUpdatedText }}: </span>
        <span class="time">{{ lastUpdated }}</span>
      </div>
    </footer>

    <div class="page-nav" v-if="prev || next">
      <p class="inner">
        <span
          v-if="prev"
          class="prev"
        >
          ←
          <router-link
            v-if="prev"
            class="prev"
            :to="prev.path"
          >
            {{ prev.title || prev.path }}
          </router-link>
        </span>

        <span
          v-if="next"
          class="next"
        >
          <router-link
            v-if="next"
            :to="next.path"
          >
            {{ next.title || next.path }}
          </router-link>
          →
        </span>
      </p>
    </div>

    <slot name="bottom"/>
  </main>
</template>

<script>
import { resolvePage, outboundRE, endingSlashRE } from '../util'

export default {
  props: ['sidebarItems'],

  computed: {
    lastUpdated () {
      return this.$page.lastUpdated
    },

    lastUpdatedText () {
      if (typeof this.$themeLocaleConfig.lastUpdated === 'string') {
        return this.$themeLocaleConfig.lastUpdated
      }
      if (typeof this.$site.themeConfig.lastUpdated === 'string') {
        return this.$site.themeConfig.lastUpdated
      }
      return 'Last Updated'
    },

    prev () {
      const prev = this.$page.frontmatter.prev
      if (prev === false) {
        return
      } else if (prev) {
        return resolvePage(this.$site.pages, prev, this.$route.path)
      } else {
        return resolvePrev(this.$page, this.sidebarItems)
      }
    },

    next () {
      const next = this.$page.frontmatter.next
      if (next === false) {
        return
      } else if (next) {
        return resolvePage(this.$site.pages, next, this.$route.path)
      } else {
        return resolveNext(this.$page, this.sidebarItems)
      }
    },

    editLink () {
      if (this.$page.frontmatter.editLink === false) {
        return
      }
      const {
        repo,
        editLinks,
        docsDir = '',
        docsBranch = 'master',
        docsRepo = repo
      } = this.$site.themeConfig

      if (docsRepo && editLinks && this.$page.relativePath) {
        return this.createEditLink(repo, docsRepo, docsDir, docsBranch, this.$page.relativePath)
      }
    },

    editLinkText () {
      return (
        this.$themeLocaleConfig.editLinkText
        || this.$site.themeConfig.editLinkText
        || `Edit this page`
      )
    }
  },

  methods: {
    createEditLink (repo, docsRepo, docsDir, docsBranch, path) {
      const bitbucket = /bitbucket.org/
      if (bitbucket.test(repo)) {
        const base = outboundRE.test(docsRepo)
          ? docsRepo
          : repo
        return (
          base.replace(endingSlashRE, '')
           + `/src`
           + `/${docsBranch}/`
           + (docsDir ? docsDir.replace(endingSlashRE, '') + '/' : '')
           + path
           + `?mode=edit&spa=0&at=${docsBranch}&fileviewer=file-view-default`
        )
      }

      const base = outboundRE.test(docsRepo)
        ? docsRepo
        : `https://github.com/${docsRepo}`
      return (
        base.replace(endingSlashRE, '')
        + `/edit`
        + `/${docsBranch}/`
        + (docsDir ? docsDir.replace(endingSlashRE, '') + '/' : '')
        + path
      )
    },
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

function resolvePrev (page, items) {
  return find(page, items, -1)
}

function resolveNext (page, items) {
  return find(page, items, 1)
}

function find (page, items, offset) {
  const res = []
  flatten(items, res)
  for (let i = 0; i < res.length; i++) {
    const cur = res[i]
    if (cur.type === 'page' && cur.path === decodeURIComponent(page.path)) {
      return res[i + offset]
    }
  }
}

function flatten (items, res) {
  for (let i = 0, l = items.length; i < l; i++) {
    if (items[i].type === 'group') {
      flatten(items[i].children || [], res)
    } else {
      res.push(items[i])
    }
  }
}

</script>

<style lang="stylus">
@require '../styles/wrapper.styl'

.page
  padding-bottom 2rem
  display block

.page-edit
  @extend $wrapper
  padding-top 1rem
  padding-bottom 1rem
  overflow auto
  .edit-link
    display inline-block
    a
      color lighten($textColor, 25%)
      margin-right 0.25rem
  .last-updated
    float right
    font-size 0.9em
    .prefix
      font-weight 500
      color lighten($textColor, 25%)
    .time
      font-weight 400
      color #aaa

.page-nav
  @extend $wrapper
  padding-top 1rem
  padding-bottom 0
  .inner
    min-height 2rem
    margin-top 0
    border-top 1px solid $borderColor
    padding-top 1rem
    overflow auto // clear float
  .next
    float right

@media (max-width: $MQMobile)
  .page-edit
    .edit-link
      margin-bottom .5rem
    .last-updated
      font-size .8em
      float none
      text-align left

</style>
